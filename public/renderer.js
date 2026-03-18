const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

const func = async () => {
    const response = await window.versions.ping()
    console.log(response)
}

func()

const statusEl = document.getElementById('opcua-status')
const serverEl = document.getElementById('opcua-server')
const stepsEl = document.getElementById('opcua-steps')
const listEl = document.getElementById('opcua-nodes')
const credentialForm = document.getElementById('opcua-credentials')
const credentialMode = document.getElementById('opcua-credential-mode')
const usernameInput = document.getElementById('opcua-username')
const passwordInput = document.getElementById('opcua-password')
const endpointForm = document.getElementById('opcua-endpoint-form')
const endpointSelect = document.getElementById('opcua-endpoint-select')
const endpointInput = document.getElementById('opcua-endpoint-input')

function updateCredentialUI() {
    const isUsername = credentialMode.value === 'username'
    usernameInput.disabled = !isUsername
    passwordInput.disabled = !isUsername
}

function loadCredentialsFromStorage() {
    const storedMode = localStorage.getItem('opcua.credentials.mode')
    const storedUser = localStorage.getItem('opcua.credentials.username')
    const storedPassword = localStorage.getItem('opcua.credentials.password')

    if (storedMode === 'username') {
        credentialMode.value = 'username'
        usernameInput.value = storedUser || ''
        passwordInput.value = storedPassword || ''
    } else {
        credentialMode.value = 'anonymous'
        usernameInput.value = ''
        passwordInput.value = ''
    }
}

function saveCredentialsToStorage() {
    localStorage.setItem('opcua.credentials.mode', credentialMode.value)
    localStorage.setItem('opcua.credentials.username', usernameInput.value)
    localStorage.setItem('opcua.credentials.password', passwordInput.value)
}

function updateEndpointUI() {
    const isCustom = endpointSelect.value === 'custom'
    endpointInput.disabled = !isCustom
    if (!isCustom) {
        endpointInput.value = endpointSelect.value
    }
}

async function loadOpcUaNodes() {
    statusEl.innerText = 'Loading nodes from OPC UA server...'
    serverEl.innerText = `Server: ${endpointInput.value.trim() || endpointSelect.value}`
    stepsEl.innerHTML = ''
    listEl.innerHTML = ''

    try {
        const result = await window.opcua.getNodes()
        const nodes = result && result.nodes ? result.nodes : []
        const steps = result && result.steps ? result.steps : []
        const usedEndpoint = result && result.endpointUrl ? result.endpointUrl : null

        if (usedEndpoint) {
            serverEl.innerText = `Server: ${usedEndpoint}`
        }

        if (steps.length > 0) {
            const stepFragment = document.createDocumentFragment()
            steps.forEach((step) => {
                const item = document.createElement('li')
                if (typeof step === 'string') {
                    item.innerText = step
                } else {
                    item.innerText = `[${step.ts}] ${step.message}`
                }
                stepFragment.appendChild(item)
            })
            stepsEl.appendChild(stepFragment)
        }

        if (!nodes || nodes.length === 0) {
            statusEl.innerText = 'No nodes found (or connection failed).'
            return
        }

        statusEl.innerText = `Loaded ${nodes.length} nodes from OPC UA.`
        const fragment = document.createDocumentFragment()
        nodes.forEach((node) => {
            const item = document.createElement('li')
            item.innerText = `${node.displayName || node.browseName || node.nodeId} = ${node.value === null ? 'null' : node.value}`
            fragment.appendChild(item)
        })
        listEl.appendChild(fragment)
    } catch (error) {
        statusEl.innerText = 'Failed to load nodes.'
        console.error(error)
    }
}

function loadEndpointFromStorage() {
    const storedEndpoint = localStorage.getItem('opcua.endpoint')
    if (!storedEndpoint) return

    const options = Array.from(endpointSelect.options).map((opt) => opt.value)
    if (options.includes(storedEndpoint)) {
        endpointSelect.value = storedEndpoint
    } else {
        endpointSelect.value = 'custom'
        endpointInput.value = storedEndpoint
    }
}

function saveEndpointToStorage(endpoint) {
    localStorage.setItem('opcua.endpoint', endpoint)
}

credentialMode.addEventListener('change', () => {
    updateCredentialUI()
})

credentialForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    await window.opcua.setCredentials({
        mode: credentialMode.value,
        username: usernameInput.value,
        password: passwordInput.value
    })
    saveCredentialsToStorage()
    loadOpcUaNodes()
})

endpointSelect.addEventListener('change', () => {
    updateEndpointUI()
})

endpointForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const endpoint = endpointInput.value.trim()
    if (!endpoint) {
        statusEl.innerText = 'Endpoint URL is required.'
        return
    }
    await window.opcua.setEndpoint(endpoint)
    saveEndpointToStorage(endpoint)
    loadOpcUaNodes()
})

loadCredentialsFromStorage()
loadEndpointFromStorage()
updateCredentialUI()
updateEndpointUI()
loadOpcUaNodes()
