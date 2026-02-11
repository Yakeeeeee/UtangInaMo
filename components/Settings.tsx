
import React, { useState } from 'react';
import { Save, User, Trash2, ShieldAlert, Cloud, Database, Wifi, WifiOff, UploadCloud } from 'lucide-react';
import { Lender, FirebaseConfig } from '../types';

interface SettingsProps {
  lender: Lender;
  updateLender: (id: string, updates: Partial<Lender>) => void;
  resetAllData: () => void;
  dbConfig: FirebaseConfig;
  setDbConfig: (config: FirebaseConfig) => void;
  pushAllToCloud: () => void;
  syncStatus: string;
}

const Settings: React.FC<SettingsProps> = ({ 
  lender, updateLender, resetAllData, dbConfig, setDbConfig, pushAllToCloud, syncStatus 
}) => {
  const [profileData, setProfileData] = useState({
    fullName: lender.fullName,
    contactNumber: lender.contactNumber,
    address: lender.address || ''
  });
  
  const [fbConfigData, setFbConfigData] = useState<FirebaseConfig>(dbConfig);
  const [saved, setSaved] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLender(lender.id, profileData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDbConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDbConfig(fbConfigData);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Configure your profile and cloud database connection.</p>
      </div>

      {/* Cloud Database Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <Database className="text-indigo-400" size={20} />
             <h3 className="font-bold text-lg">Proper Database (Firebase)</h3>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full text-xs font-bold">
             {syncStatus === 'connected' ? (
                <><Wifi size={14} className="text-emerald-400" /> <span>Connected</span></>
             ) : (
                <><WifiOff size={14} className="text-rose-400" /> <span>Disconnected</span></>
             )}
          </div>
        </div>
        <div className="p-8">
           <form onSubmit={handleDbConfigSubmit} className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-4">
                 <div className="flex items-center space-x-3">
                    <Cloud className="text-indigo-600" />
                    <div>
                       <p className="font-bold text-indigo-900">Cloud Sync</p>
                       <p className="text-xs text-indigo-700">Persist data to Firestore for cross-device access.</p>
                    </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={fbConfigData.enabled}
                      onChange={(e) => setFbConfigData({ ...fbConfigData, enabled: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                 </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-100 transition-opacity">
                 {['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].map(field => (
                    <div key={field}>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field}</label>
                       <input 
                          type="text"
                          placeholder={`Enter ${field}...`}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white transition-colors"
                          value={(fbConfigData as any)[field] || ''}
                          onChange={(e) => setFbConfigData({ ...fbConfigData, [field]: e.target.value })}
                       />
                    </div>
                 ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                 <button 
                   type="submit"
                   className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                 >
                   Save Connection Config
                 </button>
                 {syncStatus === 'connected' && (
                    <button 
                      type="button"
                      onClick={pushAllToCloud}
                      className="flex items-center justify-center space-x-2 bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                    >
                      <UploadCloud size={20} />
                      <span>Push All to Cloud</span>
                    </button>
                 )}
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2 italic">You can find these credentials in your Firebase Project Settings.</p>
           </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center space-x-3">
          <User className="text-indigo-600" size={20} />
          <h3 className="font-bold text-lg">Lender Profile</h3>
        </div>
        <form onSubmit={handleProfileSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name (Lender)</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
              <input 
                required
                type="tel"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={profileData.contactNumber}
                onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button type="submit" className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold">
              <Save size={18} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-rose-50 rounded-2xl border border-rose-100 p-8 flex items-start space-x-4">
        <div className="bg-rose-100 p-3 rounded-xl text-rose-600"><ShieldAlert size={24} /></div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-rose-900">Danger Zone</h3>
          <p className="text-rose-700 text-sm mt-1">Resetting data will clear everything from this device.</p>
          <button onClick={resetAllData} className="mt-4 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-bold">
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
