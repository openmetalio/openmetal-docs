# Operator's Manual v4 — Phase 2: Accuracy Pass

Date: 2026-09-11
Branch: `operators-manual-v4`
Depends on: Phase 1 (complete)

## Goal

Correct every factually wrong statement in `versioned_docs/operators-manual/` that v4
invalidated. No restructuring, no new guides, no Skyline conversion.

## Ground truth

All values verified against the live v4 demo cloud `pedantic-piranha.local`
(173.231.234.133) on 2026-09-11, not inferred from the changelog.

- Kolla image tags: `2026.1-ubuntu-noble`
- Registry prefix unchanged: `registry.flexmetal.net/kolla/`
- `neutron_plugin_agent: ovn` (globals.yml line 201)
- `cluster_interface` absent from globals.yml
- Watcher, Magnum, Aodh containers absent
- Ceph v19 Squid

All 11 replacement upstream URLs return HTTP 200 (checked 2026-09-11): the nine
`docs.openstack.org/.../2026.1/...` targets and both `docs.ceph.com/en/squid/...`
targets. Mass-replacing the version segment is therefore safe.

## Changes

### 1. OpenStack version strings

`2023.2` → `2026.1`. 18 occurrences across 8 files:

- `day-1/command-line/openstackclient.md`
- `day-1/horizon/create-user-project.md`
- `day-1/horizon/images.md`
- `day-2/maintenance.md`
- `day-3/backup-restore-openstack-databases.md`
- `day-4/kolla-ansible/enable-tls.md`
- `day-4/kolla-ansible/opensearch.md`
- `day-4/kolla-ansible/prepare-kolla-ansible.md`

The two `day-1/horizon/` files are rewritten in Phase 3. Fix them anyway — it is one
string each and costs nothing if Phase 3 slips.

### 2. Base image

`ubuntu-jammy` → `ubuntu-noble`. 8 occurrences in `day-2/maintenance.md` and
`day-3/backup-restore-openstack-databases.md`.

### 3. Ceph docs links

`docs.ceph.com/en/reef/` → `docs.ceph.com/en/squid/`:

- `day-2/check-ceph-status-disk-usage.md:42`
- `day-2/introduction-to-ceph.md:122`

### 4. Remove Watcher

Watcher is removed from the v4 base deployment.

- Delete `day-4/watcher/` entirely (`watcher-demo.md` and its `images/`)
- Remove the `_toc.md` entry `4. [OpenStack Watcher Demonstration]` and renumber the
  following Day 4 entries
- Replace the `docker ps` sample in `day-2/maintenance.md:120-125` with real v4 output
- Confirm no other file links to `watcher-demo.md`

On the `docker ps` sample: the prose immediately above it reads "each container should
reflect the status `Up`", but the current sample's only non-Watcher row is a `telegraf`
container in `Restarting (1)` state, which contradicts that sentence and is referenced
nowhere. Replace the whole block with real v4 containers in `Up` state so the sample
matches the prose.

### 5. Replace stale sample command output

These blocks show services that no longer exist. Replace with output captured from the
live v4 cloud rather than hand-edited:

**`day-4/troubleshooting/rabbitmq.md`** — the `list_queues` sample contains
`watcher.applier.control_fanout_*` and two `magnum-conductor*` queues. Replace the
sample block with real v4 output.

**`day-4/troubleshooting/log-filtering.md:40-49`** — the `ls /var/log/kolla/neutron/*.log`
sample lists OVS-era files. On v4/OVN the real listing is:

```
/var/log/kolla/neutron/dnsmasq.log
/var/log/kolla/neutron/neutron-dhcp-agent.log
/var/log/kolla/neutron/neutron-metering-agent.log
/var/log/kolla/neutron/neutron-ovn-agent.log
/var/log/kolla/neutron/neutron-ovn-maintenance-worker.log
/var/log/kolla/neutron/neutron-ovn-metadata-agent.log
/var/log/kolla/neutron/neutron-ovn-vpn-agent.log
/var/log/kolla/neutron/neutron-periodic-workers.log
/var/log/kolla/neutron/neutron-rpc-server.log
/var/log/kolla/neutron/neutron-server-uwsgi.log
/var/log/kolla/neutron/neutron-server.log
/var/log/kolla/neutron/privsep-helper.log
```

Note `neutron-l3-agent.log` and `neutron-openvswitch-agent.log` are gone. A find/replace
pass would not have caught this.

### 6. Interface variables

`day-4/kolla-ansible/prepare-kolla-ansible.md:111` — remove `cluster_interface` from the
"should not be modified" list. The variable no longer exists.

`swift_storage_interface` does not appear anywhere in the manual, so the rename to
`ceph_network_interface_cluster` needs no edit here.

## Explicitly NOT changing

**Adjective-animal hostnames stay as they are.** `encouraging-bobcat.local`,
`hardcore-rodent.local`, `comfortable-lark.local`, `lovely-ladybug.local` are
OpenMetal's generated cloud names, the same scheme that produced `pedantic-piranha.local`.
The "bobcat" is coincidence, not the OpenStack release. Renaming them is churn.

## Out of scope

- Skyline conversion of `day-1/horizon/` — Phase 3
- OVN concepts, Octavia provider limits, UFW firewall, replacing
  `day-2/manage-node-firewall-with-iptables.md` — Phase 4
- Regenerating the PDF
- Linting the frozen archives

## Verification

1. `npm run build` exits 0
2. `npm run lint` exits 0
3. `grep -rn "2023\.2" versioned_docs/operators-manual/` returns nothing
4. `grep -rn "ubuntu-jammy" versioned_docs/operators-manual/` returns nothing
5. `grep -rn "en/reef" versioned_docs/operators-manual/` returns nothing
6. `grep -rni "watcher" versioned_docs/operators-manual/` returns nothing
7. `grep -rn "magnum" versioned_docs/operators-manual/` returns nothing
8. `grep -rn "cluster_interface" versioned_docs/operators-manual/` returns nothing
9. `grep -rn "neutron-openvswitch-agent" versioned_docs/operators-manual/` returns nothing
10. `operators_versioned_docs/` is untouched — `git status --porcelain operators_versioned_docs/` is empty
11. Every changed upstream URL returns HTTP 200

## Risks

| Risk | Mitigation |
|---|---|
| Replacing a URL that 404s upstream | All 11 targets pre-verified 200; verification step 11 re-checks after edit |
| Deleting `day-4/watcher/` breaks an inbound link and fails the build | Build is the test; step 4 greps for residual references first |
| Editing the frozen v3 archive by mistake | Verification step 10 |
| `2023.2` appearing somewhere it is NOT a version | Reviewed all 18 occurrences; all are doc URLs or image tags |

## Next

Phase 3 — Skyline conversion of `day-1/`.
