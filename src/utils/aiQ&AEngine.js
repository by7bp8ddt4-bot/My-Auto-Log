/**
 * AI Q&A Engine — Vehicle-aware question answering system.
 * 
 * Parses natural language questions and answers them using the vehicle's
 * actual data: maintenance schedule, service history, mileage, lease info,
 * and manufacturer specs.
 * 
 * No external API calls — fully client-side, rule-based natural language
 * understanding powered by keyword + intent matching on vehicle data.
 */

import { getLogServiceTypes } from '../hooks/useMaintenanceSchedule';
import { getSpecsForVehicle, isEV } from '../data/maintenance-schedules';
import { formatCurrency, formatNumber } from './helpers';

/**
 * Intent classification — determines what the user is asking about.
 */
function classifyIntent(input) {
  const lower = input.toLowerCase().trim();

  // Welcome / greeting
  if (/^(hi|hello|hey|yo|what's up|sup|howdy|greetings)\b/.test(lower)) {
    return { type: 'greeting' };
  }

  // Next service due
  if (/next (service|maintenance|thing|item|one)|what.*due|what.*need|what.*should|upcoming/i.test(lower)) {
    return { type: 'next-service' };
  }

  // Specific service question
  if (/oil.*change|change.*oil|when.*oil/i.test(lower)) return { type: 'service-query', service: 'oil' };
  if (/brake/i.test(lower) && !/fluid/i.test(lower)) return { type: 'service-query', service: 'brake' };
  if (/transmission|trans fluid/i.test(lower)) return { type: 'service-query', service: 'transmission' };
  if (/tire|rotation/i.test(lower) && !/pressure/i.test(lower)) return { type: 'service-query', service: 'tire' };
  if (/brake.*fluid|brake fluid|flush.*brake/i.test(lower)) return { type: 'service-query', service: 'brake-fluid' };
  if (/coolant|antifreeze/i.test(lower)) return { type: 'service-query', service: 'coolant' };
  if (/spark.*plug|sparkplug|plug/i.test(lower)) return { type: 'service-query', service: 'spark-plugs' };
  if (/battery/i.test(lower) && !/tire|pressure/i.test(lower)) return { type: 'service-query', service: 'battery' };
  if (/differential|diff.*fluid/i.test(lower)) return { type: 'service-query', service: 'differential' };
  if (/transfer case/i.test(lower)) return { type: 'service-query', service: 'transfer-case' };
  if (/belt|serpentine/i.test(lower)) return { type: 'service-query', service: 'belt' };
  if (/air.*filter|cabin.*filter|engine.*filter|filter/i.test(lower)) return { type: 'service-query', service: 'filter' };
  if (/clutch/i.test(lower)) return { type: 'service-query', service: 'clutch' };
  if (/fuel.*filter/i.test(lower)) return { type: 'service-query', service: 'fuel-filter' };
  if (/chain.*lube|chain.*lubricat|chain.*adjust/i.test(lower)) return { type: 'service-query', service: 'chain' };

  // Maintenance at specific mileage
  const mileageMatch = lower.match(/(\d+[\d,]*)\s*(k|k ?miles|miles|mi|hours|hrs)?\s*(service|maintenance|check|inspect|do|todo)/i);
  if (mileageMatch) {
    const targetMileage = parseInt(mileageMatch[1].replace(/,/g, ''));
    const multiplier = mileageMatch[2] && mileageMatch[2].toLowerCase().startsWith('k') ? 1000 : 1;
    return { type: 'mileage-query', targetMileage: targetMileage * multiplier };
  }

  // "What should I do at X miles" (without "service" keyword)
  const atMileageMatch = lower.match(/at\s+(\d+[\d,]*)\s*(k|k ?miles|miles|mi|hours|hrs)?/i);
  if (atMileageMatch && /(do|need|should|recommend|what|maintenance)/i.test(lower)) {
    const targetMileage = parseInt(atMileageMatch[1].replace(/,/g, ''));
    const multiplier = atMileageMatch[2] && atMileageMatch[2].toLowerCase().startsWith('k') ? 1000 : 1;
    return { type: 'mileage-query', targetMileage: targetMileage * multiplier };
  }

  // Lease question
  if (/lease/i.test(lower)) {
    if (/on track|pace|projection|projected|ahead|behind|limit|exceed|over/i.test(lower)) return { type: 'lease-status' };
    if (/end|expir|when/i.test(lower)) return { type: 'lease-end' };
    return { type: 'lease-status' };
  }

  // Spending / cost questions
  if (/spent|cost|total|spend|expensive|how much|money|dollar|paid|expense/i.test(lower)) {
    return { type: 'spending' };
  }

  // Service history
  if (/history|last.*(change|done|service|replaced|performed)|when.*(last|done|change|replace)|recent/i.test(lower)) {
    return { type: 'service-history' };
  }

  // Overdue services
  if (/overdue|past.*due|late|expired|missed/i.test(lower)) {
    return { type: 'overdue' };
  }

  // Vehicle specs / info
  if (/specs?|specification|oil.*type|tire.*pressure|what.*(oil|tire|fluid|capacity|psi)|manual/i.test(lower)) {
    return { type: 'vehicle-specs' };
  }

  // Fuel economy
  if (/fuel.*(economy|mileage|mpg|efficiency|gas|consumption)|mpg/i.test(lower)) {
    return { type: 'fuel-economy' };
  }

  // EV-specific
  if (/ev|electric|range|charge|battery.*health/i.test(lower)) {
    return { type: 'ev-query' };
  }

  // Help
  if (/help|what can you|what do you|how.*use|commands|options|guide/i.test(lower)) {
    return { type: 'help' };
  }

  return { type: 'unknown' };
}

/**
 * Find a specific service in the schedule by name matching.
 */
function findServiceInSchedule(schedule, serviceKeyword) {
  const keywordMap = {
    'oil': 'oil',
    'brake': 'brake',
    'transmission': 'transmission',
    'tire': 'tire',
    'brake-fluid': 'brake fluid',
    'coolant': 'coolant',
    'spark-plugs': 'spark plug',
    'battery': 'battery',
    'differential': 'differential',
    'transfer-case': 'transfer case',
    'belt': 'belt',
    'filter': 'filter',
    'clutch': 'clutch',
    'fuel-filter': 'fuel filter',
    'chain': 'chain',
  };

  const keyword = keywordMap[serviceKeyword];
  if (!keyword) return null;

  return schedule.find(item => {
    const s = item.service.toLowerCase();
    return s.includes(keyword);
  });
}

/**
 * Answer a question about the vehicle.
 * 
 * @param {string} input - The natural language question
 * @param {Object} vehicle - The vehicle object
 * @param {Array} schedule - The computed maintenance schedule (from useMaintenanceSchedule)
 * @param {Array} logs - All maintenance logs for this vehicle
 * @param {Array} fuelLogs - Fuel logs for this vehicle
 * @returns {Object} { answer, type, actionButtons }
 */
export function answerQuestion(input, vehicle, schedule, logs, fuelLogs = []) {
  if (!vehicle) {
    return {
      answer: "I can't find an active vehicle. Please add a vehicle first, then I'll be able to answer questions about it!",
      type: 'info',
      actions: []
    };
  }

  const intent = classifyIntent(input);
  const specs = getSpecsForVehicle(vehicle.make, vehicle.model);
  const electric = isEV(vehicle.make, vehicle.model);

  switch (intent.type) {
    case 'greeting': {
      return {
        answer: `👋 Hey there! I'm your **${vehicle.make} ${vehicle.model}** assistant. I can answer questions about your vehicle's maintenance schedule, service history, costs, lease status, and specs. Try asking:\n\n• "When is my next oil change due?"\n• "What maintenance should I do at 60k miles?"\n• "Am I on track with my lease?"\n• "How much have I spent on maintenance?"\n• "What's my tire pressure spec?"`,
        type: 'info',
        actions: []
      };
    }

    case 'next-service': {
      const urgentItems = schedule.filter(s => s.status === 'overdue' || s.status === 'critical' || s.status === 'due-soon');
      if (urgentItems.length === 0) {
        return {
          answer: `✅ Your **${vehicle.year} ${vehicle.make} ${vehicle.model}** is in great shape! No services are due or overdue right now. The next upcoming service is **${schedule[0]?.service || '—'}** (due in ~${Math.round(schedule[0]?.daysUntilDue / 30) || '—'} months / ${formatNumber(schedule[0]?.milesUntilDue || 0)} miles).`,
          type: 'success',
          actions: [{
            label: 'View Full Schedule',
            action: 'navigate-schedule'
          }]
        };
      }
      const top = urgentItems[0];
      return {
        answer: `🔔 **${top.service}** is ${top.status === 'overdue' ? '⚠️ OVERDUE' : 'due soon'} on your ${vehicle.year} ${vehicle.make} ${vehicle.model}.\n\n${top.status === 'overdue' ? `🚨 Overdue by ${formatNumber(Math.abs(top.milesUntilDue))} miles!` : `⏰ Due in ${formatNumber(top.milesUntilDue)} miles (~${Math.round(top.daysUntilDue / 30)} months)`}\n\n📝 ${top.description}\n\n${urgentItems.length > 1 ? `\n*${urgentItems.length - 1} other service(s) also need attention.*` : ''}`,
        type: top.status === 'overdue' ? 'warning' : 'info',
        actions: [
          { label: 'Log This Service', action: 'log-service', service: top.service },
          { label: 'View Schedule', action: 'navigate-schedule' }
        ]
      };
    }

    case 'service-query': {
      const serviceItem = findServiceInSchedule(schedule, intent.service);
      if (!serviceItem) {
        // Check if it's an EV asking about oil
        if (electric && intent.service === 'oil') {
          return {
            answer: `⚡ **No engine oil required!** Your ${vehicle.make} ${vehicle.model} is an electric vehicle — it doesn't have an engine oil system. Focus on:\n\n• Cabin air filter (every 2 years)\n• Tire rotation (every 6,250 miles)\n• Brake fluid test (every 2 years)\n• Coolant system check (every 4-5 years)`,
            type: 'info',
            actions: []
          };
        }
        return {
          answer: `I couldn't find a specific service matching "${intent.service}" in your ${vehicle.year} ${vehicle.make} ${vehicle.model}'s schedule. Try asking about: oil change, brakes, transmission, tires, coolant, spark plugs, battery, air filters, or differential fluid.`,
          type: 'info',
          actions: []
        };
      }

      const status = serviceItem.status;
      const lastLog = logs
        .filter(l => {
          const types = getLogServiceTypes(l);
          return types.some(t => l.serviceType?.toLowerCase().includes(intent.service) || t.toLowerCase().includes(intent.service));
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      let answer = `**${serviceItem.service}** on your ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n`;
      
      if (status === 'overdue') {
        answer += `🚨 **OVERDUE** by ${formatNumber(Math.abs(serviceItem.milesUntilDue))} miles!\n`;
      } else if (status === 'critical') {
        answer += `⚠️ **Due NOW** — only ${formatNumber(serviceItem.milesUntilDue)} miles remaining!\n`;
      } else if (status === 'due-soon') {
        answer += `⏰ **Due soon** — ${formatNumber(serviceItem.milesUntilDue)} miles / ~${Math.round(serviceItem.daysUntilDue / 30)} months remaining.\n`;
      } else if (status === 'good') {
        answer += `✅ **All good!** ${formatNumber(serviceItem.milesUntilDue)} miles until next service.\n`;
      } else {
        answer += `📅 Due in ${formatNumber(serviceItem.milesUntilDue)} miles / ~${Math.round(serviceItem.daysUntilDue / 30)} months.\n`;
      }

      if (lastLog) {
        answer += `\n🔄 Last done: ${lastLog.date} at ${formatNumber(lastLog.mileage)} miles${lastLog.cost ? ` ($${lastLog.cost})` : ''}.`;
      } else {
        answer += `\n🔄 **Not yet performed** — first service is due at ${formatNumber(serviceItem.dueMileage)} miles.`;
      }

      answer += `\n\n📝 ${serviceItem.description}`;

      return {
        answer,
        type: status === 'overdue' ? 'warning' : status === 'due-soon' || status === 'critical' ? 'info' : 'success',
        actions: [
          { label: status === 'overdue' || status === 'critical' ? 'Log This Service' : 'Already Done?', action: 'log-service', service: serviceItem.service },
          { label: 'View Schedule', action: 'navigate-schedule' }
        ]
      };
    }

    case 'mileage-query': {
      const targetMileage = intent.targetMileage;
      const dueItems = schedule.filter(item => {
        const dueAt = item.dueMileage;
        // Items that are due at or before the target mileage
        return dueAt <= targetMileage && dueAt > targetMileage - (item.intervalMiles || 30000);
      });

      if (dueItems.length === 0) {
        return {
          answer: `At **${formatNumber(targetMileage)} miles** on your ${vehicle.year} ${vehicle.make} ${vehicle.model}, here's what's typically due:\n\nBased on your vehicle's schedule, no specific services fall exactly at ${formatNumber(targetMileage)} miles. The next service milestone is **${schedule[0]?.service || '—'}** at ${formatNumber(schedule[0]?.dueMileage || 0)} miles.`,
          type: 'info',
          actions: [{ label: 'View Full Schedule', action: 'navigate-schedule' }]
        };
      }

      let answer = `🔧 **At ${formatNumber(targetMileage)} miles** on your ${vehicle.year} ${vehicle.make} ${vehicle.model}, these services are due:\n\n`;
      dueItems.forEach((item, i) => {
        const statusIcon = item.status === 'overdue' ? '🚨' : item.status === 'critical' ? '⚠️' : '📌';
        answer += `${statusIcon} **${item.service}**\n   ${item.description}\n`;
        if (i < dueItems.length - 1) answer += '\n';
      });

      return {
        answer,
        type: 'info',
        actions: [{ label: 'View Schedule', action: 'navigate-schedule' }]
      };
    }

    case 'lease-status': {
      if (!vehicle.isLeased) {
        return {
          answer: `You're not currently leasing this **${vehicle.year} ${vehicle.make} ${vehicle.model}** — it's owned outright. If you start leasing in the future, I can help track your mileage!`,
          type: 'info',
          actions: []
        };
      }

      if (!vehicle.leaseEndDate || !vehicle.leaseMileageLimit) {
        return {
          answer: `Your **${vehicle.year} ${vehicle.make} ${vehicle.model}** is leased, but I need lease end date and mileage limit to calculate your projection. Please update your vehicle details.`,
          type: 'info',
          actions: [{ label: 'Edit Vehicle', action: 'navigate-vehicles' }]
        };
      }

      const purchaseDate = new Date(vehicle.purchaseDate || vehicle.createdAt);
      const leaseEnd = new Date(vehicle.leaseEndDate);
      const totalLeaseDays = (leaseEnd - purchaseDate) / (1000 * 60 * 60 * 24);
      const elapsedDays = (Date.now() - purchaseDate) / (1000 * 60 * 60 * 24);
      const dailyAllowance = vehicle.leaseMileageLimit / totalLeaseDays;
      const expectedMileage = Math.round(dailyAllowance * elapsedDays);
      const currentMileage = vehicle.mileage || 0;
      const remainingDays = Math.max(0, Math.ceil((leaseEnd - Date.now()) / (1000 * 60 * 60 * 24)));
      const remainingMileage = Math.max(0, vehicle.leaseMileageLimit - currentMileage);
      const projectedFinalMileage = Math.round(currentMileage + (dailyAllowance * remainingDays));
      const overUnder = projectedFinalMileage - vehicle.leaseMileageLimit;

      let statusEmoji, statusText, detailText;
      if (overUnder > 500) {
        statusEmoji = '🚨';
        statusText = '**OVER** your lease limit';
        detailText = `⚠️ You're projected to exceed your lease by **${formatNumber(overUnder)} miles** (${formatNumber(projectedFinalMileage)} vs ${formatNumber(vehicle.leaseMileageLimit)} limit). Consider reducing your mileage or buying extra miles now.`;
      } else if (overUnder < -500) {
        statusEmoji = '✅';
        statusText = '**under** your lease limit';
        detailText = `👍 You're projected to be **${formatNumber(Math.abs(overUnder))} miles under** your limit — great job!`;
      } else {
        statusEmoji = '📊';
        statusText = '**on track** with your lease';
        detailText = `📊 You're on pace to hit approximately **${formatNumber(projectedFinalMileage)} miles** — right near your ${formatNumber(vehicle.leaseMileageLimit)} limit.`;
      }

      return {
        answer: `📋 **Lease Status** — ${vehicle.year} ${vehicle.make} ${vehicle.model}\n\n` +
          `${statusEmoji} You're ${statusText}!\n\n` +
          `📊 Current: ${formatNumber(currentMileage)} miles (${Math.round(elapsedDays / totalLeaseDays * 100)}% of lease term elapsed)\n` +
          `📅 Lease ends: ${leaseEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})} (${remainingDays} days remaining)\n` +
          `🎯 Allowance: ${formatNumber(dailyAllowance * 30, 1)} mi/month — ${formatNumber(remainingMileage)} miles remaining\n` +
          `🔮 Projected final: ${formatNumber(projectedFinalMileage)} miles (limit: ${formatNumber(vehicle.leaseMileageLimit)})\n\n` +
          detailText,
        type: overUnder > 500 ? 'warning' : 'success',
        actions: [
          { label: 'Update Mileage', action: 'navigate-vehicles' },
          { label: 'Lease Details', action: 'navigate-dashboard' }
        ]
      };
    }

    case 'lease-end': {
      if (!vehicle.isLeased || !vehicle.leaseEndDate) {
        return {
          answer: `Your **${vehicle.year} ${vehicle.make} ${vehicle.model}** isn't leased, so there's no lease end date to check.`,
          type: 'info',
          actions: []
        };
      }
      const leaseEnd = new Date(vehicle.leaseEndDate);
      const remainingDays = Math.ceil((leaseEnd - Date.now()) / (1000 * 60 * 60 * 24));
      const remainingMonths = Math.round(remainingDays / 30);
      return {
        answer: `📅 Your lease on the **${vehicle.year} ${vehicle.make} ${vehicle.model}** ends on **${leaseEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}** — that's **${remainingDays} days** (${remainingMonths} months) away!\n\n🎯 Don't forget to check your mileage — you're on track for ${formatNumber(vehicle.mileage || 0)} miles so far.`,
        type: 'info',
        actions: []
      };
    }

    case 'spending': {
      const totalCost = logs.reduce((sum, l) => sum + (l.cost || 0), 0);
      const serviceCount = logs.length;
      const avgCost = serviceCount > 0 ? totalCost / serviceCount : 0;
      const recentLogs = logs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

      let answer = `💰 **Maintenance Spending** on your ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n`;
      answer += `📊 Total spent: **${formatCurrency(totalCost)}** on **${serviceCount}** services\n`;
      answer += `📈 Average per service: **${formatCurrency(avgCost)}**\n\n`;

      if (recentLogs.length > 0) {
        answer += `🕐 Recent services:\n`;
        recentLogs.forEach(l => {
          answer += `• ${l.date} — ${l.serviceType}${l.cost ? ` (${formatCurrency(l.cost)})` : ''}\n`;
        });
      }

      return {
        answer,
        type: 'info',
        actions: [{ label: 'View Log', action: 'navigate-logs' }]
      };
    }

    case 'service-history': {
      const sortedLogs = logs.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (sortedLogs.length === 0) {
        return {
          answer: `No maintenance history recorded yet for your **${vehicle.year} ${vehicle.make} ${vehicle.model}**. Add your first service log to start building a complete history!`,
          type: 'info',
          actions: [{ label: 'Add Log', action: 'navigate-logs' }]
        };
      }

      let answer = `📋 **Service History** for your ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n`;
      const recentLogs = sortedLogs.slice(0, 5);
      recentLogs.forEach((l, i) => {
        answer += `${i + 1}. **${l.serviceType}** — ${l.date}${l.mileage ? ` (${formatNumber(l.mileage)} mi)` : ''}${l.cost ? ` — ${formatCurrency(l.cost)}` : ''}\n`;
      });
      if (sortedLogs.length > 5) {
        answer += `\n*...and ${sortedLogs.length - 5} more service(s).*`;
      }
      return {
        answer,
        type: 'info',
        actions: [{ label: 'View All Logs', action: 'navigate-logs' }]
      };
    }

    case 'overdue': {
      const overdue = schedule.filter(s => s.status === 'overdue');
      if (overdue.length === 0) {
        return {
          answer: `✅ No overdue services on your **${vehicle.year} ${vehicle.make} ${vehicle.model}** — you're all caught up!`,
          type: 'success',
          actions: []
        };
      }

      let answer = `🚨 **${overdue.length} overdue service(s)** on your ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n`;
      overdue.forEach((item, i) => {
        answer += `${i + 1}. **${item.service}** — overdue by ${formatNumber(Math.abs(item.milesUntilDue))} miles\n`;
        answer += `   ${item.description}\n\n`;
      });
      return {
        answer,
        type: 'warning',
        actions: [{ label: 'Log Services', action: 'navigate-logs' }]
      };
    }

    case 'vehicle-specs': {
      if (!specs) {
        return {
          answer: `I don't have detailed specs for your **${vehicle.year} ${vehicle.make} ${vehicle.model}** yet. Check your owner's manual for exact specifications.`,
          type: 'info',
          actions: []
        };
      }

      let answer = `🔧 **Vehicle Specs** — ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n`;
      if (!electric) {
        answer += `🛢️ Oil: **${specs.oil?.viscosity || '—'}** ${specs.oil?.type || ''} (${specs.oil?.capacity || '—'})\n`;
      }
      answer += `⚙️ Transmission: **${specs.transmission?.type || '—'}**\n`;
      answer += `🧊 Coolant: **${specs.coolant?.type || '—'}** (${specs.coolant?.capacity || '—'})\n`;
      answer += `🛑 Brake Fluid: **${specs.brakeFluid?.type || '—'}**\n`;
      answer += `🔘 Tire Pressure: **${specs.tirePressure?.psi || '—'} PSI**\n`;
      if (!electric) {
        answer += `⚡ Spark Plugs: **${specs.sparkPlugs?.type || '—'}** (gap: ${specs.sparkPlugs?.gap || '—'})\n`;
      }
      answer += `🔋 Battery: **${specs.battery?.groupSize || '—'}**\n`;
      if (electric) {
        answer += `⚡ **Electric Vehicle** — no oil changes needed!`;
      }

      return {
        answer,
        type: 'info',
        actions: []
      };
    }

    case 'fuel-economy': {
      if (fuelLogs.length < 2) {
        return {
          answer: `I need at least 2 fuel entries to calculate your **${vehicle.make} ${vehicle.model}**'s fuel economy. Start tracking your fill-ups on the Fuel page!`,
          type: 'info',
          actions: [{ label: 'Track Fuel', action: 'navigate-fuel' }]
        };
      }

      // Calculate average MPG
      const validLogs = fuelLogs.filter(f => f.odometer && f.gallons && f.gallons > 0);
      if (validLogs.length < 2) {
        return {
          answer: `I have some fuel data, but need more complete entries (with odometer & gallons) to calculate accurate MPG for your **${vehicle.make} ${vehicle.model}**.`,
          type: 'info',
          actions: [{ label: 'Track Fuel', action: 'navigate-fuel' }]
        };
      }

      let totalMiles = 0;
      let totalGallons = 0;
      let mpgEntries = [];
      const sorted = validLogs.sort((a, b) => a.odometer - b.odometer);
      for (let i = 1; i < sorted.length; i++) {
        const miles = sorted[i].odometer - sorted[i - 1].odometer;
        if (miles > 0 && sorted[i].gallons > 0) {
          totalMiles += miles;
          totalGallons += sorted[i].gallons;
          mpgEntries.push(miles / sorted[i].gallons);
        }
      }

      if (mpgEntries.length === 0) {
        return {
          answer: `I have fuel data but couldn't calculate MPG. Try logging your refuel with accurate odometer readings.`,
          type: 'info',
          actions: [{ label: 'Track Fuel', action: 'navigate-fuel' }]
        };
      }

      const avgMpg = (totalMiles / totalGallons).toFixed(1);
      const bestMpg = Math.max(...mpgEntries).toFixed(1);
      const worstMpg = Math.min(...mpgEntries).toFixed(1);
      const totalCost = validLogs.reduce((sum, f) => sum + (f.totalCost || 0), 0);

      let answer = `⛽ **Fuel Economy** — ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n`;
      answer += `📊 Average: **${avgMpg} MPG** (over ${mpgEntries.length} fill-ups)\n`;
      answer += `📈 Best: ${bestMpg} MPG | 📉 Worst: ${worstMpg} MPG\n`;
      answer += `💰 Total spent on fuel: **${formatCurrency(totalCost)}**\n`;

      if (specs?.tirePressure?.psi) {
        answer += `\n💡 *Tip: Keeping tires at ${specs.tirePressure.psi} PSI can improve MPG by 3-5%.*`;
      }

      return {
        answer,
        type: 'info',
        actions: [{ label: 'View Fuel Log', action: 'navigate-fuel' }]
      };
    }

    case 'ev-query': {
      if (!electric) {
        return {
          answer: `Your **${vehicle.year} ${vehicle.make} ${vehicle.model}** is not an electric vehicle. It uses a traditional internal combustion engine.`,
          type: 'info',
          actions: []
        };
      }

      let answer = `⚡ **EV Info** — ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n`;
      answer += `• No oil changes needed!\n`;
      answer += `• Check cabin air filter every 2 years\n`;
      answer += `• Rotate tires every 6,250 miles\n`;
      answer += `• Test brake fluid every 2 years\n`;
      answer += `• Coolant system check every 4-5 years\n`;
      answer += `• 12V auxiliary battery may need replacement every 3-5 years\n\n`;
      answer += `🔋 Keep your battery between 20-80% for daily driving to maximize lifespan.`;

      return {
        answer,
        type: 'info',
        actions: []
      };
    }

    case 'help': {
      return {
        answer: `🤖 **I can help you with questions like:**\n\n` +
          `🔧 **Maintenance:** "When is my next oil change?" "What's due at 60k?" "Is my transmission fluid due?"\n` +
          `📋 **History:** "What services have been done?" "When were my brakes last changed?"\n` +
          `💰 **Costs:** "How much have I spent?" "What's my average service cost?"\n` +
          `📊 **Lease:** "Am I on track with my lease?" "When does my lease end?"\n` +
          `🔍 **Specs:** "What oil does my car take?" "What's the tire pressure?"\n` +
          `⛽ **Fuel:** "What's my MPG?" "How much have I spent on gas?"\n\n` +
          `Or just describe a symptom — "engine squeaks when I turn on the AC" — and switch to **Translate Mode** for a professional diagnosis!`,
        type: 'info',
        actions: []
      };
    }

    case 'unknown':
    default: {
      // Check if it might be a symptom description — hand off to translation mode
      const symptomWords = ['squeak', 'squeal', 'noise', 'rattle', 'vibrat', 'shaking', 'shudder', 'leak', 'smell', 'smoke', 'rough', 'hesitat', 'stall', 'knock', 'tick', 'click', 'grind', 'scrape', 'whine', 'hum', 'drip', 'puddle', 'warning', 'light', 'dashboard', 'indicator', 'funny', 'weird', 'strange'];
      const hasSymptoms = symptomWords.some(w => input.toLowerCase().includes(w));

      if (hasSymptoms) {
        return {
          answer: `🧐 It sounds like you're describing a symptom! Try switching to **"Translate to Health Record"** mode (use the toggle above) — I'll translate what you're hearing/feeling into a professional diagnosis.\n\nYou said: "${input.trim()}"`,
          type: 'info',
          actions: [{ label: 'Switch to Translate Mode', action: 'switch-to-translate' }]
        };
      }

      return {
        answer: `I'm not sure what you're asking about your **${vehicle.year} ${vehicle.make} ${vehicle.model}**. Try:\n\n` +
          `• "When is my next oil change?"\n` +
          `• "What maintenance at 60,000 miles?"\n` +
          `• "How much have I spent?"\n` +
          `• "What's my tire pressure?"\n` +
          `• "Am I on track with my lease?"\n\n` +
          `Or type "help" to see all the things I can do!`,
        type: 'info',
        actions: []
      };
    }
  }
}