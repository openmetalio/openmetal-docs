"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[3789],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>h});var n=a(67294);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=p(a),d=o,h=m["".concat(s,".").concat(d)]||m[d]||u[d]||r;return a?n.createElement(h,i(i({ref:t},c),{},{components:a})):n.createElement(h,i({ref:t},c))}));function h(e,t){var a=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=a.length,i=new Array(r);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:o,i[1]=l;for(var p=2;p<r;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},24688:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>l,toc:()=>p});var n=a(87462),o=(a(67294),a(3905));const r={},i="Migrate an OpenStack Instance from Cloud to Cloud",l={unversionedId:"tutorials/migrate-instance-cloud-to-cloud",id:"tutorials/migrate-instance-cloud-to-cloud",title:"Migrate an OpenStack Instance from Cloud to Cloud",description:"Author: Ramon Grullon",source:"@site/docs/tutorials/migrate-instance-cloud-to-cloud.md",sourceDirName:"tutorials",slug:"/tutorials/migrate-instance-cloud-to-cloud",permalink:"/docs/manuals/tutorials/migrate-instance-cloud-to-cloud",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/tutorials/migrate-instance-cloud-to-cloud.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Manage Flavors in OpenStack",permalink:"/docs/manuals/tutorials/manage-flavors"},next:{title:"Comparison of OpenStack NoVNC and SPICE Console",permalink:"/docs/manuals/tutorials/openstack-consoles-explained"}},s={},p=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Considerations",id:"considerations",level:2},{value:"Step 1: Identify the Ceph RBD Image",id:"step-1-identify-the-ceph-rbd-image",level:2},{value:"Step 2: Export, Compress, and Transfer the Image in One Command",id:"step-2-export-compress-and-transfer-the-image-in-one-command",level:2},{value:"Step 3: Upload the Image to OpenStack on the Destination Cloud",id:"step-3-upload-the-image-to-openstack-on-the-destination-cloud",level:2},{value:"Step 4: Create a New Instance from the Uploaded Image",id:"step-4-create-a-new-instance-from-the-uploaded-image",level:2},{value:"Step 5: Re-Attach Volumes (Optional)",id:"step-5-re-attach-volumes-optional",level:2}],c={toc:p};function m(e){let{components:t,...a}=e;return(0,o.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"migrate-an-openstack-instance-from-cloud-to-cloud"},"Migrate an OpenStack Instance from Cloud to Cloud"),(0,o.kt)("p",null,"Author: Ramon Grullon"),(0,o.kt)("p",null,"This tutorial focuses on migrating a virtual machine (VM) or instance from\none OpenStack cloud environment to another. The main challenge involves ensuring\nthat the instance, its associated storage volumes, and network configurations\nare correctly replicated in the target cloud."),(0,o.kt)("p",null,"This process will focus on exporting from the source cloud's Ceph storage and\nimporting to the destination cloud's OpenStack cluster."),(0,o.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"Ensure Access to Source and Destination OpenStack Clouds"),":",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Source and destination clouds must be running compatible OpenStack and Ceph\nversions."),(0,o.kt)("li",{parentName:"ul"},"Source cloud needs access to Ceph via the ",(0,o.kt)("inlineCode",{parentName:"li"},"rbd")," (RADOS Block Device)\ncommand-line tool."),(0,o.kt)("li",{parentName:"ul"},"Destination cloud needs access to OpenStack CLI"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"../operators-manual/day-1/command-line/openstackclient"},"OpenstackCLI")),(0,o.kt)("li",{parentName:"ul"},"Preconfigured virtualenv with OpenStack CLI and ",(0,o.kt)("inlineCode",{parentName:"li"},"pigz")," installed")))),(0,o.kt)("h2",{id:"considerations"},"Considerations"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Data Consistency"),": Ensure the instance on the source cloud is powered off\nduring the ",(0,o.kt)("inlineCode",{parentName:"li"},"rbd export")," process to prevent data corruption."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Downtime"),": This method involves downtime, as the instance will need to be\nstopped, exported, and recreated in the destination cloud."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Bandwidth"),": Transferring large Ceph volumes between clouds may take time\nand require significant bandwidth."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Automation"),": You can automate parts of this process using scripts to\nstreamline the migration, especially if migrating multiple instances.")),(0,o.kt)("p",null,"By following these steps, you can effectively migrate a Ceph-backed OpenStack\ninstance from one cloud to another via ",(0,o.kt)("inlineCode",{parentName:"p"},"rbd export")," and Glance image import."),(0,o.kt)("h2",{id:"step-1-identify-the-ceph-rbd-image"},"Step 1: Identify the Ceph RBD Image"),(0,o.kt)("p",null,"You need to identify the Ceph RBD image that backs the instance you want to migrate."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Find the instance ID:")),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack server show <instance-name>\n"))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Check which image or volume is attached to the instance:")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"For an image-backed instance:"),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack server show <instance-name> -f value -c image\n"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"For a volume-backed instance:"),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack volume show <volume-id> -f value -c os-vol-host-attr:host\n"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Confirm the volume UUID chosen if for the boot drive")))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Identify the Ceph RBD image:")),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"rbd ls <pool-name>\n")))),(0,o.kt)("h2",{id:"step-2-export-compress-and-transfer-the-image-in-one-command"},"Step 2: Export, Compress, and Transfer the Image in One Command"),(0,o.kt)("p",null,"Use ",(0,o.kt)("inlineCode",{parentName:"p"},"rbd"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"pigz"),", and ",(0,o.kt)("inlineCode",{parentName:"p"},"ssh")," to export the image from Ceph, compress it, and\ntransfer it directly to the destination cloud."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'rbd -p images export <image-name> - | pigz -c --fast | ssh <user>@<destination-cloud-ip> "pigz -cd > /opt/image.raw"\n')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Explanation:")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rbd -p <pool> export <image-name> -"),": Exports the RBD image from Ceph"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"pigz - c --fast"),": Compresses the image"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},'ssh <user>@<destination-cloud-ip> "pigz -cd > /opt/image.raw'),":\nUses ",(0,o.kt)("inlineCode",{parentName:"li"},"ssh")," to securely transfer the compressed image and decompress directly on\nthe destination cloud and save it as `image.raw")),(0,o.kt)("h2",{id:"step-3-upload-the-image-to-openstack-on-the-destination-cloud"},"Step 3: Upload the Image to OpenStack on the Destination Cloud"),(0,o.kt)("p",null,"Now that the image is decompressed, upload it to the OpenStack Image service on\nthe destination cloud:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack image create --file /opt/image.raw --disk-format raw --container-format bare <new-image-name>\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Replace ",(0,o.kt)("inlineCode",{parentName:"li"},"<new-image-name>")," with the name you want to assign to the uploaded image."),(0,o.kt)("li",{parentName:"ul"},"Make sure to adjust the disk format (",(0,o.kt)("inlineCode",{parentName:"li"},"raw")," in this case) to match your actual\nimage format.")),(0,o.kt)("p",null,"Verify the image upload:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack image list\n")),(0,o.kt)("p",null,"Set appropriate properties on image to take advantage of Ceph performance"),(0,o.kt)("p",null,"SCSI provides support for advanced features like discard TRIM, improving storage\nefficiency and data integrity by allowing better management of unused blocks."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack image set --property hw_scsi_model=virtio-scsi --property hw_disk_bus=scsi <new-image-name>\n")),(0,o.kt)("h2",{id:"step-4-create-a-new-instance-from-the-uploaded-image"},"Step 4: Create a New Instance from the Uploaded Image"),(0,o.kt)("p",null,"Finally, create a new instance from the uploaded image:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack server create --flavor <flavor-name> --image <new-image-name> --network <network-name> <new-instance-name>\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"<flavor-name>"),": The flavor to use for the instance."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"<new-image-name>"),": The name of the newly uploaded image."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"<network-name>"),": The network where the instance will be deployed."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"<new-instance-name>"),": The name of the new instance.")),(0,o.kt)("p",null,"Verify that the new instance is running:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openstack server list\n")),(0,o.kt)("h2",{id:"step-5-re-attach-volumes-optional"},"Step 5: Re-Attach Volumes (Optional)"),(0,o.kt)("p",null,"If the instance had additional volumes attached in the source cloud, you'll need\nto repeat the ",(0,o.kt)("inlineCode",{parentName:"p"},"rbd export")," process for those volumes, upload them to Glance as\nimages, and then recreate or attach them to the new instance."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Ensure that the network and flavor configurations in the destination cloud match\nor are compatible with those in the source cloud."),(0,o.kt)("li",{parentName:"ul"},"If the instance uses a specific security group, keypair, or volume, make sure\nthose resources are properly configured in the destination cloud before launching\nthe instance.")))}m.isMDXComponent=!0}}]);