// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'astro-nosferatu',
			customCss: ['astro-nosferatu/styles/index.css'],
			sidebar: [
				{ label: 'Getting started', link: '/' },
				{ label: 'Styles', link: '/styles/' },
				{ label: 'Components', items: [{ autogenerate: { directory: 'components' } }] },
			],
		}),
	],
});
