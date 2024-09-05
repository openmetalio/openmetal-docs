# Migrate a Ceph-backed Instance from Cloud to Cloud

Author: Ramon Grullon

This tutorial focuses on migrating a virtual machine (VM) or instance from
one OpenStack cloud environment to another. The main challenge involves ensuring
that the instance, its associated storage volumes, and network configurations
are correctly replicated in the target cloud.

## Prerequisites

1. **Ensure Access to Source and Destination OpenStack Clouds**:
   - Source and destination clouds must be running compatible OpenStack and Ceph
   versions.
   - Both clouds should have access to Ceph via the `rbd` (RADOS Block Device)
   command-line tool.
   - Preconfigured virtualenv with OpenStack CLI and `pigz` installed
   - [OpenstackCLI](../operators-manual/day-1/command-line/openstackclient)

## Considerations

- **Data Consistency**: Ensure the instance on the source cloud is powered off
during the `rbd export` process to prevent data corruption.
- **Downtime**: This method involves downtime, as the instance will need to be
stopped, exported, and recreated in the destination cloud.
- **Bandwidth**: Transferring large Ceph volumes between clouds may take time
and require significant bandwidth.
- **Automation**: You can automate parts of this process using scripts to
streamline the migration, especially if migrating multiple instances.

By following these steps, you can effectively migrate a Ceph-backed OpenStack
instance from one cloud to another via `rbd export` and Glance image import.

## Step 1: Identify the Ceph RBD Image

You need to identify the Ceph RBD image that backs the instance you want to migrate.

1. **Find the instance ID:**
  
   ```bash
   openstack server show <instance-name>
   ```

2. **Check which image or volume is attached to the instance:**
   - For an image-backed instance:
  
     ```bash
     openstack server show <instance-name> -f value -c image
     ```
  
   - For a volume-backed instance:
  
     ```bash
     openstack volume show <volume-id> -f value -c os-vol-host-attr:host
     ```

   - Confirm the volume UUID chosen if for the boot drive

3. **Identify the Ceph RBD image:**
  
   ```bash
   rbd ls <pool-name>
   ```

## Step 2: Export, Compress, and Transfer the Image in One Command

Use `rbd`, `pigz`, and `ssh` to export the image from Ceph, compress it, and
transfer it directly to the destination cloud.

```bash
rbd -p images export <image-name> - | pigz -c --fast | ssh <user>@<destination-cloud-ip> "pigz -cd > /opt/image.raw"
```

**Explanation:**

- `rbd -p <pool> export <image-name> -`: Exports the RBD image from Ceph
- `pigz - c --fast`: Compresses the image
- `ssh <user>@<destination-cloud-ip> "pigz -cd > /opt/image.raw"`:
Uses `ssh` to securely transfer the compressed image and decompress directly on
the destination cloud and save it as `image.raw

## Step 3: Upload the Image to OpenStack on the Destination Cloud

Now that the image is decompressed, upload it to the OpenStack Image service on
the destination cloud:

```bash
openstack image create --file /home/clouduser/images/image.raw --disk-format raw --container-format bare <new-image-name>
```

- Replace `<new-image-name>` with the name you want to assign to the uploaded image.
- Make sure to adjust the disk format (`raw` in this case) to match your actual
image format.

Verify the image upload:

```bash
openstack image list
```

## Step 4: Create a New Instance from the Uploaded Image

Finally, create a new instance from the uploaded image:

```bash
openstack server create --flavor <flavor-name> --image <new-image-name> --network <network-name> <new-instance-name>
```

- `<flavor-name>`: The flavor to use for the instance.
- `<new-image-name>`: The name of the newly uploaded image.
- `<network-name>`: The network where the instance will be deployed.
- `<new-instance-name>`: The name of the new instance.

Verify that the new instance is running:

```bash
openstack server list
```

## Step 5: Re-Attach Volumes (Optional)

If the instance had additional volumes attached in the source cloud, you'll need
to repeat the `rbd export` process for those volumes, upload them to Glance as
images, and then recreate or attach them to the new instance.

- Ensure that the network and flavor configurations in the destination cloud match
or are compatible with those in the source cloud.
- If the instance uses a specific security group, keypair, or volume, make sure
those resources are properly configured in the destination cloud before launching
the instance.
