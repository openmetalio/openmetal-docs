"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[6288],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>k});var a=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function r(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},c=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,c=r(e,["components","mdxType","originalType","parentName"]),u=p(t),m=o,k=u["".concat(s,".").concat(m)]||u[m]||d[m]||i;return t?a.createElement(k,l(l({ref:n},c),{},{components:t})):a.createElement(k,l({ref:n},c))}));function k(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,l=new Array(i);l[0]=m;var r={};for(var s in n)hasOwnProperty.call(n,s)&&(r[s]=n[s]);r.originalType=e,r[u]="string"==typeof e?e:o,l[1]=r;for(var p=2;p<i;p++)l[p]=t[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},44857:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>i,metadata:()=>r,toc:()=>p});var a=t(87462),o=(t(67294),t(3905));const i={},l="Comparison of OpenStack NoVNC and SPICE Console",r={unversionedId:"tutorials/openstack-consoles-explained",id:"tutorials/openstack-consoles-explained",title:"Comparison of OpenStack NoVNC and SPICE Console",description:"Author: Ramon Grullon",source:"@site/docs/tutorials/openstack-consoles-explained.md",sourceDirName:"tutorials",slug:"/tutorials/openstack-consoles-explained",permalink:"/docs/manuals/tutorials/openstack-consoles-explained",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/tutorials/openstack-consoles-explained.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Migrate an OpenStack Instance from Cloud to Cloud",permalink:"/docs/manuals/tutorials/migrate-instance-cloud-to-cloud"},next:{title:"How to Handle a Failed OpenStack Control Plane Node",permalink:"/docs/manuals/tutorials/recover-from-failed-control-plane-node"}},s={},p=[{value:"Introduction",id:"introduction",level:2},{value:"Overview",id:"overview",level:2},{value:"NoVNC (HTML5-based VNC client)",id:"novnc-html5-based-vnc-client",level:3},{value:"SPICE (Simple Protocol for Independent Computing Environments)",id:"spice-simple-protocol-for-independent-computing-environments",level:3},{value:"Features Comparison",id:"features-comparison",level:2},{value:"NoVNC",id:"novnc",level:3},{value:"SPICE",id:"spice",level:3},{value:"Scenarios",id:"scenarios",level:2},{value:"NoVNC Usage",id:"novnc-usage",level:3},{value:"SPICE Usage",id:"spice-usage",level:3},{value:"Configuration in OpenStack",id:"configuration-in-openstack",level:2},{value:"NoVNC Configuration",id:"novnc-configuration",level:3},{value:"SPICE Configuration",id:"spice-configuration",level:3},{value:"Kolla Ansible method",id:"kolla-ansible-method",level:4},{value:"Manual Spice Configuration",id:"manual-spice-configuration",level:4},{value:"Summary",id:"summary",level:2},{value:"References",id:"references",level:2}],c={toc:p};function u(e){let{components:n,...i}=e;return(0,o.kt)("wrapper",(0,a.Z)({},c,i,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"comparison-of-openstack-novnc-and-spice-console"},"Comparison of OpenStack NoVNC and SPICE Console"),(0,o.kt)("p",null,"Author: Ramon Grullon"),(0,o.kt)("h2",{id:"introduction"},"Introduction"),(0,o.kt)("p",null,"OpenStack provides multiple options for accessing virtual machine consoles,\nincluding NoVNC (HTML5-based) and SPICE (Simple Protocol for Independent\nComputing Environments). This document compares these two console access methods\nin the context of OpenStack."),(0,o.kt)("h2",{id:"overview"},"Overview"),(0,o.kt)("h3",{id:"novnc-html5-based-vnc-client"},"NoVNC (HTML5-based VNC client)"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Technology: NoVNC uses HTML5 and WebSockets to provide a VNC client that runs\nentirely in the browser.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Browser Compatibility: Works on most modern web browsers without requiring\nadditional plugins.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Performance: Generally good performance for remote console access.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Configuration: Usually configured as the default console access method in OpenStack."))),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"NoVNC",src:t(72814).Z,width:"971",height:"579"})),(0,o.kt)("h3",{id:"spice-simple-protocol-for-independent-computing-environments"},"SPICE (Simple Protocol for Independent Computing Environments)"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Technology: SPICE is a protocol for remote computing environments. SPICE\nclients are available as standalone applications.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Client Installation: Requires a separate SPICE client to be installed on the\nuser's machine.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Performance: Generally known for high-performance remote display capabilities.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Integration: Integrated with QEMU/KVM hypervisors and provides additional\nfeatures like audio and video streaming."))),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Spice",src:t(52136).Z,width:"1042",height:"728"})),(0,o.kt)("h2",{id:"features-comparison"},"Features Comparison"),(0,o.kt)("h3",{id:"novnc"},"NoVNC"),(0,o.kt)("p",null,"Pros:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Platform Independence: Works on various platforms without requiring client installation.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Browser Compatibility: Runs in most modern web browsers.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Easy Integration: Default console access method in many OpenStack deployments."))),(0,o.kt)("p",null,"Cons:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Potential Performance: May experience lower performance compared to SPICE in\ncertain scenarios.")),(0,o.kt)("h3",{id:"spice"},"SPICE"),(0,o.kt)("p",null,"Pros:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"High Performance: Known for delivering high-performance remote display capabilities.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Multimedia Support: Supports audio and video streaming in addition to console access.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Integration: Integrated with QEMU/KVM hypervisors."))),(0,o.kt)("p",null,"Cons:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Client Installation: Requires users to install a separate SPICE client on\ntheir machines.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Limited Browser Support: Requires a standalone client and is not as\nbrowser-friendly as NoVNC."))),(0,o.kt)("h2",{id:"scenarios"},"Scenarios"),(0,o.kt)("h3",{id:"novnc-usage"},"NoVNC Usage"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Suitability:")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Well-suited for users who need quick and easy console access without additional\nclient installations.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Suitable for scenarios where platform independence and browser compatibility\nare crucial."))),(0,o.kt)("h3",{id:"spice-usage"},"SPICE Usage"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Suitability:")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Ideal for users who prioritize high-performance remote display capabilities.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Suitable for multimedia applications and scenarios where advanced features\nlike audio and video streaming are required."))),(0,o.kt)("h2",{id:"configuration-in-openstack"},"Configuration in OpenStack"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Easy Integration: Default console access method in many OpenStack deployments.")),(0,o.kt)("h3",{id:"novnc-configuration"},"NoVNC Configuration"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Typically configured as the default console access method in OpenStack.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Configured in the Horizon dashboard."))),(0,o.kt)("h3",{id:"spice-configuration"},"SPICE Configuration"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Configuration:")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Requires additional configuration in OpenStack.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Configured in the Horizon dashboard, but users need to ensure SPICE support in\nhypervisors."))),(0,o.kt)("h4",{id:"kolla-ansible-method"},"Kolla Ansible method"),(0,o.kt)("p",null,"Requires using kolla-ansible to deploy Spice support and reconfiguring Nova"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Edit your /etc/kolla/globals.yaml file for kolla-ansible")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'# Nova\n\nenable_nova: true\nnova_console: "spice"\n\n')),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Edit your ",(0,o.kt)("inlineCode",{parentName:"li"},"/etc/kolla/nova-compute/nova.conf")," and\n",(0,o.kt)("inlineCode",{parentName:"li"},"/etc/kolla/nova-spicehtml5proxy/nova.conf")," file on each compute hosts to\ninclude the following in the spice section.")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"agent_enabled = true\n\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Restart both nova-compute and nova-spicehtml5proxy containers")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"docker restart nova_compute nova_spicehtml5proxy\n")),(0,o.kt)("h4",{id:"manual-spice-configuration"},"Manual Spice Configuration"),(0,o.kt)("p",null,"To enable the SPICE console service, you must configure both the\nnova-spicehtml5proxy service and the nova-compute service. Most options are\ndefined in the spice group."),(0,o.kt)("p",null,"Further reading on process to enable Spice manually"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.openstack.org/nova/latest/admin/remote-console-access.html#spice-console"},"https://docs.openstack.org/nova/latest/admin/remote-console-access.html#spice-console"))),(0,o.kt)("h2",{id:"summary"},"Summary"),(0,o.kt)("p",null,"Choosing between NoVNC and SPICE depends on specific use cases, user preferences,\nand the desired level of performance. While NoVNC offers platform independence\nand ease of use, SPICE is known for its high-performance capabilities and\nmultimedia support."),(0,o.kt)("p",null,"Both options provide reliable console access, and the choice may be influenced\nby factors such as the user environment, desired features, and performance\nrequirements. Consider the needs of your users and the nature of your virtualized\nenvironment when selecting the most suitable console access method."),(0,o.kt)("h2",{id:"references"},"References"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.openstack.org/nova/latest/admin/remote-console-access.html"},"https://docs.openstack.org/nova/latest/admin/remote-console-access.html"))))}u.isMDXComponent=!0},72814:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/novnc-1da118a4e2d37f0457dc898b17df91f2.png"},52136:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/spice-d6bb68d48d9cfe82dc7d9ccd389ab377.png"}}]);