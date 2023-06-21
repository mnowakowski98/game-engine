import { Connection } from './connections'
import { callHost, startHosting } from './signaling'

export type ClientMessage = {
    for: string
    from?: string
}

export function isClientMessage(object: any): object is ClientMessage {
    const validFor = object.for !== undefined && typeof object.for === 'string'
    const validFrom = object.from ? (typeof object.from === 'string') : true
    return validFor && validFrom
}

export type ClientControl = {
    action: 'set-host' | 'call-host' | 'set-id'
    id?: string
}

export function isClientControl(object: any): object is ClientControl {
    const isValidAction = (object.action !== undefined &&
        (object.action === 'set-host'
        || object.action === 'call-host'
        || object.action === 'set-id'))

    if (!isValidAction) return false

    const needsId = object.action === 'call-host' || object.action === 'set-id'
    if (needsId === false) return true

    return object.id !== undefined
}

export function startP2PConnection(coordinatorUrl: string, receive:(data: any) => void, error?: (message: string) => void): (data: any) => void {
    let myId = ''
    let hostId = ''

    const signaler: Connection<WebSocket> = {
        id: 'signaler',
        channel: new WebSocket(coordinatorUrl)
    }

    let send: (data: any) => void
    signaler.channel.addEventListener('message', async event => {
        const data = JSON.parse(event.data)
        if (!isClientControl(data)) return

        const control = data as ClientControl
        switch (control.action) {
            case 'set-id':
                myId = control.id!
                break
            case 'call-host':
                hostId = control.id!
                send = await callHost(signaler, hostId, receive, error)
                break
            case 'set-host':
                send = startHosting(signaler, myId, receive, error)
                break
            default:
                break
        }
    })

    send = () => undefined
    return (data: any) => send(data)
}