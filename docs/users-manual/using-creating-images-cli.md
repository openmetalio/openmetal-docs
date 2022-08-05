---
sidebar_position: 8
---
# Manage OpenStack Images

Images in OpenStack are what powers instances. In this guide, you will
learn how to view images, upload your own, and make snapshots of images.

An image is a file that contains a bootable operating system. Many
different cloud image sources are available for download from major
operating system providers like CentOS, Ubuntu, and Debian to name a
few. You can also make your own images from
[scratch](https://docs.openstack.org/image-guide/create-images-manually.html)
or create them from volumes or running instances. Snapshots of instances
can be created which can serve both as a backup and also a template for
other instances.

-----

## List and Upload Images

### **List images**

To begin, you will learn how to list images using OpenStackClient.

-----

**Step 1** -- List images

To list available images, use:

    $ openstack image list
    +--------------------------------------+------------------------------------------------------+--------+
    | ID                                   | Name                                                 | Status |
    +--------------------------------------+------------------------------------------------------+--------+
    | 02609270-b2d7-4ee2-9e7b-450163362b57 | Amphora (x64-haproxy-ubuntu-focal)                   | active |
    | 1d6ab32b-a305-403b-9d44-5981890beccf | CentOS 7 (el7-x86_64)                                | active |
    | f2d17cda-b84d-4600-8473-111e180a5452 | CentOS 8 (el8-x86_64)                                | active |
    | d5a101ff-0870-435f-bf76-c3309e542a53 | CentOS 8 Stream (el8-x86_64)                         | active |
    | 8c8e0a35-61dd-4540-b9fd-ca36ca0ef181 | Debian 10 (buster-amd64)                             | active |
    | 00468d54-84fd-4e03-9935-aabb6b0fa60f | Debian 9 (stretch-amd65)                             | active |
    | be44af12-aa34-4b25-b4af-60a66599f442 | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | active |
    | 9a5937ff-9474-4dbe-84b4-ba452024446c | Ubuntu 18.04 (bionic-amd64)                          | active |
    | c005b6f3-9d34-4f91-94b6-1ff50c174750 | Ubuntu 20.04 (focal-amd64)                           | active |
    +--------------------------------------+------------------------------------------------------+--------+

To get more information about an image, use `openstack image show ID`:

    openstack image show ID

**ID** is the **Name** or the **ID** column in the above output.

-----

### **Show image details**

Example showing the details of an image:

    $ openstack image show fa8eb9bd-9ccc-4d3f-b87b-6edb5450a57a --fit-width
    +------------------+--------------------------------------------------------------------------------------------------+
    | Field            | Value                                                                                            |
    +------------------+--------------------------------------------------------------------------------------------------+
    | checksum         | 1d3062cd89af34e419f7100277f38b2b                                                                 |
    | container_format | bare                                                                                             |
    | created_at       | 2020-09-09T20:50:25Z                                                                             |
    | disk_format      | qcow2                                                                                            |
    | file             | /v2/images/um_fa8eb9bd-9ccc-4d3f-b87b-6edb5450a57a/file                                             |
    | id               | fa8eb9bd-9ccc-4d3f-b87b-6edb5450a57a                                                             |
    | min_disk         | 0                                                                                                |
    | min_ram          | 0                                                                                                |
    | name             | cirros                                                                                           |
    | owner            | 5ad1f9e795604f4390d274d7388c4b9f                                                                 |

### **Upload an image**

To upload an image into OpenStack, the image needs to first exist on
your machine, and then you can use OpenStackClient to upload it.

This section will walk you through uploading the
[CirrOS](https://github.com/cirros-dev/cirros) image.

-----

**Step 1** -- Download the CirrOS image

To start, first download the CirrOS image to your machine.

The [latest version of
CirrOS](https://download.cirros-cloud.net/0.5.2/cirros-0.5.2-x86_64-disk.img)
is available from their download page. Ensure the latest version of the
CirrOS image is downloaded. You can use `wget` to download the image:

    wget https://download.cirros-cloud.net/0.5.2/cirros-0.5.2-x86_64-disk.img

**Step 2** -- Upload the image into OpenStack

Use this command to upload the image, replacing variables appropriately:

    openstack image create IMAGE_NAME --container-format bare --disk-format \
    qcow2 --file PATH_TO_CIRROS_IMAGE

-----

Upload the CirrOS image:

    $ openstack image create cirros --container-format bare --disk-format
    qcow2 --file ~/Downloads/cirros-0.5.2-x86_64-disk.img

Note that **PATH\_TO\_CIRROS\_IMAGE** should be the path to the image
file.

**Step 3** -- Confirm successful upload

To confirm the image uploaded into the cloud, use `openstack image
list`.

-----

List the newly uploaded image:

    $ openstack image list
    +--------------------------------------+--------------------------------+--------+
    | ID                                   | Name                           | Status |
    +--------------------------------------+--------------------------------+--------+
    | fa8eb9bd-9ccc-4d3f-b87b-6edb5450a57a | cirros                         | active |
    +--------------------------------------+--------------------------------+--------+

-----

## **Next Steps**

With this guide complete, move on to the next guide, which explains [how to
create an Instance](create-an-instance-cli) using the command line.
