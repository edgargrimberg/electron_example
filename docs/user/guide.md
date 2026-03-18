# User Guide

Welcome to the Electron OPC UA App! This guide will help you get started with connecting to OPC UA servers and browsing their nodes.

## Overview

This application allows you to:
- Connect to OPC UA servers
- Browse available nodes
- View real-time node values
- Configure authentication credentials

## Getting Started

1. Launch the application
2. The app will attempt to connect to the default OPC UA server
3. If connection fails, configure a different endpoint

## Connecting to a Server

### Using the Interface

1. Select an endpoint from the dropdown or choose "Custom..."
2. If "Custom..." is selected, enter the full OPC UA endpoint URL
3. Click "Apply" to connect

### Default Endpoints

- **Milo Demo Server**: `opc.tcp://milo.digitalpetri.com:62541/milo`
- **Localhost**: `opc.tcp://localhost:4840` (default)

### Environment Variable

You can also set the endpoint before starting:
```bash
OPCUA_ENDPOINT=opc.tcp://your-server:4840 electron-app
```

## Authentication

If the server requires authentication:

1. Select "Username/Password" from the Mode dropdown
2. Enter your username and password
3. Click "Apply"

Credentials are stored locally in your browser's localStorage.

## Browsing Nodes

Once connected, the app will:
1. Display connection status
2. Show server information
3. List available OPC UA nodes under "ObjectsFolder"

### Node Information

Each node shows:
- Node ID
- Browse name
- Current value (if readable)

## Troubleshooting

### Connection Issues

- **"No nodes found"**: The server may not expose nodes under ObjectsFolder
- **Connection timeout**: Check if the server is running and accessible
- **Authentication failed**: Verify credentials and server configuration

### Clearing Data

If you encounter issues:
1. Close the application
2. Clear browser data or remove the app's user data directory
3. Restart the application

## Advanced Usage

### Custom Endpoints

Enter any valid OPC UA endpoint URL in the format:
```
opc.tcp://hostname:port/path
```

### Logging

Check the application logs in the terminal/console for detailed error information.

## Support

For issues or questions, check the application logs and ensure your OPC UA server is properly configured.