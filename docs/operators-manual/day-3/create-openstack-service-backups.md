# How to Copy and Restore OpenStack Service Databases and Configuration

## Introduction

Your OpenMetal private cloud is comprised of OpenStack services, which
like the applications and services you might deploy inside of it, should
be backed up on a regular interval so you can recover from catastrophic
events. In this guide, we explain how to copy your cloud's configuration
files and OpenStack service databases as well as how to restore these
items.

## Before Proceeding with this Guide

This guide introduces potentially harmful commands and actions that
could cause the cloud to become inoperable or be in an unexpected state.
Read commands carefully before executing them.

## Table of Contents

1.    - [Kolla Ansible and Ceph
        Ansible](operators_manual/day-3/create-openstack-service-backups.md#kolla-ansible-and-ceph-ansible)
        
        1.  [Prepare Kolla Ansible and Ceph Ansible
            Environment](operators_manual/day-3/create-openstack-service-backups.md#prepare-kolla-ansible-and-ceph-ansible-environment)
        
        2.    - [Where are my Private Cloud's Configuration
                Files?](operators_manual/day-3/create-openstack-service-backups.md#where-are-my-private-cloud-s-configuration-files)
                
                1.  [Kolla Ansible Configuration
                    Files](operators_manual/day-3/create-openstack-service-backups.md#kolla-ansible-configuration-files)
                2.  [Ceph Ansible Configuration
                    Files](operators_manual/day-3/create-openstack-service-backups.md#ceph-ansible-configuration-files)
                3.  [FM-Deploy Configuration
                    File](operators_manual/day-3/create-openstack-service-backups.md#fm-deploy-configuration-file)
                4.  [Network Ansible Configuration
                    File](operators_manual/day-3/create-openstack-service-backups.md#network-ansible-configuration-file)
        
        3.  [Keep a Backup Copy a Private Cloud's Configuration
            Files](operators_manual/day-3/create-openstack-service-backups.md#keep-a-backup-copy-a-private-cloud-s-configuration-files)

2.    - [How to Restore a Private Cloud's Configuration
        Files](operators_manual/day-3/create-openstack-service-backups.md#how-to-restore-a-private-cloud-s-configuration-files)
        
        1.    - [Example: Recover Neutron's Configuration File using
                Kolla
                Ansible](operators_manual/day-3/create-openstack-service-backups.md#example-recover-neutron-s-configuration-file-using-kolla-ansible)
                
                1.  [Prerequisite: Prepare a Kolla Ansible
                    Environment](operators_manual/day-3/create-openstack-service-backups.md#prerequisite-prepare-a-kolla-ansible-environment)
                2.  [Regenerate an OpenStack Service's Configuration
                    File using Kolla
                    Ansible](operators_manual/day-3/create-openstack-service-backups.md#regenerate-an-openstack-service-s-configuration-file-using-kolla-ansible)

3.    - [Create Full and Incremental Copies of a Private Cloud's
        OpenStack Service
        Databases](operators_manual/day-3/create-openstack-service-backups.md#create-full-and-incremental-copies-of-a-private-cloud-s-openstack-service-databases)
        
        1.  [Prerequisites](operators_manual/day-3/create-openstack-service-backups.md#prerequisites)
        
        2.    - [How to Create OpenStack Service Database
                Backups](operators_manual/day-3/create-openstack-service-backups.md#how-to-create-openstack-service-database-backups)
                
                1.  [Command Syntax for Full Database
                    Backups](operators_manual/day-3/create-openstack-service-backups.md#command-syntax-for-full-database-backups)
                2.  [Command Syntax for Incremental Database
                    Backups](operators_manual/day-3/create-openstack-service-backups.md#command-syntax-for-incremental-database-backups)
                3.  [Path to the Kolla Ansible Inventory
                    File](operators_manual/day-3/create-openstack-service-backups.md#path-to-the-kolla-ansible-inventory-file)
                4.  [Command Usage Example for a Full Database
                    Backup](operators_manual/day-3/create-openstack-service-backups.md#command-usage-example-for-a-full-database-backup)
                5.  [Command Usage Example for an Incremental Database
                    Backup](operators_manual/day-3/create-openstack-service-backups.md#command-usage-example-for-an-incremental-database-backup)

4.    - [How to Restore a Private Cloud's OpenStack Service
        Databases](operators_manual/day-3/create-openstack-service-backups.md#how-to-restore-a-private-cloud-s-openstack-service-databases)
        
        1.    - [Full Database Restoration
                Steps](operators_manual/day-3/create-openstack-service-backups.md#full-database-restoration-steps)
                
                1.  [Full Restoration: Create Temporary Docker
                    Container](operators_manual/day-3/create-openstack-service-backups.md#full-restoration-create-temporary-docker-container)
                2.  [Full Restoration: Prepare Backup
                    Directory](operators_manual/day-3/create-openstack-service-backups.md#full-restoration-prepare-backup-directory)
        
        2.    - [Incremental Database Restoration
                Steps](operators_manual/day-3/create-openstack-service-backups.md#incremental-database-restoration-steps)
                
                1.  [Incremental Restoration: Create Temporary Docker
                    Container](operators_manual/day-3/create-openstack-service-backups.md#incremental-restoration-create-temporary-docker-container)
                2.  [Incremental Restoration: Prepare Backup
                    Directory](operators_manual/day-3/create-openstack-service-backups.md#incremental-restoration-prepare-backup-directory)

5.  [References](operators_manual/day-3/create-openstack-service-backups.md#references)

## Kolla Ansible and Ceph Ansible

Kolla Ansible is responsible for deploying a Private Cloud's OpenStack
services. Ceph Ansible then handles deployment of the cloud's Ceph
cluster. These two systems deploy all OpenStack and Ceph services
required for a Private Cloud, including their configurations.

### Prepare Kolla Ansible and Ceph Ansible Environment

Before working with either Kolla Ansible or Ceph Ansible, you must
prepare an environment in your shell:

  - [How to Prepare and Use Kolla
    Ansible](operators_manual/day-4/kolla-ansible/kolla-ansible.md)
  - [How to Prepare and Use Ceph
    Ansible](operators_manual/day-4/ceph-ansible/ceph-ansible.md)

### Where are my Private Cloud's Configuration Files?

When a cloud finishes deploying, the Ansible configurations used to
deploy the cloud are exported into each of the control plane nodes
within the folders `/etc/fm-deploy` and `/etc/kolla`. This section
explains where configuration files are located and their purpose.

#### Kolla Ansible Configuration Files

The information in these files was used to deploy your Private Cloud's
core OpenStack services into Docker containers:

  - Kolla Ansible Inventory: `/etc/fm-deploy/kolla-ansible-inventory`
  - Kolla Ansible Main Configuration: `/etc/kolla/globals.yml`

#### Ceph Ansible Configuration Files

The information in these files was used to deploy your Private Cloud's
Ceph cluster:

  - Ceph Ansible Inventory: `/etc/fm-deploy/ceph-inventory.yml`
  - Ceph Ansible Main Configuration: `/etc/fm-deploy/ceph-vars.yml`

#### FM-Deploy Configuration File

FM-Deploy is a part of the system used to deploy your Private Cloud.
Information about this deployment system is provided for the sake of
completely explaining the configuration files found within
`/etc/fm-deploy`.

  - FM-Deploy Main Configuration: `/etc/fm-deploy/config.yml`

#### Network Ansible Configuration File

The following defines the initial networking configuration for your
Private Cloud. This file was used upon initial cloud deployment.

  - Inventory: `/etc/fm-deploy/network-inventory.yml`

### Keep a Backup Copy a Private Cloud's Configuration Files

In case something unexpected happens to these files, you should keep
copies of them off site. To preserve the configuration of OpenStack
services and Ceph, copy the directories `/etc/fm-deploy`, `/etc/kolla`
and `/etc/ceph` somewhere outside of the cloud, in a secure, private
location. These folders contain sensitive information about your cloud
so the information within should only be accessible to those you trust
or yourself.

## How to Restore a Private Cloud's Configuration Files

There are two primary ways a Private Cloud's configuration file can be
restored: Copy a known good configuration file from an off site location
or use Ansible. This section explains how you can use Kolla Ansible and
Ceph Ansible to recover a Private Cloud's configuration files.

### Example: Recover Neutron's Configuration File using Kolla Ansible

For example, consider an event where one of your control plane nodes
loses its Neutron server configuration file. This section explains how
to recover this configuration by using Kolla Ansible.

#### Prerequisite: Prepare a Kolla Ansible Environment

Before proceeding, a Kolla Ansible environment needs to be prepared. For
information about preparing a Kolla Ansible environment, see [How to
Prepare and Use Kolla
Ansible](operators_manual/day-4/kolla-ansible/kolla-ansible.md). Once
the environment is prepared, navigate back to this section.

#### Regenerate an OpenStack Service's Configuration File using Kolla Ansible

In this example, we outline restoring the Neutron server configuration
file for the control plane node `relaxed-flamingo`.

In the Kolla Ansible inventory file,
`/etc/fm-deploy/kolla-ansible-inventory`, the following hosts are
defined as control plane nodes under the heading `[control]`:

    [control]
    relaxed-flamingo ansible_host=10.204.28.7
    focused-capybara ansible_host=10.204.30.158
    lovely-ladybug ansible_host=10.204.25.253

To restore the Neutron server configuration file for `relaxed-flamingo`,
first ensure you have [prepared a Kolla Ansible
environment](operators_manual/day-4/kolla-ansible/kolla-ansible.md).

Next, use Kolla Ansible's `reconfigure` function, targeting only the
Neutron service by using the flag `--tags neutron` and limit the run to
the host `relaxed-flamingo` by specifying the flag `--limit control[0]`.

For example:

    kolla-ansible \
        -i /etc/fm-deploy/kolla-ansible-inventory \
        reconfigure \
        --tags neutron \
        --limit control[0]

## Create Full and Incremental Copies of a Private Cloud's OpenStack Service Databases

Kolla Ansible provides a utility to create copies of all OpenStack
service databases, called `mariadb_backup`. In this section, we explain
how to use Kolla Ansible's builtin function to create database backups
of a Private Cloud's OpenStack services.

### Prerequisites

Before proceeding with this guide, a Kolla Ansible environment needs to
be prepared. For information about preparing a Kolla Ansible
environment, see [How to Prepare and Use Kolla
Ansible](operators_manual/day-4/kolla-ansible/kolla-ansible.md). Once
the environment is prepared, come back to this guide to learn how to
create database backups of OpenStack services.

### How to Create OpenStack Service Database Backups

The following instruction must be performed from the folder in which you
have prepared Kolla Ansible. This section first provides the command
syntax, then follows up with an example of the command's execution and
output. Note that Kolla Ansible has no way to schedule backups.

#### Command Syntax for Full Database Backups

The command to perform a full backup of all databases using Kolla
Ansible is...:

    kolla-ansible -i <inventory> mariadb_backup

...where `<inventory>` is the path to the Kolla Ansible inventory file.

#### Command Syntax for Incremental Database Backups

The command to perform an incremental backup of all databases using
Kolla Ansible is...:

    kolla-ansible -i <inventory> mariadb_backup --incremental

...where `<inventory>` is the path to the Kolla Ansible inventory file.

#### Path to the Kolla Ansible Inventory File

The Kolla Ansible inventory file is located across all control plane
nodes as:

    /etc/fm-deploy/kolla-ansible-inventory

#### Command Usage Example for a Full Database Backup

From the host that has Kolla Ansible prepared, the following command is
executed:

    kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup

Truncated output of the above command:

    # kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup
    Backup MariaDB databases : ansible-playbook -i /etc/fm-deploy/kolla-ansible-inventory -e @/etc/kolla/globals.yml  -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  -e kolla_action=backup -e mariadb_backup_type=full /opt/kolla-ansible/.venv/share/kolla-ansible/ansible/mariadb_backup.yml
    
    [...previous output truncated...]
    
    TASK [mariadb : Taking full database backup via Mariabackup] **************************************************************************************************
    skipping: [focused-capybara]
    skipping: [lovely-ladybug]
    [WARNING]: The value False (type bool) in a string field was converted to 'False' (type string). If this does not look like what you expect, quote the entire
    value to ensure it does not change.
    changed: [relaxed-flamingo]
    
    PLAY RECAP ****************************************************************************************************************************************************
    focused-capybara           : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    lovely-ladybug             : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    relaxed-flamingo           : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

The task `[mariadb : Taking full database backup via Mariabackup]` is
where a backup of all OpenStack service databases is created. Kolla
Ansible creates a Docker volume called `mariadb_backup` to store the
database copies. Previous backups made using this method are not
overwritten. The host under this task that reports a change (example:
`changed=1`) is where the Docker volume storing the databases is
created.

**Note\!** -- For this example, since the Docker volume was created on
another host, the remaining instruction in this guide must be performed
from that host. If Kolla Ansible creates `mariadb_backup` on another
host, you must SSH into that host as root to continue this process.

#### Command Usage Example for an Incremental Database Backup

**Note\!** -- Incremental backups can only be made if a full backup has
been made prior, otherwise the following command will result in an
error.

From the host that has Kolla Ansible prepared, the following command is
executed:

    kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup \
        --incremental

Truncated output of the above command:

    # kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup --incremental
    Backup MariaDB databases : ansible-playbook -i /etc/fm-deploy/kolla-ansible-inventory -e @/etc/kolla/globals.yml  -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  -e kolla_action=backup -e mariadb_backup_type=incremental /opt/kolla-ansible/.venv/share/kolla-ansible/ansible/mariadb_backup.yml
    
    [...previous output truncated...]
    
    TASK [mariadb : include_tasks] ****************************************************************************************************************************************************************
    included: /opt/kolla-ansible/.venv/share/kolla-ansible/ansible/roles/mariadb/tasks/backup.yml for relaxed-flamingo, focused-capybara, lovely-ladybug
    
    TASK [mariadb : Taking incremental database backup via Mariabackup] ***************************************************************************************************************************
    skipping: [focused-capybara]
    skipping: [lovely-ladybug]
    [WARNING]: The value False (type bool) in a string field was converted to 'False' (type string). If this does not look like what you expect, quote the entire value to ensure it does not
    change.
    changed: [relaxed-flamingo]
    
    PLAY RECAP ************************************************************************************************************************************************************************************
    focused-capybara           : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    lovely-ladybug             : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    relaxed-flamingo           : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

The task `[mariadb : Taking incremental database backup via
Mariabackup]` is where an incremental backup of all OpenStack service
databases is created. Kolla Ansible creates a Docker volume called
`mariadb_backup` to store the database copies. Previous backups made
using this method are not overwritten. The host under this task that
reports a change (example: `changed=1`) is where the Docker volume
storing the databases is created.

**Note\!** -- For this example, since the Docker volume was created on
another host, the remaining instruction in this guide must be performed
from that host. If Kolla Ansible creates `mariadb_backup` on another
host, you must SSH into that host as root to continue this process.

## How to Restore a Private Cloud's OpenStack Service Databases

This section explains how to restore both **full** and **incremental**
database backups created using Kolla Ansible's `mariadb_backup`
function.

### Full Database Restoration Steps

Follow these steps to learn how to restore full OpenStack service
databases created using Kolla Ansible's `mariadb_backup` function.

#### Full Restoration: Create Temporary Docker Container

In this section, we create a temporary Docker container called
`dbrestore`. This container is created with the same volumes as the
`mariadb` Docker container. The `mariadb_backup` Docker volume is
mounted as `/backup` in this container. Finally, the container is
created using the `kolla/centos-binary-mariadb:victoria` Docker image
available from Docker Hub with a Bash shell.

Create the temporary Docker container called `dbrestore` using:

    docker run --rm -it --volumes-from mariadb --name dbrestore \
        --volume mariadb_backup:/backup \
        kolla/centos-binary-mariadb:victoria \
        /bin/bash

Once you run the above Docker command, your terminal should appear this
way:

    ()[mysql@06ab93fb83a3 /]$

#### Full Restoration: Prepare Backup Directory

**Caution\!** -- Be careful when using commands. The following commands
make use of the `rm` command which deletes files.

Next, the backup data must be prepared before it can be copied into
place.

This example uses a full MariaDB backup called
`mysqlbackup-08-12-2021-1638999340.qp.xbc.xbs.gz`.

To prepare the backup data, in the Docker container, run:

    cd /backup
    rm -rf /backup/restore
    mkdir -p /backup/restore/full
    gunzip mysqlbackup-08-12-2021-1638999340.qp.xbc.xbs.gz
    mbstream -x -C /backup/restore/full/ < mysqlbackup-08-12-2021-1638999340.qp.xbc.xbs
    mariabackup --prepare --target-dir /backup/restore/full

Load another shell session for the node in which you are working and
stop the MariaDB Docker container:

    docker stop mariadb

Navigate back to the Docker container and run:

    rm -rf /var/lib/mysql/*
    rm -rf /var/lib/mysql/\.[^\.]*
    mariabackup --copy-back --target-dir /backup/restore/full

Next, navigate back to the other shell and start the MariaDB Docker
container:

    docker start mariadb

Examine MariaDB's logs to confirm the Galera cluster has synchronized:

    # tail -1 /var/log/kolla/mariadb/mariadb.log
    2021-12-08 22:27:39 2 [Note] WSREP: Synchronized with group, ready for
    connections

### Incremental Database Restoration Steps

Follow these steps to learn how to restore an incremental OpenStack
service database backup created using Kolla Ansible's `mariadb_backup`
function.

#### Incremental Restoration: Create Temporary Docker Container

In this section, we create a temporary Docker container called
`dbrestore`. This container is created with the same volumes as the
`mariadb` Docker container. The `mariadb_backup` Docker volume is
mounted as `/backup` in this container. Finally, the container is
created using the `kolla/centos-binary-mariadb:victoria` Docker image
available from Docker Hub with a Bash shell.

Create the temporary Docker container called `dbrestore` using:

    docker run --rm -it \
        --volumes-from mariadb \
        --name dbrestore \
        --volume mariadb_backup:/backup \
        kolla/centos-binary-mariadb:victoria \
        /bin/bash

Once you run the above Docker command, your terminal should appear this
way:

    ()[mysql@06ab93fb83a3 /]$

#### Incremental Restoration: Prepare Backup Directory

**Caution\!** -- Be careful when using commands. The following commands
make use of the `rm` command which deletes files.

This section assumes a full and incremental backup have been created.
Note that your full and incremental backup file names will differ from
this example.

Next, we must prepare the backup data before it can be copied into
place.

In the Docker container, run:

    cd /backup/
    rm -rf /backup/restore
    mkdir -p /backup/restore/full
    mkdir -p /backup/restore/incremental
    gunzip mysqlbackup-10-12-2021-1639166052.qp.xbc.xbs.gz
    gunzip incremental-20-mysqlbackup-10-12-2021-1639169695.qp.xbc.xbs.gz
    mbstream -x -C /backup/restore/full/ < mysqlbackup-10-12-2021-1639166052.qp.xbc.xbs
    mbstream -x -C /backup/restore/incremental/ < incremental-20-mysqlbackup-10-12-2021-1639169695.qp.xbc.xbs
    mariabackup --prepare --target-dir=/backup/restore/full/
    mariabackup --prepare --target-dir=/backup/restore/full/ --incremental-dir=/backup/restore/incremental/

Load another shell session for the node in which you are working and
stop the MariaDB Docker container:

    docker stop mariadb

Navigate back to the Docker container and run:

    rm -rf /var/lib/mysql/*
    rm -rf /var/lib/mysql/\.[^/.]*
    mariabackup --copy-back --target-dir /backup/restore/full/

Next, navigate back to the other shell and start the MariaDB Docker
container:

    docker start mariadb

Examine MariaDB's logs to confirm the Galera cluster has synchronized:

    # tail -1 /var/log/kolla/mariadb/mariadb.log
    2021-12-08 22:27:39 2 [Note] WSREP: Synchronized with group, ready for
    connections

## References

  - Kolla Ansible's [MariaDB database backup and
    restore](https://docs.openstack.org/kolla-ansible/victoria/admin/mariadb-backup-and-restore.html)
  - MariaDB's [Full Backup and Restore with
    Mariabackup](https://mariadb.com/kb/en/full-backup-and-restore-with-mariabackup/)
  - MariaDB's [Incremental Backup and Restore with
    Mariabackup](https://mariadb.com/kb/en/incremental-backup-and-restore-with-mariabackup/)
