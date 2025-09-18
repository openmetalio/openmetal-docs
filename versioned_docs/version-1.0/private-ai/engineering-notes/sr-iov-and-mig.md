---
slug: /private-ai/engineering-notes/sr-iov-and-mig
description: Understand how to enable SR-IOV and configure NVIDIA Multi-Instance GPU (MIG) mode on A100 for secure and isolated GPU partitioning.
sidebar_position: 3
---

# SR-IOV and Multi-Instance GPU (MIG) Setup for A100 in Private Cloud

Modern GPU workloads benefit from hardware partitioning that enables multiple
workloads or tenants to share a physical GPU securely. The A100 GPU from NVIDIA
supports both Single Root I/O Virtualization (SR-IOV) and Multi-Instance GPU
(MIG). This article outlines how to configure these features for use in a private
cloud environment running OpenStack.

## What Is SR-IOV?

SR-IOV allows a single physical PCIe device to expose multiple Virtual Functions
(VFs). Each VF operates as an independent device with direct I/O access. When
applied to GPUs, SR-IOV enables virtual machines (VMs) to access GPU resources
efficiently without emulation.

To enable SR-IOV on a system with an A100 GPU:

Step 1: Verify BIOS/UEFI settings:

- Enable **SR-IOV**
- Enable **VT-d** (Intel) or **AMD-Vi/IOMMU** (AMD)

Step 2: Enable virtual functions:

```bash
echo 1 > /sys/bus/pci/devices/0000:81:00.0/sriov_numvfs
```

Step 3: Confirm:

```bash
lspci -nn | grep -i nvidia
```

This exposes VFs on the GPU that can be passed through to virtual machines via
OpenStack Nova or other virtualization layers.

## What Is MIG?

MIG enables partitioning a single A100 GPU into multiple hardware-isolated GPU
instances. Each instance has its own:

- Dedicated streaming multiprocessors (SMs)
- Isolated L2 cache and memory bandwidth
- Fault-isolated execution path

This ensures predictable performance and fault isolation across workloads,
making MIG suitable for secure multi-tenant environments or parallel AI
inference tasks.

Each A100 GPU can support up to seven 1g.5gb MIG instances, depending on the
profile used.

## Enabling MIG Mode

Enable MIG mode on the GPU using nvidia-smi:

```bash
sudo nvidia-smi -i 0 -mig 1
```

You can verify the change with:

```bash
nvidia-smi -i 0 --query-gpu=mig.mode.current --format=csv
```

MIG must be enabled on each GPU individually. On Ampere architecture GPUs, this
setting is persistent across reboots.

## Creating MIG Instances

To allocate GPU slices for specific workloads, create MIG profiles using the
following command:

```bash
sudo nvidia-smi mig -cgi 19 -C
```

This command creates a GPU instance using profile ID `19`, which corresponds to
the **MIG 1g.5gb** profile on A100 (1/8 memory and 1/7 SMs). Other profile IDs support
larger memory and compute slices.

List the available profiles with:

```bash
nvidia-smi mig -lgip
```

And verify created instances:

```bash
nvidia-smi mig -lgi
```

Each MIG instance can be treated like a separate GPU device. These instances are
usable by containers, VMs, or native applications through the standard CUDA interface.

## Considerations for OpenStack Integration

In OpenStack Nova, MIG profiles can be exposed as **mediated devices (mdev)**. This
allows them to be scheduled and assigned through Nova flavors. To enable this:

Configure `nova.conf`:

Step 1:

```ini
[devices]
enabled_mdev_types = nvidia-476
```

Step 2:
Restart the nova-compute service.

Step 3:
Create custom flavors with resources:VGPU=1.

Each flavor can be tied to a specific MIG profile depending on the resource
isolation required.

## Use Cases

MIG provides predictable resource partitioning and is well-suited for:

- Multi-tenant AI inference platforms
- Isolated training environments
- Batch inferencing with fixed latency requirements
- CI/CD testing of AI models in parallel

SR-IOV complements MIG by allowing full-device access or additional partitioning
mechanisms when MIG is unavailable or unnecessary.

## Next Steps

After setting up MIG, the next step involves integrating these GPU instances
with OpenStack Nova and launching virtual machines equipped with virtual GPUs.
That will be covered in the next article.

OpenMetal environments support both SR-IOV and MIG configurations, enabling
organizations to deploy secure, scalable AI workloads on fully dedicated GPU hardware.
