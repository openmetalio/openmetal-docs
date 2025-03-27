---
slug: /private-ai/engineering-notes/install-grid-driver-vgpu
description: Install NVIDIA GRID guest drivers in VMs to enable vGPU and MIG device access, with guidance on validation and troubleshooting.
sidebar_position: 5
---

# Installing and Managing NVIDIA GRID Drivers for Virtual GPU (vGPU) Deployments

To enable virtual machines to recognize and use NVIDIA vGPUs or MIG-backed
devices, the correct driver must be installed inside the guest operating system.
This article covers the process of installing the **NVIDIA GRID guest driver**,
verifying GPU access, and managing vGPU behavior in virtualized environments.

## When Are GRID Drivers Needed?

The GRID guest driver is required whenever a VM is attached to a virtual GPU
resource—whether via SR-IOV, full vGPU, or MIG-based mediated devices. These
drivers expose the assigned GPU slice as a usable compute device within the VM,
allowing AI/ML and other GPU-accelerated applications to execute as expected.

## Obtaining the GRID Guest Driver

The NVIDIA GRID guest drivers are separate from standard GPU drivers.
They are available through the **NVIDIA Enterprise portal** and require a
supported license.

Choose the version that corresponds to:

- Your GPU (e.g., A100)
- Your hypervisor (e.g., KVM for OpenStack)
- Your guest OS (e.g., Ubuntu, RHEL, Windows)

Note: OpenMetal customers using MIG do not require an active GRID license for
Linux compute workloads unless display features or Windows guests are required.

## Installing the Driver in a Linux VM

Upload the driver to the guest VM.

Install required packages:

```bash
sudo apt update
sudo apt install build-essential dkms
```

Run the installer:

```bash
chmod +x NVIDIA-Linux-x86_64-<version>.run
sudo ./NVIDIA-Linux-x86_64-<version>.run
```

Follow prompts to build and install the kernel module.

Once installed, reboot the VM and run:

```bash
nvidia-smi
```

The output should list the assigned vGPU or MIG device, along with available
memory and driver version.

## Common Validation Commands

Verify vGPU visibility:

```bash
lspci | grep -i nvidia
```

Confirm CUDA devices:

```bash
nvidia-smi -L
```

Check which profile is assigned:

```bash
cat /proc/driver/nvidia/gpus/0000:00:04.0/information
```

This information can be matched with MIG or SR-IOV profile types created on the host.

## Monitoring GPU Utilization

Within the VM, you can monitor GPU memory usage and activity:

```bash
watch -n1 nvidia-smi
```

This is useful for tracking inference loads, batch jobs, and application
performance metrics.

For more detailed telemetry, use NVIDIA DCGM or integrate GPU metrics into
existing observability pipelines (e.g., Prometheus with exporters).

## Managing vGPU Drivers at Scale

In large deployments:

- Build golden images that include the GRID driver

- Use cloud-init or config management tools (e.g., Ansible) to install drivers
  at boot

- Tag flavors with driver version compatibility to avoid mismatches between MIG
configuration and guest environment

If you rebuild MIG instances on the host or change profiles, verify that VMs
retain compatible drivers or rebuild as needed.

## Operational Notes

- GRID guest drivers are tied to specific kernel versions. After a kernel update,
drivers may need to be reinstalled or rebuilt.

- Incompatible driver versions can prevent VMs from booting or accessing GPU resources.

- In Linux guests, Secure Boot must be disabled or driver signing must be enabled.

## Next Steps

With the driver installed and the VM successfully connected to a GPU partition,
the next article will cover **Monitoring, Scheduling, and Performance Management
of Virtual GPUs** in OpenStack environments.

OpenMetal’s infrastructure supports GPU virtualization at scale, giving users
full control over driver versions, kernel behavior, and resource allocation without
reliance on third-party GPU-as-a-service platforms.
