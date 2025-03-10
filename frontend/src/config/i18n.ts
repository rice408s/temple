import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 导入翻译资源
import commonZh from '../locales/zh/common.json';
import commonEn from '../locales/en/common.json';
import todosZh from '../locales/zh/todos.json';
import todosEn from '../locales/en/todos.json';
import authZh from '../locales/zh/auth.json';
import authEn from '../locales/en/auth.json';

const resources = {
  zh: {
    common: commonZh,
    todos: todosZh,
    auth: authZh,
  },
  en: {
    common: commonEn,
    todos: todosEn,
    auth: authEn,
  },
};

i18n
  // 加载和缓存翻译文件
  .use(Backend)
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'todos', 'auth'],
    
    // 语言检测选项
    detection: {
      // 检测顺序：1. localStorage 2. navigator (浏览器语言) 3. cookie
      order: ['localStorage', 'navigator', 'cookie'],
      // 缓存语言选择到 localStorage 和 cookie
      caches: ['localStorage', 'cookie'],
    },

    // 支持的语言列表
    supportedLngs: ['zh', 'en'],
    
    interpolation: {
      escapeValue: false, // React 已经安全地转义了
    },
  });

export default i18n; 