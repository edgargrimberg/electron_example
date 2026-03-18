# Main Process API

This document describes the main process APIs available in the Electron OPC UA App.

## File Structure

- `src/main.js` - Main Electron process
- `src/preload.js` - Preload script for secure IPC

## IPC Channels

### Main Process → Renderer

#### `opcua-status-update`

Sent when the OPC UA connection status changes.

**Payload**:
```javascript
{
  status: "connecting" | "connected" | "disconnected" | "error",
  message: string,
  server?: string
}
```

#### `opcua-nodes-update`

Sent when the node list is updated.

**Payload**:
```javascript
{
  nodes: Array<{
    nodeId: string,
    browseName: string,
    value?: any,
    timestamp?: string
  }>
}
```

### Renderer → Main Process

#### `opcua-connect`

Initiates connection to an OPC UA server.

**Payload**:
```javascript
{
  endpointUrl: string,
  credentials: {
    mode: "anonymous" | "username",
    username?: string,
    password?: string
  }
}
```

#### `opcua-disconnect`

Disconnects from the current OPC UA server.

**Payload**: None

## Functions

### Main Process Functions

#### `getUserIdentity()`

Returns the user identity object for OPC UA authentication.

**Returns**: `UserTokenType` object

#### `fetchOpcUaNodes()`

Fetches and caches OPC UA nodes from the server.

**Returns**: Promise resolving to node array

#### `createWindow()`

Creates the main application window.

**Parameters**: None

## Preload Script

The preload script exposes secure APIs to the renderer:

```javascript
// In renderer.js
const { ipcRenderer } = require('electron')

// Send messages
ipcRenderer.send('opcua-connect', { endpointUrl, credentials })

// Listen for messages
ipcRenderer.on('opcua-status-update', (event, data) => {
  // Handle status update
})
```

## Security

- All IPC communication goes through the preload script
- Direct access to Node.js APIs is blocked in the renderer
- Context isolation is enabled

## Error Handling

Errors are logged to the console and may trigger status updates with error messages.