# Cycle IAL to OpenMetal API Endpoint Mapping

This document maps each [Cycle Infrastructure Abstraction Layer (IAL)](https://cycle.io/docs/platform/infrastructure-abstraction-layer) endpoint to the corresponding [OpenMetal Central API](https://api.central.openmetal.io) endpoint(s). It serves as a reference for implementing the IAL integration layer that sits between Cycle and our API.

## Getting Started

Sign up at [central.openmetal.io](https://central.openmetal.io) and create an account. From the Organization Dashboard, navigate to **Organization Tools > API Access** to create sandbox API credentials. Use these credentials to build and test your integration against the sandbox API at `https://sandbox.api.central.openmetal.io`.

## API Overview

| | Cycle IAL | OpenMetal Central API |
|---|---|---|
| **Role** | Endpoints Cycle *calls* on our integration server | Endpoints our integration server calls on OpenMetal |
| **Base URL** | Defined by our integration | `https://api.central.openmetal.io` |
| **Auth model** | Custom `auth` object per request (api_key, secret, client_id, etc.) | Bearer token (API Key or OAuth2 client_credentials) |
| **Spec source** | [Cycle IAL OpenAPI spec](https://github.com/cycleplatform/integrations) | [OpenMetal OpenAPI spec](https://github.com/openmetalio/openmetal-docs/blob/main/api/openapi.yaml) |

## Endpoint Mapping Summary

| # | Cycle IAL Endpoint | HTTP | OpenMetal Endpoint(s) | Notes |
|---|---|---|---|---|
| 1 | `/v1/auth/verify` | POST | `GET /v1/oauth2/token` | Verify creds via token exchange |
| 2 | `/v1/infrastructure/provider/locations` | GET | `GET /v2/inventory/locations` | List datacenters |
| 3 | `/v1/infrastructure/provider/server-models` | GET | `GET /v1/products` + `GET /v2/inventory/{pod_location}/availability` | Product catalog for specs; availability for stock |
| 4 | `/v1/location/configure` | POST | *No direct equivalent* | Acknowledge only |
| 5 | `/v1/infrastructure/server/provision` | POST | `POST /v1/orders` | Create baremetal order |
| 6 | `/v1/infrastructure/server/provision-status` | GET | `GET /v1/orders/{orderId}` + `GET /v1/clouds/{cloudId}` | Poll order & cloud status |
| 7 | `/v1/infrastructure/server/decommission` | POST | `DELETE /v1/clouds/{cloudId}` | Delete cloud / reclaim infra |
| 8 | `/v1/infrastructure/server/restart` | POST | `POST /v1/deployment/cloud/{cloudId}/node/{nodeUuid}/power` | Power action `"rebooting"` |
| 9 | `/v1/infrastructure/ip/allocate` | POST | `POST /v1/prefixes` + `POST /v1/deployment/network/prefixes/{prefixId}/ip` | Create prefix & allocate IP |
| 10 | `/v1/infrastructure/ip/release` | POST | `DELETE /v1/deployment/network/prefixes/{prefixId}/ip/{ipId}` | Delete IP address |

---

## Detailed Endpoint Descriptions

### 1. Auth Verify

**Cycle IAL:** `POST /v1/auth/verify` — Cycle calls this to validate that user-configured credentials can authenticate with our integration. The request contains an `auth` object with fields like `api_key`, `secret`, `client_id`. The response is simply `{ "valid": true/false }`.

**OpenMetal:** `GET /v1/oauth2/token?grant_type=client_credentials` — Exchange OAuth client credentials (via Basic auth header) for a short-lived Bearer token. Returns `access_token`, `expires_in`, and `token_type`. Alternatively, long-lived API Keys can be validated by making any authenticated call (e.g., `GET /v1/clouds`).

---

### 2. List Locations

**Cycle IAL:** `GET /v1/infrastructure/provider/locations` — Cycle calls this to discover available deployment regions. Automatically synced every 6 hours. Expects an array of `Location` objects with name, geographic coordinates, a `provider` block (containing `location_id` and `code`), and feature flags.

**OpenMetal:** `GET /v2/inventory/locations` — Returns a map of pod locations (e.g., `pod_1`, `pod_2`) to location details including `displayName` (e.g., "Ashburn, VA"), `region`, datacenter `code`, `latitude`, `longitude`, and `release_status`. OpenMetal does not use availability zones.

---

### 3. List Server Models

**Cycle IAL:** `GET /v1/infrastructure/provider/server-models` — Cycle calls this to discover available server types and which locations they can be deployed to. Synced every 6 hours. Expects an array of `ServerModel` objects with detailed hardware specs (CPU, GPU, memory, storage, NICs), provider metadata (model_id, category, locations), and pricing (hourly/monthly in mils).

**OpenMetal:**

- `GET /v1/products` — Returns the full product catalog. Each entry is a hardware type keyed by `name` (e.g., `"compute_v4"`) — this `name` is the `hardware_sku` used when creating orders. Each hardware type includes full specs (`processor`, `ram`, `storage`, `network`, `gpu`) and a `products[]` array containing sellable products. The baremetal product entry within `products[]` provides the display name (e.g., "Baremetal - Large v4") and pricing in mils (1/1000th of a dollar, e.g., `30_day_cost_mils: 1101600` = $1,101.60/month). OpenMetal only bills on 30-day cycles — the `hourly_cost_ltu_mils` field is provided for display comparison only.
- `GET /v2/inventory/{pod_location}/availability` — Returns available hardware SKUs and their counts for a specific datacenter location. Each SKU entry has a `count` (total available) and `max_size` (max deployable with cabinet redundancy).



---

### 4. Configure Location

**Cycle IAL:** `POST /v1/location/configure` — Cycle calls this before every server provision to allow location-specific setup (e.g., AWS uses this to configure VPCs and subnets). Sends the current configuration state and expects back whether configuration succeeded and the latest config.

**OpenMetal:** No direct equivalent. OpenMetal handles networking configuration during provisioning.

---

### 5. Provision Server

**Cycle IAL:** `POST /v1/infrastructure/server/provision` — Cycle calls this to start provisioning a new server. Sends hostname, model_id, location_id, model features, and Cycle metadata. Expects back a `server_id` (our unique identifier for the server) that will be used in all subsequent calls.

**OpenMetal:** `POST /v1/orders` — Create a new baremetal order. Takes a label, item list with `hardware_sku`, `location` (pod), `type` ("baremetal"), `quantity`, optional OS/deployment modifications, and an SSH public key. Returns an order object with an `id`. Note: Cycle provisions individual servers, but OpenMetal provisions via orders which create clouds (a cloud is a group of servers). Each order creates a cloud, which contains one or more nodes.

Baremetal orders require either an `operating_system` or a `deployment_configuration` in the item's `modifications` field. For CycleOS, create a deployment configuration via `POST /v1/configurations` with the CycleOS image URL, checksums, and optional cloud-init user data, then reference its ID in the order. Configurations are reusable templates managed via full CRUD endpoints (`GET/POST /v1/configurations`, `GET/PATCH/DELETE /v1/configurations/{configurationId}`).

---

### 6. Provision Status

**Cycle IAL:** `GET /v1/infrastructure/server/provision-status` — Cycle polls this every 5-10 seconds after a provision request. Expects `server_id`, a boolean `provisioned` flag, and an `auth` block with `uuid`, `initial_ips`, and `mac_addr` (needed for CycleOS boot authorization).

**OpenMetal:** `GET /v1/orders/{orderId}` — Check the order's `clouds_deployed` array; each entry has an `id` (cloud ID) and `provisioning_status` that progresses: `pending` -> `in_progress` -> `awaiting_setup` -> `complete`. Once a `cloudId` is available, `GET /v1/clouds/{cloudId}` returns the cloud UUID, hostname/IP, and provision status. `GET /v1/clouds/{cloudId}/stats` provides per-node details including UUID and power state.

---

### 7. Decommission Server

**Cycle IAL:** `POST /v1/infrastructure/server/decommission` — Cycle calls this after all IPs and instances are removed from a server. Sends `server_id`, hostname, model_id, location_id. Expects a boolean `true` on success.

**OpenMetal:** `DELETE /v1/clouds/{cloudId}` — Deletes a cloud and reclaims all associated infrastructure. Clouds enter a "pending-delete" state with a 3-day decommission delay before servers are fully wiped.

---

### 8. Restart Server

**Cycle IAL:** `POST /v1/infrastructure/server/restart` — Cycle calls this when a user requests a server restart via the platform. Sends `server_id`, hostname, model_id, location_id. Expects a boolean `true` on success.

**OpenMetal:** `POST /v1/deployment/cloud/{cloudId}/node/{nodeUuid}/power` — Changes the power state of a specific node. Accepts `power_state` values: `"power on"`, `"power off"`, or `"rebooting"`. Returns `result: "success"` on success. Returns 409 if the node is locked. The `nodeUuid` can be obtained from `GET /v1/clouds/{cloudId}/stats`.

---

### 9. Allocate IP

**Cycle IAL:** `POST /v1/infrastructure/ip/allocate` — Cycle calls this when a new load balancer is created or scaled up. Sends IP kind (`"ipv4"` or `"ipv6"`), server_id, location_id, and Cycle metadata. Expects back `ip_id`, `ip_assignment_id`, `cidr`, `gateway`, `netmask`, and `network`.

**OpenMetal** — Two-step process:

1. `POST /v1/prefixes` — Create an IP Address Block (prefix) in a location. Requires a pod location, prefix type (`"routed"` for public IPs), a product addon (e.g., `"ipv4_block_28"`), a cloud_id for billing, and optionally a VLAN assignment. Returns a prefix resource with a CIDR block.
2. `POST /v1/deployment/network/prefixes/{prefixId}/ip` — Create an individual IP address within a prefix. Can auto-assign from available space or specify an exact IP. Returns the created IP address details.

Each OpenMetal deployment includes 2x /28 IP blocks by default. Allocate individual IPs from these existing blocks first, and only create new prefixes when they are exhausted.

---

### 10. Release IP

**Cycle IAL:** `POST /v1/infrastructure/ip/release` — Cycle calls this when an IP is no longer needed. Sends `ip_id`, `ip_assignment_id`, `cidr`, server_id, location_id. Expects a boolean `true` on success.

**OpenMetal:** `DELETE /v1/deployment/network/prefixes/{prefixId}/ip/{ipId}` — Deletes an individual IP address from a prefix.

