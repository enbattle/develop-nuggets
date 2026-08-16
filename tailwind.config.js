/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-text-secondary)',
            '--tw-prose-headings': 'var(--color-text-primary)',
            '--tw-prose-links': 'var(--color-accent)',
            '--tw-prose-bold': 'var(--color-text-primary)',
            '--tw-prose-code': 'var(--color-text-primary)',
            '--tw-prose-quotes': 'var(--color-text-secondary)',
            '--tw-prose-quote-borders': 'var(--color-border)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border)',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
