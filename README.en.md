<p align="center"><img src="./icon.svg" width="88" height="88" alt="Left-side turn navigation icon"></p>

# DSH Left-side Turn Navigation

![MIT](https://img.shields.io/badge/license-MIT-green) ![DSH target](https://img.shields.io/badge/DSH_target-0.2.1--rc.5-blue)

[简体中文](./README.md)

Reposition DSH's existing native turn navigation to the left with CSS and adjust its preview placement. History loading, previews, active-turn state and keyboard handling remain provided by DSH. This package does not add a second navigator or change message-body virtualization.

## Compatibility and limitations

- **DSH 0.2.1-rc.5** is the known target and the only version declared in the manifest. Other versions have not been verified. Installation, browser testing and screenshots of this release copy remain pending.
- A conversation must contain at least two turns, and DSH must have created its native navigation.
- The display override uses `@container (width > 480px)`: a CSS container strictly wider than 480px, rather than the browser viewport. Narrower containers retain the host's display rules.
- Selectors only recognize a native `nav` with `aria-label="轮次导航"` or `aria-label="Turn navigation"`. Other localized accessible names do not match.
- This limited CSS override depends on internal DOM, container queries and theme tokens. Changes to the host's navigation structure, labels or layout may require updates.
- Disabling or unloading the plugin removes its style element and restores the host's current layout. It does not modify conversations or official installation files.

No release screenshot is available yet. A screenshot may be added after real browser validation; this page does not include a mock image or a missing screenshot link.

## Install

This standard Cordis plugin package needs no build step or third-party dependencies. Install from GitHub into the profile you actually use; this example uses `web`:

```sh
dsh plugin --profile web add "github:gaoerge/dsh-turn-navigator#main"
```

Alternatively, download or clone the repository and install its absolute path. Replace the profile name and example path:

```powershell
dsh plugin --help
dsh plugin --profile your-profile add "D:\plugins\dsh-turn-navigator"
```

The command syntax was checked against the local `dsh plugin --help`: it forwards pnpm arguments such as `add` to the profile. Adding the package is followed by checking and enabling its bundle in DSH's plugin manager. If the running instance has not loaded it, follow the UI's restart guidance and refresh the page. DSH's bundle installation UI can also select this directory.

The package name remains `@local/dsh-turn-navigator`, the Loader row ID is `local-turn-navigator`, and the Client module ID is `@local/dsh-turn-navigator`. If the same local plugin already exists in your profile, update the existing entry rather than adding a duplicate navigator.

## Disable or remove

Disable the bundle in the plugin manager first and confirm that the native layout returns. To remove the package from the same profile:

```powershell
dsh plugin --profile your-profile remove @local/dsh-turn-navigator
```

Restart DSH and refresh the page if requested by the UI. Removal does not delete conversations.

## Offline checks

Use a local Node.js and npm installation; Node.js 22 is recommended. These commands do not install dependencies, start DSH or run npm lifecycle scripts:

```powershell
npm run check
npm pack --dry-run --ignore-scripts --json
```

`npm run check` runs JavaScript syntax checks and `scripts/verify.mjs`. The verifier uses only Node built-ins to check the manifest, explicit `exports` / `files`, bilingual metadata, SVG and resource boundaries, and rejects backups or experimental patches. Review the dry-run's actual package file list. Offline checks do not establish visual correctness.

## Package contents

Runtime files are `index.js`, `client.js` and `cordis.patch.yml`, accompanied by the manifest, original SVG icon, bilingual metadata, documentation and verifier. Official-module backups, `viewport-rendering.js`, `apply-viewport-patch.cjs` and message-body virtualization patches are excluded.

## License

Code and original repository artwork are available under the [MIT License](./LICENSE), Copyright (c) 2026 gaoerge.
