"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[3374],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),m=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=m(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=m(n),g=r,d=u["".concat(l,".").concat(g)]||u[g]||c[g]||i;return n?a.createElement(d,o(o({ref:t},p),{},{components:n})):a.createElement(d,o({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=g;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:r,o[1]=s;for(var m=2;m<i;m++)o[m]=n[m];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},71282:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>s,toc:()=>m});var a=n(87462),r=(n(67294),n(3905));const i={slug:"working-with-images",sidebar_position:3},o="Working with Images",s={unversionedId:"users-manual/using-creating-images",id:"users-manual/using-creating-images",title:"Working with Images",description:"Images in OpenStack are what powers instances. In this guide, you will",source:"@site/docs/users-manual/using-creating-images.md",sourceDirName:"users-manual",slug:"/users-manual/working-with-images",permalink:"/docs/manuals/users-manual/working-with-images",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/users-manual/using-creating-images.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{slug:"working-with-images",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Networking in OpenStack",permalink:"/docs/manuals/users-manual/network-ip-traffic"},next:{title:"How to Create an Instance",permalink:"/docs/manuals/users-manual/how-to-create-an-instance"}},l={},m=[{value:"List and Upload Images",id:"list-and-upload-images",level:2},{value:"<strong>List images</strong>",id:"list-images",level:3},{value:"<strong>Upload images</strong>",id:"upload-images",level:3},{value:"Next Steps",id:"next-steps",level:2}],p={toc:m};function u(e){let{components:t,...i}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"working-with-images"},"Working with Images"),(0,r.kt)("p",null,"Images in OpenStack are what powers instances. In this guide, you will\nlearn how to view images, upload your own, and make snapshots of images."),(0,r.kt)("p",null,"An image is a file that contains a bootable operating system. Many\ndifferent cloud image sources are available for download from major\noperating system providers like CentOS, Ubuntu, and Debian to name a\nfew. You can also make your own images from\n",(0,r.kt)("a",{parentName:"p",href:"https://docs.openstack.org/image-guide/create-images-manually.html"},"scratch"),"\nor create them from volumes or running instances. Snapshots of instances\ncan be created which can serve both as a backup and also a template for\nother instances."),(0,r.kt)("hr",null),(0,r.kt)("h2",{id:"list-and-upload-images"},"List and Upload Images"),(0,r.kt)("h3",{id:"list-images"},(0,r.kt)("strong",{parentName:"h3"},"List images")),(0,r.kt)("p",null,"To begin, you will need to know where to find images in OpenStack."),(0,r.kt)("p",null,"In Horizon, images are found on the left through ",(0,r.kt)("strong",{parentName:"p"},"Project -",">"," Compute\n-",">"," Images"),"."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"image",src:n(81503).Z,width:"1057",height:"430"})),(0,r.kt)("h3",{id:"upload-images"},(0,r.kt)("strong",{parentName:"h3"},"Upload images")),(0,r.kt)("p",null,"To upload an image into OpenStack, the image needs to first exist on\nyour machine, and then you can use Horizon to upload it."),(0,r.kt)("p",null,"This section will walk you through uploading the\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/cirros-dev/cirros"},"CirrOS")," image."),(0,r.kt)("hr",null),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Step 1")," -- Download the CirrOS image"),(0,r.kt)("p",null,"To start, first download the CirrOS image to your machine."),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"https://download.cirros-cloud.net/0.5.2/cirros-0.5.2-x86_64-disk.img"},"latest version of\nCirrOS"),"\nis available from their download page. Ensure the latest version of the\nCirrOS image is downloaded."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Step 2")," -- Upload the image into OpenStack"),(0,r.kt)("p",null,"To upload an image navigate to ",(0,r.kt)("strong",{parentName:"p"},"Project -",">"," Compute -",">"," Images"),". From\nthere, click the ",(0,r.kt)("strong",{parentName:"p"},"Create Image")," button."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"image",src:n(24090).Z,width:"1054",height:"179"})),(0,r.kt)("p",null,"Next, fill in the required details."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"image",src:n(96195).Z,width:"966",height:"782"})),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Image Name")," - This is what you want to call this image in\nOpenStack"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Image Description")," - This is an optional description for the\nimage"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"File")," - Where is the file located on your machine?"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Format")," - The format should be ",(0,r.kt)("strong",{parentName:"li"},"QCOW2 - QEMU Emulator"))),(0,r.kt)("p",null,"Optionally, you can specify requirements, like minimum disk space and\nRAM, for the image under the ",(0,r.kt)("strong",{parentName:"p"},"Image Requirements")," heading."),(0,r.kt)("p",null,"Click the ",(0,r.kt)("strong",{parentName:"p"},"?")," icon for assistance with specifics."),(0,r.kt)("hr",null),(0,r.kt)("h2",{id:"next-steps"},"Next Steps"),(0,r.kt)("p",null,"With this guide complete, move on to the next guide, which explains ",(0,r.kt)("a",{parentName:"p",href:"create-an-instance"},"how\nto create an Instance")," in Horizon."))}u.isMDXComponent=!0},24090:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_create_image-6aa330d64606aa817d49cd0d0328ab76.png"},96195:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_create_image_form-9871680867b6ef631cedbe36ac8556b4.png"},81503:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_images-30e3d8d7a6083a893b428d733cfc917e.png"}}]);