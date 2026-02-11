
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  HandCoins, 
  Settings,
  Menu,
  X,
  CreditCard,
  Briefcase,
  HelpCircle,
  Info,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  syncStatus: 'idle' | 'syncing' | 'connected' | 'error';
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, syncStatus, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'loans', label: 'Money I Lent', icon: HandCoins },
    { id: 'debts', label: 'Money I Owe', icon: CreditCard },
    { id: 'borrowers', label: 'Borrowers', icon: Users },
    { id: 'creditors', label: 'Creditors', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'How to Use', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  const activeGroup = (id: string) => {
    if (activeTab === id) return true;
    if (id === 'loans' && activeTab === 'loan-details') return true;
    if (id === 'debts' && activeTab === 'debt-details') return true;
    return false;
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'connected': return <Cloud size={16} className="text-emerald-400" />;
      case 'syncing': return <RefreshCw size={16} className="text-indigo-400 animate-spin" />;
      case 'error': return <CloudOff size={16} className="text-rose-400" />;
      default: return <CloudOff size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      <header className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md no-print">
        <h1 className="text-xl font-bold tracking-tight">UtangInaMo</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <aside className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out
        z-40 w-64 bg-slate-900 text-white shadow-xl flex flex-col no-print
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between">
             <h1 className="text-2xl font-black text-indigo-400">UtangInaMo</h1>
             <div title={`Sync status: ${syncStatus}`}>
                {getSyncIcon()}
             </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Financial Management</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${activeGroup(item.id)
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800 rounded-lg p-3 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Juan Dela Cruz</p>
              <p className="text-xs text-slate-500 truncate">{syncStatus === 'connected' ? 'Cloud Synced' : 'Offline'}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative min-h-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
