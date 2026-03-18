# Renderer Process API

This document describes the renderer process APIs and DOM interactions in the Electron OPC UA App.

## File Structure

- `public/index.html` - Main HTML interface
- `public/renderer.js` - Renderer process logic

## DOM Elements

### Status Elements

- `#info` - Application version information
- `#opcua-status` - Connection status text
- `#opcua-server` - Current server URL
- `#opcua-steps` - Connection step log (UL)
- `#opcua-nodes` - Node list (UL)

### Form Elements

- `#opcua-credentials` - Credentials form
- `#opcua-credential-mode` - Auth mode select (anonymous/username)
- `#opcua-username` - Username input
- `#opcua-password` - Password input
- `#opcua-endpoint-form` - Endpoint form
- `#opcua-endpoint-select` - Endpoint preset select
- `#opcua-endpoint-input` - Custom endpoint input

## JavaScript API

### Global Functions

#### `updateCredentialUI()`

Updates the credential form UI based on the selected auth mode.

**Parameters**: None

#### `loadCredentialsFromStorage()`

Loads saved credentials from localStorage and populates the form.

**Parameters**: None

#### `saveCredentialsToStorage()`

Saves current credentials to localStorage.

**Parameters**: None

### Event Handlers

#### Credential Form Submit

Handles credential form submission:
- Updates stored credentials
- Sends new credentials to main process
- Reconnects if already connected

#### Endpoint Form Submit

Handles endpoint form submission:
- Gets selected or custom endpoint URL
- Sends connect request to main process

### IPC Event Listeners

#### `opcua-status-update`

Updates the status display and server info.

**Data**:
```javascript
{
  status: string,
  message: string,
  server?: string
}
```

#### `opcua-nodes-update`

Updates the node list display.

**Data**:
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

## Data Storage

### localStorage Keys

- `opcua.credentials.mode` - Authentication mode
- `opcua.credentials.username` - Username
- `opcua.credentials.password` - Password

## Renderer Context

The renderer runs in a Chromium browser context with:
- Access to DOM APIs
- Limited Node.js access through preload script
- IPC communication with main process
- localStorage for persistent data

## Styling

The interface uses default browser styling. Custom CSS can be added to `index.html` for enhanced appearance.