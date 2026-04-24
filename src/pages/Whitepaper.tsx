import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface Section {
  id: string;
  titleKey: string;
  contentKey: string;
}

const sections: Section[] = [
  { id: 'summary', titleKey: 'whitepaper.summary', contentKey: 'whitepaper.summaryContent' },
  { id: 'overview', titleKey: 'whitepaper.overview', contentKey: 'whitepaper.overviewContent' },
  { id: 'market', titleKey: 'whitepaper.market', contentKey: 'whitepaper.marketContent' },
  { id: 'product', titleKey: 'whitepaper.product', contentKey: 'whitepaper.productContent' },
  { id: 'technology', titleKey: 'whitepaper.technology', contentKey: 'whitepaper.technologyContent' },
  { id: 'rwa', titleKey: 'whitepaper.rwa', contentKey: 'whitepaper.rwaContent' },
  { id: 'tokenomics', titleKey: 'whitepaper.tokenomics', contentKey: 'whitepaper.tokenomicsContent' },
  { id: 'compliance', titleKey: 'whitepaper.compliance', contentKey: 'whitepaper.complianceContent' },
  { id: 'business', titleKey: 'whitepaper.business', contentKey: 'whitepaper.businessContent' },
  { id: 'roadmap', titleKey: 'whitepaper.roadmap', contentKey: 'whitepaper.roadmapContent' },
  { id: 'team', titleKey: 'whitepaper.team', contentKey: 'whitepaper.teamContent' },
  { id: 'risk', titleKey: 'whitepaper.risk', contentKey: 'whitepaper.riskContent' },
  { id: 'conclusion', titleKey: 'whitepaper.conclusion', contentKey: 'whitepaper.conclusionContent' },
];

export default function Whitepaper() {
  const { section } = useParams();
  const { t, lang, setLang } = useI18n();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    console.log('Whitepaper effect running, section:', section);
    if (section && sections.find(s => s.id === section)) {
      console.log('Opening section:', section);
      setOpenSections([section]);
      setTimeout(() => {
        const el = document.getElementById(section);
        console.log('Found element:', el);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } else if (!section) {
      console.log('No section, opening summary');
      setOpenSections(['summary']);
    }
  }, [section]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-white">FunReelRWA {t('whitepaper.title')}</h1>
            </div>
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="px-3 py-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden flex items-center gap-2 text-gray-400 mb-4"
          >
            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {t('whitepaper.contents')}
          </button>

          <div className={`${showMenu ? 'block' : 'hidden'} md:block bg-gray-900 rounded-xl p-4 mb-6`}>
            <h3 className="text-white font-medium mb-3">{t('whitepaper.contents')}</h3>
            <ul className="space-y-2">
              {sections.map(section => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setShowMenu(false)}
                    className="text-gray-400 hover:text-orange-400 text-sm block"
                  >
                    {t(section.titleKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-white font-medium">{t(section.titleKey)}</span>
                {openSections.includes(section.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {openSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="px-4 pb-4"
                >
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {t(section.contentKey)}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}