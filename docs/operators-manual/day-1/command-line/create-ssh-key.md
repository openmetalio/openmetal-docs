---
sidebar_position: 2
---
# Create SSH Key Pair for an OpenStack Control Plane Node

## Introduction

In this guide, we explain how to create an SSH key pair within one of
your cloud's control plane nodes.

## How to Create an SSH Key Pair

### Prerequisites

Before beginning, ensure you have SSH access as `root` to your cloud's
control plane nodes.

### Create the Key Pair

**Step 1** -- **Log in to a control plane node**

To begin, connect to one of your cloud's control planes nodes with SSH
as `root`. This example connects to the control plane node identified by
`173.231.254.165`.

For example:

    $ ssh root@173.231.254.165
    Activate the web console with: systemctl enable --now cockpit.socket
    
    Last login: Mon Nov  8 16:53:30 2021 from 173.231.218.25

**Step 2** -- **Create the key pair**

Next, use `ssh-keygen` to generate an SSH key pair. This example
demonstrates creating a key pair of size 4096 bits, specified by
`ssh-keygen -b 4096`. The private key is saved in the default location
of `/root/.ssh/id_rsa` and for additional security, a passphrase is set.

For example:

    [root@relaxed-flamingo ~]# ssh-keygen -b 4096
    Generating public/private rsa key pair.
    Enter file in which to save the key (/root/.ssh/id_rsa):
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /root/.ssh/id_rsa.
    Your public key has been saved in /root/.ssh/id_rsa.pub.
    The key fingerprint is:
    SHA256:iSR1QtRn5VVsRIklmfiWrVJPWtn0oV8HtxLLs6wA7iQ root@relaxed-flamingo.local
    The key's randomart image is:
    +---[RSA 4096]----+
    |     o=..  .o.**=|
    |     . o. oo *oo=|
    |    . .  o  + *=*|
    |     o o .   @ *=|
    |      o S   + @ o|
    |     E o . . = o |
    |      +   . o    |
    |       .   .     |
    |                 |
    +----[SHA256]-----+

**Step 3** -- **View contents of public key**

To view the contents of the public key, use `cat /root/.ssh/id_rsa.pub`.
If the key was saved in another location, be sure to use the appropriate
file.

For example:

    [root@relaxed-flamingo ~]# cat /root/.ssh/id_rsa.pub
    ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDjxSWaO+Md8yjDjHguhjuNokgA8R/GcRBj1dxUDJAdjwktC7ZlPxOLQLshoz76SNTt9TRk3TX/txyoWvMzuvn5n2GbYvsysVioX5mzzkzAJGSKYQM46qLKBvvtaQygJkYQFmjrCyCdeOGovKWHKgJY0V4NU0OJUMWvC67BIvDXQ2Jbyfe45ZoCk8xIG1lsMA+AzvJ+6BS5Ce+vtj5FWe8teDOH4HqiKWZiDUEUj4IGahYatuq1344VL+R/NEDYm7Wj+PzqRk2OeLdh4cvodSIPV61597ZqlVqj3pZCCJ+3QfcdqMMwNTOPiAZCASOwZ2XfKQnt4QIL6WqCdKoNgDo/7wnygLWfIBdOTejhov6z6xmvcUvuajDBwIZUtyemQD2NKR+mPuZTXwnOilFNUI3w8fkDUxWjxhSmcaui07zpNabxyEemE9sqAfAUtDY/KYOb72/JIjI41qHDSvvV08LNIYWbq3n/tHT2TVX/u4HDjrBNXHHF3/H8W4ikr7xT1drBriQWB6WlCPjYU07gw2IAww8CjWj30pXcfQtwnlgm+qa/Gkl+1TtLPrRO++4SmQ5J6LNBllrY+AFlC4v7siAuNU0w5rzJ6dTeXtDRnVNom7oNCzQHVLAmX2WxCKzlUd6b5beHl0vaywAgINZl+6tPApYhipG9C1b/v4X650elVw== root@relaxed-flamingo.local

To have access to another machine, this public key needs to exist within
the file `~/.ssh/authorized_keys`. For the sake of this series of
guides, this public key is injected into the instance created within
[How to Create an Instance in OpenStack
Horizon](../horizon/create-first-instance)

## Conclusion

This concludes the steps needed to create an SSH key pair for one of
your cloud's control plane nodes.
