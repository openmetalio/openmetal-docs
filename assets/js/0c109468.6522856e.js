"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[8861],{3905:(e,n,o)=>{o.d(n,{Zo:()=>u,kt:()=>h});var t=o(7294);function a(e,n,o){return n in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o,e}function r(e,n){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),o.push.apply(o,t)}return o}function l(e){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?r(Object(o),!0).forEach((function(n){a(e,n,o[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(o,n))}))}return e}function i(e,n){if(null==e)return{};var o,t,a=function(e,n){if(null==e)return{};var o,t,a={},r=Object.keys(e);for(t=0;t<r.length;t++)o=r[t],n.indexOf(o)>=0||(a[o]=e[o]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(t=0;t<r.length;t++)o=r[t],n.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(a[o]=e[o])}return a}var s=t.createContext({}),c=function(e){var n=t.useContext(s),o=n;return e&&(o="function"==typeof e?e(n):l(l({},n),e)),o},u=function(e){var n=c(e.components);return t.createElement(s.Provider,{value:n},e.children)},p="mdxType",g={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var o=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(o),d=a,h=p["".concat(s,".").concat(d)]||p[d]||g[d]||r;return o?t.createElement(h,l(l({ref:n},u),{},{components:o})):t.createElement(h,l({ref:n},u))}));function h(e,n){var o=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var r=o.length,l=new Array(r);l[0]=d;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i[p]="string"==typeof e?e:a,l[1]=i;for(var c=2;c<r;c++)l[c]=o[c];return t.createElement.apply(null,l)}return t.createElement.apply(null,o)}d.displayName="MDXCreateElement"},3134:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>s,contentTitle:()=>l,default:()=>p,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var t=o(7462),a=(o(7294),o(3905));const r={sidebar_position:4},l="Guidelines for Searching through OpenStack Logs",i={unversionedId:"operators-manual/day-4/troubleshooting/log-filtering",id:"operators-manual/day-4/troubleshooting/log-filtering",title:"Guidelines for Searching through OpenStack Logs",description:"Introduction",source:"@site/docs/operators-manual/day-4/troubleshooting/log-filtering.md",sourceDirName:"operators-manual/day-4/troubleshooting",slug:"/operators-manual/day-4/troubleshooting/log-filtering",permalink:"/docs/manuals/operators-manual/day-4/troubleshooting/log-filtering",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/operators-manual/day-4/troubleshooting/log-filtering.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Troubleshooting a Private Cloud's Ceph Cluster",permalink:"/docs/manuals/operators-manual/day-4/troubleshooting/ceph"},next:{title:"Container Orchestration with OpenStack Heat",permalink:"/docs/manuals/operators-manual/day-4/automation/heat"}},s={},c=[{value:"Introduction",id:"introduction",level:2},{value:"Prerequisites",id:"prerequisites",level:2},{value:"Root Access to OpenStack Control Plane",id:"root-access-to-openstack-control-plane",level:3},{value:"Elasticsearch and Kibana",id:"elasticsearch-and-kibana",level:2},{value:"Kolla Ansible Log Locations",id:"kolla-ansible-log-locations",level:2},{value:"Determining the Correct Log",id:"determining-the-correct-log",level:2},{value:"Determining the Correct Host",id:"determining-the-correct-host",level:2},{value:"Viewing Logs",id:"viewing-logs",level:2}],u={toc:c};function p(e){let{components:n,...o}=e;return(0,a.kt)("wrapper",(0,t.Z)({},u,o,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"guidelines-for-searching-through-openstack-logs"},"Guidelines for Searching through OpenStack Logs"),(0,a.kt)("h2",{id:"introduction"},"Introduction"),(0,a.kt)("p",null,"OpenMetal private clouds generate a large quantity of log files. It can\nbe daunting knowing which log and on which host to look in to diagnose\nan issue. In this guide, we present strategies for extracting\ninformation from a private cloud's log files to determine the root cause\nof a failure."),(0,a.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,a.kt)("h3",{id:"root-access-to-openstack-control-plane"},"Root Access to OpenStack Control Plane"),(0,a.kt)("p",null,"Root access to your cloud's control plane nodes is required."),(0,a.kt)("h2",{id:"elasticsearch-and-kibana"},"Elasticsearch and Kibana"),(0,a.kt)("p",null,"This guide focuses on how to manually look through logs, however\nElasticsearch and Kibana, commonly referred to as an ELK stack, are\noften used to aggregate and view logs in a visual manner. With a\nproperly configured ELK stack, you can view all of your cloud's logs\nfrom a single location, visually."),(0,a.kt)("p",null,"For more information about enabling an ELK stack in your cloud, see ",(0,a.kt)("a",{parentName:"p",href:"../../day-4/kolla-ansible/enable-elk"},"How\nto Enable Elasticsearch and Kibana using Kolla\nAnsible"),"."),(0,a.kt)("h2",{id:"kolla-ansible-log-locations"},"Kolla Ansible Log Locations"),(0,a.kt)("p",null,"Private Clouds are deployed using Kolla Ansible, an OpenStack deployment\nsystem. This system deploys all OpenStack services into Docker\ncontainers. Each service's log file is then stored as\n",(0,a.kt)("inlineCode",{parentName:"p"},"/var/log/kolla/<service-name>"),", where ",(0,a.kt)("inlineCode",{parentName:"p"},"<service-name>")," is an OpenStack\nservice, like Neutron for example."),(0,a.kt)("p",null,"For example, to see all logs associated with the Neutron service, ",(0,a.kt)("inlineCode",{parentName:"p"},"ls"),"\nthe directory ",(0,a.kt)("inlineCode",{parentName:"p"},"/var/log/kolla/neutron"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"# ls /var/log/kolla/neutron/*.log\n/var/log/kolla/neutron/dnsmasq.log\n/var/log/kolla/neutron/neutron-dhcp-agent.log\n/var/log/kolla/neutron/neutron-l3-agent.log\n/var/log/kolla/neutron/neutron-metadata-agent.log\n/var/log/kolla/neutron/neutron-metering-agent.log\n/var/log/kolla/neutron/neutron-netns-cleanup.log\n/var/log/kolla/neutron/neutron-openvswitch-agent.log\n/var/log/kolla/neutron/neutron-server.log\n/var/log/kolla/neutron/privsep-helper.log\n")),(0,a.kt)("h2",{id:"determining-the-correct-log"},"Determining the Correct Log"),(0,a.kt)("p",null,"How do you know which log to look in for an issue? Which host should you\nbe in? It is generally useful to know which OpenStack services are\nrunning and what their purposes are before determining which log file to\nexamine to troubleshoot an issue. For a list of OpenStack services and\ntheir purpose, see the ",(0,a.kt)("a",{parentName:"p",href:"https://www.openstack.org/software/project-navigator/openstack-components#openstack-services"},"OpenStack\nComponents"),"\npage."),(0,a.kt)("p",null,"When diagnosing issues, consider the services associated with the action\nthat may be failing. For example, if looking into an issue with creating\na volume, consider looking at Cinder's various logs."),(0,a.kt)("h2",{id:"determining-the-correct-host"},"Determining the Correct Host"),(0,a.kt)("p",null,"By default, your cloud has three control plane nodes. Each of these\nnodes has very similar logs, and typically, only one of the nodes is\nrecording log events for a specific service. Due to this, you may need\nto examine all three host's logs in real time, replicate the issue, then\nsee if any of those logs recorded any events."),(0,a.kt)("p",null,"To view the logs for all hosts at the same time, consider using a\nterminal multiplexer, especially one where you can issue the same\ncommands in multiple SSH connections. The application ",(0,a.kt)("inlineCode",{parentName:"p"},"tmux")," is an\nexample of a terminal multiplexer."),(0,a.kt)("h2",{id:"viewing-logs"},"Viewing Logs"),(0,a.kt)("p",null,"There are several native ways to view the contents of a log file."),(0,a.kt)("p",null,"Applications like ",(0,a.kt)("inlineCode",{parentName:"p"},"less"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"nano"),", and ",(0,a.kt)("inlineCode",{parentName:"p"},"vim")," will suffice. For more\ncolorful output, consider using an application like ",(0,a.kt)("inlineCode",{parentName:"p"},"lnav"),", which has\nproven especially useful for examining unfamiliar logs."))}p.isMDXComponent=!0}}]);