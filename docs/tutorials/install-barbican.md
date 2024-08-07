---
sidebar_position: 7
---
# How to Utilize OpenStack Barbican on your OpenMetal Cloud

## Prerequisite

- Familiarity with OpenStackClient

## Step 1 - Verify that the Barbican endpoints are there

```bash
(.venv) [root@fierce-possum kolla]# openstack endpoint list --service barbican
+----------------------------------+--------+--------------+--------------+---------+-----------+---------------------------+
| ID                               | Region | Service Name | Service Type | Enabled | Interface | URL                       |
+----------------------------------+--------+--------------+--------------+---------+-----------+---------------------------+
| bbebfdc0f6ce4f9895d536785fa3cfea | iad3   | barbican     | key-manager  | True    | public    | http://200.225.44.4:9311  |
| c7c9861c34ed44de8a3f65b9d74f80fa | iad3   | barbican     | key-manager  | True    | admin     | http://192.168.2.254:9311 |
| da1d9afd031f470d80866256884ef242 | iad3   | barbican     | key-manager  | True    | internal  | http://192.168.2.254:9311 |
+----------------------------------+--------+--------------+--------------+---------+-----------+---------------------------+
```

## Step 2 - Install the Barbican OpenStack CLI

While in your virtual environment, install the OpenStack CLI library for secret
storage.

```bash
(.venv) [root@fierce-possum kolla]# pip install python-barbicanclient
```

## Step 3 - Create a test secret

To validate Barbican's functionality, run the following command to create your
first test secret.

```bash
(.venv) [root@fierce-possum kolla]# openstack secret store --name my_secret --payload 'This is a secure statement'
+---------------+--------------------------------------------------------------------------+
| Field         | Value                                                                    |
+---------------+--------------------------------------------------------------------------+
| Secret href   | http://200.225.44.4:9311/v1/secrets/973cffdb-d4b1-418c-befa-9f67d77a982b |
| Name          | my_secret                                                                |
| Created       | None                                                                     |
| Status        | None                                                                     |
| Content types | None                                                                     |
| Algorithm     | aes                                                                      |
| Bit length    | 256                                                                      |
| Secret type   | opaque                                                                   |
| Mode          | cbc                                                                      |
| Expiration    | None                                                                     |
+---------------+--------------------------------------------------------------------------+ 
```
