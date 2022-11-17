# Backing Up Important Data

## Overview

If you store any customer of personal data on your VMs, it is important to make
regular backups. As data can be corrupted or become otherwise inaccessible for
a number of reasons (accidental deletion, misconfigurations, hacking, etc).
Having a recent backup on hand makes it much easier to recover from the
unforeseen.

## Determining needs

Backups are never one-size-fits-all. Prior to making your first backup, it is
important to consider what needs to be backed up in your environment.

### What to back up

Consider what data on your VM would be difficult or impossible to replace if
lost. Here are some common examples:

- **CMS websites**: Websites such as those built on WordPress, Drupal, and
  Magento, store content in a database. Make sure a database dump is included
  in your backup.

- **Email**: If you run a mail server on your VM, you should back up the raw
  mail files.

- **Media**: Images, videos and audio files.

- **Customer Data**: Data related to customer sales and financial transactions
  are often stored in a database, if this is the case you will want to include
  a database dump in your backup.

- **Custom backend**: If your VM took a long time to set up or is otherwise
  highly customized, consider performing a root level backup of the entire
  server. At minimum your software configuration settings should be stored, in
  addition to your pubic-facing content.

Once you have determined the items that need to be backed up, locate those
files on your server. Make a list of the specific file paths and any related
databases for each item.

The type of backup you create is also important as its format affects what can
be done with it later. Consider the circumstances under which you will be
performing the restoration to determine the best backup method for your
environment. Two basic types of backup are outlined below:

- **File-system backup**: This method consists of copying all or part of your
  file-system, along with its structure and permissions. It is good for HTML
  files, software configuration files, email, and media. If you later restore
  the file system backup to a VM, it should work as it did before. If files
  are backed up without preserving their permissions, you will have the content,
  but it may increase the time it will take to get a restoration working.

- **Database dump**: File-system backups are usually not the best choice when
  backing up databases. A full-server snapshot will of course also restore your
  databases, but raw database files are fairly useless in a partial backup context.
  Running a SQL dump or something similar is better: you will get a human-readable
  file of SQL commands, which can then be imported to any other server running
  the same database type.

Determine the type of backup you need (file-system backup, database dump, or
both). If both are needed the database dump should be made first so that the
dump file can be saved as part of the file-system backup.

### When to back up

Next you should consider how often your data needs to be backed up. The primary
concern should be how often the server content changes, and how critical it is
that those changes are captured. Here we outline recommended backup intervals
for some common configurations:

- **Online Store**: At least daily
- **Blog or news site**: As often as it's updated
- **Development server**: As often as you make changes
- **Game server**: At least daily
- **Static site**: Every six months, or before and after making significant changes
- **Email server**: At least daily

Your requirements should help to determine if a manual backup tool is sufficient
or an automated process is needed.

## Where to store backups

You should now think about where you want to store your backups. Some popular
storage locations are outlined here:

- **Same server**: While this is the easiest place to store your backups, it
  is not recommended for anything other than temporary storage. If your server
  becomes corrupted, accidentally erased or hacked at the root level, your
  backups will also be lost.

- **Different server**: The most secure option is to create a server dedicated
  to storing backups. When following best practices this server will be isolated
  from your production environment.

- **Personal device**: You can back up to your desktop computer or a portable
  hard drive. However, your home office is probably not as secure as a
  professional data center, and your hardware is likely not as resilient.

You should also consider how many backups your storage platform can hold. In
most cases you will want to save _at least_ two backups (an older, reliable
copy and a recent one). It is always best to save more backups as the quantity
is only limited by your available disk space.

## Backup rotation

Lastly, you should decide how long to retain your backups and how many to store
at once. While one backup is better than none, in most cases you will want
_at least_ two. For example, if you replace your backup every day, and don’t
retain any of your old ones, you would be out of luck if you discovered that
your website had been hacked a week ago. The safest option is to store backups
as frequently as possible without overwriting them. Just make sure you don’t
run out of space on your backup machine. Backup methods that include compression
and other efficiencies make storing multiple backups much easier.

## Periodic backup testing

Once you have a backup method in place it is recommended you perform periodic
integrity testing. An incorrect or corrupted backup is, in a way, worse than no
backup at all as it can provide a false sense of security. Testing is normally
done by restoring the most recently archived backup into a development environment
identical to production, allowing you to confirm everything will function as
expected if disaster recovery is ever required.
