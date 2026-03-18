# Electron OPC UA App

Small Electron app that connects to an OPC UA server and shows node values in the renderer.

## Project Structure

```
electron-app/
├── src/                    # Main process and preload scripts
│   ├── main.js            # Electron main process
│   └── preload.js         # Preload script for secure IPC
├── public/                # Static assets for renderer process
│   ├── index.html         # Main HTML file
│   └── renderer.js        # Renderer process script
├── docs/                  # Detailed documentation
│   ├── README.md          # Documentation index
│   ├── development/       # Developer guides
│   ├── user/              # User documentation
│   └── api/               # API references
├── package.json           # Project dependencies and scripts
├── forge.config.js        # Electron Forge configuration
└── README.md              # This file
```

## Documentation

For detailed documentation, see the [docs/](docs/) folder:
- [Development Setup](docs/development/setup.md)
- [User Guide](docs/user/guide.md)
- [API Reference](docs/api/)

## Prerequisites
- Node.js LTS
- npm

## Install Dependencies
```bash
npm install
```

## Run (Dev)
```bash
npm start
```

### Configure OPC UA Endpoint
By default the app connects to `opc.tcp://milo.digitalpetri.com:62541/milo`.
Override with:
```bash
OPCUA_ENDPOINT=opc.tcp://YOUR_SERVER:4840 npm start
```

## Debug in VS Code
The easiest flow is to launch from VS Code with a `launch.json` and set breakpoints in `src/main.js`, `src/preload.js`, and `public/renderer.js`.

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Electron Main",
      "type": "pwa-node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start"],
      "cwd": "${workspaceFolder}",
      "env": {
        "OPCUA_ENDPOINT": "opc.tcp://localhost:4840"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Electron Renderer",
      "type": "pwa-chrome",
      "request": "attach",
      "port": 9222,
      "timeout": 30000,
      "webRoot": "${workspaceFolder}/public"
    }
  ]
}
```

Then:
1. Start `Electron Main` in VS Code.
2. Open DevTools in the app window (`View` → `Toggle Developer Tools`).
3. If you want renderer debugging with VS Code, relaunch Electron with `--remote-debugging-port=9222`:
   - Edit the `start` script in `package.json` to:
     ```json
     "start": "electron-forge start -- --remote-debugging-port=9222"
     ```
   - Then run the `Electron Renderer` config.

## Useful Development Tips
- Clear app data if you hit weird state: close the app and remove the Electron user data directory.
- Keep the OPC UA endpoint in an `.env` file or shell profile for convenience.
- If you see `No nodes found`, confirm the server is running and exposes nodes under `ObjectsFolder`.
- To inspect IPC results, check the renderer console output.

## Build / Package
```bash
npm run package
npm run make
```
