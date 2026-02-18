# Cycle IAL to OpenMetal API Endpoint Mapping

This document maps each [Cycle Infrastructure Abstraction Layer (IAL)](https://cycle.io/docs/platform/infrastructure-abstraction-layer) endpoint to the corresponding [OpenMetal Central API](https://openmetal.io/docs/manuals/api) endpoint(s). It serves as a reference for building the IAL integration against the OpenMetal API.

## Getting Started

Sign up at [central.openmetal.io](https://central.openmetal.io) and create an account. From the Organization Dashboard, navigate to **Organization Tools > API Access** to create sandbox API credentials. Use these credentials to build and test your integration against the sandbox API at `https://sandbox.api.central.openmetal.io`.

## API Overview

| | OpenMetal Central API |
|---|---|
| **Base URL** | `https://api.central.openmetal.io` (production) / `https://sandbox.api.central.openmetal.io` (sandbox) |
| **Auth model** | OAuth2 `client_credentials` (recommended) or long-lived API Keys |
| **Spec source** | [Cycle IAL OpenAPI spec](https://cycle.io/docs/api/ial/) / [OpenMetal OpenAPI spec](https://github.com/openmetalio/openmetal-docs/blob/main/api/openapi.yaml) |

### Key Concept: Clouds vs Servers

Cycle's IAL treats each server as an independent resource with a single `server_id`. OpenMetal groups baremetal nodes under a **cloud** — a single cloud can contain multiple baremetal nodes sharing a common network. This means both the cloud ID (used for decommission, IP operations, and status) and individual node UUIDs (used for restart/power operations and MAC address lookups) are needed.

> **Note:** Adding additional nodes to an existing cloud via API is not yet supported but is planned.

### Networking Model

OpenMetal baremetal nodes come preconfigured with bonded network interfaces (LACP). Each cloud is provisioned with a set of VLANs and IP Address Blocks (prefixes):

- **Routed VLANs** (Inventory, Provider) — publicly routed, backed by VRRP for high availability. Each routed prefix reserves 5 IPs (network, broadcast, VRRP gateway, 2x core switches). For example, a `/28` block has 11 usable IPs out of 16.
- **Internal VLANs** (Compute, Control, Storage, Tunnel) — private networks for inter-node communication.

Each deployment includes 2x `/28` public IP blocks by default (one Inventory, one Provider). Additional IP blocks can be created via the API and assigned to VLANs. VLANs and IP blocks are managed through the following endpoints:

- `GET /v1/prefixes` — List all IP Address Blocks across your organization
- `POST /v1/prefixes` — Create a new IP Address Block
- `GET /v1/vlans` — List all VLANs
- `POST /v1/vlans/{vlanId}/prefixes/{prefixId}` — Assign a prefix to a VLAN
- `POST /v1/deployment/network/prefixes/{prefixId}/ip` — Allocate an individual IP from a prefix
- `DELETE /v1/deployment/network/prefixes/{prefixId}/ip/{ipId}` — Release an individual IP

## Endpoint Mapping Summary

| # | Cycle IAL Endpoint | HTTP | OpenMetal Endpoint(s) | Notes |
|---|---|---|---|---|
| 1 | `/v1/auth/verify` | POST | `GET /v1/oauth2/token` | Verify creds via OAuth2 token exchange |
| 2 | `/v1/infrastructure/provider/locations` | GET | `GET /v2/inventory/locations` | List datacenters |
| 3 | `/v1/infrastructure/provider/server-models` | GET | `GET /v1/products` + `GET /v2/inventory/{pod_location}/availability` | Product catalog for specs; availability for stock |
| 4 | `/v1/location/configure` | POST | *Not applicable* | No equivalent at OpenMetal |
| 5 | `/v1/infrastructure/server/provision` | POST | `POST /v1/orders` | Create baremetal order |
| 6 | `/v1/infrastructure/server/provision-status` | GET | `GET /v1/orders/{orderId}` + `GET /v1/clouds/{cloudId}` + `GET /v1/clouds/{cloudId}/stats` | Poll order, cloud status, node details (UUID, MAC, IPs) |
| 7 | `/v1/infrastructure/server/decommission` | POST | `DELETE /v1/clouds/{cloudId}` | Delete cloud / reclaim infra |
| 8 | `/v1/infrastructure/server/restart` | POST | `POST /v1/deployment/cloud/{cloudId}/node/{nodeUuid}/power` | Power action `"rebooting"` |
| 9 | `/v1/infrastructure/ip/allocate` | POST | `POST /v1/deployment/network/prefixes/{prefixId}/ip` | Allocate IP from existing prefix |
| 10 | `/v1/infrastructure/ip/release` | POST | `DELETE /v1/deployment/network/prefixes/{prefixId}/ip/{ipId}` | Release IP address |

---

## Detailed Endpoint Descriptions

### 1. Auth Verify

Validate credentials by exchanging OAuth2 client credentials for a Bearer token.

**OpenMetal:** `GET /v1/oauth2/token` with `grant_type=client_credentials` — Send the `client_id` and `client_secret` via Basic auth header. A successful response returns `access_token`, `expires_in`, and `token_type`. A failed exchange indicates invalid credentials.

---

### 2. List Locations

Return the list of available datacenter locations.

**OpenMetal:** `GET /v2/inventory/locations` — Returns a map of pod locations (e.g., `pod_1`, `pod_2`) to location details including `displayName` (e.g., "Ashburn, VA"), `region`, datacenter `code`, `latitude`, `longitude`, and `release_status`. OpenMetal does not use availability zones.

---

### 3. List Server Models

Return available server types with hardware specs, pricing, and location availability.

**OpenMetal:**

- `GET /v1/products` — Returns the full product catalog. Each entry is a hardware type keyed by `name` (e.g., `"compute_v4"`) — this `name` is the `hardware_sku` used when creating orders. Each hardware type includes full specs (`processor`, `ram`, `storage`, `network`, `gpu`) and a `products[]` array containing sellable products. The baremetal product entry within `products[]` provides the display name (e.g., "Baremetal - Large v4") and pricing in mils (1/1000th of a dollar, e.g., `30_day_cost_mils: 1101600` = $1,101.60/month). OpenMetal only bills on 30-day cycles — the `hourly_cost_ltu_mils` field is provided for display comparison only.
- `GET /v2/inventory/{pod_location}/availability` — Returns available hardware SKUs and their counts for a specific datacenter location. Each SKU entry has a `count` (total available) and `max_size` (max deployable with cabinet redundancy).

---

### 4. Configure Location

**OpenMetal:** No equivalent endpoint. OpenMetal handles networking configuration automatically during provisioning, so this step is not applicable.

---

### 5. Provision Server

Create a baremetal order which provisions a cloud with one or more nodes.

**OpenMetal:** `POST /v1/orders` — Takes a label, item list with `hardware_sku`, `location` (pod), `type` ("baremetal"), `quantity`, optional OS/deployment modifications, and an SSH public key. Returns an order object with an `id`.

> **Important:** Always use `quantity: 1` for baremetal orders. There is currently no method to remove a single node from a cloud, so each Cycle server should map to its own single-node cloud.

Baremetal orders require either an `operating_system` or a `deployment_configuration` in the item's `modifications` field. For CycleOS, create a deployment configuration via `POST /v1/configurations` with the CycleOS image URL, checksums, and optional cloud-init user data, then reference its ID in the order. Configurations are reusable templates managed via full CRUD endpoints (`GET/POST /v1/configurations`, `GET/PATCH/DELETE /v1/configurations/{configurationId}`).

> **Note:** Provisioning typically takes 15-30 minutes from order creation to the cloud reaching `complete` status.

---

### 6. Provision Status

Poll order and cloud status until provisioning is complete, then retrieve node details.

**OpenMetal:** `GET /v1/orders/{orderId}` — Check the order's `clouds_deployed` array; each entry has an `id` (cloud ID) and `provisioning_status` that progresses: `pending` -> `in_progress` -> `awaiting_setup` -> `complete`. If errors occur during provisioning, the cloud may enter a `manual_setup` state — this means OpenMetal Infrastructure (OMI) needs to fix the deployment manually, and setup may take longer than normal. Once a `cloudId` is available, `GET /v1/clouds/{cloudId}` returns the cloud UUID, hostname/IP, and provision status. `GET /v1/clouds/{cloudId}/stats` provides per-node details needed to populate the Cycle `auth` response block:

- `auth.uuid` — the node's `uuid` from cloud stats
- `auth.initial_ips` — the node's `ipaddress` field from cloud stats (the primary IP)
- `auth.mac_addr` — the node's `networks[].mac_address` from cloud stats

---

### 7. Decommission Server

Delete a cloud and reclaim all associated infrastructure.

**OpenMetal:** `DELETE /v1/clouds/{cloudId}` — Returns success immediately. The cloud enters a "pending-delete" state and servers are fully wiped after a 3-day decommission period.

---

### 8. Restart Server

Reboot a specific node within a cloud.

**OpenMetal:** `POST /v1/deployment/cloud/{cloudId}/node/{nodeUuid}/power` — Accepts `power_state` values: `"power on"`, `"power off"`, or `"rebooting"`. Returns `result: "success"` on success. Returns 409 if the node is locked. The `nodeUuid` can be obtained from `GET /v1/clouds/{cloudId}/stats`.

---

### 9. Allocate IP

Allocate an individual IPv4 address from an existing IP Address Block (prefix).

**OpenMetal** (IPv4 only — IPv6 support planned for mid-2026):

1. Use `GET /v1/prefixes` to find existing IP Address Blocks with available space. Each cloud is provisioned with 2x `/28` blocks by default — allocate from these first before creating new blocks. Note that routed prefixes reserve 5 IPs per block (network, broadcast, VRRP gateway, 2x core switches).
2. `POST /v1/deployment/network/prefixes/{prefixId}/ip` — Allocate an individual IP address from a prefix. Can auto-assign from available space or specify an exact IP. Returns the created IP address details including the assigned IP in CIDR notation.
3. If existing blocks are exhausted, create a new one with `POST /v1/prefixes` (requires pod location, prefix type `"routed"`, a product addon like `"ipv4_block_28"`, and a `cloud_id` for billing) and then assign it to the Provider VLAN with `POST /v1/vlans/{vlanId}/prefixes/{prefixId}`. If the VLAN is newly created, it must also be assigned to the cloud with `POST /v1/clouds/{cloudId}/vlans/{vlanId}`.

The `gateway`, `netmask`, and `network` values for the Cycle response are derived from the prefix CIDR. For example, a `/28` prefix of `198.51.100.112/28` yields `gateway: 198.51.100.113` (VRRP address), `netmask: 255.255.255.240`, and `network: 198.51.100.112`. Set `nat_private_ip` to `null` (OpenMetal does not use NAT).

---

### 10. Release IP

Release an individual IP address back to its prefix.

**OpenMetal:** `DELETE /v1/deployment/network/prefixes/{prefixId}/ip/{ipId}` — Deletes an individual IP address from a prefix, returning it to the available pool.
