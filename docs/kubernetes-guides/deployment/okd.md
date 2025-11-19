---
slug: /kubernetes-guides/installing-an-openshift-cluster-on-openstack
sidebar_position: 1
---

# Installing an OpenShift cluster on OpenStack

We'll be using the following guide to install a OKD Kubernetes cluster on an
OpenMetal provisioned OpenStack cloud:
[Installing a cluster on OpenStack with customizations](https://docs.okd.io/latest/installing/installing_openstack/installing-openstack-installer-custom.html).
For more information about configuration options please refer to the OKD
documentation. The intent of this guide is to quickly validate the installation
process on an OpenMetal cloud.

## Prerequisites

We'll be performing these installation steps on one of the hardware nodes
provisioned for your cloud. Make sure that you have deployed a cloud and have
access SSH access to the nodes. If deploying from another machine, you may need
to preform additional steps.

## Setup OpenStack Access

### Installing OpenStack CLI

Complete the following steps to [install the OpenStack CLI:](/operators-manual/day-1/command-line/openstackclient).

### Update quotas

Remove the following quota limits for the project you plan on using for
this installation by setting the value to -1.

- RAM: -1
- VCPU: -1

```bash
openstack quota set --cores -1 PROJECT_NAME
```

```bash
openstack quota set --ram -1 PROJECT_NAME
```

### Save Password

During the setup process of the OpenStack CLI, you should have created a
`clouds.yaml`. Update that file by adding your password in the `auth` field.

```bash
vim ~/.config/openstack/clouds.yaml
```

```yaml
clouds:
   openstack:
     auth:
       auth_url: http://my-hostname:5000
       username: "username"
       password: "password"
       ...
```

> Note: You can also keep secrets in a separate file:
> <https://docs.openstack.org/os-client-config/latest/user/configuration.html#splitting-secrets>.

## Prepare Installation

### Download OKD Installer

```bash
mkdir ~/okd/ && cd ~/okd/
```

```bash
curl -o openshift-install-linux.tar.gz -L https://github.com/openshift/okd/releases/download/4.11.0-0.okd-2022-07-29-154152/openshift-install-linux-4.11.0-0.okd-2022-07-29-154152.tar.gz
```

```bash
tar -xvf openshift-install-linux.tar.gz
```

### Generate a key pair

```bash
ssh-keygen -t ed25519 -N '' -f /root/.ssh/id_okd && chmod 600 /root/.ssh/id_okd
```

### Add the SSH private key identity to the SSH agent for your local user

``` bash
eval "$(ssh-agent -s)"
```

``` bash
ssh-add /root/.ssh/id_okd
```

### Create floating IPs

Record the IP addresses it returns, we'll pass these IPs to the installer later.

```bash
openstack floating ip create --description "API okd test cluster" External
```

```bash
openstack floating ip create --description "APPS okd test cluster" External
```

Output:

```bash
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| created_at          | 2022-08-12T22:49:31Z                 |
| description         | API okd test cluster                 |
| dns_domain          | None                                 |
| dns_name            | None                                 |
| fixed_ip_address    | None                                 |
| floating_ip_address | 127.0.0.1                            |
| floating_network_id | 4e08a887-5fa7-4cc1-b106-26ade52e3e5f |
| id                  | c5c9c416-5ea4-4ebe-8b02-307f6c371b06 |
| name                | 127.0.0.1                            |
| port_details        | None                                 |
| port_id             | None                                 |
| project_id          | a8df8d1113b444a694f59653b830c1df     |
| qos_policy_id       | None                                 |
| revision_number     | 0                                    |
| router_id           | None                                 |
| status              | DOWN                                 |
| subnet_id           | None                                 |
| tags                | []                                   |
| tenant_id           | a8df8d1113b444a694f59653b830c1df     |
| updated_at          | 2022-08-12T22:49:31Z                 |
+---------------------+--------------------------------------+
```

### DNS Configuration

#### Option 1

Setup DNS records. _Recommended for production clusters._

- api.<cluster_name>.<base_domain>.  IN  A  <API_FLOATING_IP>
- *.apps.<cluster_name>.<base_domain>. IN  A <APPS_FLOATING_IP>
- api-int.<cluster_name>.<base_domain>.  IN  A  <API_FLOATING_IP>

> Note: OKD will fail if it cannot resolve these DNS records to the floating IP
> addresses you selected. If the install does fail for this reason, it will tell
> you the host is unreachable or no route to host.

#### Option 2: Add hostfile mods

Add the following to `/etc/hosts`. Replace the floating IPs with the IPs you
created above. You'll need to use this block on several servers.
 _Only recommended for testing purposes._

```bash
API_FLOATING_IP api.okd.testing-okd.com
API_FLOATING_IP api-int.okd.testing-okd.com
APPS_FLOATING_IP grafana-openshift-monitoring.apps.okd.testing-okd.com
APPS_FLOATING_IP prometheus-k8s-openshift-monitoring.apps.okd.testing-okd.com
APPS_FLOATING_IP oauth-openshift.apps.okd.testing-okd.com
APPS_FLOATING_IP console-openshift-console.apps.okd.testing-okd.com
APPS_FLOATING_IP integrated-oauth-server-openshift-authentication.apps.okd.testing-okd.com
```

### Generate Installation Configs

### Create Manifest Files

```bash
mkdir ~/okd/install-directory
```

```bash
./openshift-install --dir ~/okd/install-directory create manifests
```

You'll be prompted for information about the cluster.  As a reference,
we used the following values for each prompt.

- Base domain will be the domain you set up DNS or the domain in your hosts file
  mod.
- OKD wants a pull secret. The pull secret is used for making pull requests from
  private container image registries. If you have a private registry secret you
  can provide that. Otherwise, you can use a fake secret the OKD documentation
  provides: `{"auths":{"fake":{"auth":"aWQ6cGFzcwo="}}}`. Copy and paste that
  entire string into the prompt for pull secret. It will show as a series of
  asterisks.
  **OKD will fail if the pull secret is not a valid pull secret or the fake secret.**
   If you use the fake secret, OKD will pull its container images from public
   repositories. OKD does cache container images, so you do not have to repull
   them for every run of OKD. If you use the pull secret provided, Red Hat
   operators will be unavailable. For more information see their [documentation:](https://docs.okd.io/latest/installing/installing_openstack/installing-openstack-installer-custom.html#installation-obtaining-installer_installing-openstack-installer-custom)
- You must choose a flavor with at least 16 GB memory, 4 vCPUs, and 100 GB
  storage space. The `gp1.xlarge` flavor has enough resources. OKD will fail
  with an error about the flavor not having enough RAM or vCPUs if you pick
   a small flavor.

```bash
? SSH Public Key /root/.ssh/id_okd.pub
? Platform openstack
? Cloud openstack
? ExternalNetwork External
? APIFloatingIPAddress <API floating IP address you generated earlier>
? FlavorName gp1.large
? Base Domain testing-okd.com
? Cluster Name okd
? Pull Secret [? for help] {"auths":{"fake":{"auth":"aWQ6cGFzcwo="}}}
```

### Generate Install Configuration

```bash
./openshift-install create install-config --dir ~/okd/install-directory
```

### Create Security Group

Create a security group that allows for SSH access from the host on which
you are running the `openshift-install` application. You can get failures
if the host cannot access the bootstrap node via SSH Provision floating IPs
for the project that will host the OKD infrastructure.

```bash
openstack security group create okd-deploy
```

```bash
openstack security group rule create okd-deploy \
    --protocol TCP --remote-ip YOUR_IP_ADDRESS/32 --description "Allow deployment host"
```

### Update the Install Config

```bash
vim ~/okd/install-directory/install-config.yaml
```

Add security group UUID so the installer can access the cluster. Replace
the UUID with the UUID of the security group you created above.

```yaml
controlPlane:
  platform:
    openstack:
      additionalSecurityGroupIDs: ["7af89a64-3cc0-444f-9273-63f309a003c2"]
```

Specify the IP of the floating IPs you created earlier. The API IP should
already be filled in.

```yaml
platform:
  openstack:
    apiFloatingIP: 127.0.0.1
    ingressFloatingIP: 127.0.0.2
```

The complete config looks like the following example. You can customize this
config to your needs.

```yaml
apiVersion: v1
baseDomain: okd.testing-okd.com
compute:
- architecture: amd64
  hyperthreading: Enabled
  name: worker
  replicas: 3
controlPlane:
  architecture: amd64
  hyperthreading: Enabled
  name: master
  platform:
    openstack:
      additionalSecurityGroupIDs: ["7af89a64-3cc0-444f-9273-63f309a003c2"]
  replicas: 3
metadata:
  creationTimestamp: null
  name: okd
networking:
  clusterNetwork:
  - cidr: 10.128.0.0/14
    hostPrefix: 23
  machineNetwork:
  - cidr: 10.0.0.0/16
  networkType: OVNKubernetes
  serviceNetwork:
  - 172.30.0.0/16
platform:
  openstack:
    apiFloatingIP: 127.0.0.1
    ingressFloatingIP: 127.0.0.2
    apiVIP: 10.0.0.5
    cloud: openstack
    defaultMachinePlatform:
      type: gp1.large
    externalDNS: null
    externalNetwork: External
    ingressVIP: 10.0.0.7
publish: External
pullSecret: '{"auths":{"fake":{"auth":"aWQ6cGFzcwo="}}}'
sshKey: |
  ssh-ed25519 AAAAC3Nz...
```

### Save a copy of the config

The installation process will delete your configuration file. Save a copy of
the config before running the installer.

```bash
cp ~/okd/install-directory/install-config.yaml .
```

## Install OKD

This process can take up to an hour. If the process fails, you'll need to
delete the cluster and start again. Please see [troubleshooting](#troubleshooting)
for more information.

```bash
./openshift-install create cluster --dir ~/okd/install-directory/ --log-level=info
```

If everything is successful, you should see URLs to access the API and the
console. There will also be a username and password for the console.
 **Save the username and password from the log output somewhere safe.**

> **NOTE!** If you are deploying with hosts file mods, you'll need to add the
> same entries to the bootstrapping VM after it's created.
>
> ```bash
> watch openstack server list
> ```

## Verify Installation

That's it! You've installed OKD onto your OpenStack cloud. Now you can verify
that the installation was successful and deploy your own workloads.

### Open Web Console

#### Optional - Add the hosts file mods to your local machine

Use the same entries you've added to the previous servers and add them to your
local machine.

#### Web Console Login

Navigate to <https://console-openshift-console.apps.okd.testing-okd.com/dashboards>

Use the username and password that were output after you completed the
installation. If you forget to save the password, the password is stored
in the `auth` folder in the current directory in the `kubeadmin-password` file.

![OKD Web Console on OpenMetal](okd-images/okd-web-console.jpg)

### Test Kubectl

#### Install Kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

```bash
install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

#### Load configuration

```bash
 export KUBECONFIG=/root/okd/install-directory/auth/kubeconfig
```

#### List Pods

```bash
[root@silly-quokka okd]# kubectl get pods -A
NAMESPACE                                          NAME                                                         READY   STATUS             RESTARTS      AGE
openshift-apiserver-operator                       openshift-apiserver-operator-5686496c75-b6ngv                1/1     Running            1 (84m ago)   88m
openshift-apiserver                                apiserver-55b764f57-cp7w9                                    2/2     Running            0             76m
openshift-apiserver                                apiserver-55b764f57-ktq9c                                    2/2     Running            0             77m
openshift-apiserver                                apiserver-55b764f57-tf96q                                    2/2     Running            0             75m
openshift-authentication-operator                  authentication-operator-79647548ff-9pv9j                     1/1     Running            1 (84m ago)   88m
openshift-authentication                           oauth-openshift-75cb6567b6-6ltrr                             1/1     Running            0             69m
openshift-authentication                           oauth-openshift-75cb6567b6-n845d                             1/1     Running            0             68m
openshift-authentication                           oauth-openshift-75cb6567b6-qtfcf                             1/1     Running            0             69m
openshift-cloud-controller-manager-operator        cluster-cloud-controller-manager-operator-54f49d867f-gzjlh   2/2     Running            0             87m
openshift-cloud-credential-operator                cloud-credential-operator-7c4bbc8654-c6ckq                   2/2     Running            0             88m
openshift-cluster-csi-drivers                      manila-csi-driver-operator-b4dfc5874-frvlj                   1/1     Running            0             84m
openshift-cluster-csi-drivers                      openstack-cinder-csi-driver-controller-6b56dfff86-f5zfb      10/10   Running            0             82m
openshift-cluster-csi-drivers                      openstack-cinder-csi-driver-controller-6b56dfff86-wdh98      10/10   Running            0             85m
openshift-cluster-csi-drivers                      openstack-cinder-csi-driver-node-7v6sj                       3/3     Running            0             76m
...
```

### OKD Client

#### Install OKD Client

To verify operation, download the OKD client from the OKD GitHub [releases page:](https://github.com/openshift/okd/releases)

```bash
curl -OL https://github.com/openshift/okd/releases/download/4.11.0-0.okd-2022-07-29-154152/openshift-client-linux-4.11.0-0.okd-2022-07-29-154152.tar.gz
```

```bash
tar -xvf openshift-client-linux-4.11.0-0.okd-2022-07-29-154152.tar.gz
```

#### Fetch Kubernetes resources using OKD Client

Run the following OKD client commands using the `oc` binary:

- `./oc get nodes`
- `./oc get clusterversion`
- `./oc get clusteroperator`
- `./oc get pods -A`

Output:

```bash
(venv) [root@silly-quokka test]# ./oc get nodes
NAME                       STATUS   ROLES    AGE     VERSION
okd-dstmh-master-0         Ready    master   3h35m   v1.24.0+9546431
okd-dstmh-master-1         Ready    master   3h35m   v1.24.0+9546431
okd-dstmh-master-2         Ready    master   3h35m   v1.24.0+9546431
okd-dstmh-worker-0-gbr8f   Ready    worker   3h24m   v1.24.0+9546431
okd-dstmh-worker-0-l868x   Ready    worker   3h24m   v1.24.0+9546431
okd-dstmh-worker-0-mjzlr   Ready    worker   3h24m   v1.24.0+9546431
```

## Troubleshooting

### Restart OKD Installation

#### Delete the cluster

```bash
./openshift-install destroy cluster --dir ~/okd/install-directory/ --log-level=info
```

#### Copy the config

```bash
cp install-config.yaml ~/okd/install-directory/
```

#### Create the manifests

```bash
./openshift-install --dir ~/okd/install-directory create manifests
```

#### Start Install

```bash
./openshift-install create cluster --dir ~/okd/install-directory/ --log-level=info
```
