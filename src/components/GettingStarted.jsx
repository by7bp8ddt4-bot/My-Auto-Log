import { useCallback } from 'react';
import { 
  Car, Wrench, Bell, CheckCircle2, Check, 
  ArrowRight, Sparkles, ShieldCheck, X
} from 'lucide-react';

export default function GettingStarted({ onNavigate, hasVehicles, hasLogs, hasReminders, autoReminderCount, onDismiss }) {
  // Compute completion state from props — no stale internal state
  const steps = [
    { 
      id: 'vehicle', 
      title: 'Add Your First Vehicle', 
      desc: 'Enter your car details to unlock its maintenance schedule.',
      icon: Car,
      completed: hasVehicles
    },
    { 
      id: 'log', 
      title: 'Log a Past Service', 
      desc: 'Add your last oil change to start your digital health record.',
      icon: Wrench,
      completed: hasLogs
    },
    { 
      id: 'reminder', 
      title: autoReminderCount > 0 
        ? 'Review your reminders' 
        : hasReminders ? 'Reminders enabled' : 'Enable Reminders',
      desc: autoReminderCount > 0 
        ? `${autoReminderCount} reminders were auto-created from your vehicle's schedule.`
        : hasReminders ? 'You have reminders set up. Review them anytime.'
        : 'Set up alerts so you never miss a service again.',
      icon: Bell,
      completed: hasReminders
    }
  ];

  const allDone = hasVehicles && hasLogs && hasReminders;

  const handleDismiss = useCallback(() => {
    localStorage.setItem('mtxtrkr_onboarding_dismissed', 'true');
    onDismiss();
  }, [onDismiss]);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-500/20 shadow-xl">
      {/* Header with dismiss */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Welcome to MTXtrkr!</h2>
            <p className="text-sm text-slate-400">Let's get your vehicle's health record started in 3 easy steps.</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors shrink-0"
          aria-label="Skip onboarding"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* All-done celebration state */}
      {allDone ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-600/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">You're all set! 🎉</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            Your vehicle's maintenance tracking is ready. Explore your dashboard below.
          </p>
          <button
            onClick={handleDismiss}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-500/25"
          >
            Explore Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Step cards with numbered badges */}
          <div className="space-y-4 mb-8">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={step.completed ? undefined : step.action}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left group ${
                  step.completed 
                    ? 'bg-emerald-600/5 border-emerald-500/20 cursor-default' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-blue-500/40 hover:bg-slate-900'
                }`}
              >
                {/* Numbered badge */}
                <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.completed 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 border border-slate-700 text-slate-400 group-hover:border-blue-500/50 group-hover:text-blue-400'
                }`}>
                  {step.completed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${step.completed ? 'text-emerald-400' : 'text-white'}`}>
                      {step.title}
                    </h3>
                    <step.icon className={`w-4 h-4 ${step.completed ? 'text-emerald-500' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Security footer */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-xs text-slate-500">
              Your data is securely synced to the cloud and available across all your devices.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
