"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[7674],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>g});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),u=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=u(a),c=r,g=d["".concat(s,".").concat(c)]||d[c]||m[c]||l;return a?n.createElement(g,o(o({ref:t},p),{},{components:a})):n.createElement(g,o({ref:t},p))}));function g(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=c;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[d]="string"==typeof e?e:r,o[1]=i;for(var u=2;u<l;u++)o[u]=a[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},53416:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>l,metadata:()=>i,toc:()=>u});var n=a(87462),r=(a(67294),a(3905));const l={},o="Kolla Image Build History",i={unversionedId:"kolla-image-update/build-history",id:"kolla-image-update/build-history",title:"Kolla Image Build History",description:"This page tracks the history of when Kolla images have been built. Images are",source:"@site/docs/kolla-image-update/build-history.md",sourceDirName:"kolla-image-update",slug:"/kolla-image-update/build-history",permalink:"/docs/manuals/kolla-image-update/build-history",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/kolla-image-update/build-history.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"OpenStack Operator's Manual - Private Cloud Core",permalink:"/docs/manuals/operators-manual/"},next:{title:"Kolla Image Build History",permalink:"/docs/manuals/kolla-image-update/build-history"}},s={},u=[{value:"Current OpenStack release",id:"current-openstack-release",level:2},{value:"Image tagging",id:"image-tagging",level:2},{value:"How to update your cloud",id:"how-to-update-your-cloud",level:2},{value:"OpenStack 2023.2",id:"openstack-20232",level:2},{value:"Ubuntu 22.04 LTS (Jammy) Security updates",id:"ubuntu-2204-lts-jammy-security-updates",level:3},{value:"OpenStack service updates",id:"openstack-service-updates",level:3},{value:"Image Update History",id:"image-update-history",level:3}],p={toc:u};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"kolla-image-build-history"},"Kolla Image Build History"),(0,r.kt)("p",null,"This page tracks the history of when Kolla images have been built. Images are\nbuilt when major security issues are patched in the base image operating system\nand when changes to OpenStack services, like bug fixes and improvements, are\nreleased. OpenStack service changes can be found in the ",(0,r.kt)("a",{parentName:"p",href:"https://docs.openstack.org/releasenotes/"},"release notes"),"\nindex."),(0,r.kt)("h2",{id:"current-openstack-release"},"Current OpenStack release"),(0,r.kt)("p",null,"We are currently deploying OpenStack 2023.2 with Ubuntu 22.04 as the base\noperating system."),(0,r.kt)("h2",{id:"image-tagging"},"Image tagging"),(0,r.kt)("p",null,'When images are built, the date they were built is appended to the image tag, in\nthe format "YYYY-MM-DD". Images built on October 10, 2024 for the 2023.2 release\nwill be tagged with ',(0,r.kt)("inlineCode",{parentName:"p"},"2023.2-ubuntu-jammy-2024-10-10"),". The latest images built\nwill have two tags applied, one being the base tag (",(0,r.kt)("inlineCode",{parentName:"p"},"2023.2-ubuntu-jammy"),", for\nexample), and the other including the appended date. This allows for rolling\nback to previous images if necessary."),(0,r.kt)("h2",{id:"how-to-update-your-cloud"},"How to update your cloud"),(0,r.kt)("p",null,"See ",(0,r.kt)("a",{parentName:"p",href:"/docs/manuals/operators-manual/day-2/update-kolla-images"},"Update Kolla Images")," for\nthe steps needed to update your cloud."),(0,r.kt)("h2",{id:"openstack-20232"},"OpenStack 2023.2"),(0,r.kt)("p",null,"Latest image tag: ",(0,r.kt)("inlineCode",{parentName:"p"},"2023.2-ubuntu-jammy")),(0,r.kt)("h3",{id:"ubuntu-2204-lts-jammy-security-updates"},"Ubuntu 22.04 LTS (Jammy) Security updates"),(0,r.kt)("p",null,"See the ",(0,r.kt)("a",{parentName:"p",href:"https://ubuntu.com/security/notices?order=newest&release=jammy&details=&offset=0"},"Ubuntu Security Notices"),"\npage for information relating to security updates."),(0,r.kt)("h3",{id:"openstack-service-updates"},"OpenStack service updates"),(0,r.kt)("p",null,"OpenStack service changes can be found in the ",(0,r.kt)("a",{parentName:"p",href:"https://docs.openstack.org/releasenotes/"},"release notes"),"\nindex."),(0,r.kt)("h3",{id:"image-update-history"},"Image Update History"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Tag"),(0,r.kt)("th",{parentName:"tr",align:null},"Build Date"),(0,r.kt)("th",{parentName:"tr",align:null},"Notes"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"2023.2-ubuntu-jammy-2024-10-10"),(0,r.kt)("td",{parentName:"tr",align:null},"10/10/2024"),(0,r.kt)("td",{parentName:"tr",align:null},"- ",(0,r.kt)("a",{parentName:"td",href:"https://ubuntu.com/security/notices?order=newest&release=jammy&details=&offset=0"},"Ubuntu security updates"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"- ",(0,r.kt)("a",{parentName:"td",href:"https://docs.openstack.org/releasenotes/cinder/2023.2.html#relnotes-23-2-0-12-stable-2023-2"},"Cinder (23.2.0-12) new features and bug fixes"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"- ",(0,r.kt)("a",{parentName:"td",href:"https://docs.openstack.org/releasenotes/neutron/2023.2.html#relnotes-23-2-0-18-stable-2023-2"},"Neutron (23.2.0-18) security issues and bug fixes"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"- ",(0,r.kt)("a",{parentName:"td",href:"https://docs.openstack.org/releasenotes/nova/2023.2.html#relnotes-28-3-0-11-stable-2023-2"},"Nova (28.3.0-11) bug fixes"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"- ",(0,r.kt)("a",{parentName:"td",href:"https://docs.openstack.org/releasenotes/octavia/2023.2.html#relnotes-13-0-0-32-stable-2023-2"},"Octavia (13.0.0-32) bug fixes"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"9/5/2024"),(0,r.kt)("td",{parentName:"tr",align:null})))))}d.isMDXComponent=!0}}]);