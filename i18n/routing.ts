// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 1. 定义支持的语言
  locales: ['en', 'fr', 'es', 'fil', 'pl'],
  
  // 2. 默认语言
  defaultLocale: 'en',

  // 3. 关键设置：默认语言不显示前缀 (en -> / , fr -> /fr)
  localePrefix: 'as-needed',

  // 4. 禁用浏览器语言检测（可选）
  // 如果开启，访问 / 可能会被重定向到 /pl，如果你希望用户始终先看到英文，请设为 false
  localeDetection: false 
});

// 导出封装好的组件和钩子，用于你的布局和页面
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);