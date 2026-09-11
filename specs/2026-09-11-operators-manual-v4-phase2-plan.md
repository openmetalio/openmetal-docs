# Operator's Manual v4 Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct every v4-invalidated fact in `versioned_docs/operators-manual/`, with no restructuring and no new guides.

**Architecture:** Five mechanical edit tasks, each followed by build and lint. All replacement values were captured from the live v4 cloud or verified against upstream, not inferred.

**Tech Stack:** Docusaurus 2.2.0, Node 18.20.4, markdownlint-cli 0.31.1.

**Design doc:** `specs/2026-09-11-operators-manual-v4-phase2-design.md`

**Branch:** `operators-manual-v4`. Do not merge — Nick owns merges.

---

## Context for someone with zero repo knowledge

This repo builds https://openmetal.io/docs with Docusaurus 2. There is NO unit test
framework. `npm run build` and `npm run lint` ARE the tests.

`versioned_docs/operators-manual/` is the **v4** manual (edit this).
`operators_versioned_docs/version-3.0/` is the **frozen v3 archive** (never edit this).
Phase 1 created that split. Many files exist in both; make sure you are editing the v4
copy.

The site `baseUrl` is `/docs/manuals/`. To view locally, use `npx docusaurus start`
(the README's documented flow), NOT `docusaurus serve`.

Three unrelated untracked files sit at repo root: `add-control-plane.md`,
`pcc-node-operations.md`, `remove-node-pcc.md`. **Never `git add` them.**

Do NOT merge. Do NOT push.

---

## Task 1: Version strings and base image

**Files:** 8 files under `versioned_docs/operators-manual/`

- [ ] **Step 1: Confirm the starting counts**

```bash
cd /home/nick/om/git-repos/openmetal-docs
grep -rc "2023\.2" --include=*.md versioned_docs/operators-manual/ | grep -v ':0$'
grep -rn "2023\.2" --include=*.md versioned_docs/operators-manual/ | wc -l
grep -rn "ubuntu-jammy" --include=*.md versioned_docs/operators-manual/ | wc -l
```

Expected: 18 occurrences of `2023.2`, 8 of `ubuntu-jammy`.

If the counts differ, STOP and report — the plan's premise has drifted.

- [ ] **Step 2: Replace**

```bash
cd /home/nick/om/git-repos/openmetal-docs
grep -rl "2023\.2" --include=*.md versioned_docs/operators-manual/ | xargs sed -i 's/2023\.2/2026.1/g'
grep -rl "ubuntu-jammy" --include=*.md versioned_docs/operators-manual/ | xargs sed -i 's/ubuntu-jammy/ubuntu-noble/g'
```

Scoped to `versioned_docs/operators-manual/` only. Do NOT let this touch
`operators_versioned_docs/`.

- [ ] **Step 3: Verify none remain, and the archive is untouched**

```bash
grep -rn "2023\.2\|ubuntu-jammy" --include=*.md versioned_docs/operators-manual/ || echo "CLEAN"
git status --porcelain operators_versioned_docs/
```

Expected: `CLEAN`, then NO output from the second command.

- [ ] **Step 4: Verify the rewritten upstream URLs actually resolve**

```bash
grep -rho 'https://docs\.openstack\.org/[^)  ]*2026\.1[^)  ]*' --include=*.md versioned_docs/operators-manual/ \
  | tr -d '`' | sort -u | while read u; do
  printf "%s  %s\n" "$(curl -sk -o /dev/null -w '%{http_code}' -L --max-time 20 "$u")" "$u"; done
```

Expected: every line starts with `200`. Any non-200 means that specific doc page does
not exist for 2026.1 — report it rather than reverting the whole task.

- [ ] **Step 5: Build and lint**

```bash
npm run build 2>&1 | tail -3
npm run lint && echo "LINT CLEAN"
```

Expected: `[SUCCESS] Generated static files in "build".` and `LINT CLEAN`.
The build takes 60-90s; use a timeout of at least 300000 ms.

- [ ] **Step 6: Commit**

```bash
git add versioned_docs/operators-manual
git commit -m "Update OpenStack version strings and base image for v4

2023.2 -> 2026.1 and ubuntu-jammy -> ubuntu-noble. All rewritten
upstream doc URLs verified to return HTTP 200.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Ceph docs links

**Files:**
- Modify: `versioned_docs/operators-manual/day-2/check-ceph-status-disk-usage.md:42`
- Modify: `versioned_docs/operators-manual/day-2/introduction-to-ceph.md:122`

v4 ships Ceph v19 Squid, replacing Reef.

- [ ] **Step 1: Confirm the two occurrences**

```bash
cd /home/nick/om/git-repos/openmetal-docs
grep -rn "docs\.ceph\.com/en/reef" --include=*.md versioned_docs/operators-manual/
```

Expected: exactly two lines, in the two files above.

- [ ] **Step 2: Replace**

```bash
grep -rl "docs\.ceph\.com/en/reef" --include=*.md versioned_docs/operators-manual/ \
  | xargs sed -i 's#docs\.ceph\.com/en/reef#docs.ceph.com/en/squid#g'
```

- [ ] **Step 3: Verify replaced and resolving**

```bash
grep -rn "en/reef" --include=*.md versioned_docs/operators-manual/ || echo "CLEAN"
curl -sk -o /dev/null -w "%{http_code} cephadm\n" -L --max-time 20 https://docs.ceph.com/en/squid/cephadm/
curl -sk -o /dev/null -w "%{http_code} dashboard\n" -L --max-time 20 "https://docs.ceph.com/en/squid/mgr/dashboard/"
```

Expected: `CLEAN`, then `200 cephadm` and `200 dashboard`.

- [ ] **Step 4: Commit**

```bash
git add versioned_docs/operators-manual
git commit -m "Point Ceph docs links at Squid

v4 ships Ceph v19 Squid, replacing Reef.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Remove Watcher

Watcher is removed from the v4 base deployment. Verified absent from the live v4 cloud.

**Files:**
- Delete: `versioned_docs/operators-manual/day-4/watcher/` (4 files)
- Modify: `versioned_docs/operators-manual/_toc.md`
- Modify: `versioned_docs/operators-manual/day-2/maintenance.md`

- [ ] **Step 1: Delete the directory**

```bash
cd /home/nick/om/git-repos/openmetal-docs
git rm -r versioned_docs/operators-manual/day-4/watcher/
```

Expected: removes `_category_.json`, `watcher-demo.md`, and two images.

Confirm the v3 archive still has its copy:

```bash
test -f operators_versioned_docs/version-3.0/day-4/watcher/watcher-demo.md && echo "ARCHIVE INTACT"
```

Expected: `ARCHIVE INTACT`. If not, STOP and report BLOCKED.

- [ ] **Step 2: Remove the `_toc.md` entry and renumber**

In `versioned_docs/operators-manual/_toc.md`, the Day 4 list currently reads:

```markdown
1. [How to Prepare and Use Kolla Ansible](./day-4/kolla-ansible/prepare-kolla-ansible.md)
2. [Enable TLS Using Kolla Ansible](./day-4/kolla-ansible/enable-tls.md)
3. [Security and Your OpenMetal Private Cloud](./day-4/security/security-best-practices.md)
4. [OpenStack Watcher Demonstration](./day-4/watcher/watcher-demo.md)
5. [Troubleshooting RabbitMQ](./day-4/troubleshooting/rabbitmq.md)
6. [How to Redeploy RabbitMQ using Kolla Ansible](./day-4/troubleshooting/redeploy-rabbitmq.md)
7. [Troubleshooting Ceph](./day-4/troubleshooting/ceph.md)
8. [Guidelines for Searching through Logs](./day-4/troubleshooting/log-filtering.md)
9. [OpenStack Automation through Heat](./day-4/automation/heat.md)
10. [Automate Infrastructure using Terraform](./day-4/automation/terraform.md)
```

Replace that entire list with:

```markdown
1. [How to Prepare and Use Kolla Ansible](./day-4/kolla-ansible/prepare-kolla-ansible.md)
2. [Enable TLS Using Kolla Ansible](./day-4/kolla-ansible/enable-tls.md)
3. [Security and Your OpenMetal Private Cloud](./day-4/security/security-best-practices.md)
4. [Troubleshooting RabbitMQ](./day-4/troubleshooting/rabbitmq.md)
5. [How to Redeploy RabbitMQ using Kolla Ansible](./day-4/troubleshooting/redeploy-rabbitmq.md)
6. [Troubleshooting Ceph](./day-4/troubleshooting/ceph.md)
7. [Guidelines for Searching through Logs](./day-4/troubleshooting/log-filtering.md)
8. [OpenStack Automation through Heat](./day-4/automation/heat.md)
9. [Automate Infrastructure using Terraform](./day-4/automation/terraform.md)
```

The Watcher entry is gone and items 5-10 became 4-9.

- [ ] **Step 3: Replace the `docker ps` sample in maintenance.md**

In `versioned_docs/operators-manual/day-2/maintenance.md`, replace this block:

```
    [root@smiling-pelican ~]# docker ps
    CONTAINER ID   IMAGE                                                                        COMMAND                  CREATED        STATUS                          PORTS     NAMES
    6f7590bc2191   registry.flexmetal.net/kolla/telegraf:2026.1-ubuntu-noble                    "dumb-init --single-…"   20 hours ago   Restarting (1) 14 seconds ago             telegraf
    67a4d47e8c78   registry.flexmetal.net/kolla/watcher-api:2026.1-ubuntu-noble                 "dumb-init --single-…"   3 days ago     Up 6 minutes                              watcher_api
    af815b1dcb5d   registry.flexmetal.net/kolla/watcher-engine:2026.1-ubuntu-noble              "dumb-init --single-…"   3 days ago     Up 6 minutes                              watcher_engine
    a52ab61933ac   registry.flexmetal.net/kolla/watcher-applier:2026.1-ubuntu-noble             "dumb-init --single-…"   3 days ago     Up 6 minutes                              watcher_applier
    [...output truncated...]
```

with this block (real v4 containers, all `Up`, matching the prose above it):

```
    [root@smiling-pelican ~]# docker ps
    CONTAINER ID   IMAGE                                                                        COMMAND                  CREATED        STATUS                    PORTS     NAMES
    62e119179bb4   registry.flexmetal.net/kolla/skyline-console:2026.1-ubuntu-noble             "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               skyline_console
    b3767f16dead   registry.flexmetal.net/kolla/skyline-apiserver:2026.1-ubuntu-noble           "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               skyline_apiserver
    fb570dbaae96   registry.flexmetal.net/kolla/octavia-worker:2026.1-ubuntu-noble              "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               octavia_worker
    66a3068fda74   registry.flexmetal.net/kolla/barbican-worker:2026.1-ubuntu-noble             "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               barbican_worker
    [...output truncated...]
```

Note the image tags in the "before" block already read `2026.1-ubuntu-noble` because
Task 1 rewrote them. Match on whatever is actually in the file.

- [ ] **Step 4: Verify no Watcher references remain**

```bash
grep -rni "watcher" versioned_docs/operators-manual/ || echo "NO WATCHER"
```

Expected: `NO WATCHER`

- [ ] **Step 5: Build and lint**

```bash
npm run build 2>&1 | tail -3
npm run lint && echo "LINT CLEAN"
```

Expected: `[SUCCESS] Generated static files in "build".` and `LINT CLEAN`.

A broken-link error means something still links to the deleted page.

- [ ] **Step 6: Commit**

```bash
git add -A versioned_docs/operators-manual
git commit -m "Remove Watcher from the v4 manual

Watcher is not in the v4 base deployment; confirmed absent from a live
v4 cloud. Deletes the demo guide, its TOC entry, and its containers from
the docker ps sample. The v3 archive keeps the guide.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Replace stale sample command output

Two sample blocks show services and files that no longer exist in v4. Both replacements
below were captured from the live v4 cloud on 2026-09-11.

**Files:**
- Modify: `versioned_docs/operators-manual/day-4/troubleshooting/rabbitmq.md`
- Modify: `versioned_docs/operators-manual/day-4/troubleshooting/log-filtering.md`

- [ ] **Step 1: Replace the RabbitMQ queue sample**

In `day-4/troubleshooting/rabbitmq.md`, find the sample block that begins with
`# docker exec -it rabbitmq rabbitmqctl list_queues -p / name messages consumers | head -20`
and runs through the line ending `engine_fanout_28b15b87d3ec4541b0d7731b928f6852  0       1`.

Replace the entire block with:

```
    # docker exec -it rabbitmq rabbitmqctl list_queues -p / name messages consumers | head -20
    Timeout: 60.0 seconds ...
    Listing queues for vhost / ...
    name    messages        consumers
    ipsec_driver.suspicious-spoonbill.local 0       3
    scheduler_fanout_pedantic-piranha.local:nova-scheduler:7 0       1
    reply_pedantic-piranha.local:nova-compute:1     0       1
    q-plugin.suspicious-spoonbill.local     0       3
    engine_worker_fanout_suspicious-spoonbill.local:heat-engine:9    0       1
    cinder-volume.suspicious-spoonbill.local@rbd-1.suspicious-spoonbill.local        0       1
    reply_suspicious-spoonbill.local:nova-conductor:6        0       1
    mistral_event_engine.192.168.3.5        0       1
    heat-engine-listener.8c2c593e-97da-4b09-933b-1e634e609dab        0       1
    heat-engine-listener.23c7a798-27ff-4c54-baea-81d068cef57e        0       1
    engine_worker   0       15
    cinder-backup   0       3
    heat-engine-listener_fanout_pedantic-piranha.local:heat-engine:1 0       1
    q-plugin_fanout_suspicious-spoonbill.local:neutron-rpc-server:1  0       1
    mistral_engine_fanout_suspicious-spoonbill.local:mistral-server:1        0       1
    q-reports-plugin_fanout_suspicious-spoonbill.local:neutron-rpc-server:8  0       1
    mistral_engine  0       3
```

This removes the `watcher.applier.control_fanout_*` and two `magnum-conductor*` queues,
neither of which exists in v4.

- [ ] **Step 2: Replace the Neutron log listing**

In `day-4/troubleshooting/log-filtering.md`, find this block:

```
    # ls /var/log/kolla/neutron/*.log
    /var/log/kolla/neutron/dnsmasq.log
    /var/log/kolla/neutron/neutron-dhcp-agent.log
    /var/log/kolla/neutron/neutron-l3-agent.log
    /var/log/kolla/neutron/neutron-metadata-agent.log
    /var/log/kolla/neutron/neutron-metering-agent.log
    /var/log/kolla/neutron/neutron-netns-cleanup.log
    /var/log/kolla/neutron/neutron-openvswitch-agent.log
    /var/log/kolla/neutron/neutron-server.log
    /var/log/kolla/neutron/privsep-helper.log
```

Replace with the real v4/OVN listing:

```
    # ls /var/log/kolla/neutron/*.log
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

Do NOT add explanatory prose about OVN. That is Phase 4's job. This task only corrects
the file listing.

- [ ] **Step 3: Verify the removed names are gone**

```bash
cd /home/nick/om/git-repos/openmetal-docs
grep -rn "neutron-openvswitch-agent\|neutron-l3-agent\|neutron-netns-cleanup\|magnum" \
  versioned_docs/operators-manual/ || echo "CLEAN"
```

Expected: `CLEAN`

- [ ] **Step 4: Build and lint**

```bash
npm run build 2>&1 | tail -3
npm run lint && echo "LINT CLEAN"
```

Expected: `[SUCCESS] Generated static files in "build".` and `LINT CLEAN`.

- [ ] **Step 5: Commit**

```bash
git add versioned_docs/operators-manual
git commit -m "Refresh stale sample output for v4

RabbitMQ queue listing no longer shows Watcher or Magnum queues, and the
Neutron log listing reflects OVN rather than OVS. Both captured from a
live v4 cloud.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Remove the `cluster_interface` variable

**Files:**
- Modify: `versioned_docs/operators-manual/day-4/kolla-ansible/prepare-kolla-ansible.md`

`cluster_interface` was removed in v4. Confirmed absent from the live cloud's
`/etc/kolla/globals.yml`.

- [ ] **Step 1: Confirm the occurrence**

```bash
cd /home/nick/om/git-repos/openmetal-docs
grep -n "cluster_interface" versioned_docs/operators-manual/day-4/kolla-ansible/prepare-kolla-ansible.md
```

Expected: one line, `111:    cluster_interface`

- [ ] **Step 2: Delete that line**

The file contains this indented list of variables that must not be modified:

```
    api_interface
    cluster_interface
    dns_interface
    docker_registry_insecure
```

Remove only the `    cluster_interface` line, leaving:

```
    api_interface
    dns_interface
    docker_registry_insecure
```

Change nothing else in the list and do not reword the surrounding prose.

- [ ] **Step 3: Verify**

```bash
grep -rn "cluster_interface" versioned_docs/operators-manual/ || echo "CLEAN"
```

Expected: `CLEAN`

Note this must not match `ceph_network_interface_cluster` — that string does not appear
in the manual, so `CLEAN` is correct.

- [ ] **Step 4: Build and lint**

```bash
npm run build 2>&1 | tail -3
npm run lint && echo "LINT CLEAN"
```

- [ ] **Step 5: Commit**

```bash
git add versioned_docs/operators-manual
git commit -m "Drop cluster_interface from the protected variable list

The variable was removed in v4; confirmed absent from a live v4 cloud's
globals.yml.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Final verification

**Files:** none

- [ ] **Step 1: Clean rebuild**

```bash
cd /home/nick/om/git-repos/openmetal-docs
npm run clear && npm run build 2>&1 | tail -3
```

Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 2: Lint**

```bash
npm run lint && echo "LINT CLEAN"
```

Expected: `LINT CLEAN`

- [ ] **Step 3: Every stale string is gone**

```bash
for p in "2023\.2" "ubuntu-jammy" "en/reef" "cluster_interface" \
         "neutron-openvswitch-agent" "neutron-l3-agent" "magnum"; do
  n=$(grep -rni "$p" versioned_docs/operators-manual/ | wc -l)
  echo "$n  $p"
done
grep -rni "watcher" versioned_docs/operators-manual/ | wc -l | xargs echo "watcher count:"
```

Expected: every count is `0`.

- [ ] **Step 4: The frozen archive was never touched**

```bash
git status --porcelain operators_versioned_docs/
git diff --stat HEAD~5 -- operators_versioned_docs/
```

Expected: no output from either.

- [ ] **Step 5: The archive still has the v3 content**

```bash
grep -rc "2023\.2" operators_versioned_docs/version-3.0/ 2>/dev/null | grep -v ':0$' | wc -l
test -f operators_versioned_docs/version-3.0/day-4/watcher/watcher-demo.md && echo "V3 WATCHER INTACT"
```

Expected: a non-zero count of files still containing `2023.2`, and `V3 WATCHER INTACT`.
The v3 archive must still describe v3.

- [ ] **Step 6: Unrelated files still untracked**

```bash
git status --porcelain
```

Expected: only `?? add-control-plane.md`, `?? pcc-node-operations.md`,
`?? remove-node-pcc.md`.

- [ ] **Step 7: Review the commit series**

```bash
git log --oneline main..HEAD | head -12
```

**Do not merge. Do not open a PR unless asked.**

---

## Definition of done

- `npm run build` exits 0 from a cleared cache
- `npm run lint` exits 0
- Zero occurrences of `2023.2`, `ubuntu-jammy`, `en/reef`, `cluster_interface`,
  `watcher`, `magnum`, `neutron-openvswitch-agent`, `neutron-l3-agent` in the v4 manual
- Every rewritten upstream URL returns HTTP 200
- `operators_versioned_docs/` unmodified, still describing v3
- Everything committed to `operators-manual-v4`, nothing merged

## Next

Phase 3 — Skyline conversion of `day-1/`, including recapturing 46 screenshots against
the live v4 cloud.
