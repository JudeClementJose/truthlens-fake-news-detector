import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, Sun, Moon, Globe, LogOut, User as UserIcon, 
  Menu, X, Sparkles, LayoutDashboard, History, Info, Mail, Lock
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: t('nav.home'), icon: Sparkles },
    { id: 'detector', label: t('nav.detector'), icon: ShieldCheck },
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'history', label: t('nav.history'), icon: History },
    { id: 'about', label: t('nav.about'), icon: Info },
    { id: 'contact', label: t('nav.contact'), icon: Mail },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ id: 'admin', label: t('nav.admin'), icon: Lock });
  }

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-brand-700 to-brand-500 dark:from-white dark:via-brand-300 dark:to-brand-400 bg-clip-text text-transparent">
                TruthLens
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold border border-brand-200 dark:border-brand-800">
                AI v1.0
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Language, Dark Mode, Auth */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 ml-1 text-slate-500 dark:text-slate-400" />
              <select
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer px-1 py-0.5"
              >
                <option value="en" className="dark:bg-slate-900">EN</option>
                <option value="es" className="dark:bg-slate-900">ES</option>
                <option value="fr" className="dark:bg-slate-900">FR</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* User Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-fade-in">
                    <button
                      onClick={() => { handleNavClick('profile'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-brand-500" /> {t('nav.profile')}
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-lg shadow-md hover:shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 transition-all"
                >
                  {t('nav.register')}
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  activePage === item.id
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-brand-500" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Globe className="w-4 h-4" /> Language:
              <select
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-sm text-slate-800 dark:text-slate-200"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-brand-600 text-white shadow"
              >
                {t('nav.register')}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
