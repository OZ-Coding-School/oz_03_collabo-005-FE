/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ['class'],
    content: [
    './index.html',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		keyframes: {
  			slideInLeft: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-30%)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(30%)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			rainbow: {
  				'0%': {
  					'background-position': '0%'
  				},
  				'100%': {
  					'background-position': '200%'
  				}
  			}
  		},
  		animation: {
  			slideInLeft: 'slideInLeft 0.7s ease-in-out',
  			slideInRight: 'slideInRight 0.7s ease-in-out',
  			rainbow: 'rainbow var(--speed, 2s) infinite linear'
  		},
  		screens: {
  			xs: {
  				max: '600px'
  			},
  			xxs: {
  				max: '375px'
  			}
  		},
  		colors: {
  			primary: '#f56e26',
  			black: '#000000',
  			red: '#FF3B30',
  			gray: {
  				'66': '#666666',
  				'78': '#787486',
  				'98': '#989898',
  				'9f': '#9FA6B2',
  				d9: '#D9D9D9',
  				ee: '#EEEEEE',
  				fa: '#FAFAFA'
  			},
  			'color-1': 'hsl(var(--color-1))',
  			'color-2': 'hsl(var(--color-2))',
  			'color-3': 'hsl(var(--color-3))',
  			'color-4': 'hsl(var(--color-4))',
  			'color-5': 'hsl(var(--color-5))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require('tailwind-scrollbar-hide'), require("tailwindcss-animate")],
};
