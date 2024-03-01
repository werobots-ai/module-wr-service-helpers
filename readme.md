# module-wr-service-helpers

## Overview

`module-wr-service-helpers` is a utility library designed to simplify common tasks for service development within the werobots-ai ecosystem. It provides helper functions such as unique ID generation and Dapr service URL retrieval, streamlining the integration and utilization of these utilities in your projects.

## Installation

To add `module-wr-service-helpers` to your project, use the following command:

```bash
npm i https://github.com/werobots-ai/module-wr-service-helpers
```

This command fetches the latest version of the module and installs it in your project. You can use the same command to update the module to the latest version.

## Usage

After installation, you can import and use the provided functions in your project as follows:

```typescript
import { generateUniqueId, getDaprUrl } from "module-wr-service-helpers";

const uniqueId = generateUniqueId();
```

## Contributing

To contribute to `module-wr-service-helpers`, follow these steps:

1. **Modify/Add Files in `src`:** Implement your changes or add new files in the `src` directory.
2. **Update `index.ts`:** If you add or remove files, update `index.ts` in the `src` directory accordingly to export the new or updated functionalities.
3. **Build:** Changes in the `src` directory will automatically build the `dist` folder upon commit, thanks to Husky integration.

## Installation in Projects

To use the updated module in your project, either add it for the first time or update it using the same installation command mentioned above.
