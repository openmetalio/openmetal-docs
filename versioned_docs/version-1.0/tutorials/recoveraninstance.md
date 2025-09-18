# Recover an Instance Using Horizon

This guide provides instructions for how to recover a failed instance
through the Horizon Dashboard. If an instance becomes inaccessible,
there is an option to reboot the instance from within Horizon. You can
also run commands directly on your instance through Horizon using the
console. Outlined with this guide is how to reboot an instance through
Horizon and how to access the console.

## Rebooting an Instance Through Horizon

To reboot an instance through your Horizon dashboard, navigate to
**Admin -\> Compute -\> Instances**. Within this dashboard, lists the
instances of your project as well as their status.

**Figure 1:** List of Running Instances Within Horizon

![image](images/figure1.png)

To reboot an instance, click the small arrow next to the button **Rescue
Instance**. Depending on the current status of your instance you have
the options to Soft Reboot Instance and Hard Reboot Instance

- Soft Reboot Instance - attempts a graceful shutdown and restart of
    instance
- Hard Reboot Instance - power cycles instance

**Note:** Because of the use of Ceph, the rebuild function will not
work.

**Figure 2:** Link to Drop Down Menu

![image](images/figure2.png)

**Figure 3:** Actions Menu for Working With Instance Functions

![image](images/figure3.png)

Once you have rebooted your instance, you can check the status by
attempting to SSH into the instance. If you are still unable to access
your instance after a hard reboot, attempt to use the console to access
the instance.

## Accessing Instance Console Through Horizon

To access the Instance Console, navigate to **Admin -\> Compute -\>
Instances** and click on the name of the instance that you wish to
access.

**Figure 4:** Name of Instance to Access Console

![image](images/figure4.png)

From the options menu, select **Console** from the upper left menu to
access the console page.

**Figure 5:** Console Page of Instance

![image](images/figure5.png)

Within the console page, a root user or superuser password is required.
Input the login credentials of the user with appropriate access to the
instance. If still accessible, your instance should accept commands
through its console.

**Figure 6:** Console Access Demonstration

![image](images/figure6.png)
