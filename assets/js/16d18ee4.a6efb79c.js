"use strict";(self.webpackChunkopenmetal_docs=self.webpackChunkopenmetal_docs||[]).push([[6049],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=s(n),k=o,m=u["".concat(p,".").concat(k)]||u[k]||d[k]||r;return n?a.createElement(m,i(i({ref:t},c),{},{components:n})):a.createElement(m,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=k;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[u]="string"==typeof e?e:o,i[1]=l;for(var s=2;s<r;s++)i[s]=n[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},33274:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>l,toc:()=>s});var a=n(87462),o=(n(67294),n(3905));const r={sidebar_position:6},i="Get Started with OpenStackClient",l={unversionedId:"users-manual/openstackclient",id:"users-manual/openstackclient",title:"Get Started with OpenStackClient",description:"OpenStack offers a way to administer your cloud over the command line",source:"@site/docs/users-manual/openstackclient.md",sourceDirName:"users-manual",slug:"/users-manual/openstackclient",permalink:"/docs/manuals/users-manual/openstackclient",draft:!1,editUrl:"https://github.com/openmetalio/openmetal-docs/blob/main/docs/users-manual/openstackclient.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"How to Make Backups in OpenStack",permalink:"/docs/manuals/users-manual/how-to-make-backups-in-openstack"},next:{title:"Create a Network",permalink:"/docs/manuals/users-manual/create-a-network"}},p={},s=[{value:"<strong>Installing OpenStackClient</strong>",id:"installing-openstackclient",level:2},{value:"<strong>How to Install OpenStackClient</strong>",id:"how-to-install-openstackclient",level:3},{value:"<strong>First Time Using OpenStackClient</strong>",id:"first-time-using-openstackclient",level:2},{value:"<strong>Next Steps</strong>",id:"next-steps",level:2}],c={toc:s};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"get-started-with-openstackclient"},"Get Started with OpenStackClient"),(0,o.kt)("p",null,"OpenStack offers a way to administer your cloud over the command line\nusing OpenStackClient."),(0,o.kt)("p",null,"The purpose of this guide is to introduce you to managing your cloud\nusing the command line. You will learn how to install OpenStackClient,\nauthenticate, and run introductory commands. Everything that can be done\nusing Horizon, can also be accomplished using OpenStackClient."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"installing-openstackclient"},(0,o.kt)("strong",{parentName:"h2"},"Installing OpenStackClient")),(0,o.kt)("p",null,"OpenStackClient is available as a Python pip package."),(0,o.kt)("p",null,"For more information about this package, see OpenStackClient's ",(0,o.kt)("a",{parentName:"p",href:"https://pypi.org/project/openstackclient/"},"pip\nproject page"),"."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note","!")," -- There exist two OpenStackClient packages:\n",(0,o.kt)("inlineCode",{parentName:"p"},"openstackclient")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"python-openstackclient"),". This guide recommends\nusing ",(0,o.kt)("inlineCode",{parentName:"p"},"openstackclient")," as it comes with many more OpenStack service\ncommand line clients. You can use either package, but if you want to\ninteract with a specific service's command line client, you may have to\ninstall that separately."),(0,o.kt)("h3",{id:"how-to-install-openstackclient"},(0,o.kt)("strong",{parentName:"h3"},"How to Install OpenStackClient")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note","!")," -- These instructions are meant for a Linux environment."),(0,o.kt)("p",null,"Before getting started, make sure Python 3 and ",(0,o.kt)("inlineCode",{parentName:"p"},"pip")," are installed to\nyour machine."),(0,o.kt)("p",null,"The first step is to create a Python virtual environment. This is useful\nin that this environment will not interfere with your system's Python\ninstallation."),(0,o.kt)("hr",null),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 1")," -- Create Python virtual environment"),(0,o.kt)("p",null,"The following demonstrates creating a virtual environment in the path\n",(0,o.kt)("inlineCode",{parentName:"p"},"~/venv/openstackclient"),"."),(0,o.kt)("p",null,"Create the environment:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"python3 -m venv ~/venv/openstackclient\n")),(0,o.kt)("p",null,"Activate the environment using ",(0,o.kt)("inlineCode",{parentName:"p"},"source"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"$ source ~/venv/openstackclient/bin/activate\n(openstackclient) :~$\n")),(0,o.kt)("p",null,"Notice the shell now has ",(0,o.kt)("inlineCode",{parentName:"p"},"(openstackclient)")," where commands are entered.\nThis indicates the virtual environment is active."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 2")," -- Update pip"),(0,o.kt)("p",null,"Pip may need to be updated before installing OpenStackClient."),(0,o.kt)("p",null,"To do so, use:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"python3 -m pip install -U pip\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 3")," -- Download OpenStackClient"),(0,o.kt)("p",null,"With the virtual environment prepared, use ",(0,o.kt)("inlineCode",{parentName:"p"},"pip")," to download the\nOpenStackClient package:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"pip3 install openstackclient\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 4")," -- Download ",(0,o.kt)("strong",{parentName:"p"},"OpenStack RC")," and ",(0,o.kt)("strong",{parentName:"p"},"clouds.yaml")," files"),(0,o.kt)("p",null,"Next, you will need to obtain two files from Horizon:"),(0,o.kt)("blockquote",null,(0,o.kt)("ul",{parentName:"blockquote"},(0,o.kt)("li",{parentName:"ul"},"OpenStack RC"),(0,o.kt)("li",{parentName:"ul"},"clouds.yaml"))),(0,o.kt)("p",null,"These are located under the ",(0,o.kt)("strong",{parentName:"p"},"Project")," tab, then ",(0,o.kt)("strong",{parentName:"p"},"API Access"),"."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image",src:n(11094).Z,width:"1047",height:"242"})),(0,o.kt)("p",null,"From here, click the ",(0,o.kt)("strong",{parentName:"p"},"Download OpenStack RC File")," drop-down, and then\ndownload both files."),(0,o.kt)("p",null,"The ",(0,o.kt)("strong",{parentName:"p"},"clouds.yaml")," file needs to exist in ",(0,o.kt)("inlineCode",{parentName:"p"},"~/.config/openstack")," for\nOpenStackClient to function. When downloaded, ensure it can be located\nas ",(0,o.kt)("inlineCode",{parentName:"p"},"~/.config/openstack/clouds.yaml"),"."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Multiple clouds"),": If you are working with multiple clouds, add the\ncloud entry to the existing ",(0,o.kt)("inlineCode",{parentName:"p"},"clouds.yaml")," and the cloud can be specified\nusing ",(0,o.kt)("inlineCode",{parentName:"p"},"OS_CLOUD=$cloud_name")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"--os-cloud=$cloud_name"),", where\n",(0,o.kt)("inlineCode",{parentName:"p"},"$cloud_name")," is the name of the cloud you're working with."),(0,o.kt)("p",null,"Example ",(0,o.kt)("inlineCode",{parentName:"p"},"clouds.yaml")," with two cloud entries, ",(0,o.kt)("inlineCode",{parentName:"p"},"cloud-1")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"cloud-2"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'clouds:\n  cloud-1:\n    auth:\n      auth_url: http://50.50.50.1:5000\n      username: "admin"\n      project_id: b93259ca0a5b4541b30e4e16ae1d699d\n      project_name: "Apples"\n      user_domain_name: "Default"\n    region_name: "iad3"\n    interface: "public"\n    identity_api_version: 3\n  cloud-2:\n    auth:\n      auth_url: http://50.50.50.2:5000\n      username: "admin"\n      project_id: 6d0ef671c4b2413d920b61e3777fe2ab\n      project_name: "Oranges"\n      user_domain_name: "Default"\n    region_name: "iad3"\n    interface: "public"\n    identity_api_version: 3\n')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Step 5")," -- Finish preparing environment"),(0,o.kt)("p",null,"Next, load the ",(0,o.kt)("strong",{parentName:"p"},"OpenStack RC")," file into your shell using ",(0,o.kt)("inlineCode",{parentName:"p"},"source"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"source ~/Downloads/user-openrc.sh\n")),(0,o.kt)("p",null,"This action sets needed environment variables and will also ask you to\nauthenticate as your OpenStack user:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"(openstackclient):~$ source ~/Downloads/user-openrc.sh\nPlease enter your OpenStack Password for project User Cloud Test as user\nuser1:\n")),(0,o.kt)("p",null,"Enter in the password for your user, and you are now set to use\nOpenStackClient."),(0,o.kt)("hr",null),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note","!")," -- In addition to OpenStackClient, there are other command\nline clients for various OpenStack services that can be used. For\nexample,\n",(0,o.kt)("a",{parentName:"p",href:"https://docs.openstack.org/python-novaclient/latest/cli/nova.html"},"Nova"),"\nand\n",(0,o.kt)("a",{parentName:"p",href:"https://docs.openstack.org/python-cinderclient/latest/cli/details.html"},"Cinder"),"\neach have their own command line client, as well as other services."),(0,o.kt)("p",null,"In later releases of OpenStack use of service-specific command line\ninterfaces will be deprecated. When using the command line to administer\nOpenStack it is recommended to use OpenStackClient where possible as\nopposed to individual service's command line interfaces such as ",(0,o.kt)("inlineCode",{parentName:"p"},"nova"),"'s\nCLI."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"first-time-using-openstackclient"},(0,o.kt)("strong",{parentName:"h2"},"First Time Using OpenStackClient")),(0,o.kt)("p",null,"For users using OpenStackClient for the first time, follow this section\nto learn how to list and show the details of the project associated with\nyour OpenStack user."),(0,o.kt)("p",null,"As a first command, try listing the project your user is associated\nwith, using ",(0,o.kt)("inlineCode",{parentName:"p"},"openstack project list"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"$ openstack project list\n+----------------------------------+-----------------+\n| ID                               | Name            |\n+----------------------------------+-----------------+\n| a7f3c46fb8b3404c89dd94b0c33301e0 | User Cloud Test |\n+----------------------------------+-----------------+\n")),(0,o.kt)("p",null,"Next, list the details of the project under ID\n",(0,o.kt)("inlineCode",{parentName:"p"},"a7f3c46fb8b3404c89dd94b0c33301e0"),", using the ",(0,o.kt)("inlineCode",{parentName:"p"},"show")," subcommand:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"$ openstack project show a7f3c46fb8b3404c89dd94b0c33301e0\n+-------------+-----------------------------------------------------------------------+\n| Field       | Value                                                                 |\n+-------------+-----------------------------------------------------------------------+\n| description | This is a testing Project used to create documentation for end users. |\n| domain_id   | default                                                               |\n| enabled     | True                                                                  |\n| id          | a7f3c46fb8b3404c89dd94b0c33301e0                                      |\n| is_domain   | False                                                                 |\n| name        | User Cloud Test                                                       |\n| options     | {}                                                                    |\n| parent_id   | default                                                               |\n| tags        | []                                                                    |\n+-------------+-----------------------------------------------------------------------+\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note","!")," -- Entering only ",(0,o.kt)("inlineCode",{parentName:"p"},"openstack")," and running that will take you\ninto the OpenStackClient shell allowing commands to be run without\nneeding to prefix them with ",(0,o.kt)("inlineCode",{parentName:"p"},"openstack"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"(openstackclient) user@host:~$ openstack\n(openstack) network list\n+--------------------------------------+----------+--------------------------------------+\n| ID                                   | Name     | Subnets                              |\n+--------------------------------------+----------+--------------------------------------+\n| 5cc755c9-41fc-44c2-87e7-642dfdfb0208 | External | a52754dd-13d9-4a36-bab6-10058f4887f5 |\n+--------------------------------------+----------+--------------------------------------+\n(openstack) exit\n(openstackclient) user@host:~$\n")),(0,o.kt)("p",null,"Type ",(0,o.kt)("inlineCode",{parentName:"p"},"exit")," to leave the OpenStackClient shell."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"next-steps"},(0,o.kt)("strong",{parentName:"h2"},"Next Steps")),(0,o.kt)("p",null,"Navigate to the next guide in this series to learn how to ",(0,o.kt)("a",{parentName:"p",href:"create-a-network"},"create networks in\nOpenStack"),"."))}u.isMDXComponent=!0},11094:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/um_api_access_osc-2e3b39c9a74a4541854401c4f75b9eff.png"}}]);