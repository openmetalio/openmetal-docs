# Operator's Manual v4 — Phase 3: Skyline Conversion

Date: 2026-09-11
Branch: `operators-manual-v4`
Depends on: Phases 1 and 2 (complete)

## Goal

Convert `day-1/horizon/` to Skyline, rename it to `day-1/skyline/`, and recapture its
screenshots against the live v4 cloud.

## Reframing: not a 1:1 reshoot

The existing 51 screenshots document Horizon's information architecture. Skyline's is
different, so a screenshot-for-screenshot replacement is the wrong target. Two examples:

- Horizon has **Project / Admin / Identity tabs**. Skyline has **two separate consoles**
  reached by a top-right toggle. `create-user-project.md` opens by explaining those tabs;
  that section is wrong for Skyline and gets rewritten, not reshot.
- Skyline splits identity work into the Administrator console (`/identity/*-admin`) while
  tenant work stays in the project console. The user/project guide therefore changes
  structure, not just pictures.

Target the correct Skyline flow. The screenshot count falls out of that.

## Decisions (confirmed with Nick)

1. Rename `day-1/horizon/` → `day-1/skyline/`, add client redirects from the old paths
2. Add a short "Accessing Horizon" page — Horizon remains at `https://<VIP>:9999`
3. Reuse existing demo names: **Development** project, **Private** network,
   **Jumpstation** instance, **SSH** security group
4. OpenMetal Central screenshots become placeholders for Nick to supply

## Verified Skyline route map

All 33 routes confirmed by direct probe on 2026-09-11 against `https://173.231.234.132`.

Project console:

| Route | Page |
|---|---|
| `/base/overview` | Home |
| `/compute/instance` | Instances |
| `/compute/instance-snapshot` | Instance Snapshots |
| `/compute/image` | Images |
| `/compute/keypair` | Key Pairs |
| `/compute/server-group` | Server Groups |
| `/network/networks` | Networks |
| `/network/router` | Routers |
| `/network/floatingip` | Floating IPs |
| `/network/topology` | Topology |
| `/network/security-group` | Security Groups |
| `/network/lb` | Load Balancers |
| `/storage/volume` | Volumes |
| `/heat/stack` | Stacks |

Administrator console:

| Route | Page |
|---|---|
| `/base/overview-admin` | Home |
| `/identity/project-admin` | Projects |
| `/identity/user-admin` | Users |
| `/identity/role-admin` | Roles |
| `/identity/domain-admin` | Domains |
| `/compute/instance-admin` | Instances |
| `/compute/hypervisors-admin` | Hypervisors |
| `/compute/flavor-admin` | Flavors |
| `/network/networks-admin` | Networks |
| `/configuration-admin/info` | System Info |

## Files

| Path | Action |
|---|---|
| `day-1/skyline/_category_.json` | Create — label "Skyline", position 1 |
| `day-1/skyline/getting-started-with-skyline.md` | Rewrite of `getting-started-with-horizon.md` |
| `day-1/skyline/create-user-project.md` | Rewrite — moves to Administrator console |
| `day-1/skyline/create-first-instance.md` | Rewrite — largest, 425 lines |
| `day-1/skyline/images.md` | Rewrite |
| `day-1/skyline/accessing-horizon.md` | New — short page |
| `day-1/skyline/images/` | New screenshots |
| `day-1/horizon/` | Delete |
| `docusaurus.config.js` | Add 4 client redirects |
| `_toc.md` | Update Day 1 entries |

## Redirects

Added to the existing `plugin-client-redirects` block:

```
/operators-manual/day-1/horizon/getting-started-with-horizon
  -> /operators-manual/day-1/skyline/getting-started-with-skyline
/operators-manual/day-1/horizon/create-user-project
  -> /operators-manual/day-1/skyline/create-user-project
/operators-manual/day-1/horizon/create-first-instance
  -> /operators-manual/day-1/skyline/create-first-instance
/operators-manual/day-1/horizon/images
  -> /operators-manual/day-1/skyline/images
```

These target only the v4 paths. The v3 archive keeps its own
`/operators-manual/operators_versioned_docs/version-3.0/day-1/horizon/*` URLs, which are
unaffected.

## Screenshots

Captured with Playwright 1.50.1 driving the installed Chrome (`channel: 'chrome'`,
`ignoreHTTPSErrors: true`), at 1600x950 with `deviceScaleFactor: 2` for legibility.

**Throwaway resources.** Nick authorized creating and deleting resources on the demo
cloud. Every resource created for screenshots is torn down afterwards, and the teardown
is verified. Pre-existing resources (`network-1`, `router-1`, `ubuntu-26`,
`ubuntu-vpn-only`, `lb-mgmt-net`, `vpn*`) are never touched.

**Central placeholders.** Five screenshots are OpenMetal Central UI, which is not
reachable from here. Each becomes a visible placeholder:

```markdown
<!-- SCREENSHOT NEEDED: OpenMetal Central — <description>. Cannot be captured
     automatically; Central is not reachable from the docs build environment. -->
![<alt text>](images/<name>.png)
```

The image file will not exist, so the build would fail on a broken image. Instead the
placeholder is comment-only with no `![]()` until Nick supplies the file. A tracking
list goes in the guide's front matter comment and in this spec's Open Items.

## Writing style

Terse and simple. Imperative steps. No background explanation, no "as you can see", no
restating what a screenshot shows. Cut "Introduction" padding where it adds nothing.
This is a standing preference from Nick, not specific to this phase.

## Out of scope

- `day-1/command-line/` — CLI guides, unaffected by the dashboard change
- `day-1/intro-to-openmetal-private-cloud.md` — Central content, Phase 4 or later
- OVN, Octavia provider limits, UFW firewall — Phase 4
- Regenerating the PDF

## Verification

1. `npm run build` exits 0
2. `npm run lint` exits 0
3. `day-1/horizon/` no longer exists in the v4 manual
4. Every `![](images/...)` reference in `day-1/skyline/` resolves to a file that exists
5. No orphan images — every file in `day-1/skyline/images/` is referenced
6. The four redirects resolve in a built site
7. `grep -rn "Horizon" day-1/skyline/` returns only intentional mentions
   (`accessing-horizon.md` and any deliberate comparison)
8. `operators_versioned_docs/` untouched
9. Demo cloud teardown verified — no leftover `Development` project, `Private` network,
   `Jumpstation` instance, or `SSH` security group
10. Screenshots visually spot-checked, not just confirmed to exist

## Risks

| Risk | Mitigation |
|---|---|
| Screenshots capture mid-render or a spinner | Wait for network idle plus an explicit settle; spot-check every image visually |
| Throwaway resources left on the demo cloud | Explicit teardown task with verification, listing pre-existing resources to preserve |
| Deleting `day-1/horizon/` breaks inbound links | Redirects, plus the build's broken-link check |
| Capturing a page containing real tenant data | Demo cloud only; review each image before committing |
| Session token expiry mid-capture | Harness logs in fresh per run rather than reusing stored state |

## Open items for Nick

Five OpenMetal Central screenshots to supply:

1. Central login page
2. Cloud details / Manage Cloud page
3. Dashboard URL location (now Skyline rather than Horizon)
4. Where to obtain the dashboard password
5. Hardware assets page

## Next

Phase 4 — OVN, Octavia provider limits with the Amphora warning, and the UFW/ipset
firewall rewrite.
