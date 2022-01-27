// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Open Metal Docs',
  tagline: 'Dinosaurs are cool',
  url: 'https://docs.openmetal.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Open Metal', // Usually your GitHub org/user name.
  projectName: 'openmetal-docs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/inmotionhosting/openmetal-docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '',
        logo: {
          alt: 'Open Metal',
          src: 'img/openmetal.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Manuals',
          },
        //   {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/inmotionhosting/openmetal-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/openmetal',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/openmetalio',
              },
            ],
          },
          {
            title: 'More',
            items: [
            //   {
            //     label: 'Blog',
            //     to: '/blog',
            //   },
              {
                label: 'GitHub',
                href: 'https://github.com/openmetal',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Open Metal.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
