---
sidebar_position: 7
---
# How to Update Kolla images

Updating your cloud's Kolla images is an important part of improving the
security of your OpenStack cloud. Improvements, bug fixes, and security patches
for OpenStack services are also a benefit of updating your cloud's images.

## Prepare Kolla Ansible

To update the Kolla images, first [prepare your Kolla Ansible environment](../day-4/kolla-ansible/prepare-kolla-ansible.md).

## Freeze changes to cloud

Make sure the OpenStack service databases are not modified during this
maintenance window. This includes things like creating/deleting VMs, networks,
routers, etc.

## Backup OpenStack databases

Back up your cloud's MariaDB databases, just in case.

```sh
kolla-ansible -i inventory.yml -i ansible/inventory/multinode mariadb_backup
```

## Pull images

Pull in updated Kolla images. You can confirm when image updates are available
by visiting [Kolla Image Build History](/kolla-image-update/build-history).

```sh
kolla-ansible -i inventory.yml -i ansible/inventory/multinode pull
```

## Kolla deploy-containers

Deploy updated containers.

```sh
kolla-ansible -i inventory.yml -i ansible/inventory/multinode deploy-containers
```

## (Optional) MariaDB recovery

If you run into issues with MariaDB containers not starting up during the
deployment of containers, you can try recovering MariaDB.

```sh
kolla-ansible -i inventory.yml -i ansible/inventory/multinode mariadb_recovery
```
