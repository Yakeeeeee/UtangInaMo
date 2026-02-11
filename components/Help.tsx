
import React from 'react';
import { BookOpen, CheckCircle2, HandCoins, CreditCard, FileText, Database, ShieldCheck } from 'lucide-react';

const Help: React.FC = () => {
  const steps = [
    {
      title: 'Cloud Connection',
      desc: 'To keep your data safe and synced, set up a Firebase project and enter your credentials in the Settings tab.',
      icon: Database,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      title: 'Manage Obligation',
      desc: 'Use the "Money I Lent" for receivables and "Money I Owe" for payables. Each section supports detailed tracking.',
      icon: HandCoins,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Legal Contracts',
      desc: 'Generate professional PDF-ready agreements for any loan you create. Both parties sign for added security.',
      icon: FileText,
      color: 'text-slate-500',
      bg: 'bg-slate-50'
    },
    {
      title: 'Interest Locking',
      desc: 'Once a loan is created, interest terms are locked. The system computes daily/weekly/monthly accruals automatically.',
      icon: ShieldCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">User Guide</h2>
        <p className="text-slate-500">How to master your personal lending and debt system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className={`${step.bg} ${step.color} p-3 rounded-xl flex-shrink-0`}>
              <step.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <Database size={28} className="text-indigo-400" />
            <span>Setting up your proper Database</span>
          </h3>
          <ol className="space-y-4 text-slate-300">
             <li className="flex items-start space-x-3">
                <span className="bg-indigo-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                <p>Go to <a href="https://console.firebase.google.com/" target="_blank" className="text-white underline">Firebase Console</a> and create a new project named "UtangInaMo".</p>
             </li>
             <li className="flex items-start space-x-3">
                <span className="bg-indigo-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                <p>Enable **Cloud Firestore** in test mode (for development) or locked mode with proper rules.</p>
             </li>
             <li className="flex items-start space-x-3">
                <span className="bg-indigo-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                <p>Create a "Web App" inside your project, copy the `firebaseConfig` object, and paste the values into this app's Settings.</p>
             </li>
          </ol>
          <div className="p-4 bg-white/10 rounded-xl text-sm border border-white/20">
             <strong>Note:</strong> Once configured, clicking "Push to Cloud" will move your local data to the new database forever.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
