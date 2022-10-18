---
slug: /openmetal-central/how-to-add-ssh-keys-in-openmetal-central
description: Learn how to add SSH keys to your private cloud in OpenMetal Central.
sidebar_position: 4
---
# Adding SSH Keys to your Private Cloud in OpenMetal Central

In this article you will learn how to add new SSH keys to your private cloud
from your OpenMetal Central portal.

## Access your OpenMetal Central account

- Login to your account at [OpenMetal Central](https://central.openmetal.io)

## Adding your SSH key

- Access your cloud settings.

   ![Cloud Settings](images/cloud-settings-ssh.png)

- Paste the text contents of your ssh public key into the **Add SSH Key** field and
   click **Add Key**.

   ![Add SSH Key](images/add-ssh-key-central.png)

- You will see a pop-up at the bottom of the page indicating success.
  
  > **Note**: The **Add SSH Key** field does not clear upon task completion.

## Access your hardware nodes

- Access your servers with the new key:
  
  ```shell
  ssh -i ~/.ssh/your_key_name root@<server-ip>
  ```
