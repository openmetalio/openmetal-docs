# Backup VM Data to Ceph with Swift S3API

## Overview

In this guide we will demonstrate generating backups of important data from a
production VM to Ceph backed object storage on your OpenMetal cloud using the
S3cmd tool.

## Prerequisites

- [EC2 Credentials](swift-api-s3.md)
- [S3cmd CLI tool](swift-s3cmd-cli.md)
- Familiarity with [Backing Up Important Data](backing-up-your-data.md)

### Environment

For this demonstration we have an Ubuntu focal instance serving WordPress on an
optimized LEMP stack managed by Ansible. In this example, all service and server
configuration is handled by Ansible, so only user and CMS specific content need
be backed up.

> The demo environment was deployed using the [WordPress UltraStack](https://github.com/inmotionhosting/wordpress-ultrastack-ansible)
> Ansible playbook.

## S3cmd

### Reasoning

S3cmd is chosen as the preferred tool in this example due to it's `sync` option
providing similar functionality and ownership/permission preservation to the
Linux native rsync tool.

## Preparation

- Create a bucket using the server hostname or otherwise unique ID:

    ```shell
    $ s3cmd mb s3://$(hostname)
    Bucket 's3://back-me-up/' created
    ```

- Export a full backup of the CMS database:
  
  > **Note**: We perform this manually for illustrative purposes, ideally this
  > process is performed on a scheduled cron using native tooling.

  ```shell
  mkdir sql-dump
  cd sql-dump

  # Dump DB via WP-CLI
  $ wp db export --path="../doc_root"
  Success: Exported to 'ubuntu-2022-11-29-96d8f99.sql'.
  ```

## Initial S3cmd sync

We perform an initial sync of the user directory which includes the SQL dump
files and document root, excluding all cache folders with the command below:
 
```shell
s3cmd sync --exclude="*/cache/*" /home/ubuntu s3://back-me-up/$(date -u +%Y-%m-%dT%H:%M:%SZ)/
```
