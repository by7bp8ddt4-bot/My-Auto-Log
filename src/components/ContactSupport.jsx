import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Mail, MessageSquare, User, ArrowLeft } from 'lucide-react';

export default function ContactSupport({ onNavigate }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Your message has been sent. We'll get back to you soon.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }}
          className="px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onNavigate?.('settings')}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Contact Support</h1>
          <p className="text-sm text-slate-400">We're here to help</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your name"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="your@email.com"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Subject</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                placeholder="What's this about?"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Message</label>
            <textarea
              value={form.message}
              onChange={handleChange('message')}
              rows={5}
              placeholder="Describe your issue or question..."
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{errorMsg}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading' || !form.name || !form.email || !form.subject || !form.message}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>

      {/* Alternative Contact */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <p className="text-xs text-slate-400 text-center">
          Prefer email? Reach us at{' '}
          <a href="mailto:support@mtxtrkr.com" className="text-blue-400 hover:underline">
            support@mtxtrkr.com
          </a>
        </p>
      </div>
    </div>
  );
}