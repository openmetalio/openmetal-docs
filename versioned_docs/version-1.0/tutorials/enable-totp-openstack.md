# Configuring Time-Based One-Time Password (TOTP) on OpenStack

Author: Ramon Grullon

## Introduction

Horizon added time-based one-time password (TOTP) authentication support,
leveraging the already existing two factor authentication from Keystone.
Now, if a user activates TOTP on Keystone, it gets activated on Horizon too.

## Prerequisites

- A working OpenStack 2023.2 environment deployed using kolla-ansible.
- [Keystone and Horizon reconfigured with TOTP enabled](https://www.openstack.org/blog/new-in-openstack-bobcat-horizon-team-introduces-time-based-one-time-password-totp-authentication-support/)
- Admin access to the OpenStack dashboard and CLI.
- Access to the kolla-ansible configuration files.

### Create and Configure a TOTP Credential

On one of your control nodes with OpenStack CLI configured:

TOTP uses a base32 encoded string for the secret. The secret must be at least
128 bits (16 bytes). The following bash code can be used to generate a TOTP secret:

```bash
echo "iam16characters." | base32 | tr -d "="
```

Example output:

```bash
GEZDGNBVGY3TQOJQGEZDGNBVGY

```

### Configure credentials and MFA rules for user

Create and configure a user to utilize TOTP

```bash
openstack user create --project admin --domain default --project-domain default --password-prompt --enable-multi-factor-auth --multi-factor-auth-rule password,totp mfa-member

openstack role add --user mfa-member --project admin member

openstack credential create --type totp mfa-member GEZDGNBVGY3TQOJQGEZDGNBVGY

```

### Set Up TOTP

This typically involves scanning a QR code with a TOTP app like Google Authenticator.
On a device install Google Authenticator and inside the app click on
‘Set up account’ and then click on ‘Enter provided key’. In the input fields
enter account name and secret.

To quickly verify your configuration you can use <https://totp.app> and enter your
secret to get your code.

Verify TOTP Authentication

1. Log out of the OpenStack dashboard.

2. Attempt to log back in. After entering your password, you should be prompted to
enter your TOTP code.

3. Enter TOTP Code:

![totp](/img/tutorials/totp-login.png)

Open your TOTP app and enter the current code to complete the login process.

By following these steps, you should have successfully enabled TOTP
authentication in OpenStack 2023.2 using kolla-ansible, allowing users to
enhance the security of their accounts with TOTP through the Horizon dashboard.

## References

- <https://docs.openstack.org/keystone/latest/admin/auth-totp.html>
- <https://www.youtube.com/watch?v=JEniPHp1l74>
