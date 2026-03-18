const { ipcMain } = require('electron')
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const {
  OPCUAClient,
  AttributeIds,
  TimestampsToReturn,
  UserTokenType
} = require('node-opcua')

let endpointUrl = process.env.OPCUA_ENDPOINT || 'opc.tcp://milo.digitalpetri.com:62541/milo'
const client = OPCUAClient.create({
  endpointMustExist: false
})

let browseCache = []
let browseInFlight = null
let credentials = { mode: 'anonymous', username: '', password: '' }

function getUserIdentity() {
  if (credentials.mode === 'username' && credentials.username) {
    return {
      type: UserTokenType.UserName,
      userName: credentials.username,
      password: credentials.password || ''
    }
  }
  return { type: UserTokenType.Anonymous }
}

async function fetchOpcUaNodes() {
  if (browseInFlight) return browseInFlight
  browseInFlight = (async () => {
    const steps = []
    const addStep = (message) => {
      console.log(`[opcua] ${message}`)
      steps.push({
        ts: new Date().toISOString(),
        message
      })
    }
    let session
    try {
      addStep(`Connecting to ${endpointUrl}...`)
      await client.connect(endpointUrl)
      addStep('Connected. Creating session...')
      session = await client.createSession(getUserIdentity())
      addStep('Session created. Browsing ObjectsFolder...')

      const browseResult = await session.browse('ObjectsFolder')
      const references = browseResult.references || []
      if (references.length === 0) {
        browseCache = []
        addStep('No nodes found in ObjectsFolder.')
        return { nodes: browseCache, steps, endpointUrl }
      }

      const nodesToRead = references.map((ref) => ({
        nodeId: ref.nodeId,
        attributeId: AttributeIds.Value
      }))

      addStep(`Reading ${nodesToRead.length} node values...`)
      const dataValues = await session.read(nodesToRead, 0, TimestampsToReturn.Neither)
      browseCache = references.map((ref, index) => {
        const dv = dataValues[index]
        const value = dv && dv.value ? dv.value.value : null
        return {
          nodeId: ref.nodeId.toString(),
          browseName: ref.browseName ? ref.browseName.toString() : '',
          displayName: ref.displayName ? ref.displayName.text : '',
          value
        }
      })

      addStep('Read complete.')
      return { nodes: browseCache, steps, endpointUrl }
    } catch (error) {
      browseCache = []
      addStep(`Error: ${error && error.message ? error.message : 'Unknown error'}`)
      return { nodes: browseCache, steps, endpointUrl }
    } finally {
      if (session) {
        try {
          addStep('Closing session...')
          await session.close()
          addStep('Session closed.')
        } catch (_) {}
      }
      try {
        addStep('Disconnecting client...')
        await client.disconnect()
        addStep('Client disconnected.')
      } catch (_) {}
      browseInFlight = null
    }
  })()

  return browseInFlight
}

const createWindow = () => {
    const win = new BrowserWindow ({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('opcua:setCredentials', async (_event, nextCredentials) => {
      if (!nextCredentials || typeof nextCredentials !== 'object') {
        credentials = { mode: 'anonymous', username: '', password: '' }
        return { ok: true }
      }

      const mode = nextCredentials.mode === 'username' ? 'username' : 'anonymous'
      credentials = {
        mode,
        username: mode === 'username' ? String(nextCredentials.username || '') : '',
        password: mode === 'username' ? String(nextCredentials.password || '') : ''
      }
      return { ok: true }
    })

    ipcMain.handle('opcua:setEndpoint', async (_event, nextEndpoint) => {
      if (typeof nextEndpoint === 'string' && nextEndpoint.trim()) {
        endpointUrl = nextEndpoint.trim()
      }
      return { ok: true, endpointUrl }
    })

    ipcMain.handle('opcua:getNodes', async () => {
      return fetchOpcUaNodes()
    })
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
