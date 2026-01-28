// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// 指向你刚修改的那个文件
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 你的其他配置
};

export default withNextIntl(nextConfig);