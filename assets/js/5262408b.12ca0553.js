"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[6059],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>m});var a=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=a.createContext({}),c=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},u=function(e){var n=c(e.components);return a.createElement(s.Provider,{value:n},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},b=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(t),b=o,m=p["".concat(s,".").concat(b)]||p[b]||d[b]||r;return t?a.createElement(m,l(l({ref:n},u),{},{components:t})):a.createElement(m,l({ref:n},u))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=t.length,l=new Array(r);l[0]=b;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i[p]="string"==typeof e?e:o,l[1]=i;for(var c=2;c<r;c++)l[c]=t[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}b.displayName="MDXCreateElement"},91086:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>l,default:()=>p,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var a=t(87462),o=(t(67294),t(3905));const r={sidebar_position:3},l="How to Enable Elasticsearch and Kibana using Kolla Ansible",i={unversionedId:"operators-manual/day-4/kolla-ansible/enable-elk",id:"operators-manual/day-4/kolla-ansible/enable-elk",title:"How to Enable Elasticsearch and Kibana using Kolla Ansible",description:"Introduction",source:"@site/docs/operators-manual/day-4/kolla-ansible/enable-elk.md",sourceDirName:"operators-manual/day-4/kolla-ansible",slug:"/operators-manual/day-4/kolla-ansible/enable-elk",permalink:"/docs/manuals/operators-manual/day-4/kolla-ansible/enable-elk",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/operators-manual/day-4/kolla-ansible/enable-elk.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"How to Enable TLS for OpenStack using Kolla Ansible",permalink:"/docs/manuals/operators-manual/day-4/kolla-ansible/enable-tls"},next:{title:"Security and Your OpenMetal Private Cloud",permalink:"/docs/manuals/operators-manual/day-4/security/security-best-practices"}},s={},c=[{value:"Introduction",id:"introduction",level:2},{value:"Prerequisites",id:"prerequisites",level:2},{value:"Prepare Kolla Ansible",id:"prepare-kolla-ansible",level:3},{value:"Root Access to OpenStack Control Plane",id:"root-access-to-openstack-control-plane",level:3},{value:"How to Enable Central Logging",id:"how-to-enable-central-logging",level:2},{value:"Prevent Root Disk from Filling",id:"prevent-root-disk-from-filling",level:3},{value:"Reference",id:"reference",level:2}],u={toc:c};function p(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"how-to-enable-elasticsearch-and-kibana-using-kolla-ansible"},"How to Enable Elasticsearch and Kibana using Kolla Ansible"),(0,o.kt)("h2",{id:"introduction"},"Introduction"),(0,o.kt)("p",null,"An OpenStack cloud generates a large quantity of log messages. By\ndefault, there's no way to visually see a Private Cloud's log messages.\nTo diagnose issues in logs requires using SSH and ",(0,o.kt)("inlineCode",{parentName:"p"},"grep"),", which can be\ncumbersome due to the number of hosts and number of OpenStack services.\nElasticsearch and Kibana (ELK) could be leveraged to see all of your\ncloud's log files from a single location in your browser. This feature\nset is not enabled by default. In this guide we walk you through how to\nenable the ELK stack for your Private Cloud using Kolla Ansible."),(0,o.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,o.kt)("h3",{id:"prepare-kolla-ansible"},"Prepare Kolla Ansible"),(0,o.kt)("admonition",{title:"New Clouds",type:"info"},(0,o.kt)("p",{parentName:"admonition"},"On clouds provisioned ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("em",{parentName:"strong"},"after")," Dec 2022")," you will need to open a\n",(0,o.kt)("a",{parentName:"p",href:"/docs/manuals/operators-manual/day-1/intro-to-openmetal-private-cloud#how-to-submit-a-support-ticket"},"support ticket"),"\nto have the configuration saved to your nodes.")),(0,o.kt)("p",null,"This guide explains how to configure your cloud using Kolla Ansible. Any\ntime you work with Kolla Ansible, you must prepare a shell environment.\nFor more, see ",(0,o.kt)("a",{parentName:"p",href:"./prepare-kolla-ansible"},"How to Prepare and Use Kolla Ansible"),"."),(0,o.kt)("p",null,"All commands are to be executed from the control plane node in which\nKolla Ansible has been prepared."),(0,o.kt)("h3",{id:"root-access-to-openstack-control-plane"},"Root Access to OpenStack Control Plane"),(0,o.kt)("p",null,"Root access to your cloud's control plane nodes is required."),(0,o.kt)("h2",{id:"how-to-enable-central-logging"},"How to Enable Central Logging"),(0,o.kt)("p",null,"To enable the ELK stack, in ",(0,o.kt)("inlineCode",{parentName:"p"},"/etc/kolla/globals.yml")," ensure the\nfollowing is set:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"enable_central_logging: 'yes'\n")),(0,o.kt)("p",null,"To enforce data retention policies, enable Elasticseach Curator with:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"enable_elasticsearch_curator: 'yes'\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note","!")," -- Enabling Elasticseach Curator can help prevent your\ncloud's local disks from filling up by enforcing retention policies for\nElasticsearch data."),(0,o.kt)("p",null,"Kolla Ansible generates a default configuration for Elasticsearch\nCurator which can later be found in the ",(0,o.kt)("inlineCode",{parentName:"p"},"elasticsearch_curator")," Docker\ncontainer as\n",(0,o.kt)("inlineCode",{parentName:"p"},"elasticsearch_curator:/etc/elasticsearch-curator/actions.yml"),"."),(0,o.kt)("p",null,"Next, to deploy the configuration changes, use:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"# kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory reconfigure\n")),(0,o.kt)("h3",{id:"prevent-root-disk-from-filling"},"Prevent Root Disk from Filling"),(0,o.kt)("p",null,"You can enable Elasticsearch Curator to enforce disk retention polices\nto prevent your cloud's disks from filling up."),(0,o.kt)("h2",{id:"reference"},"Reference"),(0,o.kt)("p",null,"Kolla Ansible's ",(0,o.kt)("a",{parentName:"p",href:"https://docs.openstack.org/kolla-ansible/victoria/reference/logging-and-monitoring/central-logging-guide.html"},"Central\nLogging"),"\nguide."))}p.isMDXComponent=!0}}]);