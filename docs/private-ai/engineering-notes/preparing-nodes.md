---
slug: /private-ai/engineering-notes/preparing-nodes
description: Learn how to configure bare metal nodes for NVIDIA A100 GPUs, including BIOS settings, kernel parameters, and PCI passthrough for GPU virtualization.
sidebar_position: 1
---


# Preparing Bare Metal Nodes for A100 GPU Workloads

Deploying NVIDIA A100 GPUs in a private cloud environment requires careful
preparation at the node level. Proper configuration ensures the system can fully
leverage the capabilities of the hardware while enabling advanced features such
as virtualization and multi-instance GPU partitioning. This article outlines the
steps required to prepare a bare metal node for A100 GPU workloads.

## Kernel and System Requirements

For compatibility with the A100 GPU and related technologies like SR-IOV and MIG,
 the host system must meet specific kernel and BIOS requirements. OpenMetal
 recommends using a Linux kernel version `5.4 or higher`. This ensures adequate
 support for GPU pass-through, I/O virtualization, and the necessary PCIe features.

At the kernel level, enable the following parameters for optimal operation:

```shell
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt kvm.ignore_msrs=1"
```

The `intel_iommu=on` flag activates the IOMMU, allowing the system to manage
device isolation and virtualization. The `iommu=pt` option ensures performance
is not degraded by unnecessary address translations. For AMD systems, replace
the IOMMU option accordingly:

```shell
GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt kvm.ignore_msrs=1"
```

After modifying the grub configuration, apply the changes:

```shell
sudo update-grub
```

Reboot the system to ensure the new parameters are loaded.

## PCI Passthrough and SR-IOV Enablement

SR-IOV (Single Root I/O Virtualization) is essential for deploying virtual GPU
(vGPU) instances. Enable the necessary PCIe parameters to allow the GPU to
present multiple virtual functions (VFs):

```shell
echo 1 > /sys/bus/pci/devices/0000:81:00.0/sriov_numvfs
```

Replace `0000:81:00.0` with the PCI address of the target GPU. The number of
virtual functions available depends on the GPU model and configuration.

Use the following command to validate the presence of the GPU and confirm
SR-IOV support:

```shell
lspci -nn | grep -i nvidia
```

## BIOS Configuration for Virtualization

Access the system BIOS or UEFI firmware and enable the following settings:

- **Intel VT-x** (or AMD-V)
- **VT-d** (or AMD IOMMU)
- **SR-IOV** Support
- **Above 4G Decoding**

These settings allow the hardware to support virtualization, large
memory mappings, and multiple PCI devices—a requirement for multi-GPU
workloads and partitioning.

## Operating System Preparation

Update the system and install basic tools required for NVIDIA driver installation
 and GPU management:

```shell
sudo apt update
sudo apt install -y build-essential dkms pciutils
```

Ensure that secure boot is disabled if kernel module signing is not
configured, as the NVIDIA driver installation requires building and
loading kernel modules.

## Verifying PCIe Topology and GPU Recognition

Use the lspci command to verify that the GPU is detected and mapped correctly:

```shell
lspci -nn | grep -i nvidia
```

For detailed PCIe hierarchy and bandwidth validation, run:

```shell
lspci -tv
```

This helps confirm the GPU is connected to a suitable PCIe slot providing the
required bandwidth for compute workloads.

## Next Steps

With the node configured, the next phase involves installing the NVIDIA driver
 and setting up the environment for vGPU or MIG operation. Proper installation
 of the NVIDIA software stack is critical for managing the A100 GPU and enabling
 advanced features like multi-instance partitioning.

OpenMetal provides private clouds built to support GPU-based workloads. These
environments ensure dedicated hardware access, predictable performance, and
isolation for AI/ML and high-performance computing tasks.