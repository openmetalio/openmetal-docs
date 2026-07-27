---
id: fix-windows-secure-boot-access-denied-openstack-kolla-ovmf
title: "Fix Windows Secure Boot Access Denied Boot Failure on OpenStack"
sidebar_label: "Fix Windows Secure Boot Access Denied (OVMF Update)"
description: "Resolve UEFI Secure Boot Access Denied and No bootable option or device was found errors on Windows instances in OpenStack Kolla Ansible deployments by updating the OVMF/edk2 firmware inside the nova_libvirt container."
keywords:
  - windows secure boot access denied
  - openstack windows vm not booting
  - ovmf secure boot security violation
  - kolla ansible nova_libvirt ovmf update
  - windows uefi ca 2023
  - bdsdxe no bootable option or device was found
  - edk2 firmware update kvm
  - qemu ovmf windows server 2025
  - openstack uefi secure boot
tags:
  - openstack
  - kolla-ansible
  - nova
  - libvirt
  - windows
  - secure-boot
  - uefi
  - ovmf
  - edk2
  - troubleshooting
---

## Symptom

A Windows instance with UEFI Secure Boot enabled fails to boot. The console
shows:

```text
BdsDxe: failed to load Boot0001 "UEFI Misc Device" from PciRoot(0x0)/Pci(0x2,0x3)/Pci(0x0,0x0): Access Denied
BdsDxe: failed to start Boot0002 "EFI Internal Shell" ... : Security Violation
BdsDxe: No bootable option or device was found.
BdsDxe: Press any key to enter the Boot Manager Menu.
```

The instance's domain XML shows the Secure Boot firmware pair in use:

```xml
<loader readonly='yes' secure='yes' type='pflash'>/usr/share/OVMF/OVMF_CODE_4M.ms.fd</loader>
<nvram template='/usr/share/OVMF/OVMF_VARS_4M.ms.fd'>/var/lib/libvirt/qemu/nvram/instance-XXXXXXXX_VARS.fd</nvram>
```

## Root Cause

The OVMF (edk2) firmware shipped in the `nova_libvirt` container image
predates Microsoft's Secure Boot certificate transition (Windows UEFI CA
2023, part of the CVE-2023-24932 / BlackLotus mitigations). Current Windows
releases (Windows Server 2025, fully patched Server 2022, current Windows
11) ship a boot manager signed with the 2023 CA. The old firmware's
enrolled certificate store does not trust that signer, so signature
validation fails and the firmware refuses to start the Windows boot
manager. Secure Boot is working as designed against an outdated trust
list.

Two components matter and both must be updated:

- `OVMF_CODE_4M.ms.fd`, the firmware code.
- `OVMF_VARS_4M.ms.fd`, the variables **template** containing the enrolled
  certificates and dbx. Each instance gets a per-instance copy
  (`instance-XXXXXXXX_VARS.fd`) stamped from this template **at creation
  time**, so updating the package alone does not fix an existing instance
  until its VARS file is regenerated.

## Prerequisites

- Root SSH access to the affected compute node(s).
- OpenStack admin CLI access.
- Identify the compute host and libvirt instance name:

```bash
openstack server show <uuid> \
  -c OS-EXT-SRV-ATTR:host -c OS-EXT-SRV-ATTR:instance_name -c status
```

- Confirm the current (old) firmware version inside the container:

```bash
docker exec nova_libvirt dpkg -l ovmf | tail -1
docker exec nova_libvirt ls -lL /usr/share/OVMF/OVMF_CODE_4M.ms.fd
```

If the package is already the updated build, this procedure will not
help. Investigate the guest bootloader instead.

## Procedure

### 1. Back up the instance NVRAM and domain XML

The libvirt data lives in the `libvirtd` Docker volume on the host. Verify
the mount with:

```bash
docker inspect nova_libvirt \
  --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'
```

Then take the backups:

```bash
docker exec nova_libvirt virsh dumpxml instance-XXXXXXXX > /root/instance-XXXXXXXX.xml.bak
cp /var/lib/docker/volumes/libvirtd/_data/qemu/nvram/instance-XXXXXXXX_VARS.fd /root/
```

### 2. Download the updated ovmf package on the compute host

Use the current updated build from the Ubuntu noble archive. Check the
[Ubuntu edk2 package pool](https://archive.ubuntu.com/ubuntu/pool/main/e/edk2/)
for the latest `ovmf_2024.02-*` revision:

```bash
cd /tmp
curl -LO https://archive.ubuntu.com/ubuntu/pool/main/e/edk2/ovmf_2024.02-2ubuntu0.9_all.deb

# sanity check: should be ~4.9M, not an HTML error page
ls -lh /tmp/ovmf_2024.02-2ubuntu0.9_all.deb
```

:::note

Avoid the `ovmf_2025.11-*` package. It is a small transitional
metapackage; the firmware moved to `ovmf-generic` with a changed file
layout.

:::

### 3. Install the package inside the `nova_libvirt` container

```bash
docker cp /tmp/ovmf_2024.02-2ubuntu0.9_all.deb nova_libvirt:/tmp/
docker exec nova_libvirt apt install -y /tmp/ovmf_2024.02-2ubuntu0.9_all.deb
```

If `apt` refuses due to the container's older base release, force it with
`dpkg`. The package is architecture-independent firmware blobs with no
meaningful dependencies:

```bash
docker exec nova_libvirt dpkg -i /tmp/ovmf_2024.02-2ubuntu0.9_all.deb
```

### 4. Verify the firmware actually changed

```bash
docker exec nova_libvirt dpkg -l ovmf | tail -1
docker exec nova_libvirt ls -lL /usr/share/OVMF/OVMF_CODE_4M.ms.fd /usr/share/OVMF/OVMF_VARS_4M.ms.fd
```

Expected: version `2024.02-2ubuntu0.9` and current-year timestamps on the
dereferenced files (the old build shows `Feb 12 2024`). For a definitive
check, compare `md5sum` of the container files against a local `dpkg -x`
extract of the same deb.

### 5. Remove the affected instance's stale NVRAM file

The existing VARS file still carries the old certificate store and must be
regenerated from the updated template:

```bash
rm -f /var/lib/docker/volumes/libvirtd/_data/qemu/nvram/instance-XXXXXXXX_VARS.fd
```

The backup from step 1 remains in `/root/`.

### 6. Power cycle the instance through Nova

```bash
openstack server reboot --hard <uuid>
```

Use `openstack server start <uuid>` instead if the instance is `SHUTOFF`.
Either way, Nova regenerates the domain XML and libvirt recreates the VARS
file from the updated template.

:::caution

Do not start the instance with `virsh start` directly. Nova's power-state
sync task will shut down instances it believes should be stopped, and Nova
regenerates the domain XML on its next lifecycle operation, discarding any
manual libvirt changes.

:::

### 7. Verify boot

Watch the instance console. The firmware should pass `BdsDxe` validation
and hand off to the Windows boot manager (spinning dots) instead of
printing `Access Denied`.

### 8. Clean up

```bash
docker exec nova_libvirt rm /tmp/ovmf_2024.02-2ubuntu0.9_all.deb
rm /tmp/ovmf_2024.02-2ubuntu0.9_all.deb
```

Repeat steps 2-4 and 8 on every compute node in the cluster so future
Secure Boot instances land on fixed firmware regardless of scheduling.

## Rollback

```bash
# stop the VM if running
docker exec nova_libvirt virsh destroy instance-XXXXXXXX

# restore original domain XML and NVRAM
docker exec -i nova_libvirt virsh define /dev/stdin < /root/instance-XXXXXXXX.xml.bak
cp /root/instance-XXXXXXXX_VARS.fd \
   /var/lib/docker/volumes/libvirtd/_data/qemu/nvram/instance-XXXXXXXX_VARS.fd

# let Nova re-assert its canonical config
openstack server reboot --hard <uuid>
```

## Caveats and Follow-ups

- **The in-container package install does not survive container
  recreation.** A `kolla-ansible deploy` or `upgrade` that recreates
  `nova_libvirt` reverts to the firmware baked into the image, and
  affected instances will break again on their next VARS regeneration.
  The durable fix is rebuilding the `nova_libvirt` image with the updated
  `ovmf` package and rolling it fleet-wide. Track this as a follow-up
  whenever this procedure is used.
- **Already-running instances are unaffected until their next power
  cycle.** They keep the old firmware in memory and their old VARS on
  disk. Only instances that fail validation need the VARS-delete plus
  reboot treatment; healthy ones can be left alone.
- **BitLocker:** regenerating the VARS file changes the measured boot
  state. A guest with BitLocker bound to Secure Boot measurements may
  prompt for its recovery key on first boot after the change. Confirm key
  availability with the customer before touching VARS on a production
  Windows instance.
- **Sidestep:** if the customer does not require Secure Boot, set
  `os_secure_boot=disabled` on the image and rebuild, or edit
  `image_os_secure_boot` in the instance's `instance_system_metadata`
  (Nova DB) followed by a stop/start.

## References

- [Windows Secure Boot certificate expiration and CA updates](https://support.microsoft.com/en-us/topic/windows-secure-boot-certificate-expiration-and-ca-updates-7ff40d33-95dc-4c3c-8725-a9b95457578e)
- [Act now: Secure Boot certificates expire in June 2026](https://techcommunity.microsoft.com/blog/windows-itpro-blog/act-now-secure-boot-certificates-expire-in-june-2026/4426856)
- [Windows Server Secure Boot playbook for certificates expiring in 2026](https://techcommunity.microsoft.com/blog/windowsservernewsandbestpractices/windows-server-secure-boot-playbook-for-certificates-expiring-in-2026/4495789)
- [KB5025885: Windows Boot Manager revocations for CVE-2023-24932](https://support.microsoft.com/en-us/topic/kb5025885-how-to-manage-the-windows-boot-manager-revocations-for-secure-boot-changes-associated-with-cve-2023-24932-41a975df-beb2-40c1-99a3-b3ff139f832d)
- [Enterprise Deployment Guidance for CVE-2023-24932](https://support.microsoft.com/en-us/topic/enterprise-deployment-guidance-for-cve-2023-24932-88b8f034-20b7-4a45-80cb-c6049b0f9967)
