import Unique from '../../foundation/base-types/unique'

export interface UpdateData<T> {
    for: string
    data: T
}

export interface Receiver<T> extends Unique {
    onRemoteSync: (data: T) => void
}

export interface Updater<T> {
    for: string
    syncData: () => T
}

export function startRemoteSyncing(remoteUrl: string, updaters: () => Updater<any>[], receivers: () => Receiver<any>[], error?: (message: string) => void): () => void {
    let isSyncing = true

    const socket = new WebSocket(remoteUrl)
    socket.addEventListener('open', () => console.log(`Connected to ${remoteUrl}`))
    socket.addEventListener('error', () => {
        isSyncing = false
        const message = `Connection to ${remoteUrl} failed`
        console.error(`Connection to ${remoteUrl} failed`)
        if (error) error(message)
    })

    socket.addEventListener('message', event => {
        const updateData = JSON.parse(event.data.toString()) as UpdateData<any>
        const toSync = receivers().find(receiver => receiver.id === updateData.for)
        if (!toSync) return

        toSync.onRemoteSync(updateData)
    })

    const syncLoop = () => {
        if (!isSyncing) return

        if (socket.readyState === socket.OPEN) {
            updaters().forEach(updater => {
                const update = updater.syncData() as ({ for: string })
                update.for = updater.for
                const data = JSON.stringify(update)
                if (socket) socket.send(data)
            })
        }

        timeout = setTimeout(syncLoop)
    }
    let timeout = setTimeout(syncLoop)

    return () => {
        isSyncing = false
        if (socket.readyState === socket.OPEN) socket.close()

    }
}