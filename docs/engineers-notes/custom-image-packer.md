# Creating Custom Images with Packer on OpenMetal

## Overview

Packer is a free and open source tool designed to automate image building and
customization across multiple platforms. In this article you will learn how to
create an Ubuntu 22.04 LTS image from an external source file for use on your
OpenMetal cloud.

## Prerequisites

- An OpenStack Cloud
- Familiarity with [OpenStack Client CLI](../operators-manual/day-1/command-line/openstackclient.md)
- [Packer](https://www.packer.io)

## Install packer

You will first need to install packer. The following assumes you are running an
Ubuntu/Debian environment. For installation on other platforms see the upstream
[Install Packer](https://developer.hashicorp.com/packer/downloads) documentation.

```shell
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

sudo apt update && sudo apt install packer
```

## Prepare your environment

Activate the virtual environment created for the OpenStack client if
applicable and not already active:

```shell
source .venv/bin/activate
```

Source your OpenStack credentials from `<user>-openrc.sh`:

```shell
source <user>-openrc.sh
```

Create and enter working directory:

```shell
mkdir packer-build
cd packer-build
```

## Create security group

Packer will spin up a temporary instance with the desired source image and
requires SSH access. Create a new security group and rule to allow ingress
on port 22:

```shell
openstack security group create build-group
```

```shell
openstack security group rule create \
--remote-ip 0.0.0.0/0 \
--protocol tcp \
--dst-port 22 \
--description "Builder SSH access" \
build-group
```

## Initialize packer

We first need to define the packer plugin we will be using. This is done with
`required_plugins` in the `packer` block. Run the following command in the build
directory created above:

```shell
cat <<EOF> image.pkr.hcl
packer {
  required_plugins {
    openstack = {
      version = ">= 1.0.1"
      source  = "github.com/hashicorp/openstack"
    }
  }
}
EOF
```

You can now initialize the packer environment which installs the defined plugin:

```shell
$ packer init .
Installed plugin github.com/hashicorp/openstack v1.0.1 in "/home/ubuntu/.config/packer/plugins/github.com/hashicorp/openstack/packer-plugin-openstack_v1.0.1_x5.0_linux_amd64"
```

## Define a source block

With packer initialized you now need to define a `source` block in your
`image.pkr.hcl`:

```hcl
source "openstack" "demo" {
  flavor                    = "<image flavor>" # openstack flavor list
  image_name                = "<new image name>"
  external_source_image_url = "<source image link>"
  ssh_username              = "<ssh username>" # Default SSH user for external source img
  security_groups           = ["<security group>"] # Security groups to allow SSH access
}
```

The example above defines the minimum information required to create an
unmodified OpenStack image from an external image source. In our example
we are creating an Ubuntu 22.04 LTS image using the following values:

- `flavor`: "m1.small"
- `image_name`: "Ubuntu 22.04 (jammy-amd64)"
- `external_source_image_url`: <https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img>
- `ssh_username`: "ubuntu"
- `security_group`: "build-group"

After adding these values, or replacing them with your own, the `source` block
should now look like this:

```hcl
source "openstack" "demo" {
  flavor                    = "m1.small"
  image_name                = "Ubuntu 22.04 (jammy-amd64)"
  external_source_image_url = "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img"
  ssh_username              = "ubuntu"
  security_groups           = ["build-group"]
}
```

## Define build block

The `build` block in packer is where you would define customizations to the
image. As we are only creating a default image the build block will only need
the source defined:

```hcl
build {
  sources = ["source.openstack.demo"]
}
```

Once you've added the build block, run the `packer fmt` command to automagically
correct any formatting discrepancies:

```shell
packer fmt .
```

Your `image.pkr.hcl` should now look like this:

```shell
$ cat image.pkr.hcl 
packer {
  required_plugins {
    openstack = {
      version = ">= 1.0.1"
      source  = "github.com/hashicorp/openstack"
    }
  }
}

source "openstack" "demo" {
  flavor                    = "m1.small"
  image_name                = "Ubuntu 22.04 (jammy-amd64)"
  external_source_image_url = "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img"
  ssh_username              = "ubuntu"
  security_groups           = ["build-group"]
}

build {
  sources = ["source.openstack.demo"]
}
```

## Validate configuration and build image

Now that your configuration file is complete, verify everything is correct
with `packer validate`:

```shell
$ packer validate .
The configuration is valid.
```

Once validated you are ready to build your image:

```shell
$ packer build .
openstack.demo: output will be in this color.

==> openstack.demo: Loading flavor: m1.small
    openstack.demo: Verified flavor. ID: m1.small
==> openstack.demo: Creating temporary RSA SSH key for instance...
==> openstack.demo: Creating temporary keypair: packer_636aa8e7-85aa-b787-ca40-b494195062d8 ...
==> openstack.demo: Created temporary keypair: packer_636aa8e7-85aa-b787-ca40-b494195062d8
==> openstack.demo: Creating image using external source image with name packer_636aa8e7-5f8a-8c58-b8fd-b415f5d433aa
==> openstack.demo: Using disk format qcow2
==> openstack.demo: Created image with ID 11919271-4c41-4f28-a20e-417dda203c45
==> openstack.demo: Importing External Source Image from URL https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img
    openstack.demo: Image not Active, retrying in 10 seconds
[...]
==> openstack.demo: Launching server...
==> openstack.demo: Launching server...
    openstack.demo: Server ID: 779e2ffe-5c18-4c28-b714-bff62d234129
==> openstack.demo: Waiting for server to become ready...
    openstack.demo: Floating IP not required
==> openstack.demo: Using SSH communicator to connect: 173.231.253.58
==> openstack.demo: Waiting for SSH to become available...
==> openstack.demo: Connected to SSH!
==> openstack.demo: Stopping server: 779e2ffe-5c18-4c28-b714-bff62d234129 ...
    openstack.demo: Waiting for server to stop: 779e2ffe-5c18-4c28-b714-bff62d234129 ...
==> openstack.demo: Creating the image: Ubuntu 22.04 (jammy-amd64)
    openstack.demo: Image: c2ed4308-593c-4a0c-adc5-dbeebaf69dbd
==> openstack.demo: Waiting for image Ubuntu 22.04 (jammy-amd64) (image id: c2ed4308-593c-4a0c-adc5-dbeebaf69dbd) to become ready...
==> openstack.demo: Terminating the source server: 779e2ffe-5c18-4c28-b714-bff62d234129 ...
==> openstack.demo: Deleting temporary external source image: packer_636aa8e7-5f8a-8c58-b8fd-b415f5d433aa ...
==> openstack.demo: Deleting temporary keypair: packer_636aa8e7-85aa-b787-ca40-b494195062d8 ...
Build 'openstack.demo' finished after 1 minute 59 seconds.

==> Wait completed after 1 minute 59 seconds

==> Builds finished. The artifacts of successful builds are:
--> openstack.demo: An image was created: c2ed4308-593c-4a0c-adc5-dbeebaf69dbd
```

We can see from the output above that the build process completed successfully.
We can view the new image properties with `openstack image show <new_image_id>`:

```shell
$ openstack image show c2ed4308-593c-4a0c-adc5-dbeebaf69dbd --fit-width
+------------------+-----------------------------------------------------------------------------------------------+
| Field            | Value                                                                                         |
+------------------+-----------------------------------------------------------------------------------------------+
| container_format | bare                                                                                          |
| created_at       | 2022-11-08T19:09:07Z                                                                          |
| disk_format      | raw                                                                                           |
| file             | /v2/images/c2ed4308-593c-4a0c-adc5-dbeebaf69dbd/file                                          |
| id               | c2ed4308-593c-4a0c-adc5-dbeebaf69dbd                                                          |
| min_disk         | 25                                                                                            |
| min_ram          | 0                                                                                             |
| name             | Ubuntu 22.04 (jammy-amd64)                                                                    |
| owner            | 20de51f9e6714727aabe668cdcf33d67                                                              |
| properties       | base_image_ref='11919271-4c41-4f28-a20e-417dda203c45', boot_roles='reader,member,admin',      |
|                  | image_location='snapshot', image_state='available', image_type='image',                       |
|                  | instance_uuid='779e2ffe-5c18-4c28-b714-bff62d234129', locations='[{'url': 'rbd://c368d47b-005 |
|                  | 5-4380-bda9-257e0c662b90/images/c2ed4308-593c-4a0c-adc5-dbeebaf69dbd/snap', 'metadata':       |
|                  | {'store': 'rbd'}}]', os_glance_failed_import='', os_glance_importing_to_stores='',            |
|                  | os_hidden='False', owner_project_name='kubespray-demo', owner_user_name='admin',              |
|                  | stores='rbd', user_id='14ca74f0b2da43d680fdba3910d4ee3a'                                      |
| protected        | False                                                                                         |
| schema           | /v2/schemas/image                                                                             |
| size             | 26843545600                                                                                   |
| status           | active                                                                                        |
| tags             |                                                                                               |
| updated_at       | 2022-11-08T19:09:15Z                                                                          |
| visibility       | private                                                                                       |
+------------------+-----------------------------------------------------------------------------------------------+
```

## Resources

- Hashicorp Packer [documentation](https://developer.hashicorp.com/packer/docs)
- OpenStack Builder [plugin](https://developer.hashicorp.com/packer/plugins/builders/openstack)
