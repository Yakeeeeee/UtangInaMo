
import React from 'react';
import { Info, Github, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
          <Info size={40} />
        </div>
        <h2 className="text-4xl font-black text-slate-900">UtangInaMo</h2>
        <p className="text-lg text-slate-500 font-medium">Professional Loan & Debt Management System</p>
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest">Version 2.1.0</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold border-b border-slate-100 pb-4">Our Mission</h3>
        <p className="text-slate-600 leading-relaxed">
          UtangInaMo was built to provide individual lenders and small business owners with a reliable, 
          professional tool for tracking financial obligations. We believe in transparency and 
          fairness, which is why we've integrated automated contract generation and 
          precise interest calculations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Privacy First</h4>
            <p className="text-sm text-slate-500">All data is stored locally on your device. We do not track your financial records or store them in the cloud.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Open & Flexible</h4>
            <p className="text-sm text-slate-500">Supports various interest frequencies and types to match local lending practices in the Philippines.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-sm text-slate-400 flex items-center justify-center space-x-2">
          <span>Made with</span>
          <Heart size={14} className="text-rose-500 fill-rose-500" />
          <span>for efficient financing</span>
        </p>
      </div>
    </div>
  );
};

export default About;
