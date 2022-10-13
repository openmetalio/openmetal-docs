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
  scripts: [
    {
      src: '//js.hs-scripts.com/5297785.js?businessUnitId=188922',
      type: 'text/javascript',
      id: 'hs-script-loader',
      async: true,
      defer: true,
    },
  ],
   ssrTemplate: `<!DOCTYPE html>
<html <%~ it.htmlAttributes %>>
  <head>
    <meta charset="UTF-8">
    <meta name="generator" content="Docusaurus v<%= it.version %>">
    <% it.metaAttributes.forEach((metaAttribute) => { %>
      <%~ metaAttribute %>
    <% }); %>
    <%~ it.headTags %>
	<script>
		if (window && window.location && window.location.pathname.endsWith('/') && window.location.pathname !== '/') {
			window.history.replaceState('', '', window.location.pathname.substr(0, window.location.pathname.length - 1))
		}
	</script>
    <% it.stylesheets.forEach((stylesheet) => { %>
      <link rel="stylesheet" href="<%= it.baseUrl %><%= stylesheet %>" />
    <% }); %>
    <% it.scripts.forEach((script) => { %>
      <link rel="preload" href="<%= it.baseUrl %><%= script %>" as="script">
    <% }); %>
  </head>
  <body <%~ it.bodyAttributes %>>
    <%~ it.preBodyTags %>
    <div id="__docusaurus">
      <%~ it.appHtml %>
    </div>
    <% it.scripts.forEach((script) => { %>
      <script src="<%= it.baseUrl %><%= script %>"></script>
    <% }); %>
    <%~ it.postBodyTags %>
  </body>
</html>`,
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
            {
                to: '/users-manual/using-creating-images-cli',
                from: '/users-manual/using_creating_images_cli',
            },
            {
                to: '/users-manual/create-an-instance',
                from: '/users-manual/create_an_instance_cli',
            },
            {
                from: '/kubernetes-guides/installing-an-okd-cluster-on-openstack',
                to: '/kubernetes-guides/installing-an-openshift-cluster-on-openstack',
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
                label: 'On-Demand OpenStack',
                description: 'Production ready OpenStack clusters in 45 seconds. Fully customizable.',
                href: 'https://openmetal.io/solutions/on-demand-openstack-cloud/',
                itemType: 'link',
              },
              {
                label: 'Bare Metal Clusters',
                description: 'Large scale clusters for Clickhouse, Spark, Ceph, Hadoop, and more',
                href: 'https://openmetal.io/solutions/on-demand-openstack-cloud/',
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
            //header: 'Openmetal Platform',
            items: [
              {
                label: 'Private Cloud Overview',
                itemType: 'section',
                href: 'https://openmetal.io/platform/cloud-features/',
                links: [
                  {
                    label: 'Compute',
                    description: '',
                    href: 'https://openmetal.io/platform/cloud-features/cloud-compute/',
                    itemType: 'link',
                  },
                  {
                    label: 'Block Storage',
                    description: '',
                    href: 'https://openmetal.io/platform/features/block-storage/',
                    itemType: 'link',
                  },
                  {
                    label: 'Networking',
                    description: '',
                    href: 'https://openmetal.io/platform/features/networking/',
                    itemType: 'link',
                  },
                  {
                    label: 'Object Storage',
                    description: '',
                    href: 'https://openmetal.io/platform/features/object-storage/',
                    itemType: 'link',
                  },
                ]
              },
              {
                label: 'On-Demand OpenStack Overview',
                itemType: 'section',
                href: 'https://openmetal.io/solutions/on-demand-openstack-cloud',
                links: [
                  {
                    label: 'For Public Cloud Providers',
                    description: '',
                    href: 'https://openmetal.io/solutions/openstack-public-cloud-providers/',
                    itemType: 'link',
                  },
                  {
                    label: 'For SAAS Companies',
                    description: '',
                    href: 'https://openmetal.io/solutions/saas',
                    itemType: 'link',
                  },
                ]
              },
              {
                label: 'Bare Metal Overview',
                itemType: 'section',
                href: 'https://openmetal.io/platform/cloud-features/bare-metal/',
                links: [],
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
                href: 'https://openmetal.io/docs/manuals/operators-manual',
                itemType: 'link',
              },
              {
                label: 'Kubernetes',
                description: '',
                href: 'https://openmetal.io/docs/manuals/kubernetes-guides',
                itemType: 'link',
              },
              {
                label: 'OpenStack Users Manual',
                description: '',
                href: 'https://openmetal.io/docs/manuals/users-manual',
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
                label: 'OMI Release V1.5: New Software Integrations',
                description: 'New OpenMetal Integrations with Datadog and SecurityTrails – July 14, 2022Datadog Integration Datadog is a monitoring and security platform for cloud ...',
                href: 'https://openmetal.io/docs/releases/omi-release-v1-5-new-software-integrations/',
                image_url: 'https://openmetal.io/wp-content/uploads/2022/07/Product-Release-Update-v1.5-768x403.png',
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
                label: 'The OpenMetal Team',
                description: '',
                href: 'https://openmetal.io/about-openmetal/team-page/',
                itemType: 'link',
              },
              {
                label: 'Data Center Locations',
                description: '',
                href: 'https://openmetal.io/about-openmetal/data-center-locations/',
                itemType: 'link',
              },
              {
                label: 'Network Connectivity',
                description: '',
                href: 'https://openmetal.io/about-openmetal/network-connectivity/',
                itemType: 'link',
              },
              {
                label: 'Support and Service Levels',
                description: '',
                href: 'https://openmetal.io/about-openmetal/support-and-service-levels/',
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
                href: 'https://openmetal.io/docs/manuals/operators-manual',
              },
              {
                label: 'OpenStack User’s Manual',
                href: 'https://openmetal.io/docs/manuals/users-manual',
              },
              {
                label: 'Private Cloud Users',
                href: 'https://openmetal.io/docs/product-guides/private-cloud/',
              },
              {
                label: 'Kubernetes',
                href: 'https://openmetal.io/docs/manuals/kubernetes-guides',
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
