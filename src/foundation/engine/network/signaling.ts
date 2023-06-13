import { Connection, ConnectionPool } from './connections'
import { ClientMessage, isClientMessage } from './p2p'

type Signaler = Connection<WebSocket>

export function startHosting(signaler: Signaler, id: string, receive: (data: any) => void, error?: (message: string) => void): (data: any) => void {
    const peerConnections: ConnectionPool<RTCPeerConnection> = []
    console.log(`Starting hosting as client: ${id}`)

    signaler.channel.addEventListener('message', async event => {
        const data = JSON.parse(event.data)
        if (!isClientMessage(data)) return

        const message = data as ClientMessage
        if (!('offer' in message)) return

        console.log(`Got offer from client: ${message.from}`)

        const connection: Connection<RTCPeerConnection> = {
            id: `Peer - ${message.from}`,
            channel: new RTCPeerConnection()
        }

        const offer = message.offer as RTCSessionDescriptionInit
        await connection.channel.setRemoteDescription(new RTCSessionDescription(offer))

        const answer = await connection.channel.createAnswer()
        await connection.channel.setLocalDescription(new RTCSessionDescription(answer))

        signaler.channel.send(JSON.stringify({
            for: message.from!,
            answer: answer
        }))

        peerConnections.push(connection)

        connection.channel.addEventListener('icecandidate', event => {
            console.log(`Got new ice candidate: ${event.candidate?.address}`)
            signaler.channel.send(JSON.stringify({
                for: message.from!,
                candidate: event.candidate
            }))
        })

        connection.channel.addEventListener('connectionstatechange', () => {
            if (connection.channel.connectionState === 'connected')
                console.log(`Connected to peer: ${message.from}`)

            else if (connection.channel.connectionState === 'failed')
                error?.('WebRTC connection to host failed')
        })

        // TODO: Add channel message listener & call receive
    })

    return (data: any) => {
        peerConnections.forEach(connection => undefined) // TODO: Send data over the connection or track or something
    }
}

export async function callHost(signaler: Signaler, hostId: string, receive: (data: any) => void, error?: (message: string) => void): Promise<(data: any) => void> {
    console.log(`Calling host connection: ${hostId}`)

    const hostConnection: Connection<RTCPeerConnection> = {
        id: 'host-rtc-connection',
        channel: new RTCPeerConnection()
    }

    const offer = await hostConnection.channel.createOffer()
    await hostConnection.channel.setLocalDescription(offer)

    signaler.channel.send(JSON.stringify({
        for: hostId,
        offer: offer
    }))

    signaler.channel.addEventListener('message', async event => {
        const data = JSON.parse(event.data)
        if (!isClientMessage(data)) return

        const message = data as ClientMessage
        if ('candidate' in message) {
            const candidate = message.candidate as RTCIceCandidate
            console.log(`Got trickled ice candidate: ${candidate.address}`)
            await hostConnection.channel.addIceCandidate(candidate)
        }

        if (!('answer' in message)) return

        console.log(`Got answer from host ${hostId}`)
        const answer = message.answer as RTCSessionDescriptionInit
        await hostConnection.channel.setRemoteDescription(new RTCSessionDescription(answer))
    })

    hostConnection.channel.addEventListener('icecandidate', event => {
        console.log(`Got new ice candidate: ${event.candidate?.address}`)
        signaler.channel.send(JSON.stringify({
            for: hostId,
            candidate: event.candidate
        }))
    })

    hostConnection.channel.addEventListener('connectionstatechange', () => {
        if (hostConnection.channel.connectionState === 'connected')
            console.log(`Connected to host: ${hostId}`)

        else if (hostConnection.channel.connectionState === 'failed')
            error?.('WebRTC connection to host failed')
    })

    // TODO: Add host connection data listener & call receive

    return (data: any) => {
        // TODO: Send data to host connection
    }
}
