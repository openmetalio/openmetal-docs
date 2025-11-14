---
sidebar_position: 6
---
# Manage Node Firewall Using iptables

## Use Case

In cases where access restriction and attack surface reduction is key,
your project landscape may require assets and management be accessible
only to select IPs or networks (such as a company VPN). Such a
restriction can be handled on the Hardware Node level, allowing access
to be easily managed separately without interference from or with Docker
or OpenStack internal communication.

## Goal

Use `iptables` and `ipset` to restrict access to local (eg. SSH) and/or
Cloud services (HAProxy) on an OpenStack node without interfering with
Docker.

## Prerequisites

- Root SSH access to node
- Knowledge of OS package management
- OpenVSwitch Firewall Driver
- Kolla Ansible (if driver reconfigure required)

### Identify Active Firewall Driver

You will first need to identify the driver actively in use by Neutron
port security. This is defined in `openvswitch_agent.ini`. This can be
confirmed using the `grep` command.

``` sourceCode shell
[root@exhilarated-firefly ~]# grep firewall_driver /etc/kolla/neutron-openvswitch-agent/openvswitch_agent.ini
firewall_driver = neutron.agent.linux.iptables_firewall.OVSHybridIptablesFirewallDriver
```

If the `firewall_driver` is defined as `openvswitch` proceed to
Setup.

### Reconfigure Firewall Driver with Kolla Ansible

If the default Hybrid driver is in use you will need to update the
[Kolla Ansible](../day-4/kolla-ansible/prepare-kolla-ansible)
configuration at `/etc/kolla/config/neutron/openvswitch_agent.ini`.

If the `openvswitch_agent.ini` file does not exist, create it with the
following contents:

``` sourceCode ini
# Ensures firewall rules are fully-managed in OVS instead of using
# host iptables
[securitygroup]
firewall_driver = openvswitch
```

``` sourceCode shell
[root@exhilarated-firefly ~]# cat /etc/kolla/config/neutron/openvswitch_agent.ini

# Ensures firewall rules are fully-managed in OVS instead of using
# host iptables
[securitygroup]
firewall_driver = openvswitch
```

Once in place, reconfigure the cloud with `kolla-ansible reconfigure`
you can target just the changed services with `--tags
neutron,openvswitch`:

``` sourceCode shell
(.kolla-admin) [root@exhilarated-firefly kolla-ansible]# kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory reconfigure --tags neutron,openvswitch
Reconfigure OpenStack service : ansible-playbook -i /etc/fm-deploy/kolla-ansible-inventory -e @/etc/kolla/globals.yml  -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  --tags neutron,openvswitch -e kolla_action=reconfigure -e kolla_serial=0 /opt/kolla-ansible/.kolla-admin/share/kolla-ansible/ansible/site.yml 
[WARNING]: Invalid characters were found in group names but not replaced, use -vvvv to see details
[WARNING]: Could not match supplied host pattern, ignoring: enable_nova_True

--- OUTPUT TRUNCATED ---

PLAY RECAP *********************************************************************************************************************************************************************************************************
exhilarated-firefly        : ok=33   changed=5    unreachable=0    failed=0    skipped=18   rescued=0    ignored=0   
gifted-wildcat             : ok=43   changed=6    unreachable=0    failed=0    skipped=19   rescued=0    ignored=0   
localhost                  : ok=4    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
upbeat-peacock             : ok=33   changed=5    unreachable=0    failed=0    skipped=18   rescued=0    ignored=0
```

Confirm your change is now reflected:

``` sourceCode shell
[root@exhilarated-firefly kolla-ansible]# grep firewall_driver /etc/kolla/neutron-openvswitch-agent/openvswitch_agent.ini
firewall_driver = openvswitch
```

Proceed to [installation](#install-and-configure-firewall).

## Install and Configure Firewall

> - **CAUTION\!** This process can potentially result in loss of
>     access to your cloud. Perform these steps on one node at a time to
>     limit the possibility of total loss of access.

### Install ipset and iptables

1. Begin by installing the required packages with `yum`:

<!-- end list -->

``` sourceCode shell
yum install iptables-services ipset ipset-service -y
-- OUTPUT TRUNCATED ---
Installed:
  ipset-7.1-1.el8.x86_64         ipset-libs-7.1-1.el8.x86_64           ipset-service-7.1-1.el8.noarch           iptables-services-1.8.4-17.el8_4.1.x86_64                     

Complete!
```

### Configure Services

1. Identify the nodes vlan bond devices with `ip`:

<!-- end list -->

``` sourceCode shell
[root@exhilarated-firefly ~]# ip -br a | awk -F'@bond0' '/bond0\./{print$1}'
bond0.393
bond0.392
bond0.396
bond0.394
bond0.395
bond0.8
```

1. Create a new iptables configuration at `/etc/sysconfig/iptables`.

    > **NOTE\!**: To ensure all VLAN traffic is accepted, special
    > attention must be paid to the `ACCEPT` rules (eg. `bond0.304`
    > etc). **Be sure to update the Local VLAN rules with the nodes
    > identified interface names**

    ``` sourceCode
    *filter
    :INPUT ACCEPT [0:0]
    :FORWARD ACCEPT [0:0]
    :OUTPUT ACCEPT [0:0]
    -A INPUT -i lo -j ACCEPT -m comment --comment "localhost"
    -A OUTPUT -o lo -j ACCEPT -m comment --comment "localhost"
    -A INPUT  -j ACCEPT -m pkttype --pkt-type multicast -m comment --comment "multicast"
    -A OUTPUT -j ACCEPT -m pkttype --pkt-type multicast -m comment --comment "multicast"
    -A INPUT -j ACCEPT -m pkttype --pkt-type broadcast -m comment --comment "broadcast"
    -A OUTPUT -j ACCEPT -m pkttype --pkt-type broadcast -m comment --comment "broadcast"
    -A INPUT  -j DROP -m set --match-set blacklist src -m comment --comment "blacklist"
    -A OUTPUT -j DROP -m set --match-set blacklist dst -m comment --comment "blacklist"
    -A INPUT -p icmp -j ACCEPT -m comment --comment "allow icmp"
    -A INPUT  -m state --state RELATED,ESTABLISHED -j ACCEPT -m comment --comment "connection tracking"
    -A INPUT -i bond0.304 -j ACCEPT -m comment --comment "Local VLAN - compute"
    -A INPUT -i bond0.306 -j ACCEPT -m comment --comment "Local VLAN - control"
    -A INPUT -i bond0.332 -j ACCEPT -m comment --comment "Local VLAN - storage"
    -A INPUT -i bond0.333 -j ACCEPT -m comment --comment "Local VLAN - tunnel"
    -A INPUT -i o-hm0 -j ACCEPT -m comment --comment "Octavia management"
    -A INPUT -p vrrp -j ACCEPT
    -A INPUT -p tcp -s 10.204.0.1 -m comment --comment "OMI Pod VLAN 8 management" -j ACCEPT
    -A INPUT -p udp -s 10.204.0.1 -m comment --comment "OMI Pod VLAN 8 management" -j ACCEPT
    -A INPUT -p tcp -s 173.231.217.0/28 -m comment --comment "OMI Pod Management and Support" -j ACCEPT
    -A INPUT  -j ACCEPT -m set --match-set whitelist src -m comment --comment "whitelist"
    -A INPUT -p tcp -m tcp --dport 22 -m state --state NEW -m comment --comment "ssh" -j ACCEPT
    -A INPUT -p tcp -m tcp --dport 80 -m state --state NEW -m comment --comment "http/haproxy" -j ACCEPT
    -A INPUT -p tcp -m tcp --dport 443 -m state --state NEW -m comment --comment "https/haproxy" -j ACCEPT
    -A INPUT -j DROP
    COMMIT
    ```

<!-- end list -->

1. Create a new ipset configuration at `/etc/sysconfig/ipset`

    ``` sourceCode
    ###
    # ipset IP lists
    #
    # To reload: systemctl restart ipset
    ##
    
    create whitelist hash:net family inet hashsize 1024 maxelem 65536
    create blacklist hash:net family inet hashsize 1024 maxelem 65536
    create multicast hash:net family inet hashsize 1024 maxelem 65536
    
    ## Multicast/Broadcast IPs required for VRRP, DHCP, other protocols
    add multicast 224.0.0.0/4
    add multicast 255.255.255.255
    
    ## Whitelisted IPs
    
    # OMI VPN IP (support)
    add whitelist 173.231.218.25
    
    # Add your additional IPs here...
    #add whitelist W.X.Y.Z
    ```

2. The services now need to be restarted for the changes to take
    effect. Do **NOT** enable auto-start yet, in case something goes
    wrong.

    ``` sourceCode shell
    [root@exhilarated-firefly ~]# systemctl restart ipset
    [root@exhilarated-firefly ~]# systemctl restart iptables
    [root@exhilarated-firefly ~]#
    ```

3. Confirm that the firewall is working as expected. This can be done
    by attempting to access services (SSH etc) from both a whitelisted
    IP and an undefined network.

4. Once confirmed, enable auto-start for both services.

    ``` sourceCode shell
    [root@exhilarated-firefly ~]# systemctl enable ipset
    Created symlink /etc/systemd/system/basic.target.wants/ipset.service → /usr/lib/systemd/system/ipset.service.
    [root@exhilarated-firefly ~]# systemctl enable iptables
    Created symlink /etc/systemd/system/multi-user.target.wants/iptables.service → /usr/lib/systemd/system/iptables.service.
    [root@exhilarated-firefly ~]#
    ```

5. Copy the newly created files to the root users home folder accross
    the rest of the nodes.

    ``` sourceCode shell
    [root@exhilarated-firefly ~]# for node in $(awk '!/localhost/&&/local/{print$NF}' /etc/hosts| grep -v $(hostname -s)); do echo "scp -i .ssh/fm-deploy /etc/sysconfig/ipset $node:~/new-ipset && scp -i .ssh/fm-deploy /etc/sysconfig/iptables $node:~/new-iptables"; done
    scp -i .ssh/fm-deploy /etc/sysconfig/ipset gifted-wildcat:~/new-ipset && scp -i .ssh/fm-deploy /etc/sysconfig/iptables gifted-wildcat:~/new-iptables
    scp -i .ssh/fm-deploy /etc/sysconfig/ipset upbeat-peacock:~/new-ipset && scp -i .ssh/fm-deploy /etc/sysconfig/iptables upbeat-peacock:~/new-iptables
    [root@exhilarated-firefly ~]#
    ```

6. Deploy to the remaining nodes.
