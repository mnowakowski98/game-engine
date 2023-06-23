import { Connection } from '../connections'

type Signaler = Connection<WebSocket>
export default Signaler

export type DataFunction = (data: any) => void

export interface SignalerSettings {
    signaler: Signaler
    signalerClientId: string
    dataChannelId: string
    onDataReceive: DataFunction
}

export function logDataChannelOpen(id: string) {
    console.log(`Data channel opened to ${id}`)
}

export function logDataChannelClosed(id: string) {
    console.log(`Data channel to ${id} closed`)
}

export function onIceCandidate(signaler: Signaler, event: RTCPeerConnectionIceEvent, forwardTo: string) {
    if (!event.candidate) return

    console.log(`Got new ice candidate: ${event.candidate.candidate}`)
    signaler.channel.send(JSON.stringify({
        for: forwardTo,
        candidate: event.candidate
    }))
}

export function onConnectionStateChanged(connection: RTCPeerConnection, id: string) {
    switch(connection.connectionState) {
        case 'connected':
            console.log(`Connection opened to ${id}`)
            break;
        case 'closed':
            console.log(`Connection to ${id} closed`)
            break;
        case 'failed':
            console.error(`Connection to ${id} failed`)
            break;
    }   
}