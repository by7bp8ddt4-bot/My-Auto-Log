import {
  Car, Wrench, Bell, CheckCircle2, X,
  ArrowRight, Sparkles, ShieldCheck
} from 'lucide-react';

export default function GettingStarted({ onNavigate, hasVehicles, hasLogs, hasReminders, autoReminderCount = 0, onDismiss }) {
  const isComplete = hasVehicles && hasLogs && hasReminders;

  const steps = [
    {
      id: 'vehicle',
      title: 'Add Your First Vehicle',
      desc: 'Enter your car details to unlock its maintenance schedule.',
      action: () => onNavigate('vehicles'),
      icon: Car,
      completed: hasVehicles
    },
    {
      id: 'log',
      title: 'Log a Past Service',
      desc: 'Add your last oil change to start your digital health record.',
      action: () => onNavigate('logs'),
      icon: Wrench,
      completed: hasLogs
    },
    {
      id: 'reminder',
      title: autoReminderCount > 0
        ? 'Review your reminders'
        : hasReminders
          ? 'Reminders enabled'
          : 'Enable Reminders',
      desc: autoReminderCount > 0
        ? `We auto-created ${autoReminderCount} reminder${autoReminderCount !== 1 ? 's' : ''} from your vehicle's maintenance schedule. Review and adjust as needed.`
        : hasReminders
          ? 'Your maintenance reminders are active and tracking your service intervals.'
          : 'Set up alerts so you never miss a service again.',
      action: () => onNavigate('reminders'),
      icon: Bell,
      completed: hasReminders
    }
  ];

  const handleDismiss = () => {
    localStorage.setItem('mtxtrkr_onboarding_dismissed', 'true');
    onDismiss();
  };

  // ===== COMPLETE STATE =====
  if (isComplete) {
    return (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-500/20 shadow-xl text-center relative">
        {/* Dismiss X button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
          aria-label="Dismiss onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">You're all set! 🎉</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
          Your vehicle's digital health record is ready. MTXtrkr will keep you on track with proactive maintenance reminders.
        </p>
        <button
          onClick={handleDismiss}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ===== INCOMPLETE STATE =====
  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-500/20 shadow-xl relative">
      {/* Dismiss X button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
        aria-label="Dismiss onboarding"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-6 pr-8">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Welcome to MTXtrkr!</h2>
          <p className="text-sm text-slate-400">Let's get your vehicle's health record started in 3 easy steps.</p>
        </div>
      </div>

      {/* Step progress label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium text-slate-500">
          Step {Math.min(completedCount + 1, 3)} of 3
        </span>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                s.completed ? 'bg-emerald-400' : i === completedCount ? 'bg-blue-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={step.action}
            className="w-full flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all text-left group"
          >
            {/* Numbered badge — replaced Circle icons */}
            <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step.completed
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-700/60 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'
            }`}>
              {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <step.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
        <p className="text-xs text-slate-500">
          Your data is securely synced to the cloud and available across all your devices.
        </p>
      </div>
    </div>
  );
}
