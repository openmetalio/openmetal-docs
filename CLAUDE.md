# CLAUDE.md

This repo builds OpenMetal's public documentation at https://openmetal.io/docs/manuals with Docusaurus 2.

The audience is customers and the public. Everything committed here is public, whether or not the site builds it.

Use the `write-docs` skill when writing or editing pages, and the `review-docs` skill before reporting docs work done.

## Layout

| Path | Contents |
|---|---|
| `docs/` | Main docs: users manual, Central, bare metal, tutorials |
| `versioned_docs/operators-manual/` | Current Operator's Manual, PCC v4 |
| `operators_versioned_docs/version-X.X/` | Archived manual versions 3.0, 2.0, 1.0 |
| `sidebars/` | Sidebars for both docs instances |
| `docusaurus.config.js` | Site config, docs instances, versions, redirects |
| `api/` | OpenAPI spec, built with Redocly |
| `lint-rules/` | Custom markdownlint rules |

`README.md` lists the PCC to OpenStack version mapping and the procedure for a new manual version.

## Commands

```shell
npm start              # dev server, http://localhost:3000/docs/manuals/
npm run build
npm run lint           # docs/ and the current manual
npm run lint-fix
npm run api-docs:build
```

The repo tracks `yarn.lock` and ignores `package-lock.json`. Add dependencies with `yarn add`.
