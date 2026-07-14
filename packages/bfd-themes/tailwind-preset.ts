/** Bharat Oncology design tokens for Tailwind v4 consumers. */
export const bharatOncoPreset = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        'input-background': 'var(--input-background)',
        ring: 'var(--ring)',
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        success: {
          soft: 'var(--success-soft)',
          emphasis: 'var(--success-emphasis)',
          'emphasis-mid': 'var(--success-emphasis-mid)',
          border: 'var(--success-border)',
          solid: 'var(--success-solid)',
        },
        info: {
          soft: 'var(--info-soft)',
          emphasis: 'var(--info-emphasis)',
          'emphasis-mid': 'var(--info-emphasis-mid)',
          border: 'var(--info-border)',
        },
        warning: {
          soft: 'var(--warning-soft)',
          emphasis: 'var(--warning-emphasis)',
          'emphasis-mid': 'var(--warning-emphasis-mid)',
          border: 'var(--warning-border)',
          solid: 'var(--warning-solid)',
        },
        error: {
          soft: 'var(--error-soft)',
          emphasis: 'var(--error-emphasis)',
          'emphasis-mid': 'var(--error-emphasis-mid)',
          border: 'var(--error-border)',
          solid: 'var(--error-solid)',
        },
        teal: {
          soft: 'var(--teal-soft)',
          emphasis: 'var(--teal-emphasis)',
          'emphasis-mid': 'var(--teal-emphasis-mid)',
          border: 'var(--teal-border)',
        },
        purple: {
          soft: 'var(--purple-soft)',
          emphasis: 'var(--purple-emphasis)',
          'emphasis-mid': 'var(--purple-emphasis-mid)',
          border: 'var(--purple-border)',
          accent: 'var(--purple-accent)',
        },
        print: {
          bg: 'var(--print-bg)',
          text: 'var(--print-text)',
          muted: 'var(--print-muted)',
          border: 'var(--print-border)',
        },
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        micro: 'var(--font-size-micro)',
        caption: 'var(--font-size-caption)',
        'caption-sm': 'var(--font-size-caption-sm)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
} as const;

export default bharatOncoPreset;
