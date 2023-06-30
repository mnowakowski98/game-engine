import { DataFunction, SignalerSettings, logDataChannelClosed, logDataChannelOpen, onConnectionStateChanged, onIceCandidate } from './signaler'
import { Connection, ConnectionPool } from '../connections'
import { ClientMessage, isClientMessage } from './p2p'
import IceMessage, { isIceCandidateMessage } from './ice'

interface HostSettings extends SignalerSettings {}

export function startHosting(settings: HostSettings): DataFunction {
    type PoolType = [RTCDataChannel, RTCPeerConnection]
    const connections: ConnectionPool<PoolType> = []
    console.log(`Starting hosting as client: ${settings.signalerClientId}`)

    settings.signaler.channel.addEventListener('message', async event => {
        const data = JSON.parse(event.data)
        if (!isClientMessage(data)) return

        const message = data as ClientMessage
        if (!message.from) return
        const peerId = message.from

        if (isIceCandidateMessage(message)) {
            const iceMessage = message as IceMessage
            const connection = connections.find(channel => channel.id === peerId)
            connection?.channel[1].addIceCandidate(iceMessage.candidate)
        }

        if (!('offer' in message)) return
        console.log(`Got offer from peer: ${peerId}`)

        const peerConnection = new RTCPeerConnection()

        const offer = message.offer as RTCSessionDescriptionInit
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer))

        settings.signaler.channel.send(JSON.stringify({
            for: message.from!,
            answer: answer
        }))

        peerConnection.addEventListener('datachannel', event => {
            const dataChannel = event.channel

            const connection: Connection<PoolType> = {
                id: `peer-${peerId}`,
                channel: [dataChannel, peerConnection]
            }
    
            connections.push(connection)

            dataChannel.addEventListener('open', () => logDataChannelOpen(connection.id))
            dataChannel.addEventListener('close', () => logDataChannelClosed(connection.id))
            dataChannel.addEventListener('message', event => settings.onDataReceive(JSON.parse(event.data)))
        })

        peerConnection.addEventListener('icecandidate', event => onIceCandidate(settings.signaler, event, peerId))
        peerConnection.addEventListener('connectionstatechange', () => onConnectionStateChanged(peerConnection, peerId))
    })

    return (data: any) => {
        connections.forEach(connection => {
            if (connection.channel[0].readyState !== 'open') return
            connection.channel[0].send(JSON.stringify(data))
        })
    }
}