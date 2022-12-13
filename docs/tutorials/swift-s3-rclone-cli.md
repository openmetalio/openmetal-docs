---
slug: /openstack-admin/swift-s3-api-access-with-rclone
description: Learn how to access your OpenMetal clouds' Object store using rclone and the Swift S3 API
---
# How to Configure and Use Rclone for Swift S3 API Access on OpenMetal

## Objective

This guide will show you how to configure and use the [rclone](https://rclone.org)
CLI tool to interact with your OpenMetal clouds' Ceph-backed Object store via the
Swift S3 API.

## Prerequisites

- [EC2 Credentials](swift-api-s3.md) generated for your cloud.

## Install

Script installation is provided for Linux and related systems
  
```shell
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

## Configure

### Quick Config

The default location for the configuration file:

- `~/.config/rclone/rclone.conf`

The minimum required values are provided in the following example:

```conf
[backup-demo] # Name to be used when calling remote
type = s3
provider = Other
access_key_id = <access-key>
secret_access_key = <secret-key>
endpoint = http(s)://<cloud-domain-or-ip>:8080/
acl = private
```

### Guided config

Guided configuration is provided with `rclone config` which will prompt for the
following values:

```shell
$ rclone config
2022/12/12 19:47:27 NOTICE: Config file "/home/ubuntu/.config/rclone/rclone.conf" not found - using defaults
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n

Enter name for new remote.
name> backup-demo

Option Storage.
Type of storage to configure.
Choose a number from below, or type in your own value.
[...]
Storage> 5

Option provider.
Choose your S3 provider.
Choose a number from below, or type in your own value.
Press Enter to leave empty.
[...]
provider> 24

Option env_auth.
[...]
env_auth> false

Option access_key_id.
[...]
access_key_id> <access-key>

Option secret_access_key.
[...]
secret_access_key> <secret-key>

Option endpoint.
[...]
endpoint> http(s)://<cloud-domain-or-ip>:8080/

Option location_constraint.
[...]
Enter a value. Press Enter to leave empty.
location_constraint>

Option acl.
[...]
acl> 1

Edit advanced config?
y) Yes
n) No (default)
y/n> n

Configuration complete.
```

## Basic usage

- `rclone lsd` - List all directories at remote path:
  
  ```shell
  $ rclone lsd backup-demo:
    -1 2022-11-01 16:08:29        -1 openmetal-bucket
  ```

- `rclone mkdir` - Make a new path if it doesn't already exist:
  
  ```shell
  rclone mkdir backup-demo:/test-bucket
  ```

- `rclone sync` - Make source and dest identical, modifying destination only:
  
  ```shell
  rclone sync /local/path remote:path
  ```

## Reference

- [Rclone Usage](https://rclone.org/docs/)
- [Rclone Global Flags](https://rclone.org/flags/)
