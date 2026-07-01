import { useState } from 'react';
import { 
  Car, Wrench, Bell, CheckCircle2, Circle, 
  ArrowRight, Sparkles, ShieldCheck 
} from 'lucide-react';

export default function GettingStarted({ onNavigate }) {
  const [steps, setSteps] = useState([
    { 
      id: 'vehicle', 
      title: 'Add Your First Vehicle', 
      desc: 'Enter your car details to unlock its maintenance schedule.',
      action: () => onNavigate('vehicles'),
      icon: Car,
      completed: false
    },
    { 
      id: 'log', 
      title: 'Log a Past Service', 
      desc: 'Add your last oil change to start your digital health record.',
      action: () => onNavigate('logs'),
      icon: Wrench,
      completed: false
    },
    { 
      id: 'reminder', 
      title: 'Enable Reminders', 
      desc: 'Set up alerts so you never miss a service again.',
      action: () => onNavigate('reminders'),
      icon: Bell,
      completed: false
    }
  ]);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-500/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Welcome to MTXtrkr!</h2>
          <p className="text-sm text-slate-400">Let's get your vehicle's health record started in 3 easy steps.</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={step.action}
            className="w-full flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all text-left group"
          >
            <div className={`mt-0.5 shrink-0 ${step.completed ? 'text-emerald-400' : 'text-slate-600 group-hover:text-blue-400'}`}>
              {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <step.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
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
