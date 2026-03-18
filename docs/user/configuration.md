# Configuration

This document describes the configuration options available in the Electron OPC UA App.

## Environment Variables

### OPCUA_ENDPOINT

Sets the default OPC UA server endpoint.

**Default**: `opc.tcp://milo.digitalpetri.com:62541/milo`

**Usage**:
```bash
OPCUA_ENDPOINT=opc.tcp://localhost:4840 npm start
```

## Application Settings

### Credentials Storage

User credentials are stored locally using the browser's localStorage:
- `opcua.credentials.mode`: "anonymous" or "username"
- `opcua.credentials.username`: Username (if using username auth)
- `opcua.credentials.password`: Password (if using username auth)

### Clearing Stored Data

To reset all stored settings:
1. Open DevTools (View → Toggle Developer Tools)
2. Go to Application/Storage → Local Storage
3. Remove the `opcua.*` keys

Or delete the entire Electron user data directory.

## Electron Configuration

The app uses Electron Forge for packaging. Configuration is in `forge.config.js`:

- **asar**: true - Packages app into ASAR archive
- **makers**: Configured for multiple platforms (squirrel, zip, deb, rpm)
- **plugins**: Auto-unpack natives, fuses for security

## Development Configuration

### VS Code Launch Configuration

See [Debugging Guide](../development/debugging.md) for VS Code setup.

### Remote Debugging

To enable Chrome DevTools remote debugging:
```bash
npx electron-forge start -- --remote-debugging-port=9222
```

## Build Configuration

### Package Configuration

Modify `forge.config.js` to change:
- Output directories
- Platform targets
- Icon settings
- Additional resources

### Custom Build Scripts

Add scripts to `package.json` for custom build processes.

## Security Considerations

- Credentials are stored in plain text in localStorage
- Consider using secure storage for production applications
- The app uses Electron fuses to disable Node.js options in production