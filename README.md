# Docs
This repository builds the documentation found here: https://openmetal.io/docs/manuals and public API documentation found here: https://openmetal.io/docs/manuals/api

# Contributing

All documentation exists within the `docs/` directory. Simply create or update the markdown files, and the documentation site will be updated after the changes have been merged into main.

## Contributing to the Operator's Manual

The Operator's Manual has differing versions depending on the PCC release.

The following lists the different PCC versions and which OpenStack release they correspond to:
| PCC Version  | OpenStack Release |
|--------------|-------------------|
| 3.0 (latest) | 2023.2 (Bobcat) |
| 2.0          | Yoga            |
| 1.0          | Victoria        |

### Updating the latest version

To update the latest version of the Operator's Manual, make changes in the [versioned_docs/operators-manual]() directory.

### Updating Older Versions

Older versions are located in [operators_versioned_docs](). If changes need to be made to the PCC 2.0 release of the Operator's Manual, use the directory [operators_versioned_docs/version-2.0]().

# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern
static website generator.

## Installation

### Prerequisites
This readme assumes that you already have node 14 or greater installed. To perform this install on Ubuntu, we run the following

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install node
npm install --global yarn
```

### Install Dependencies
```sh
yarn
```

### Local Development

```sh
yarn start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

### Build

```sh
yarn build
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.

### Deployment

Using SSH:

```sh
USE_SSH=true yarn deploy
```

Not using SSH:

```sh
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way
to build the website and push to the `gh-pages` branch.
