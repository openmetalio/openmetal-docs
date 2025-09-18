---
slug: /private-ai/engineering-notes/nvidia-driver-installation
description: Step-by-step guide to installing and validating NVIDIA GPU drivers for A100 cards, including compatibility checks and persistent mode setup.
sidebar_position: 2
---

# NVIDIA Driver Installation and Verification for A100 GPUs

The NVIDIA A100 GPU requires installation of the correct driver stack to
enable compute workloads, virtualization, and advanced features such as
Multi-Instance GPU (MIG). This article outlines the driver installation process,
along with key steps to verify operational readiness in a private cloud environment.

## Downloading the NVIDIA Driver

Obtain the latest stable production driver that supports the A100 GPU from the
official NVIDIA website or your software repository. Ensure that the driver
version matches the kernel and CUDA toolkit requirements of your environment.

For bare metal installations, OpenMetal recommends downloading the .run installer
 package for maximum control:

```shell
wget https://us.download.nvidia.com/tesla/<VERSION>/NVIDIA-Linux-x86_64-<VERSION>.run
```

Replace `<VERSION>` with the specific driver release number required for your deployment.

## Preparing the System for Installation

Before running the installer:

Stop the display manager if running a GUI environment:

```shell
sudo systemctl stop gdm
```

Blacklist the nouveau driver to prevent conflicts:

```shell
echo "blacklist nouveau" | sudo tee -a /etc/modprobe.d/blacklist-nouveau.conf
sudo update-initramfs -u
```

Reboot the system to apply changes.

Ensure that kernel headers and development packages are installed:

```shell
sudo apt install -y build-essential dkms linux-headers-$(uname -r)
```

## Installing the NVIDIA Driver

Run the installer in text mode to begin installation:

```shell
chmod +x NVIDIA-Linux-x86_64-<VERSION>.run
sudo ./NVIDIA-Linux-x86_64-<VERSION>.run --silent
```

Options during installation:

Allow the installer to compile the kernel module.

Select "yes" to install the 32-bit compatibility libraries if required by your applications.

Skip driver signing unless Secure Boot is enabled and configured.

After installation, verify that the NVIDIA kernel module is loaded:

```shell
lsmod | grep nvidia
```

## Validating the Driver and GPU Status

The primary validation tool is nvidia-smi, which provides real-time information
 about GPU status and driver installation:

```shell
nvidia-smi
```

The output should display:

- Driver version
- GPU model (A100)
- PCIe bus ID
- Memory usage
- Compute processes (if active)

Example output snippet:

```shell
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.104.12    Driver Version: 535.104.12    CUDA Version: 12.2   |
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
|  0   A100-PCIE-40GB     On    | 00000000:81:00.0 Off |                    0 |
+-----------------------------------------------------------------------------+
```

Use the following command to check for available Multi-Instance GPU profiles if
planning to configure MIG:

```shell
nvidia-smi mig -lgip
```

## Verifying PCIe Performance

Confirm the GPU is linked at the correct PCIe generation and width to avoid
performance bottlenecks:

```shell
sudo nvidia-smi topo --matrix
```

This output provides insight into interconnect bandwidth, which is critical for
high-throughput AI/ML workloads.

## Enabling Persistent Mode (Optional)

For environments where GPU power cycling is undesired, enable persistence mode
to keep the GPU initialized:

```shell
nvidia-smi -pm 1
```

Persistence mode is recommended for systems running continuous or long-duration workloads.

## Next Steps

With the driver installed and verified, the system is ready to support A100
workloads. The next phase involves configuring SR-IOV and Multi-Instance GPU (MIG)
 features for fine-grained resource sharing and workload isolation.

OpenMetal's private cloud platforms are built to support full GPU virtualization,
 allowing customers to run AI/ML workloads with dedicated hardware performance and
 predictable resource availability.
