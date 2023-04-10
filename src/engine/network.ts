import Unique from './scene/Unique'
import Syncable from './scene/syncable'

let socket: WebSocket

const syncables: Syncable[] = []

export function sendUpdate(updateData: Unique & any) {
    socket.send(JSON.stringify(updateData))
}

export function connect(url: string) {
    socket = new WebSocket(url)

    socket.addEventListener('message', event => {
        console.log(`Recieved: ${event.data}`)

        const updateData = JSON.parse(event.data) as { id?: string }
        if (!updateData.id) return

        const target = syncables.find(syncable => syncable.id === updateData.id)
        if (!target || !target.sync) return

        target.sync(updateData)
    })

    const syncLoop = () => {
        if (socket.readyState === 1) {
            for (const syncable of syncables) {
                if (!syncable.getSyncData) continue
                const data = syncable.getSyncData()
                if (!data) continue

                console.log(`Sending update data: ${data}`)
                socket.send(JSON.stringify(data))
            }
        }

        setTimeout(syncLoop)
    }

    syncLoop()
}

export function addSyncable(syncable: Syncable) {
    syncables.push(syncable)
}

export function clearSyncables() {
    while (syncables.length > 0) syncables.pop()
}