# module-wr-service-helpers

## Overview

`module-wr-service-helpers` is a utility library designed to simplify common tasks for service development within the werobots-ai ecosystem. It provides helper functions such as unique ID generation, streamlining the integration and utilization of these utilities in your projects.

## Installation

To add `module-wr-service-helpers` to your project, use the following command:

```bash
npm i https://github.com/werobots-ai/module-wr-service-helpers
```

This command fetches the latest version of the module and installs it in your project. You can use the same command to update the module to the latest version.

### Bulk Update `@werobots-ai/module-wr-service-helpers` Version in All `package.json` Files

To update all instances of `@werobots-ai/module-wr-service-helpers` to the latest version across multiple `package.json` files using VSCode:

1. Open the **Find and Replace** panel (`Ctrl + Shift + H` or `Cmd + Shift + H` on macOS).
2. Enable **Regex Search** by clicking the `.*` icon.
3. In the **Search** field, enter the following regex to locate the package version:

   ```regex
   "@werobots-ai/module-wr-service-helpers":\s*"[^"]+"
   ```

4. In the **Replace** field, input the desired version, e.g.,:

   ```json
   "@werobots-ai/module-wr-service-helpers": "^latest-version"
   ```

5. Set `files to include` to `package.json` to avoid modifying `package-lock.json`.
6. Click **Replace All** to update all occurrences.

This will replace all instances with the specified version in `package.json` files only.

Replace `^latest-version` with the actual version you need. This ensures only `package.json` files are modified, leaving `package-lock.json` updates to another install script.

## Usage

After installation, you can import and use the provided functions in your project as follows:

```typescript
import { generateUniqueId } from "module-wr-service-helpers";

const uniqueId = generateUniqueId();
```

## Contributing

To contribute to `module-wr-service-helpers`, follow these steps:

1. **Modify/Add Files in `src`:** Implement your changes or add new files in the `src` directory.
2. **Update `index.ts`:** If you add or remove files, update `index.ts` in the `src` directory accordingly to export the new or updated functionalities.
3. **Build:** Changes in the `src` directory will automatically build the `dist` folder upon commit, thanks to Husky integration.

## Installation in Projects

To use the updated module in your project, either add it for the first time or update it using the same installation command mentioned above.
