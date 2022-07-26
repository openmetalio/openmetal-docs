---
sidebar_position: 5
---
# VPNaaS Configuration and Deployment

Installation and configuration of Virtual Private Networking as a Service
(VPNaaS) on your OpenMetal Cloud.

## Prerequisites

- [Kolla Ansible](../operators-manual/day-4/kolla-ansible/kolla-ansible.md)
- [OpenstackCLI](../operators-manual/day-1/command-line/openstackclient.md)
- `python-neutronclient` cli plugin for advanced networking.

## Preparation

You will first need to ensure the following values are set in
`/etc/kolla/globals.yml`:

```sh
$ grep vpnaas /etc/kolla/globals.yml
enable_horizon_neutron_vpnaas: "yes"
enable_neutron_vpnaas: "yes"
```

### Downgrade libreswan

When using the CentOS 8 binary container images, as in the case in our current
environment. The version of libreswan will need to be downgraded. This can be
done by performing the following steps for each `neutron-l3-agent` container.

First enter the container as the root user.

```sh
$ docker exec -u root -it neutron_l3_agent /bin/bash
(neutron-l3-agent)[root@exhilarated-firefly /]#
```

Ensure the CentOS BaseOS, AppStream and PowerTools repos have a valid `baseurl`
defined. As the current images in use are running CentOS 8 we point to the
official vault repo.

`baseurl=http://vault.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/`

Example one-shot command to modify repo files:

```sh
sed -i.bak 's@mirrorlist=@#mirrorlist=@;s@#baseurl=.*@baseurl=http://vault.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/@' /etc/yum.repos.d/CentOS-Linux-{BaseOS,AppStream,PowerTools}.repo
```

Confirm the changes made to the repo files:

```sh
(neutron-l3-agent)[root@exhilarated-firefly /]# grep baseurl /etc/yum.repos.d/CentOS-Linux-{BaseOS,AppStream,PowerTools}.repo | grep -v '#'
/etc/yum.repos.d/CentOS-Linux-BaseOS.repo:baseurl=http://vault.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/
/etc/yum.repos.d/CentOS-Linux-AppStream.repo:baseurl=http://vault.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/
/etc/yum.repos.d/CentOS-Linux-PowerTools.repo:baseurl=http://vault.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/
```

You will need to obtain the RPM for the required version manually, here we use
the `curl` command.

```sh
$ curl https://koji.mbox.centos.org/pkgs/packages/libreswan/3.32/6.el8/x86_64/libreswan-3.32-6.el8.x86_64.rpm --output libreswan-3.32-6.el8.x86_64.rpm
curl (https://koji.mbox.centos.org/pkgs/packages/libreswan/3.32/6.el8/x86_64/libreswan-3.32-6.el8.x86_64.rpm): response: 200, time: 0.150641, size: 1441280
```

Confirm download.

```sh
$ ls -alh libreswan-3.32-6.el8.x86_64.rpm
-rw-r--r--. 1 root root 1.4M Jun 27 19:13 libreswan-3.32-6.el8.x86_64.rpm
```

Install

```sh
$ yum --disablerepo=* --enablerepo=baseos,appstream,powertools downgrade libreswan-3.32-6.el8.x86_64.rpm
CentOS Linux 8 - AppStream                                                                                                84 kB/s | 3.9 kB     00:00    
CentOS Linux 8 - BaseOS                                                                                                   20 MB/s | 4.6 MB     00:00    
CentOS Linux 8 - PowerTools                                                                                               30 MB/s | 4.6 MB     00:00    
Dependencies resolved.
=========================================================================================================================================================
 Package                             Architecture                     Version                               Repository                              Size
=========================================================================================================================================================
Downgrading:
 libreswan                           x86_64                           3.32-6.el8                            @commandline                           1.4 M

Transaction Summary
=========================================================================================================================================================
Downgrade  1 Package

Total size: 1.4 M
Is this ok [y/N]: y
Downloading Packages:
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                                                                 1/1 
  Running scriptlet: libreswan-3.32-6.el8.x86_64                                                                                                     1/1 
  Downgrading      : libreswan-3.32-6.el8.x86_64                                                                                                     1/2 
  Running scriptlet: libreswan-3.32-6.el8.x86_64                                                                                                     1/2 
  Running scriptlet: libreswan-4.3-3.el8.x86_64                                                                                                      2/2 
  Cleanup          : libreswan-4.3-3.el8.x86_64                                                                                                      2/2 
  Running scriptlet: libreswan-4.3-3.el8.x86_64                                                                                                      2/2 
  Verifying        : libreswan-3.32-6.el8.x86_64                                                                                                     1/2 
  Verifying        : libreswan-4.3-3.el8.x86_64                                                                                                      2/2 

Downgraded:
  libreswan-3.32-6.el8.x86_64                                                                                                                            

Complete!
```

Exit the container and issue a restart with docker.

```sh
docker restart neutron_l3_agent
```

Repeat the above across the remaining nodes.

### Deploy Changes with Kolla Ansible

With this preparation complete you can now deploy the changes with
`kolla-ansible`. To deploy the changes, use Kolla Ansible's `reconfigure`
subcommand. For example:

```sh
$ kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory reconfigure
--- OUTPUT TRUNCATED ---
PLAY RECAP **********************************************************************************************************************************************
exhilarated-firefly        : ok=290  changed=22   unreachable=0    failed=0    skipped=187  rescued=0    ignored=0   
gifted-wildcat             : ok=454  changed=39   unreachable=0    failed=0    skipped=213  rescued=0    ignored=0   
localhost                  : ok=4    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
upbeat-peacock             : ok=290  changed=22   unreachable=0    failed=0    skipped=187  rescued=0    ignored=0
```

### Install Required Modules for Horizon Management

In our current deployment the VPNaaS modules for Horizon are not included by
default. You can use the steps below to install them manually.

First enter the Horizon container.

```sh
$ docker exec -it horizon /bin/bash
(horizon)[root@gifted-wildcat /]#
```

Next install the required modules with the `pip3` command with `--prefix /usr`.

```sh
$ pip3 install --prefix /usr neutron-vpnaas-dashboard
--- OUTPUT TRUNCATED ---
Installing collected packages: neutron-vpnaas-dashboard, enmerkar
Successfully installed enmerkar-0.7.1 neutron-vpnaas-dashboard-6.0.0
```

Then reconfigure Horizon on the container with the `kolla_extend_start` tool
(any deprecation errors such as the one below can be safely ignored).

```sh
$ kolla_extend_start
--- OUTPUT TRUNCATED ---
2498 static files copied to '/usr/lib/python3.6/site-packages/static'.
/usr/lib64/python3.6/site-packages/scss/namespace.py:172: DeprecationWarning: inspect.getargspec() is deprecated since Python 3.0, use inspect.signature() or inspect.getfullargspec()
  argspec = inspect.getargspec(function)
/usr/lib/python3.6/site-packages/django/contrib/staticfiles/templatetags/staticfiles.py:26: RemovedInDjango30Warning: {% load staticfiles %} is deprecated in favor of {% load static %}.
  RemovedInDjango30Warning,
Compressing... done
Compressed 7 block(s) from 12 template(s) for 0 context(s).
```

Restart the Horizon container.

```sh
docker restart horizon
```

Finally, repeat the above across the remaining nodes.
