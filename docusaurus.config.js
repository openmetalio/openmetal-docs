// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Openmetal Docs',
  tagline: 'Openmetal On-Demand Private Cloud Documentation',
//   url: 'https://docs.openmetal.io',
  url: 'https://openmetalio.github.io',
  baseUrl: '/openmetal-docs/',
//   onBrokenLinks: 'throw',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'inmotionhosting', // Usually your GitHub org/user name.
  projectName: 'openmetal-docs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/openmetalio/openmetal-docs/blob/main/',
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
      colorMode: {
        disableSwitch: true
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Openmetal',
          src: 'img/openmetal.svg',
        },
        items: [
        //   {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/openmetalio/openmetal-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        logo: {
          alt: 'Facebook Open Source Logo',
          src: 'img/openmetal.svg',
          width: 160,
          height: 51,
        },
        copyright: `<strong>${new Date().getFullYear()} © OpenMetal, a division of <a href="https://www.inmotionhosting.com" target="_blank" rel="noopener">InMotion Hosting</a>.  All rights reserved.</strong>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
