import { Connection, ConnectionPool } from './connections'
import { ClientMessage, isClientMessage } from './p2p'

type Signaler = Connection<WebSocket>

const dataChannelId = 'data'

export function startHosting(signaler: Signaler, id: string, receive: (data: any) => void, error?: (message: string) => void): (data: any) => void {
    const peerDataChannels: ConnectionPool<RTCDataChannel> = []
    console.log(`Starting hosting as client: ${id}`)

    signaler.channel.addEventListener('message', async event => {
        const data = JSON.parse(event.data)
        if (!isClientMessage(data)) return

        const message = data as ClientMessage
        if (!('offer' in message)) return

        console.log(`Got offer from client: ${message.from}`)

        const peerConnection = new RTCPeerConnection()
        const dataChannel = peerConnection.createDataChannel(dataChannelId)

        const connection: Connection<RTCDataChannel> = {
            id: `Peer - ${message.from}`,
            channel: dataChannel
        }

        const offer = message.offer as RTCSessionDescriptionInit
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer))

        signaler.channel.send(JSON.stringify({
            for: message.from!,
            answer: answer
        }))

        peerDataChannels.push(connection)

        peerConnection.addEventListener('icecandidate', event => {
            if (!event.candidate) return

            console.log(`Got new ice candidate: ${event.candidate.candidate}`)
            signaler.channel.send(JSON.stringify({
                for: message.from!,
                candidate: event.candidate
            }))
        })

        peerConnection.addEventListener('connectionstatechange', () => {
            if (peerConnection.connectionState === 'connected')
                console.log(`Connected to peer: ${message.from}`)

            else if (peerConnection.connectionState === 'failed')
                error?.('WebRTC connection to host failed')
        })

        dataChannel.addEventListener('message', event => receive(JSON.parse(event.data)))
    })

    return (data: any) => {
        peerDataChannels.forEach(dataChannel => {
            if (dataChannel.channel.readyState !== 'open') return
            dataChannel.channel.send(JSON.stringify(data))
        })
    }
}

export async function callHost(signaler: Signaler, hostId: string, receive: (data: any) => void, error?: (message: string) => void): Promise<(data: any) => void> {
    console.log(`Calling host connection: ${hostId}`)

    const hostConnection: Connection<RTCPeerConnection> = {
        id: 'host-rtc-connection',
        channel: new RTCPeerConnection()
    }

    const dataChannel = hostConnection.channel.createDataChannel('data')

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
            console.log(`Got trickled ice candidate: ${candidate.candidate}`)
            await hostConnection.channel.addIceCandidate(candidate)
        }

        if (!('answer' in message)) return

        console.log(`Got answer from host ${hostId}`)
        const answer = message.answer as RTCSessionDescriptionInit
        await hostConnection.channel.setRemoteDescription(new RTCSessionDescription(answer))
    })

    hostConnection.channel.addEventListener('icecandidate', event => {
        if (!event.candidate) return

        console.log(`Got new ice candidate: ${event.candidate.candidate}`)
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

    dataChannel.addEventListener('message', event => receive(JSON.parse(event.data)))

    return (data: any) => {
        if (dataChannel.readyState !== 'open') return
        dataChannel.send(JSON.stringify(data))
    }
}
