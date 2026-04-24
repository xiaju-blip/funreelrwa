import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, Wallet as WalletIcon, User, LogOut, Settings, Menu, X, Home, Film, TrendingUp, ShoppingCart, Award, Gift } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  user?: {
    nickname: string;
    avatar: string;
    vipLevel: number;
  };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { t } = useI18n();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Home },
    { name: t('nav.drama'), path: '/drama', icon: Film },
    { name: t('nav.assets'), path: '/assets', icon: TrendingUp },
    { name: t('nav.market'), path: '/market', icon: ShoppingCart },
    { name: t('nav.stake'), path: '/stake', icon: Award },
    { name: t('nav.tasks'), path: '/tasks', icon: Gift },
    { name: t('nav.shop'), path: '/shop', icon: ShoppingCart },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">FunReelRWA</span>
            </a>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="w-40 bg-gray-900/80 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>

            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <a
              href="/notifications"
              className="relative p-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </a>

            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {user ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-800/50 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-8 h-8 rounded-full border-2 border-orange-500/30"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm text-white font-medium">{user.nickname}</p>
                    <p className="text-xs text-orange-400">VIP{user.vipLevel}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-orange-500/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-800">
                        <p className="text-white font-medium">{user.nickname}</p>
                        <p className="text-sm text-gray-500">VIP{user.vipLevel}</p>
                      </div>
                      <div className="p-2">
                        <a 
                          href="/profile" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">{t('nav.profile')}</span>
                        </a>
                        <a 
                          href="/wallet" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <WalletIcon className="w-4 h-4" />
                          <span className="text-sm">{t('profile.myWallet')}</span>
                        </a>
                        <a 
                          href="/settings" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">{t('profile.securitySettings')}</span>
                        </a>
                        <div className="border-t border-gray-800 my-2"></div>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">{t('profile.logout')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  {t('login.submit')}
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-full hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  {t('register.submit')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-orange-400 hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>

              {user ? (
                <>
                  <div className="border-t border-gray-800 my-4"></div>
                  <div className="flex items-center gap-3 mb-4 px-4">
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="w-12 h-12 rounded-full border-2 border-orange-500/30"
                    />
                    <div>
                      <p className="text-white font-medium">{user.nickname}</p>
                      <p className="text-xs text-orange-400">VIP{user.vipLevel}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <a
                      href="/profile"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    >
                      <User className="w-5 h-5" />
                      <span>{t('nav.profile')}</span>
                    </a>
                    <a
                      href="/wallet"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    >
                      <WalletIcon className="w-5 h-5" />
                      <span>{t('profile.myWallet')}</span>
                    </a>
                    <a
                      href="/settings"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    >
                      <Settings className="w-5 h-5" />
                      <span>{t('profile.securitySettings')}</span>
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileNavOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t('profile.logout')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-800 my-4"></div>
                  <div className="space-y-2 px-4">
                    <a
                      href="/login"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="block w-full py-3 text-center text-gray-300 hover:text-white border border-gray-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      {t('login.submit')}
                    </a>
                    <a
                      href="/register"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="block w-full py-3 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                      {t('register.submit')}
                    </a>
                  </div>
                </>
              )}

              <div className="border-t border-gray-800 my-4"></div>
              <div className="px-4">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
