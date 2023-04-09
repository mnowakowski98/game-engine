import Unique from './scene/Unique'
import Syncable from './scene/syncable'

let socket: WebSocket

const syncables: Syncable[] = []

export function connect(url: string) {
    socket = new WebSocket(url)

    socket.addEventListener('message', event => {
        const updateData = JSON.parse(event.data) as { id?: string }
        if (!updateData.id) return

        const target = syncables.find(syncable => syncable.id === updateData.id)
        if (!target) return

        target.update(updateData)
    })
}

export function sendUpdate(updateData: Unique & any) {
    socket.send(JSON.stringify(updateData))
}

export function addSyncable(syncable: Syncable) {
    syncables.push(syncable)
}

export function clearSyncables() {
    while (syncables.length > 0) syncables.pop()
}