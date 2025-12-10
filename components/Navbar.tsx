
import React, { useState } from 'react';
import { Menu, X, Activity, Settings, LogOut } from 'lucide-react';
import { TabView } from '../types';

interface NavbarProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
  appName: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, appName, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', value: TabView.HOME },
    { label: 'Profil', value: TabView.ABOUT },
    { label: 'Klaster', value: TabView.CLUSTERS },
    { label: 'Pengaturan', value: TabView.SETTINGS, icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center text-teal-600">
              <Activity className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight">{appName}</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => onTabChange(link.value)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === link.value
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 mr-1.5" />}
                {link.label}
              </button>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Keluar
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => {
                  onTabChange(link.value);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  currentTab === link.value
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                {link.label}
              </button>
            ))}
            
            <div className="border-t border-slate-100 mt-2 pt-2">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar Aplikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
