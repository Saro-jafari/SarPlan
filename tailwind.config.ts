import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#135D66',
				secondary: '#77B0AA',
				accent: '#E3FEF7',
				dark: '#003C43',
			},
		},
	},
	plugins: [],
};

export default config;
