# Intro to cloud-init

Updated on July 30, 2020 by Chris Bermudez

2 Minutes, 13 Seconds to Read

Cloud-init is an industry standard method for Linux cloud instance initialization.
Cloud-init has support across all major Linux distributions, FreeBSD, NetBSD and
OpenBSD. It is also supported across all major public cloud providers,
provisioning systems for private cloud infrastructure, and bare-metal installations.

Cloud-init will identify the cloud it is running on, using the provided metadata
from the cloud, and configure the system accordingly. Tasks can include things
like networking configurations, setting up the drives, ssh access, and other server
tasks before you even log into the server.

## Using a cloud-config script

More than likely you will pass a cloud-config script to the server on provision.
This will get picked up by cloud-init and actions in the file are carried out.
The cloud-config script is a YAML formatted file. YAML is a human-readable data
serialization standard that is generally used for configuration files, but can
have various other uses as well.

When creating a cloud-config file you will want to place a special identifier of
`#cloud-config` so that cloud-init can be aware of the set of instructions its
about to receive.

Below we will go over some examples of cloud-configs.

```sh
#cloud-config
users:
  - name: chrisb
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCaGLKWXz61dB0E5yJrpJ8kcfKHaQQIS91XjjPY/2o8mCkNXoC/XkXiVhvL0mlzyzs6ALeUBmTXS5iy1llFbqQsRNkTaZHIWD3REYyv5lPuHWWFYklgf2Sd0vEWQfQBrGBnqRnvIwL1ajFEEpm0HbNtE1xhukfsH+FAl+JrMkPbYTBkvvCX/6a2g8A8qsUnb5zQ+uEoEdKu85kB54x7i6IQboG9z6u4xEu6ISYArZo+UPSf5HxcLkbv776RJWOQb81tJIDEbLSn+xNS3ThAtC4DgSo2OjP7KgLKk1X5o1PTOaTiL/oq5NHOnwuegwtVkqNrq2mULhN3Tot3ayV2+Efr chris@work_laptop
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCEO/nW7MeFTKETbjesBQFLYhYa/Os9eKBGWiBCuP9ZstzSwkwA9dmNgtseRAnp01OvHMDFyTUcIuaHPBBqxafixF4RnV54QYz8bEIdDR6LpBj1y3ih8foobe9tFPiERzbVmZysP19Hag9e6HkLgJ9OjLqsO1eiR2djC/UGPQt601MYZhk7EpxFJpO8uu28G9nM8BRw0dBqrB525Q4/yKtekMz2nbQnfeYrR6kbmCqbgcvFHlgnBsapeVlP5v9T2qQnz1JfUUDIgJ6Zpyldld+qJCQERU0C9kldUHEijnBvoC68+1BBLJNTT9hUV0XivwCqJ/F6IlMp8bI4sTKCuysX chris@home_desktop
runcmd:
  - touch /done.txt
```

In this example we are creating a user for chrisb and giving that user sudo access.
We also specify some public ssh keys so that ssh access is simple.

```sh
#cloud-config
package_upgrade: true
packages:
  - python3-pip
  - python3-dev
  - build-essential
  - libssl-dev
  - libffi-dev
```

In this example we make sure that all packages are up to date as well as ensure
that some specific packages are installed on the server.

```sh
#cloud-config
manage-resolv-conf: true
resolv_conf:
  nameservers:
    - '9.9.9.9' #quad9
    - '8.8.8.8' #google
```

In our last example we are setting the server’s resolvers to the ones specified
there.
