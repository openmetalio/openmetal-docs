---
sidebar_position: 8
---
# Create an SSH Key Pair

Instances take an SSH public key at boot. Generate the pair on the machine you connect from.

## Create the key pair

    ssh-keygen -t ed25519

Accept the default path and set a passphrase when prompted.

    $ ssh-keygen -t ed25519
    Generating public/private ed25519 key pair.
    Enter file in which to save the key (/home/user/.ssh/id_ed25519):
    Enter passphrase for "/home/user/.ssh/id_ed25519" (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /home/user/.ssh/id_ed25519
    Your public key has been saved in /home/user/.ssh/id_ed25519.pub

This writes two files:

| File | Purpose |
|---|---|
| `~/.ssh/id_ed25519` | Private key. Never share it. |
| `~/.ssh/id_ed25519.pub` | Public key. Upload this to the cloud. |

Use `-t rsa -b 4096` instead if you need a key for a system that does not support Ed25519.

## View the public key

    $ cat ~/.ssh/id_ed25519.pub
    ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK8Qb5tVxQ3mHhE2vN7pYrWfJ4sLdTgXcZ9aUmKoPqRs user@workstation

## Next

Import the public key into the cloud, then select it when launching an instance. See [Add a key pair](./create-first-instance.md#add-a-key-pair) in How to Create an Instance.

Connect to the instance with the matching private key:

    ssh -i ~/.ssh/id_ed25519 <user>@<floating-ip>
