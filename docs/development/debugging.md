# Debugging Guide

This guide explains how to debug the Electron OPC UA App using VS Code.

## VS Code Configuration

Create `.vscode/launch.json` in the project root:

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

## Debugging Steps

### Main Process Debugging

1. Set breakpoints in `src/main.js` or `src/preload.js`
2. Run the "Electron Main" configuration from VS Code
3. The debugger will attach to the main process

### Renderer Process Debugging

1. Set breakpoints in `public/renderer.js`
2. Start the app with remote debugging enabled:
   ```bash
   npx electron-forge start -- --remote-debugging-port=9222
   ```
3. Run the "Electron Renderer" configuration from VS Code
4. The debugger will attach to the renderer process

### Alternative: DevTools

For quick inspection:
1. Start the app normally: `npm start`
2. Open DevTools: View → Toggle Developer Tools
3. Use the Console and Sources tabs for debugging

## Common Issues

- **Breakpoints not hitting**: Ensure the correct file paths are used (e.g., `src/main.js` not `main.js`)
- **Renderer debugging not connecting**: Make sure the app is started with `--remote-debugging-port=9222`
- **Source maps**: If using compiled code, ensure source maps are enabled

## Tips

- Use `console.log()` in renderer code for quick debugging
- Check the terminal output for main process logs
- Clear app data if you encounter state issues: remove the Electron user data directory