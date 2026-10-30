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
			// The font packages come first: the library only names the families,
			// so the @font-face rules have to be loaded before anything uses them.
			customCss: [
				'@fontsource-variable/outfit',
				'@fontsource-variable/plus-jakarta-sans',
				'@fontsource-variable/geist-mono',
				'astro-nosferatu/styles/index.css',
				'./src/styles/theme.css',
			],
			expressiveCode: {
				themes: ['dracula', 'starlight-light'],
			},
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
