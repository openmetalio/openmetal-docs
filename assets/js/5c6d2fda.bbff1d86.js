"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[8204],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var a=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var i=a.createContext({}),p=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(i.Provider,{value:t},e.children)},l="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,s=e.originalType,i=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),l=p(n),k=o,h=l["".concat(i,".").concat(k)]||l[k]||m[k]||s;return n?a.createElement(h,r(r({ref:t},u),{},{components:n})):a.createElement(h,r({ref:t},u))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var s=n.length,r=new Array(s);r[0]=k;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[l]="string"==typeof e?e:o,r[1]=c;for(var p=2;p<s;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},31496:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>r,default:()=>l,frontMatter:()=>s,metadata:()=>c,toc:()=>p});var a=n(87462),o=(n(67294),n(3905));const s={slug:"how-to-make-backups-in-openstack",sidebar_position:5},r="How to Make Backups in OpenStack",c={unversionedId:"users-manual/backups",id:"users-manual/backups",title:"How to Make Backups in OpenStack",description:"Having a solid backup strategy is important in the event where data is",source:"@site/docs/users-manual/backups.md",sourceDirName:"users-manual",slug:"/users-manual/how-to-make-backups-in-openstack",permalink:"/docs/manuals/users-manual/how-to-make-backups-in-openstack",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/users-manual/backups.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{slug:"how-to-make-backups-in-openstack",sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"How to Create an Instance",permalink:"/docs/manuals/users-manual/how-to-create-an-instance"},next:{title:"Get Started with OpenStackClient",permalink:"/docs/manuals/users-manual/openstackclient"}},i={},p=[{value:"Testing Considerations",id:"testing-considerations",level:2},{value:"Instance Backups",id:"instance-backups",level:3},{value:"How to Recover an Instance Backup",id:"how-to-recover-an-instance-backup",level:3},{value:"Volume Backups",id:"volume-backups",level:2},{value:"How to Create a Volume Backup",id:"how-to-create-a-volume-backup",level:3},{value:"How to Recover a Volume Backup",id:"how-to-recover-a-volume-backup",level:3}],u={toc:p};function l(e){let{components:t,...s}=e;return(0,o.kt)("wrapper",(0,a.Z)({},u,s,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"how-to-make-backups-in-openstack"},"How to Make Backups in OpenStack"),(0,o.kt)("p",null,"Having a solid backup strategy is important in the event where data is\nlost and you need to recover it. In this guide, you will learn how to\nmake backups of instance data, volumes, and how to store backups outside\nof the OpenStack cloud."),(0,o.kt)("h2",{id:"testing-considerations"},"Testing Considerations"),(0,o.kt)("p",null,"Backups should not only be created, but should be confirmed they contain\nall data as well as be restored and tested as part of a polished backup\nstrategy. Consider a disaster recovery scenario where you have known\nbackups, however they were never tested, and are not usable due to some\ncircumstance."),(0,o.kt)("h3",{id:"instance-backups"},"Instance Backups"),(0,o.kt)("p",null,"This section demonstrates how to create an instance backup using Horizon\nby creating a snapshot."),(0,o.kt)("hr",null),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 1")," -- Create Instance Backup"),(0,o.kt)("p",null,"To create a backup of an instance, navigate to ",(0,o.kt)("strong",{parentName:"p"},"Project -",">"," Compute -",">","\nInstances"),"."),(0,o.kt)("p",null,"From there, find the instance in question and click the ",(0,o.kt)("strong",{parentName:"p"},"Create\nSnapshot")," button. This starts the process of backing up the instance\ndata and may take some time to complete."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(55645).Z,width:"1052",height:"328"})),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 2")," -- Confirm Backup Completion"),(0,o.kt)("p",null,"To confirm the snapshot was created successfully, navigate to ",(0,o.kt)("strong",{parentName:"p"},"Project\n-",">"," Compute -",">"," Images"),", then find the snapshot in the list."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(7099).Z,width:"1053",height:"331"})),(0,o.kt)("h3",{id:"how-to-recover-an-instance-backup"},"How to Recover an Instance Backup"),(0,o.kt)("p",null,"This section explains how to recover an instance backup using Horizon."),(0,o.kt)("hr",null),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 1")," -- Recover snapshot"),(0,o.kt)("p",null,"To recover the instance snapshot, navigate to ",(0,o.kt)("strong",{parentName:"p"},"Project -",">"," Compute -",">","\nInstances")," and launch a new instance. When filling out the form, ensure\nyou select as the boot source ",(0,o.kt)("strong",{parentName:"p"},"Instance Snapshot")," and choose the\nsnapshot to restore."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(31460).Z,width:"973",height:"277"})),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 2")," -- Confirm restoration"),(0,o.kt)("p",null,"To confirm the snapshot has restored list the instances in Horizon and\ncheck the status column. Check to ensure everything still works as\nexpected within that instance."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(6969).Z,width:"1052",height:"276"})),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"volume-backups"},"Volume Backups"),(0,o.kt)("h3",{id:"how-to-create-a-volume-backup"},"How to Create a Volume Backup"),(0,o.kt)("p",null,"In addition to creating instance snapshots, you can also create backups\nof volumes in Horizon. This is important when a persistent volume is\nused and you want to create backup copies of it."),(0,o.kt)("hr",null),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 1")," -- Create volume backup"),(0,o.kt)("p",null,"To back up a volume, navigate to ",(0,o.kt)("strong",{parentName:"p"},"Project -",">"," Volumes -",">"," Volumes"),",\nthen to the volume in you are working with, select from the drop down on\nthe right, ",(0,o.kt)("strong",{parentName:"p"},"Create Backup"),"."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(68627).Z,width:"1051",height:"414"})),(0,o.kt)("p",null,"Fill out the following form with at least the name of the backup and any\nother fields needed."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(76971).Z,width:"738",height:"524"})),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 2")," -- Confirm volume backup creation"),(0,o.kt)("p",null,"To confirm the backup created successfully, navigate to ",(0,o.kt)("strong",{parentName:"p"},"Project -",">","\nVolumes -",">"," Backups"),", then locate the backup in the list, and take note\nof the ",(0,o.kt)("strong",{parentName:"p"},"Status")," column. You should see ",(0,o.kt)("strong",{parentName:"p"},"Available")," indicating the\nbackup is complete and ready to use."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(52167).Z,width:"1049",height:"305"})),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"how-to-recover-a-volume-backup"},"How to Recover a Volume Backup"),(0,o.kt)("p",null,"This section will explain the steps needed to recover a volume backup\nusing Horizon."),(0,o.kt)("hr",null),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 1")," -- Find the volume backup"),(0,o.kt)("p",null,"To find the volume backups, navigate to ",(0,o.kt)("strong",{parentName:"p"},"Project -",">"," Volumes -",">","\nBackups")," and confirm the backup is in the list."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(80705).Z,width:"1047",height:"93"})),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 2")," -- Restore volume backup"),(0,o.kt)("p",null,"To restore this backup, choose from the listing drop down on the right,\nthe ",(0,o.kt)("strong",{parentName:"p"},"Restore Backup")," option."),(0,o.kt)("p",null,"Choose the ",(0,o.kt)("strong",{parentName:"p"},"Create a New Volume")," option to recover this backup into a\nnew volume, that can be later attached to an instance as needed."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(32538).Z,width:"738",height:"238"})))}l.isMDXComponent=!0},80705:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_confirm_volume_backup_list-1f68fcb6b261490d307a49d15d3e8065.png"},55645:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_create_instance_snapshot-2ed8e7ec21c7b12fb3fc8d8c81680458.png"},68627:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_create_volume_backup-a6833723a431f76225a03fc1c935ff98.png"},76971:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_create_volume_backup_form-b84c4903ae117b84ca98df1ad3911ced.png"},31460:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_launch_instance_from_snapshot-1f547d343507096b0a82130420587add.png"},7099:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_list_snapshot-ebf7cac4565f821e14cd168f9fea17ab.png"},32538:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_restore_volume_backup-017af57055b7e91b15c74b503e3c89fc.png"},6969:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_successful_instance_restore-97740dfcdd006c78b58102e69068fcc3.png"},52167:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_volume_backup_list-d7f71c79b718229947c46c25e66b573d.png"}}]);