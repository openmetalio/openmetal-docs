---
slug: /openstack-admin/access-swift-s3-api
description: Learn how to generate EC2 credentials in OpenStack for Swift S3 API access.
sidebar_position: 7
---
# Create EC2 Credentials for Swift S3 API Access

## Objective

Generate EC2 credentials to access and manage Ceph backed object storage
containers through Swift's middleware emulation of the S3 REST API on your
OpenMetal private cloud.

See the OpenStack [S3/Swift REST API Comparison Matrix](https://docs.openstack.org/swift/latest/s3_compat.html)
for compatibility information.

## Prerequisites

- [OpenStack CLI client](/operators-manual/day-1/command-line/openstackclient)

## EC2 credentials

To generate an S3 token, you need 2 parameters (**access** and **secret**).
These credentials are stored securely in Keystone and can be managed with the
OpenStack CLI client.

### Create credentials

The command below generates access keys. It defaults to the currently authorized
user and project as determined by `clouds.yaml`, `<user>-openrc.sh`, etc:

```bash
$ openstack ec2 credentials create
+------------+---------------------------------------------------------------------------------------------------------+
| Field      | Value                                                                                                   |
+------------+---------------------------------------------------------------------------------------------------------+
| access     | 9a5fc02e2ed64a7cad249a8477d79203                                                                        |
| links      | {'self': 'http://173.231.217.68:5000/v3/users/0aa830b5853d4d419cdcab81b9652bc5/credentials/OS-          |
|            | EC2/9a5fc02e2ed64a7cad249a8477d79203'}                                                                  |
| project_id | fd14980cc0f24e829d51c68ef78ee530                                                                        |
| secret     | 3806359744e54aa3828285c3b56f8f83                                                                        |
| trust_id   | None                                                                                                    |
| user_id    | 0aa830b5853d4d419cdcab81b9652bc5                                                                        |
+------------+---------------------------------------------------------------------------------------------------------+
```

Admin users can specify an optional `--user` and/or `--project` as required:

```bash
$ openstack ec2 credentials create --user s3demo --project s3-demo --fit-width 
+------------+-------------------------------------------------------------------------------------------------------+
| Field      | Value                                                                                                 |
+------------+-------------------------------------------------------------------------------------------------------+
| access     | 18b744a314fa4165960e55af2e0539b3                                                                      |
| links      | {'self': 'http://192.168.2.254:5000/v3/users/a19f86a6f1044c5bb28a508f8054257c/credentials/OS-         |
|            | EC2/18b744a314fa4165960e55af2e0539b3'}                                                                |
| project_id | 6016837b33f64cf38b5214a8aeb7fb8f                                                                      |
| secret     | f98dfdda3e694360ab052592c9f44d43                                                                      |
| trust_id   | None                                                                                                  |
| user_id    | a19f86a6f1044c5bb28a508f8054257c                                                                      |
+------------+-------------------------------------------------------------------------------------------------------+
```

### List existing credentials

List all credentials for the current project:

```bash
$ openstack ec2 credentials list 
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
| Access                           | Secret                           | Project ID                       | User ID                          |
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
| 981ff83b99024abfaefcbda63b5d48d1 | a12c509175d04962b81183755d1698e3 | fd14980cc0f24e829d51c68ef78ee530 | 0aa830b5853d4d419cdcab81b9652bc5 |
| 6764bd24e4754b89b30c51c46b5b2311 | 76f09960a6b148acb906604dc269616b | fd14980cc0f24e829d51c68ef78ee530 | 0aa830b5853d4d419cdcab81b9652bc5 |
| 9a5fc02e2ed64a7cad249a8477d79203 | 3806359744e54aa3828285c3b56f8f83 | fd14980cc0f24e829d51c68ef78ee530 | 0aa830b5853d4d419cdcab81b9652bc5 |
| cf5ed0e704004991885358fc9f4b118e | cd898b7c8a0c4bad8dac1c3853075612 | fd14980cc0f24e829d51c68ef78ee530 | 0aa830b5853d4d419cdcab81b9652bc5 |
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
```

List credentials for a specific user:

```bash
$ openstack ec2 credentials list --user s3demo
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
| Access                           | Secret                           | Project ID                       | User ID                          |
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
| 18b744a314fa4165960e55af2e0539b3 | f98dfdda3e694360ab052592c9f44d43 | 6016837b33f64cf38b5214a8aeb7fb8f | a19f86a6f1044c5bb28a508f8054257c |
| e2053effd013413fac4a4e320007e827 | 61a632d402884e32b9371b8fb46a91a4 | 6016837b33f64cf38b5214a8aeb7fb8f | a19f86a6f1044c5bb28a508f8054257c |
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
```

### Delete credentials

Credentials are deleted by calling the `access` ID. Success returns no output:

```bash
openstack ec2 credentials delete e2053effd013413fac4a4e320007e827
```

## What's Next?

Look forward to future use case articles as we expand our documentation.

- [How to Configure and Use AWS Client for Swift S3 API Access on OpenMetal](swift-s3-aws-cli.md)
- [How to Configure and Use s3cmd for Swift S3 API Access on OpenMetal](swift-s3cmd-cli.md)

## Resources

- [Swift AWS S3 Api middleware](https://docs.openstack.org/swift/latest/middleware.html#module-swift.common.middleware.s3api.s3api)
