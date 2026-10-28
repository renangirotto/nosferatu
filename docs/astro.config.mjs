// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	vite: {
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
	},
	integrations: [
		starlight({
			title: 'astro-nosferatu',
			customCss: ['astro-nosferatu/styles/index.css'],
			sidebar: [
				{ label: 'Getting started', link: '/' },
				{ label: 'Styles', link: '/styles/' },
				{ label: 'Components', items: [{ autogenerate: { directory: 'components' } }] },
				{ label: 'Layouts', items: [{ autogenerate: { directory: 'layouts' } }] },
				{ label: 'HTML', items: [{ autogenerate: { directory: 'html' } }] },
			],
		}),
	],
});
