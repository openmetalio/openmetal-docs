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
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'openmetalio', // Usually your GitHub org/user name.
  projectName: 'openmetal-docs', // Usually your repo name.
  clientModules: [
    require.resolve('./src/modules/trackers.ts'),
  ],
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
      }),
    ],
  ],
  scripts: [
    {
      src: 'js/accessibility.js',
      async: true,
    },
  ],
  ssrTemplate: `<!DOCTYPE html>
  <html <%~ it.htmlAttributes %>>
	<head>
	  <meta name="viewport" content="width=device-width, initial-scale=1">
	  <meta charset="UTF-8">
	  <meta name="generator" content="Docusaurus v<%= it.version %>">
	  <% it.metaAttributes.forEach((metaAttribute) => { %>
		<%~ metaAttribute %>
	  <% }); %>
	  <%~ it.headTags %>
	  <% it.stylesheets.forEach((stylesheet) => { %>
		<link rel="stylesheet" href="<%= it.baseUrl %><%= stylesheet %>" />
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
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      navbar: {
        title: '',
        logo: {
          target: '_self',
          alt: 'OpenMetal',
          src: 'https://inmotionhosting.github.io/static-assets/logo/open-metal/medium.png',
          href: 'https://openmetal.io'
        },
        hideOnScroll: false,
        items: [],
      },
    }),
    customFields: {
      navbarTopRow: [
        {
          label: 'CHAT',
          position: 'right',
          href: 'https://openmetal.io/#hs-chat-open',
        },
        {
          label: 'MEET',
          position: 'right',
          href: 'https://openmetal.io/schedule-meeting/',
        },
        {
          label: 'BUY',
          position: 'right',
          href: 'https://openmetal.io/iaas-pricing//',
        },
        {
          label: 'TRIAL',
          position: 'right',
          href: 'https://openmetal.io/free-trial/',
        },
        {
          label: 'LOGIN',
          position: 'right',
          href: 'https://central.openmetal.io/auth/sign-in',
        },
      ],
      navbar: {
        items: [
          {
            type: 'dropdown',
            label: 'Products',
            position: 'left',
            items: [
              {
                label: 'Cloud Cores',
                description: 'Start with all the top OpenMetal features in a highly available configuration.',
                href: 'https://openmetal.io/products/cloud-cores/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-Cloud-Logo.png',
              },
              {
                label: 'Cloud Expansion Nodes',
                description: 'Scale your Cloud with flexible building blocks that fit your business.',
                href: 'https://openmetal.io/products/cloud-expansion/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-Converged-Node-Layers-150x150.png',
              },
              {
                label: 'Storage Clusters',
                description: 'Get high performance object, block, and file storage with fair egress at simple prices.',
                href: 'https://openmetal.io/products/storage-clusters/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-NVMe-150x150.png',
              },
              {
                label: 'Bare Metal Clusters',
                description: 'Support demanding workloads such as ClickHouse, Hadoop, and more.',
                href: 'https://openmetal.io/products/bare-metal/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-BareMetal-Node-Layers-150x150.png',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Use Cases',
            position: 'left',
            items: [
              {
                label: 'Hosted Private Cloud',
                description: '',
                href: 'https://openmetal.io/use-cases/hosted-private-cloud/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/private-cloud-menu.png',
              },
              {
                label: 'Reduce Cloud Costs',
                description: '',
                href: 'https://openmetal.io/use-cases/reduce-cloud-costs/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faSackDollar',
              },
              {
                label: 'Public Cloud Alternative',
                description: '',
                href: 'https://openmetal.io/use-cases/public-cloud-alternative/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/cloud-alternative-menu.png',
              },
              {
                label: 'Managed Private Cloud',
                description: '',
                href: 'https://openmetal.io/use-cases/managed-private-cloud/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/05/cloud-service.png',
              },
              {
                label: 'On-Demand OpenStack',
                description: '',
                href: 'https://openmetal.io/use-cases/on-demand-openstack-cloud/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/openstack-menu.png',
              },
              {
                label: 'S3 Alternatives',
                description: '',
                href: 'https://openmetal.io/use-cases/s3-alternatives/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/05/blocks.png',
              },
              {
                label: 'Kubernetes Workloads',
                description: '',
                href: 'https://openmetal.io/use-cases/kubernetes-workloads/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/kubernetes-menu.png',
              },
              {
                label: 'Large Iaas Deployments',
                description: '',
                href: 'https://openmetal.io/products/large-iaas-deployments/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/large-deployments-menu.png',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Platform',
            position: 'left',
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
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/compute-menu.png',
                  },
                  {
                    label: 'Block Storage',
                    description: '',
                    href: 'https://openmetal.io/platform/features/block-storage/',
                    itemType: 'link',
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/block-storage-menu.png',
                  },
                  {
                    label: 'Networking',
                    description: '',
                    href: 'https://openmetal.io/platform/features/networking/',
                    itemType: 'link',
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/networking-menu.png',
                  },
                  {
                    label: 'Object Storage',
                    description: '',
                    href: 'https://openmetal.io/platform/features/object-storage/',
                    itemType: 'link',
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/object-storage-menu.png',
                  },
                  {
                    label: 'Cloud Monitoring',
                    description: '',
                    href: 'https://openmetal.io/platform/cloud-monitoring/',
                    itemType: 'link',
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/cloud-monitoring-menu.png',
                  },
                  {
                    label: 'Service Level Agreements',
                    description: '',
                    href: 'https://openmetal.io/platform/support-and-service-levels/',
                    itemType: 'link',
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/sla.png',
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
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/hosting-public-cloud-menu.png',
                  },
                  {
                    label: 'For SAAS Companies',
                    description: '',
                    href: 'https://openmetal.io/solutions/saas',
                    itemType: 'link',
                    icontype: 'external',
                    iconstyle: 'solid',
                    icon: 'https://openmetal.io/wp-content/uploads/2023/04/saas-providers-menu.png',
                  },
                ]
              },
              {
                label: 'Bare Metal Overview',
                itemType: 'section',
                href: 'https://openmetal.io/platform/cloud-features/bare-metal/',
                links: [],
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Pricing',
            position: 'left',
            header: '',
            items: [
              {
                label: 'Cloud Cores',
                description: '',
                href: 'https://openmetal.io/iaas-pricing/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-Cloud-Logo.png',
              },
              {
                label: 'Cloud Expansion Nodes',
                description: '',
                href: 'https://openmetal.io/cloud-expansion-pricing/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-Converged-Node-Layers-150x150.png',
              },
              {
                label: 'Storage Clusters',
                description: '',
                href: 'https://openmetal.io/storage-cluster-pricing/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-NVMe-150x150.png',
              },
              {
                label: 'Egress',
                description: '',
                href: 'https://openmetal.io/egress-pricing-calculator/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'detailed',
                icon: 'https://openmetal.io/wp-content/uploads/2023/03/Architecture-BareMetal-Node-Layers-150x150.png',
              },
            ]
          },
          {
            type: 'dropdown',
            label: 'Programs',
            position: 'left',
            items: [
              {
                label: 'SaaS Providers',
                description: 'Scale business while maintaining a cost-effective infrastructure that improves margins',
                href: 'https://openmetal.io/programs/saas-providers-program/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/saas-providers-menu.png',
              },
              {
                label: 'Hosting and Public Cloud Providers',
                description: 'Combined scale yields better costs, new locations, and more features',
                href: 'https://openmetal.io/programs/hosting-cloud-providers/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/hosting-public-cloud-menu.png',
              },
              {
                label: 'OpenStack',
                description: 'Harness the power of OpenStack to build private clouds at any size, on-demand',
                href: 'https://openmetal.io/programs/on-demand-openstack-cloud/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/openstack-menu.png',
              },
              {
                label: 'Education and Training',
                description: 'Become the next generation of Cloud Architects and Cloud Native Developers',
                href: 'https://openmetal.io/programs/education-and-training/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faGraduationCap',
              },
              {
                label: 'Partners',
                description: 'Realize new paths to profitability or business success with open source services',
                href: 'https://openmetal.io/programs/openmetal-partner-programs/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faHandshake',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Resources',
            position: 'left',
            header: '',
            items: [
              {
                label: 'Resources Home',
                description: '',
                href: 'https://openmetal.io/resources/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/documentation-menu.png',
              },
              {
                label: 'OpenMetal Blog',
                description: '',
                href: 'https://openmetal.io/resources/blog/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/blog-menu.png',
              },
              {
                label: 'Analyst Coverage and Industry Reports',
                description: '',
                href: 'https://openmetal.io/resources/analyst-industry-reports/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faLineChart',
              },
              {
                label: 'Cloud Industry Events',
                description: '',
                href: 'https://openmetal.io/resources/cloud-industry-events/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faCalendar',
              },
              {
                label: 'Media & Press',
                description: '',
                href: 'https://openmetal.io/resources/media-and-press/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faBullhorn',
              },
              {
                label: 'Sales FAQ',
                description: '',
                href: 'https://openmetal.io/resources/sales-faq/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faQuestionCircle',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'left',
            header: '',
            items: [
              {
                label: 'Documentation Home',
                description: '',
                href: 'https://openmetal.io/docs/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/documentation-menu.png',
              },
              {
                label: 'OpenStack Operators Manual',
                description: '',
                href: 'https://openmetal.io/docs/manuals/operators-manual',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/operator-manual-menu.png',
              },
              {
                label: 'OpenStack Users Manual',
                description: '',
                href: 'https://openmetal.io/docs/manuals/users-manual',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/user-manual-menu.png',
              },
              {
                label: 'Private Cloud Users',
                description: '',
                href: 'https://openmetal.io/docs/product-guides/private-cloud/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/private-cloud-users-menu.png',
              },
              {
                label: 'Kubernetes',
                description: '',
                href: 'https://openmetal.io/docs/manuals/kubernetes-guides',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/kubernetes-menu.png',
              },
              {
                label: 'Product Release Updates',
                description: '',
                href: 'https://openmetal.io/docs/releases/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/release-notes-menu.png',
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
              // {
              //   label: 'OMI Release V1.5: New Software Integrations',
              //   description: 'New OpenMetal Integrations with Datadog and SecurityTrails – July 14, 2022Datadog Integration Datadog is a monitoring and security platform for cloud ...',
              //   href: 'https://openmetal.io/docs/releases/omi-release-v1-5-new-software-integrations/',
              //   image_url: 'https://openmetal.io/wp-content/uploads/2022/07/Product-Release-Update-v1.5-768x403.png',
              //   itemType: 'article',
              // },
            ],
          },
          {
            type: 'dropdown',
            label: 'Company',
            position: 'left',
            header: '',
            items: [
              {
                label: 'About OpenMetal',
                description: '',
                href: 'https://openmetal.io/about-openmetal/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faInfoCircle',
              },
              {
                label: 'Core Guiding Principles',
                description: '',
                href: 'https://openmetal.io/company/guiding-principles/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faLightbulb',
              },
              {
                label: 'The OpenMetal Team',
                description: '',
                href: 'https://openmetal.io/about-openmetal/team-page/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faUsers',
              },
              {
                label: 'Our Cloud Support Services',
                description: '',
                href: 'https://openmetal.io/about-openmetal/cloud-support-services/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/04/customer.png',
              },
              {
                label: 'Data Center Locations',
                description: '',
                href: 'https://openmetal.io/about-openmetal/data-center-locations/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faLocationArrow',
              },
              {
                label: 'Network Connectivity',
                description: '',
                href: 'https://openmetal.io/about-openmetal/network-connectivity/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faGlobe',
              },
              {
                label: 'Contact Us',
                description: '',
                href: 'https://openmetal.io/about-openmetal/contact-us/',
                itemType: 'link',
                icontype: 'fontAwesome',
                iconstyle: 'solid',
                icon: 'faPhoneSquare',
              },
              {
                label: 'Sitemap',
                description: '',
                href: 'https://openmetal.io/sitemap/',
                itemType: 'link',
                icontype: 'external',
                iconstyle: 'solid',
                icon: 'https://openmetal.io/wp-content/uploads/2023/05/sitemap-1.png',
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
                label: 'Cloud Cores',
                href: 'https://openmetal.io/products/cloud-cores/',
              },
              {
                label: 'Cloud Expansion Nodes',
                href: 'https://openmetal.io/products/cloud-expansion/',
              },
              {
                label: 'Storage Clusters',
                href: 'https://openmetal.io/products/storage-clusters/',
              },
              {
                label: 'Bare Metal Clusters',
                href: 'https://openmetal.io/products/bare-metal/',
              },
            ],
          },
          {
            title: 'Programs',
            items: [
              {
                label: 'SaaS Providers',
                href: 'https://openmetal.io/programs/saas-providers-program/',
              },
              {
                label: 'Hosting and Public Cloud Providers',
                href: 'https://openmetal.io/programs/hosting-cloud-providers/',
              },
              {
                label: 'OpenStack',
                href: 'https://openmetal.io/programs/on-demand-openstack-cloud/',
              },
              {
                label: 'Education and Training',
                href: 'https://openmetal.io/programs/education-and-training/',
              },
              {
                label: 'Partners',
                href: 'https://openmetal.io/programs/openmetal-partner-programs/',
              },
            ],
          },
          {
            title: 'Use Cases',
            items: [
              {
                label: 'Reduce Cloud Costs',
                href: 'https://openmetal.io/use-cases/reduce-cloud-costs/',
              },
              {
                label: 'Public Cloud Alternative',
                href: 'https://openmetal.io/use-cases/public-cloud-alternative/',
              },
              {
                label: 'Hosted Private Cloud',
                href: 'https://openmetal.io/use-cases/hosted-private-cloud/',
              },
              {
                label: 'Managed Private Cloud',
                href: 'https://openmetal.io/use-cases/managed-private-cloud/',
              },
              {
                label: 'On-Demand OpenStack',
                href: 'https://openmetal.io/use-cases/on-demand-openstack-cloud/',
              },
              {
                label: 'S3 Alternatives',
                href: 'https://openmetal.io/use-cases/s3-alternatives/',
              },
              {
                label: 'Kubernetes Workloads',
                href: 'https://openmetal.io/use-cases/kubernetes-workloads/',
              },
              {
                label: 'Large IaaS Deployments',
                href: 'https://openmetal.io/products/large-iaas-deployments/',
              },
            ],
          },
          {
            title: 'Platform',
            items: [
              {
                label: 'Private Cloud Overview',
                href: 'https://openmetal.io/platform/cloud-features/',
              },
              {
                label: 'Compute',
                href: 'https://openmetal.io/resources/blog/using-self-service-tools-to-buy-private-openstack-clouds/',
              },
              {
                label: 'Object Storage',
                href: 'https://openmetal.io/products/cloud-cores/object-storage/',
              },
              {
                label: 'Block Storage',
                href: 'https://openmetal.io/products/cloud-cores/block-storage/',
              },
              {
                label: 'Cloud Monitoring',
                href: 'https://openmetal.io/platform/cloud-monitoring/',
              },
              {
                label: 'Central Cloud Portal',
                href: 'https://openmetal.io/platform/openmetal-central-cloud-portal/',
              },
              {
                label: 'On-Demand OpenStack Overview',
                href: 'https://openmetal.io/solutions/on-demand-openstack-cloud',
              },
              {
                label: 'Bare Metal Overview',
                href: 'https://openmetal.io/platform/cloud-features/bare-metal/',
              },
            ],
          },
          {
            title: '',
            type: 'section',
            items: [
              {
                title: 'Pricing',
                items: [
                  {
                    label: 'Cloud Core',
                    href: 'https://openmetal.io/iaas-pricing/',
                  },
                  {
                    label: 'Cloud Expansion Nodes',
                    href: 'https://openmetal.io/cloud-expansion-pricing/',
                  },
                  {
                    label: 'Storage Clusters',
                    href: 'https://openmetal.io/storage-cluster-pricing/',
                  },
                  {
                    label: 'Egress',
                    href: 'https://openmetal.io/egress-pricing-calculator/',
                  },
                ],
              },
              {
                title: 'Resources',
                items: [
                  {
                    label: 'Resources',
                    href: 'https://openmetal.io/resources/',
                  },
                  {
                    label: 'OpenMetal Blog',
                    href: 'https://openmetal.io/resources/blog/',
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
                    href: 'https://central.openmetal.io/auth/sign-in?_gl=1*1f9nq84*_ga*NjU4MzA2NTUzLjE2NTc2NTQ2NDU.*_ga_6NRHQVXHG4*MTY4NjIzMTE0NS4xNjAuMS4xNjg2MjMxMjk4LjAuMC4w*_gcl_au*MTY3ODcxNDU4My4xNjgxMjQ0MjQzLjYxMTMwMDYyMC4xNjgzODMxMTA0LjE2ODM4MzExMDM.&_ga=2.59192749.1018032181.1685979564-658306553.1657654645',
                  },
                ],
              },
            ]
          },
          {
            title: 'Documentation',
            items: [
              {
                label: 'Documentation Home',
                href: 'https://openmetal.io/docs/',
              },
              {
                label: 'Education Docs',
                href: 'https://openmetal.io/docs/edu/',
              },
              {
                label: 'OpenStack Tutorials',
                href: 'https://openmetal.io/docs/edu/openstack/',
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
                label: 'Kubernetes',
                href: 'https://openmetal.io/docs/manuals/kubernetes-guides',
              },
              {
                label: 'Private Cloud Users',
                href: 'https://openmetal.io/docs/product-guides/private-cloud/',
              },
              {
                label: 'Private Cloud Docs',
                href: 'https://openmetal.io/docs/private-cloud/',
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
                label: 'OpenMetal Team',
                href: 'https://openmetal.io/about-openmetal/team-page/',
              },
              {
                label: 'Cloud Support Services',
                href: 'https://openmetal.io/about-openmetal/cloud-support-services/',
              },
              {
                label: 'Data Center Locations',
                href: 'https://openmetal.io/about-openmetal/data-center-locations/',
              },
              {
                label: 'Contact Us',
                href: 'https://openmetal.io/company/contact-us/',
              },
              {
                label: 'Sitemap',
                href: 'https://openmetal.io/sitemap',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Terms of Use',
                href: 'https://openmetal.io/universal-terms-of-use/',
              },
              {
                label: 'Acceptable Use Policy',
                href: 'https://openmetal.io/aup/',
              },
              {
                label: 'Privacy Policy',
                href: 'https://openmetal.io/privacy-policy/',
              },
              {
                label: 'Cookie Policy',
                href: 'https://openmetal.io/cookie-policy/',
              },
              {
                label: 'Data Processing Addendum',
                href: 'https://openmetal.io/dpa/',
              },
              {
                label: 'CCPA Compliance',
                href: 'https://openmetal.io/ccpa-compliance/',
              },
              {
                label: 'Do Not Sell or Share My Data',
                href: 'https://openmetal.io/do-not-sell-or-share-my-personal-information/',
              },
              {
                label: 'Limit the Use of My Sensitive Personal Information',
                href: 'https://openmetal.io/limit-use-and-disclosure-of-sensitive-personal-information/',
              },
              {
                label: 'Accessibility Statement',
                href: 'https://openmetal.io/accessibility-statement/',
              },
              {
                label: 'Legal Inquiries',
                href: 'https://openmetal.io/legal-inquiries/',
              },
              {
                label: 'Attribution',
                href: 'https://openmetal.io/attribution/',
              },
            ],
          },
        ],
        logo: {
          alt: 'Openmetal Logo',
          src: 'https://inmotionhosting.github.io/static-assets/logo/open-metal/medium.png',
          width: '160px',
          height: '51px',
        },
        copyright: `<strong>${new Date().getFullYear()} © OpenMetal.  All rights reserved.</strong>`,
      },
    },
};

module.exports = config;
