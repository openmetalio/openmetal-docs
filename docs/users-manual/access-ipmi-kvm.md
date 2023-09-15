# How to access the IPMI KVM console

## Objective

The main purpose of IPMI KVM is to facilitate remote server management,
troubleshooting, and maintenance tasks, providing administrators with a way to
interact with a server's operating system, BIOS, and other pre-boot environments
remotely.

## Requirements

- Access to [OpenMetal Central](https://central.openmetal.io/)
- Java is installed on your local machine.
  - To download and install the latest version of Java, click [here](https://www.java.com/en/download/).

:::caution
Please bear in mind that while the IPMI Java applet can be utilized on macOS,
certain compatibility concerns may arise. Therefore, it is advisable to opt for
a system running either the Windows or Linux operating system for a smoother
experience.
:::

## Instructions

First, you will want to navigate to the `Assets` page for the cloud with the
node you wish to access.

![image](images/ipmi_click_assets.jpg)

Next, select the menu (**`⋮`**) next to the server you want to access, then
select `IPMI Access` :

![image](images/ipmi_click_ipmiaccess.jpg)

On the next menu, select `Download JNLP` :

![image](images/ipmi_download_jnlp.jpg)

Once the `<hostname>.jnlp` has downloaded, open it and hit `Run` when prompted:

![image](images/ipmi_run_app.jpg)

You will then enter into the virtual console where you can enter your `root` credentials:

![image](images/ipmi_open_console.jpg)
