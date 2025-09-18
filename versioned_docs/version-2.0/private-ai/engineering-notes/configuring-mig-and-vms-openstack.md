---
slug: /private-ai/engineering-notes/configuring-mig-and-vms-openstack
description: Learn how to configure MIG profiles and launch virtual machines in OpenStack with GPU-backed resources using mediated devices.
sidebar_position: 4
---

# Configuring MIG Profiles and Launching VMs with OpenStack

Once MIG mode is enabled on an NVIDIA A100 GPU and instances are created, the
next step is to integrate those GPU instances into an OpenStack environment.
This allows virtual machines to access specific GPU partitions with hardware-level
isolation. This article outlines the steps to configure MIG profiles and deploy VMs
with virtual GPUs in OpenStack Nova.

## Creating MIG Profiles

Each MIG profile defines a specific slice of GPU memory and compute resources. On
an A100 40GB GPU, a typical profile might be `1g.5gb`, which offers one-seventh of
the compute and 5GB of memory.

To create MIG instances:

```bash
sudo nvidia-smi mig -cgi 19,19,19 -C
```

This command creates three instances of profile ID 19 (i.e., three 1g.5gb instances).
To list available profiles and their IDs:

```bash
nvidia-smi mig -lgip
```

After instance creation, confirm their presence:

```bash
nvidia-smi mig -lgi
```

Each GPU Instance (GI) includes a Compute Instance (CI), and both are required to
execute workloads. Use the `-lci` flag to list compute instances and confirm their
allocation.

## Mapping MIG Devices for OpenStack

OpenStack treats MIG instances as mediated devices (mdevs). To expose them to Nova:

Update `nova.conf`:

```ini
[devices]
enabled_mdev_types = nvidia-476
```

Restart Nova Compute:

```bash
sudo systemctl restart nova-compute
```

Confirm mdev types are detected:

```bash
openstack resource provider list
```

Verify VGPU availability:

```bash
openstack allocation candidate list --resource VGPU=1
```

This output should reflect the MIG-backed resources available to Nova schedulers.

## Defining Flavors for GPU-Backed VMs

Each VM flavor in OpenStack can include GPU traits for resource matching. For
example, to create a flavor that requests a single virtual GPU:

```bash
openstack flavor create \
  --ram 8192 \
  --disk 40 \
  --vcpus 4 \
  --property resources:VGPU=1 \
  gpu.small
```

If you want to target a specific MIG profile, additional custom traits can be
registered and used with `traits:` or `aggregate_instance_extra_specs`.

## Launching a VM with a MIG-Backed VGPU

With flavors and scheduling rules in place, deploy a VM that utilizes one of the
available MIG-backed GPU slices:

```bash
openstack server create \
  --flavor gpu.small \
  --image <image-id> \
  --network <network-id> \
  --key-name <keypair> \
  gpu-vm-01
```

Inside the guest VM, install the **NVIDIA GRID guest driver**, which is required
for vGPU device recognition. After installation, validate with:

```bash
nvidia-smi
```

The output will show the assigned MIG device and its available memory and compute
capacity.

## Managing MIG Devices

MIG instances can be destroyed and recreated dynamically:

```bash
sudo nvidia-smi mig -dci
sudo nvidia-smi mig -dgi
```

Keep in mind that MIG devices are **not persistent across system reboots** unless
recreated automatically. Use tooling such as `mig-parted` or a systemd service to
manage reinitialization on boot.

## Operational Notes

- **Isolation**: MIG provides hardware-level memory and compute isolation. This ensures
predictable performance across tenant workloads.

- **Flexibility**: You can mix different MIG profiles on a single GPU to balance
  performance and density.

- **Security**: Each MIG instance functions as a discrete device, reducing the
  risk of
cross-tenant interference.

## Next Steps

The next article will focus on **Installing and Managing NVIDIA GRID Drivers** inside
virtual machines and preparing the guest operating system to make full use of the
allocated GPU resources.

OpenMetal’s infrastructure is designed to support these advanced virtualization
features, enabling organizations to run GPU-powered workloads with full control
and without vendor lock-in.
