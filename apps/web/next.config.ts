import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @mvp/shared é resolvido via node_modules (packages/shared/dist); mantido na
  // allowlist do bundler para o caso de o build apontar direto pro código-fonte.
  transpilePackages: ['@mvp/shared'],
  reactStrictMode: true,
};

export default nextConfig;

