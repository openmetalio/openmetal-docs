# Accessing IPMI on Central Dashboard

Author: Ramon Grullon

## Prerequisites

You have login credentials for the Central Dashboard.

## Step 1: Log In to the Central Dashboard

Open your preferred web browser and go to the URL of your Central Dashboard.
Enter your username and password.
Click Login.

![ipmi login](/img/openmetal-central/ipmi-login.png "IPMI Login")

## Step 2: Navigate to the Server's Asset Information

- Once logged in, locate and click on the Assets section from the main dashboard
menu.

- In the Assets page, your inventory of servers will be available. Find the
server you wish to manage.

- Click on the three dots on the right hand side next to the server to view more
information.

- Select the IPMI Access button

![ipmi access](/img/openmetal-central/ipmi-access.png "IPMI Access")

## Step 3: Select Access Type

- In the select access page, the default type utilized by OpenMetal is HTML5,

- Click the Open Web Console to continue

![ipmi access type](/img/openmetal-central/ipmi-access-type.png "IPMI Access Type")

## Step 4: Handle Unsecured SSL Certificate Warning

If you encounter an SSL certificate warning, it’s typically because the server
is using a self-signed or untrusted certificate.

- Click on Proceed or Advanced (depending on your browser) to continue past the warning.

![ipmi ssl warn](/img/openmetal-central/ipmi-ssl-warn.png "IPMI SSL Warn")

## Step 5: Access & Use of Virtual Media

After proceeding past the SSL warning, the IPMI HTML5 interface will load,
allowing you to interact with your server remotely.

Press the virtual media button to mount your ISO.

![ipmi button](/img/openmetal-central/ipmi-media-button.png "IPMI Media Button")

Select the File on your local storage and Mount the ISO.

![ipmi Select](/img/openmetal-central/ipmi-select.png "IPMI Select")

![ipmi Mount](/img/openmetal-central/ipmi-mount.png "IPMI Mount")

Restart the server and invoke the BOOT Menu by pressing F11.
The mounted ISO will appear on the Menu as a CDROM device.

![ipmi Boot](/img/openmetal-central/ipmi-boot-menu.png "IPMI Boot")

![ipmi CDROM](/img/openmetal-central/ipmi-cdrom.png "IPMI CDROM")

Select the Install OS option and allow some time (UP TO 2 HOURS) for your ISO
to load.

![ipmi Install](/img/openmetal-central/ipmi-install.png "IPMI Install")

![ipmi Install Complete](/img/openmetal-central/ipmi-install-complete.png "IPMI Install Complete")

## Summary

You have successfully completed the process of accessing and managing your server
via the Central Dashboard's IPMI interface. By following this guide, you were
able to:

Log in to the Central Dashboard.
Navigate to the server's asset information and select IPMI access.
Handle SSL certificate warnings to safely proceed to the remote console.
Mount an ISO file and install an operating system using the IPMI HTML5 interface.

This process is essential for remote server management, especially when
performing OS installations or troubleshooting critical issues.
If you encounter any challenges or require additional assistance, don't hesitate
to reach out to your support team.
