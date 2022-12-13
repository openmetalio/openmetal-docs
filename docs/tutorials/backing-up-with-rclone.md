---
slug: /tutorials/backing-up-vm-data-with-rclone
description: Practical example of VM data backup to Swift S3API with rclone.
---
# Backup VM Data to Ceph with Swift S3API

## Overview

In this guide we will demonstrate generating backups of important data from a
production VM to Ceph backed object storage on your OpenMetal cloud using rclone.

## Prerequisites

- [EC2 Credentials](swift-api-s3.md)
- [Rclone CLI tool](swift-s3-rclone-cli.md)
- Familiarity with [Backing Up Important Data](backing-up-your-data.md)

### Environment

For this demonstration we have an Ubuntu focal instance serving WordPress on an
optimized LEMP stack managed by Ansible. In this example, all service and server
configuration is handled by Ansible, so only user and CMS specific content need
be backed up.

> The demo environment was deployed using the [WordPress UltraStack](https://github.com/inmotionhosting/wordpress-ultrastack-ansible)
> Ansible playbook.

## Rclone

### Reasoning

Rclone is chosen as the preferred tool in this example due to its `sync` option
providing similar functionality and ownership/permission preservation to the
Linux native rsync tool. Additionally, in our testing, rclone consistently
outperformed other tooling in speed of operations and transfers by a significant
margin.

## Preparation

- Create a bucket using the server hostname or otherwise unique ID:

    ```shell
    rclone mkdir backup-demo:$(hostname)
    ```

- Export a full backup of the CMS database:
  
  > **Note**: We perform this manually for illustrative purposes, ideally this
  > process is performed on a scheduled cron using native tooling.

  ```shell
  mkdir ~/sql-dump
  cd ~/sql-dump

  # Dump DB via WP-CLI
  $ wp db export --path="../doc_root"
  Success: Exported to 'ubuntu-2022-12-13-7fbde57.sql'.
  ```

## Initial S3cmd sync

Now perform an initial sync of the user directory which includes the SQL dump
files and document root, excluding the WordPress cache folder, with the command
below:

```shell
rclone sync /home/ubuntu/ backup-demo:$(hostname)/${USER}/ \
 --exclude="/home/ubuntu/doc_root/wp-content/cache"
```

## Incremental backups

At times, it is unnecessary or unwarranted to create duplicate copies of
everything whenever backups run. To reduce disk and bandwidth usage when using
sync you can pass the `--backup-dir` flag which will copy or move any files
which would have been overwritten or deleted, in their original hierarchy, into
the directory specified. The example below updates the existing remote backup
with any local changes storing any incremental changes in a timestamped
subdirectory:

```shell
rclone sync /home/ubuntu/ backup-demo:$(hostname)/${USER}/ \
 --exclude="/home/ubuntu/doc_root/wp-content/cache" \
 --backup-dir backup-demo:$(hostname)/$(date -u +%Y-%m-%dT%H:%MZ)/ \
 --update
```

## Conclusion

While we have only touched on a very basic backup scenario, the tooling and
concepts presented should provide a foundation for you to explore, plan and
implement a backup strategy to fit your needs.

## Reference

- [Rclone commands](https://rclone.org/commands/)
