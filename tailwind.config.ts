import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				game: {
					red: 'hsl(var(--game-red))',
					blue: 'hsl(var(--game-blue))',
					yellow: 'hsl(var(--game-yellow))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'neon-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary))' },
					'50%': { boxShadow: '0 0 40px hsl(var(--primary)), 0 0 60px hsl(var(--primary))' }
				},
				'win-celebration': {
					'0%': { transform: 'scale(1)', boxShadow: '0 0 20px hsl(120 100% 50%)' },
					'50%': { transform: 'scale(1.1)', boxShadow: '0 0 40px hsl(120 100% 50%), 0 0 60px hsl(120 100% 50%)' },
					'100%': { transform: 'scale(1)', boxShadow: '0 0 20px hsl(120 100% 50%)' }
				},
				'lose-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(5px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'win-celebration': 'win-celebration 0.6s ease-in-out',
				'lose-shake': 'lose-shake 0.5s ease-in-out',
				'float': 'float 3s ease-in-out infinite'
			},
			boxShadow: {
				'neon': '0 0 20px hsl(var(--primary))',
				'neon-strong': '0 0 30px hsl(var(--primary)), 0 0 60px hsl(var(--primary))',
				'game-red': '0 0 20px hsl(var(--game-red))',
				'game-blue': '0 0 20px hsl(var(--game-blue))',
				'game-yellow': '0 0 20px hsl(var(--game-yellow))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
