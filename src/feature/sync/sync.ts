import Unique from '../../foundation/base-types/unique'
import { startP2PConnection } from '../../foundation/engine/network/p2p'


export interface UpdateData<T> {
    for: string
    data: T
}

function isUpdateData(object: any): object is UpdateData<any> {
    const updateData = object as UpdateData<any>
    const hasData = updateData.for !== undefined
    const hasFor = updateData.for !== undefined
    return hasData && hasFor
}

export interface Receiver<T> extends Unique {
    onRemoteSync: (data: T) => void
}

export interface Updater<T> {
    for: string
    syncData: () => T
}

type RemoteSyncConfig = {
    updaters: () => Updater<any>[]
    receivers: () => Receiver<any>[]
    error?: (message: string) => void
}

export async function startRemoteSyncing(remoteUrl: string, config: RemoteSyncConfig): Promise<() => void> {
    let isSyncing = true

    const dataHandler = (data: any) => {
        if (isUpdateData(data)) {
            const updateData = data as UpdateData<any>
            const toSync = config.receivers().find(receiver => receiver.id === updateData.for)
            if (!toSync) return
            toSync.onRemoteSync(updateData)
        }
    }

    const sendData = startP2PConnection(remoteUrl, dataHandler, config.error)

    const syncLoop = () => {
        if (!isSyncing) return

        config.updaters().forEach(updater => {
            const update = updater.syncData() as ({ for: string })
            update.for = updater.for
            sendData(update)
        })

        timeout = setTimeout(syncLoop)
    }
    let timeout = setTimeout(syncLoop)

    return () => {
        isSyncing = false
        clearTimeout(timeout)
    }
}