---
slug: /cloud-administration/intro-to-cloud-init
description: Introduction to cloud-init for Linux cloud instance initialization.
---

# Intro to cloud-init

Cloud-init is an industry standard method for Linux cloud instance initialization.
Cloud-init has support across all major Linux distributions, FreeBSD, NetBSD and
OpenBSD. It is also supported across all major public cloud providers,
provisioning systems for private cloud infrastructure, and bare-metal installations.

Cloud-init will identify the cloud it is running on, using the provided metadata
from the cloud, and configure the system accordingly. Tasks can include things
like networking configurations, drive setup, ssh access, and other server
tasks before you even log into the server.

## Using a cloud-config script

More than likely you will pass a cloud-config script to the server on provision.
This will get picked up by Cloud-init and actions in the file are carried out.
The cloud-config script is a YAML formatted file. YAML is a human-readable data
serialization standard that is generally used for configuration files, but can
have various other uses as well.

When creating a cloud-config file you will want to place a special identifier of
`#cloud-config` so that Cloud-init can be aware of the set of instructions it's
about to receive.

Below we will go over some examples of cloud-configs.

```yaml
#cloud-config

users:
  - default
  - name: omi-admin
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDE0PUM9qcLkttJp330AHwp7M5kNQ5YQCU0iE0NhZkK8nTxJ3NelTST739nlaQxCYIdPhMegJQgNqsVkcZ2daaRYlc8fWGnzRYfL+f9AgM5fGAAmveBFYajZe/5Kp+81IYcfLQhfoWTvytoBq9gmn0PwwFsLlwe138r6M2aaWJl80V/mDp2BiAwDh0xJYR2+Ei7AD4O66lAeZJhjqaue/Ctpez4MpXp2XRufErsmCBHX9bN0wVPWNNJgrfTIBhrDqr1JbMHZo73d5iQntxJAmc1+y8qTueUGpiitC5Fl/jKyLycIjOM4OPpKgsvc1DtT+UWudfzG2kpAYJWaA3t6r8IxMS6a/9leavL7TKUcoAdqQahB75iJ38CZKxVB0sF0xxxyBS2JtMokHfex6bHtWS0D0eBwpQZPSKT18egmal4sFEcQwxEHeqK16U+9N01hv7KatImG2pHUQJxmtPmdRMOhltFOQCmIfm21mHxsXgaYY8In5xbZD1Lg05FYmOmwgE= omi-admin@example.io
```

In this example we are creating a new user, `omi-admin`, giving that user sudo
access, and specifying a public ssh key to simplify ssh access.

```yaml
#cloud-config
package_upgrade: true
packages:
  - python3-pip
  - python3-dev
  - build-essential
  - libssl-dev
  - libffi-dev
```

In the example above we ensure that all packages are up-to-date, and ensure
specific packages are installed on the server.

```sh
#cloud-config
manage-resolv-conf: true
resolv_conf:
  nameservers:
    - '9.9.9.9' #quad9
    - '8.8.8.8' #google
```

Our last example sets the server to use the specified resolvers.
