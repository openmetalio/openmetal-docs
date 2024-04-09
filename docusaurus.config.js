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
  favicon: 'https://inmotionhosting.github.io/static-assets/logo/open-metal/icon.png',
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
  scripts: [{
    src: 'js/accessibility.js',
    async: true,
  }, ],
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
        redirects: [{
            to: '/users-manual/using-creating-images-cli',
            from: '/users-manual/using_creating_images_cli',
          },
          {
            to: '/users-manual/create-an-instance',
            from: '/users-manual/create_an_instance_cli',
          },
          {
            to: '/baremetal/tutorials/access-ipmi-kvm',
            from: '/users-manual/access-ipmi-kvm',
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
      metadata: [{
          name: 'twitter:site',
          content: '@openmetalio'
        },
        {
          name: 'twitter:creator',
          content: '@openmetalio'
        }
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
    navbarTopRow: [{
        label: 'CHAT',
        position: 'right',
        href: 'https://openmetal.io/#hs-chat-open',
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
      items: [{
          type: 'dropdown',
          label: 'Products',
          position: 'left',
          items: [{
              "label": "Hosted Private Cloud",
              "description": "Day 2 ready, no licensing costs, delivered in 45 seconds.",
              "href": "https://openmetal.io/products/hosted-private-cloud/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "detailed",
              "icon": "https://openmetal.io/wp-content/uploads/2023/03/Architecture-Networking-Box-on-Platform-150x150.png"
            },
            {
              "label": "OpenStack Private Cloud",
              "description": "The #1 open source cloud, full root, delivered in 45 seconds.",
              "href": "https://openmetal.io/products/on-demand-openstack-cloud/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/openstack-menu.png"
            },
            {
              "label": "Ceph Storage Clusters",
              "description": "Get high performance object, block, and file storage with fair egress at simple prices.",
              "href": "https://openmetal.io/products/storage-clusters/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "detailed",
              "icon": "https://openmetal.io/wp-content/uploads/2023/03/Architecture-NVMe-150x150.png"
            },
            {
              "label": "Bare Metal Clusters",
              "description": "Support demanding workloads such as ClickHouse, Hadoop, and more.",
              "href": "https://openmetal.io/products/bare-metal/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "detailed",
              "icon": "https://openmetal.io/wp-content/uploads/2023/03/Architecture-BareMetal-Node-Layers-150x150.png"
            },
          ],
        },
        {
          "type": "dropdown",
          "label": "Pricing",
          "position": "left",
          "items": [{
              "label": "Private Cloud",
              "description": "",
              "href": "https://openmetal.io/cloud-deployment-calculator/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "detailed",
              "icon": "https://openmetal.io/wp-content/uploads/2023/03/Architecture-Cloud-Logo.webp"
            },
            {
              "label": "Bare Metal",
              "description": "",
              "href": "https://openmetal.io/bare-metal-pricing/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "detailed",
              "icon": "https://openmetal.io/wp-content/uploads/2023/03/Architecture-BareMetal.png"
            },
            {
              "label": "Storage Clusters",
              "description": "",
              "href": "https://openmetal.io/storage-cluster-pricing/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "detailed",
              "icon": "https://openmetal.io/wp-content/uploads/2023/03/Architecture-NVMe-45x45.png"
            },
            {
              "label": "Egress",
              "description": "",
              "href": "https://openmetal.io/egress-pricing-calculator/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "detailed",
              "icon": "https://openmetal.io/wp-content/uploads/2023/03/Architecture-BareMetal-Node-Layers-45x45.png"
            }
          ]
        },
        {
          "type": "dropdown",
          "label": "Platform",
          "position": "left",
          "items": [{
              "label": "Feature Overview",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-cores/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": ""
            },
            {
              "label": "OpenStack",
              "description": "",
              "href": "https://openmetal.io/platform/openstack/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/openstack-menu.png"
            },
            {
              "label": "Compute",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-cores/cloud-compute/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/compute-menu.png"
            },
            {
              "label": "Block Storage",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-cores/block-storage/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/block-storage-menu.png"
            },
            {
              "label": "Networking",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-cores/cloud-networking/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/networking-menu.png"
            },
            {
              "label": "Object Storage",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-cores/object-storage/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/object-storage-menu.png"
            },
            {
              "label": "Integrated Bare Metal",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-cores/integrated-bare-metal/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/12/server.png"
            },
            {
              "label": "Kubernetes Infrastructure",
              "description": "",
              "href": "https://openmetal.io/platform/kubernetes-infrastructure/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/kubernetes-menu.png"
            },
            {
              "label": "Cloud Monitoring",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-monitoring/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/cloud-monitoring-menu.png"
            },
            {
              "label": "Cloud Scaling Options",
              "description": "",
              "href": "https://openmetal.io/platform/cloud-expansion/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": ""
            },
            {
              "label": "Cloud Portal",
              "description": "",
              "href": "https://openmetal.io/platform/openmetal-central-cloud-portal/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": ""
            },
            {
              "label": "Service Level Agreements",
              "description": "",
              "href": "https://openmetal.io/platform/support-and-service-levels/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": ""
            }
          ]
        },

        {
          "type": "dropdown",
          "label": "Use Cases",
          "position": "left",
          "items": [{
              "label": "SaaS Providers",
              "description": "",
              "href": "https://openmetal.io/use-cases/saas-providers/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/saas-providers-menu.png"
            },
            {
              "label": "Hosting and Public Cloud Providers",
              "description": "",
              "href": "https://openmetal.io/use-cases/hosting-cloud-providers/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/hosting-public-cloud-menu.png"
            },
            {
              "label": "Managed IT Service Providers",
              "description": "",
              "href": "https://openmetal.io/use-cases/MSP/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2024/01/computer.png"
            },
            {
              "label": "Managed Private Cloud",
              "description": "",
              "href": "https://openmetal.io/use-cases/managed-private-cloud/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/05/cloud-service.png"
            },
            {
              "label": "Reduce Cloud Costs",
              "description": "",
              "href": "https://openmetal.io/use-cases/reduce-cloud-costs/",
              "itemType": "link",
              "icontype": "fontAwesome",
              "iconstyle": "solid",
              "icon": "faSackDollar"
            },
            {
              "label": "Public Cloud Alternative",
              "description": "",
              "href": "https://openmetal.io/use-cases/public-cloud-alternative/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/cloud-alternative-menu.png"
            },
            {
              "label": "Big Data Infrastructure",
              "description": "",
              "href": "https://openmetal.io/use-cases/big-data-infrastructure/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/08/data-analytics.png"
            },
            {
              "label": "S3 Alternatives",
              "description": "",
              "href": "https://openmetal.io/use-cases/s3-alternatives/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/05/blocks.png"
            },
            {
              "label": "Kubernetes Workloads",
              "description": "",
              "href": "https://openmetal.io/use-cases/kubernetes-workloads/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/kubernetes-menu.png"
            },
            {
              "label": "Large IaaS Deployments",
              "description": "",
              "href": "https://openmetal.io/use-cases/large-iaas-deployments/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/large-deployments-menu.png"
            }
          ]
        },
        {
          "type": "dropdown",
          "label": "Resources",
          "position": "left",
          "items": [{
              "label": "Resources Home",
              "href": "https://openmetal.io/resources",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/user-manual-menu.png"
            },
            {
              "label": "OpenMetal Blog",
              "href": "https://openmetal.io/resources/blog/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/04/blog-menu.png"
            },
            {
              "label": "Case Studies",
              "href": "https://openmetal.io/resources/case-studies/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/06/case-study.png"
            },
            {
              "label": "Newsletters",
              "href": "https://openmetal.io/resources/newsletters/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/12/newspaper.png"
            },
            {
              "label": "OpenMetal Community",
              "href": "https://openmetal.io/openmetal-community/",
              "itemType": "link",
              "icontype": "external",
              "iconstyle": "solid",
              "icon": "https://openmetal.io/wp-content/uploads/2023/07/people.png"
            },
            {
              "label": "Analyst Coverage & Industry Reports",
              "href": "https://openmetal.io/resources/analyst-industry-reports/",
              "itemType": "link",
              "icontype": "fontAwesome",
              "iconstyle": "solid",
              "icon": "faChartLine"
            },
            {
              "label": "Cloud Industry Events",
              "href": "https://openmetal.io/resources/cloud-industry-events/",
              "itemType": "link",
              "icontype": "fontAwesome",
              "iconstyle": "solid",
              "icon": "faCalendar"
            },
            {
              "label": "Education & Training",
              "href": "https://openmetal.io/programs/education-and-training/",
              "itemType": "link",
              "icontype": "fontAwesome",
              "iconstyle": "solid",
              "icon": "faGraduationCap"
            },
            {
              "label": "Media & Press",
              "href": "https://openmetal.io/resources/media-and-press/",
              "itemType": "link",
              "icontype": "fontAwesome",
              "iconstyle": "solid",
              "icon": "faBullhorn"
            },
            {
              "label": "OpenMetal Cloud FAQ",
              "href": "https://openmetal.io/resources/openmetal-cloud-faq/",
              "itemType": "link",
              "icontype": "fontAwesome",
              "iconstyle": "solid",
              "icon": "faQuestionCircle"
            }
          ]
        },

        {
          type: 'dropdown',
          label: 'Docs',
          position: 'left',
          header: '',
          items: [{
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
          items: [{
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
              label: 'Careers',
              description: '',
              href: 'https://openmetal.io/about-openmetal/openmetal_careers/',
              itemType: 'link',
              icontype: 'external',
              iconstyle: 'solid',
              icon: 'https://openmetal.io/wp-content/uploads/2023/07/suitcase.png',
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
      links: [{
          title: 'Products',
          items: [{
              "label": "Hosted Private Cloud",
              "href": "https://openmetal.io/products/hosted-private-cloud/"
            },
            {
              "label": "OpenStack Private Cloud",
              "href": "https://openmetal.io/products/on-demand-openstack-cloud/"
            },
            {
              "label": "Ceph Storage Clusters",
              "href": "https://openmetal.io/products/storage-clusters/"
            },
            {
              "label": "Bare Metal Clusters",
              "href": "https://openmetal.io/products/bare-metal/"
            }
          ],
        },


        {
          title: 'Pricing',
          items: [{
              "label": "Private Cloud",
              "href": "https://openmetal.io/cloud-deployment-calculator/"
            },
            {
              "label": "Bare Metal",
              "href": "https://openmetal.io/bare-metal-pricing"
            },
            {
              "label": "Cloud Expansion Nodes",
              "href": "https://openmetal.io/cloud-expansion-pricing/"
            },
            {
              "label": "Storage Clusters",
              "href": "https://openmetal.io/storage-cluster-pricing/"
            },
            {
              "label": "Egress",
              "href": "https://openmetal.io/egress-pricing-calculator/"
            },
            {
              "label": "Spot Hardware",
              "href": "https://openmetal.io/cloud-spot-pricing/"
            }
          ],
        },

        {
          "title": "Platform",
          "items": [{
              "label": "Cloud Cores",
              "href": "https://openmetal.io/platform/cloud-cores/"
            },
            {
              "label": "OpenStack",
              "href": "https://openmetal.io/platform/openstack/"
            },
            {
              "label": "Compute",
              "href": "https://openmetal.io/platform/cloud-cores/cloud-compute/"
            },
            {
              "label": "Block Storage",
              "href": "https://openmetal.io/platform/cloud-cores/block-storage/"
            },
            {
              "label": "Networking",
              "href": "https://openmetal.io/platform/cloud-cores/cloud-networking/"
            },
            {
              "label": "Object Storage",
              "href": "https://openmetal.io/platform/cloud-cores/object-storage/"
            },
            {
              "label": "Integrated Bare Metal",
              "href": "https://openmetal.io/platform/cloud-cores/integrated-bare-metal/"
            },
            {
              "label": "Kubernetes Infrastructure",
              "href": "https://openmetal.io/platform/kubernetes-infrastructure/"
            },
            {
              "label": "Cloud Monitoring",
              "href": "https://openmetal.io/platform/cloud-monitoring/"
            },
            {
              "label": "Cloud Scaling Options",
              "href": "https://openmetal.io/platform/cloud-expansion/"
            },
            {
              "label": "Cloud Portal",
              "href": "https://openmetal.io/platform/openmetal-central-cloud-portal/"
            },
            {
              "label": "Service Level Agreements",
              "href": "https://openmetal.io/platform/support-and-service-levels/"
            }
          ]
        },

        {
          title: 'Use Cases',
          items: [{
              "label": "SaaS Providers",
              "href": "https://openmetal.io/use-cases/saas-providers"
            },
            {
              "label": "Hosting and Public Cloud Providers",
              "href": "https://openmetal.io/use-cases/hosting-cloud-providers/"
            },
            {
              "label": "Managed IT Service Providers",
              "href": "https://openmetal.io/use-cases/MSP/"
            },
            {
              "label": "Managed Private Cloud",
              "href": "https://openmetal.io/use-cases/managed-private-cloud/"
            },
            {
              "label": "Reduce Cloud Costs",
              "href": "https://openmetal.io/use-cases/reduce-cloud-costs/"
            },
            {
              "label": "Public Cloud Alternative",
              "href": "https://openmetal.io/use-cases/public-cloud-alternative/"
            },
            {
              "label": "Big Data Infrastructure",
              "href": "https://openmetal.io/use-cases/big-data-infrastructure"
            },
            {
              "label": "S3 Alternatives",
              "href": "https://openmetal.io/use-cases/s3-alternatives/"
            },
            {
              "label": "Kubernetes Workloads",
              "href": "https://openmetal.io/use-cases/kubernetes-workloads/"
            },
            {
              "label": "Large IaaS Deployments",
              "href": "https://openmetal.io/use-cases/large-iaas-deployments/"
            }
          ],
        },
        {
          "title": "Resources",
          "items": [{
              "label": "Resources Home",
              "href": "https://openmetal.io/resources/"
            },
            {
              "label": "OpenMetal Blog",
              "href": "https://openmetal.io/resources/blog/"
            },
            {
              "label": "Case Studies",
              "href": "https://openmetal.io/resources/case-studies/"
            },
            {
              "label": "Newsletters",
              "href": "https://openmetal.io/resources/newsletters"
            },
            {
              "label": "OpenMetal Community",
              "href": "https://openmetal.io/openmetal-community/"
            },
            {
              "label": "Analyst Coverage & Industry Reports",
              "href": "https://openmetal.io/resources/analyst-industry-reports/"
            },
            {
              "label": "Cloud Industry Events",
              "href": "https://openmetal.io/resources/cloud-industry-events/"
            },
            {
              "label": "Education & Training",
              "href": "https://openmetal.io/programs/education-and-training/"
            },
            {
              "label": "Media & Press",
              "href": "https://openmetal.io/resources/media-and-press/"
            },
            {
              "label": "OpenMetal Cloud FAQ",
              "href": "https://openmetal.io/resources/openmetal-cloud-faq/"
            }
          ]
        },
        {
          "title": "Docs",
          "items": [{
              "label": "Documentation Home",
              "href": "https://openmetal.io/docs/"
            },
            {
              "label": "OpenStack Operator’s Manual",
              "href": "https://openmetal.io/docs/manuals/operators-manual"
            },
            {
              "label": "OpenStack User’s Manual",
              "href": "https://openmetal.io/docs/manuals/users-manual"
            },
            {
              "label": "Private Cloud Users",
              "href": "https://openmetal.io/docs/product-guides/private-cloud/"
            },
            {
              "label": "Kubernetes",
              "href": "https://openmetal.io/docs/manuals/kubernetes-guides"
            },
            {
              "label": "Product Release Updates",
              "href": "https://openmetal.io/docs/releases/"
            }
          ]
        },
        {
          "title": "Company",
          "items": [{
              "label": "About OpenMetal",
              "href": "https://openmetal.io/about-openmetal/"
            },
            {
              "label": "Core Guiding Principles",
              "href": "https://openmetal.io/about-openmetal/guiding-principles/"
            },
            {
              "label": "OpenMetal Team",
              "href": "https://openmetal.io/about-openmetal/team-page/"
            },
            {
              "label": "Cloud Support Services",
              "href": "https://openmetal.io/about-openmetal/cloud-support-services/"
            },
            {
              "label": "Data Center Locations",
              "href": "https://openmetal.io/about-openmetal/data-center-locations/"
            },
            {
              "label": "Careers",
              "href": "https://openmetal.io/about-openmetal/openmetal_careers"
            },
            {
              "label": "Sitemap",
              "href": "https://openmetal.io/sitemap"
            }
          ]
        },
        {
          "title": "Legal",
          "items": [{
              "label": "Terms of Use",
              "href": "https://openmetal.io/universal-terms-of-use/"
            },
            {
              "label": "Acceptable Use Policy",
              "href": "https://openmetal.io/aup/"
            },
            {
              "label": "Privacy Policy",
              "href": "https://openmetal.io/privacy-policy/"
            },
            {
              "label": "Cookie Policy",
              "href": "https://openmetal.io/cookie-policy/"
            },
            {
              "label": "Data Processing Addendum",
              "href": "https://openmetal.io/dpa/"
            },
            {
              "label": "CCPA Compliance",
              "href": "https://openmetal.io/ccpa-compliance/"
            },
            {
              "label": "Do Not Sell or Share My Data",
              "href": "https://openmetal.io/do-not-sell-or-share-my-personal-information/"
            },
            {
              "label": "Limit the Use of My Sensitive Personal Information",
              "href": "https://openmetal.io/limit-use-and-disclosure-of-sensitive-personal-information/"
            },
            {
              "label": "Accessibility Statement",
              "href": "https://openmetal.io/accessibility-statement/"
            },
            {
              "label": "Legal Inquiries",
              "href": "https://openmetal.io/legal-inquiries/"
            },
            {
              "label": "Attribution",
              "href": "https://openmetal.io/attribution/"
            },
          ]
        }
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