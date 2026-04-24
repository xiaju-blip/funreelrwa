import { motion } from 'framer-motion';
import { Twitter, Send, MessageCircle, Github } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const Footer = () => {
  const { t, lang } = useI18n();

  const links = [
    { name: lang === 'zh' ? '关于我们' : 'About', href: '#about' },
    { name: lang === 'zh' ? '白皮书' : 'Whitepaper', href: '#/whitepaper' },
    { name: lang === 'zh' ? '代币经济' : 'Tokenomics', href: '#/whitepaper/tokenomics' },
    { name: lang === 'zh' ? '路线图' : 'Roadmap', href: '#/whitepaper/roadmap' },
    { name: lang === 'zh' ? '常见问题' : 'FAQ', href: '#faq' }
  ];

  const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Send, href: '#', label: 'Telegram' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-black border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-white font-bold text-xl">FunReelRWA</span>
            </motion.div>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              {lang === 'zh'
                ? '全球首个基于区块链的短剧IP版权碎片化投资交易平台。'
                : "The world's first blockchain-based short drama IP copyright fractional investment and trading platform."}
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-900 border border-orange-500/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{lang === 'zh' ? '平台' : 'Platform'}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{lang === 'zh' ? '法律' : 'Legal'}</h4>
            <ul className="space-y-3">
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {lang === 'zh' ? '服务条款' : 'Terms of Service'}
                </a>
              </li>
              <li>
                <a href="/whitepaper/risk" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {lang === 'zh' ? '风险披露' : 'Risk Disclosure'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 FunReelRWA. {lang === 'zh' ? '保留所有权利。' : 'All rights reserved.'}
          </p>
          <p className="text-gray-600 text-xs">
            {lang === 'zh'
              ? 'REEL代币不是证券。请理性投资。'
              : 'REEL Token is not a security. Please invest responsibly.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
