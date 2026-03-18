# Development Setup

This guide covers setting up the development environment for the Electron OPC UA App.

## Prerequisites

- Node.js LTS (version 18 or higher)
- npm (comes with Node.js)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd electron-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Project Structure

The project follows this structure:
```
electron-app/
├── src/                    # Main process and preload scripts
│   ├── main.js            # Electron main process
│   └── preload.js         # Preload script for secure IPC
├── public/                # Static assets for renderer process
│   ├── index.html         # Main HTML file
│   └── renderer.js        # Renderer process script
├── docs/                  # Documentation
├── package.json           # Project dependencies and scripts
├── forge.config.js        # Electron Forge configuration
└── README.md              # Project overview
```

## Running the Application

### Development Mode
```bash
npm start
```

### Custom OPC UA Endpoint
```bash
OPCUA_ENDPOINT=opc.tcp://your-server:4840 npm start
```

## Building

### Package for current platform
```bash
npm run package
```

### Create distributable
```bash
npm run make
```

## Development Scripts

- `npm start` - Start the app in development mode
- `npm run package` - Package the app
- `npm run make` - Create distributables

See [package.json](../package.json) for all available scripts.