// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OpenMetal Docs',
  tagline: 'OpenMetal On-Demand Private Cloud Documentation',
  url: 'https://openmetal.io',
  baseUrl: '/docs/manuals/',
  onBrokenMarkdownLinks: 'error',
  favicon: 'img/favicon.ico',
  organizationName: 'openmetalio', // Usually your GitHub org/user name.
  projectName: 'openmetal-docs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl: 'https://github.com/openmetalio/openmetal-docs/blob/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'UA-213530121-1',
        }
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from : '/openstack-users/openstack-users-manual',
            to: '/users-manual/',
          },
          {
            from : '/openstack-users/private-cloud-core-manual',
            to: '/users-manual/',
          },
          {
            from : '/openstack-users/private-cloud-core-openstack-user-manual',
            to: '/users-manual/',
          },
          {
            from : '/operators-manual-extras/ephemeral_storage',
            to: '/tutorials/ephemeral-storage',
          },
          {
            from : '/operators-manual-extras/lb_with_octavia',
            to: '/tutorials/lb-with-octavia',
          },
          {
            from : '/operators-manual-extras/magnum-and-kubernetes',
            to: '/tutorials/magnum-and-kubernetes',
          },
          {
            from : '/operators-manual-extras/telemetry',
            to: '/tutorials/getting-started-with-ceilometer-and-gnocchi',
          },
          {
            from : '/operators-manual-extras/vpnaas-configure-deploy',
            to: '/tutorials/create-site-to-site-vpn',
          },
          {
            from : '/users-manual/getting_started_with_openstack',
            to: '/users-manual/getting-started-with-openstack',
          },
          {
            from : '/openstack-operators',
            to: '/operators-manual/',
          },
          {
            from : '/openstack-users',
            to: '/users-manual/',
          },
          {
            from : '/operators-extended',
            to: '/tutorials/',
          },
        ],
      },
    ],
  ],
  customFields: {
    navbarTopRow: [
      {
        label: 'SCHEDULE MEETING',
        position: 'right',
        href: 'https://openmetal.io/schedule-meeting/',
      },
      {
        label: 'FREE TRIAL',
        position: 'right',
        href: 'https://openmetal.io/free-trial/',
      },
      {
        label: 'LOGIN',
        position: 'right',
        href: 'https://central.openmetal.io/auth/sign-in',
      },
    ],
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'twitter:site', content: '@openmetalio'},
        {name: 'twitter:creator', content: '@openmetalio'}
      ],
      colorMode: {
        disableSwitch: true
      },
      navbar: {
        title: '',
        logo: {
          alt: 'OpenMetal',
          src: 'https://inmotionhosting.github.io/static-assets/logo/open-metal/medium.png',
          href: 'https://openmetal.io'
        },
        items: [
          {
            type: 'dropdown',
            label: 'Products',
            position: 'left',
            header: 'IAAS Products',
            items: [
              {
                label: 'On-Demand Private Cloud',
                description: 'The rich benefits of private cloud now delivered in 45 seconds',
                href: 'https://openmetal.io/products/private-cloud/hosted/',
                itemType: 'link',
              },
              {
                label: 'Private Pods',
                description: 'The complete OpenMetal Platform in a data center of your choice',
                href: 'https://openmetal.io/products/products/private-pods',
                itemType: 'link',
              },
              {
                label: 'Large IAAS Deployments',
                description: 'Leverage the on-demand fleet and team for innovative solutions',
                href: 'https://openmetal.io/products/products/private-pods',
                image_url: 'https://openmetal.io/wp-content/uploads/2022/04/Large-IaaS-Deployments-Featured-Image-768x432.png',
                itemType: 'article',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Solutions',
            position: 'left',
            header: 'IAAS Solutions',
            items: [
              {
                label: 'Private Cloud for SaaS',
                description: 'Cost effective infrastructure is critical to good margins',
                href: 'https://openmetal.io/solutions/saas/',
                itemType: 'link',
              },
              {
                label: 'OpenStack Public Cloud Providers',
                description: 'Combined scale yields better costs, new locations, and more features',
                href: 'https://openmetal.io/solutions/openstack-public-cloud-providers/',
                itemType: 'link',
              },
              {
                label: 'IT Modernization',
                description: 'Bring IT Modernization to your business',
                href: 'https://openmetal.io/solutions/it-modernization/',
                itemType: 'link',
              },
              {
                label: 'On-Demand OpenStack',
                description: 'Harness the power of OpenStack to build private clouds at any size, on-demand',
                href: 'https://openmetal.io/solutions/on-demand-openstack/',
                itemType: 'link',
              },
              {
                label: 'Why Should your Business be Using a Private Cloud',
                description: 'Moving Your Business to Private Cloud Companies are moving towards cloud adoption at record rates, yet there are still business owners ...',
                href: 'https://openmetal.io/resources/blog/why-your-business-should-be-using-a-private-cloud/',
                image_url: 'https://openmetal.io/wp-content/uploads/2021/09/The-OpenMetal-Blog-6-768x432.png',
                itemType: 'article',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Platform',
            position: 'left',
            header: 'Openmetal Platform',
            items: [
              {
                label: 'OpenStack Services',
                description: '',
                href: 'https://openmetal.io/platform/openstack-services/',
                itemType: 'link',
              },
              {
                label: 'Features and Components',
                description: '',
                href: 'https://openmetal.io/platform/features/',
                itemType: 'link',
              },
              {
                label: 'Global Locations',
                description: '',
                href: 'https://openmetal.io/platform/locations/',
                itemType: 'link',
              },
              {
                label: 'Why Move from Public Cloud to Private Cloud',
                description: 'Cloud Repatriation is the Choice of Cloud Professionals Public cloud users are finding out that for all their convenience and so-called ...',
                href: 'https://openmetal.io/resources/blog/move-from-public-cloud-to-private-cloud/',
                image_url: 'https://openmetal.io/wp-content/uploads/2021/09/The-OpenMetal-Blog-3-768x432.png',
                itemType: 'article',
              },
            ],
          },
          {
            href: 'https://openmetal.io/iaas-pricing/',
            label: 'Pricing',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Resources',
            position: 'left',
            header: 'Resources',
            items: [
              {
                label: 'OpenMetal Blog',
                description: '',
                href: 'https://openmetal.io/resources/',
                itemType: 'link',
              },
              {
                label: 'Cloud Industry Events',
                description: '',
                href: 'https://openmetal.io/resources/cloud-industry-events/',
                itemType: 'link',
              },
              {
                label: 'Media & Press',
                description: '',
                href: 'https://openmetal.io/resources/media-and-press/',
                itemType: 'link',
              },
              {
                label: 'Sales FAQ',
                description: '',
                href: 'https://openmetal.io/resources/sales-faq/',
                itemType: 'link',
              },
              {
                label: 'Login to OpenMetal Central',
                description: '',
                href: 'https://central.openmetal.io/auth/sign-in',
                itemType: 'link',
              },
              {
                label: 'A Cost Tipping Point Guide for IT Professionals: Public vs Private Cloud',
                description: 'It’s 2022, we know that a vast majority of organizations have adopted either a public cloud or private cloud. Within ...',
                href: 'https://openmetal.io/resources/blog/public-cloud-vs-private-cloud-cost-tipping-points/',
                image_url: 'https://openmetal.io/wp-content/uploads/2021/08/The-OpenMetal-Blog-4-768x432.png',
                itemType: 'article',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'left',
            header: 'Documentation',
            items: [
              {
                label: 'Documentation Home',
                description: '',
                href: 'https://openmetal.io/docs/',
                itemType: 'link',
              },
              {
                label: 'OpenStack Operators Manual',
                description: '',
                href: 'https://openmetal.io/docs/manuals/openstack-operators/openstack-operators-manual-private-cloud-core/',
                itemType: 'link',
              },
              {
                label: 'OpenStack Users Manual',
                description: '',
                href: 'https://openmetal.io/docs/manuals/openstack-users/openstack-users-manual/',
                itemType: 'link',
              },
              {
                label: 'Private Cloud Users',
                description: '',
                href: 'https://openmetal.io/docs/product-guides/private-cloud/',
                itemType: 'link',
              },
              /*
              Scaffold added for new section.
              {
                label: 'Engineer\'s Notes',
                description: '',
                href: 'https://openmetal.io/docs/manuals/engineers-notes/',
                itemType: 'link',
              },
              */
              {
                label: 'Product Release Updates',
                description: '',
                href: 'https://openmetal.io/docs/releases/',
                itemType: 'link',
              },
              {
                label: 'OMI Release V1.4: New XL-V2 Node Type Added',
                description: 'OpenMetal Cloud Hardware Catalog Update – March 15th, 2022We are refreshing our catalog based on feedback and customization for customers ...',
                href: 'https://openmetal.io/docs/releases/release-update-v1-4/',
                image_url: 'https://openmetal.io/wp-content/uploads/2022/03/Release-Update-768x403.png',
                itemType: 'article',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Company',
            position: 'left',
            header: 'About Us',
            items: [
              {
                label: 'About OpenMetal',
                description: '',
                href: 'https://openmetal.io/company/',
                itemType: 'link',
              },
              {
                label: 'Core Guiding Principles',
                description: '',
                href: 'https://openmetal.io/company/guiding-principles/',
                itemType: 'link',
              },
              {
                label: 'Contact Us',
                description: '',
                href: 'https://openmetal.io/company/contact-us/',
                itemType: 'link',
              },
              {
                label: 'Success Story: OpenStack On-Demand Private Clouds in Less than an Hour',
                description: 'Success Story: InMotion Hosting and Supermicro Join Forces Supermicro recently published a success story describing how InMotion Hosting built an on-demand private cloud ...',
                href: 'https://openmetal.io/resources/blog/openmetal-and-supermicro-success-story/',
                image_url: 'https://openmetal.io/wp-content/uploads/2022/03/The-OpenMetal-Blog-7-1-768x432.png',
                itemType: 'article',
              },
            ],
          }
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Products',
            items: [
              {
                label: 'On-Demand Private Cloud',
                href: 'https://openmetal.io/products/private-cloud/hosted/',
              },
              {
                label: 'Large Deployments',
                href: 'https://openmetal.io/products/large-iaas-deployments/',
              },
              {
                label: 'Private Pods',
                href: 'https://openmetal.io/products/private-pods/',
              },
            ],
          },
          {
            title: 'Solutions',
            items: [
              {
                label: 'SaaS Cloud',
                href: 'https://openmetal.io/solutions/saas/',
              },
              {
                label: 'IT Modernization',
                href: 'https://openmetal.io/solutions/it-modernization/',
              },
              {
                label: 'Public Cloud Providers',
                href: 'https://openmetal.io/solutions/openstack-public-cloud-providers/',
              },
              {
                label: 'On-Demand OpenStack',
                href: 'https://openmetal.io/solutions/on-demand-openstack-cloud/',
              },
            ],
          },
          {
            title: 'Platform',
            items: [
              {
                label: 'OpenStack Services',
                href: 'https://openmetal.io/platform/openstack-services/',
              },
              {
                label: 'Features and Components',
                href: 'https://openmetal.io/platform/features/',
              },
              {
                label: 'Global Locations',
                href: 'https://openmetal.io/platform/locations/',
              },
            ],
          },
          {
            title: 'Pricing',
            items: [
              {
                label: 'On-Demand Pricing',
                href: 'https://openmetal.io/pricing/',
              },
              {
                label: 'General Sales FAQ',
                href: 'https://openmetal.io/resources/sales-faq/',
              },
              {
                label: 'Free Trial',
                href: 'https://openmetal.io/free-trial/',
              },
              {
                label: 'Schedule a Meeting',
                href: 'https://openmetal.io/schedule-meeting/',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'OpenMetal Blog',
                href: 'https://openmetal.io/blog/',
              },
              {
                label: 'Cloud Industry Events',
                href: 'https://openmetal.io/resources/cloud-industry-events/',
              },
              {
                label: 'Sales FAQ',
                href: 'https://openmetal.io/resources/sales-faq/',
              },
              {
                label: 'Login to OpenMetal Central',
                href: 'https://central.openmetal.io/auth/sign-in',
              },
            ],
          },
          {
            title: 'Documentation',
            items: [
              {
                label: 'Documentation Home',
                href: 'https://openmetal.io/docs/',
              },
              {
                label: 'OpenStack Operator’s Manual',
                href: 'https://openmetal.io/docs/manuals/openstack-operators/openstack-operators-manual-private-cloud-core/',
              },
              {
                label: 'OpenStack User’s Manual',
                href: 'https://openmetal.io/docs/manuals/openstack-users/openstack-users-manual/',
              },
              {
                label: 'Private Cloud Users',
                href: 'https://openmetal.io/docs/product-guides/private-cloud/',
              },
              {
                label: 'Product Release Updates',
                href: 'https://openmetal.io/docs/releases/',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About OpenMetal',
                href: 'https://openmetal.io/company/',
              },
              {
                label: 'Core Guiding Principles',
                href: 'https://openmetal.io/company/guiding-principles/',
              },
              {
                label: 'Contact Us',
                href: 'https://openmetal.io/company/contact-us/',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Terms of Service',
                href: 'https://openmetal.io/company/legal/',
              },
              {
                label: 'Privacy Policy',
                href: 'https://openmetal.io/company/legal/privacy-policy/',
              },
              {
                label: 'Do Not Sell My Personal Data',
                href: 'https://openmetal.io/company/legal/donotsellmypersonaldata/',
              },
              {
                label: 'Accessibility Statement',
                href: 'https://openmetal.io/company/legal/accessibility-statement/',
              },
              {
                label: 'Legal Inquiries and DMCA',
                href: 'https://openmetal.io/company/legal/legal-inquiries/',
              },
            ],
          },
        ],
        logo: {
          alt: 'Openmetal Logo',
          src: 'https://inmotionhosting.github.io/static-assets/logo/open-metal/medium.png',
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
