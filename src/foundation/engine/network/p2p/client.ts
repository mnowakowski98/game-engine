import { Connection } from '../connections'
import IceMessage, { isIceCandidateMessage } from './ice'
import { ClientMessage, isClientMessage } from './p2p'
import { DataFunction, SignalerSettings, logDataChannelClosed, logDataChannelOpen, onConnectionStateChanged, onIceCandidate } from './signaler'

interface ClientSettings extends SignalerSettings {
    hostSignalerId: string
}

export async function callHost(settings: ClientSettings): Promise<DataFunction> {
    console.log(`Calling host connection: ${settings.hostSignalerId}`)

    const peerConnection = new RTCPeerConnection()
    const dataChannel = peerConnection.createDataChannel(settings.dataChannelLabel)

    const connection: Connection<RTCDataChannel> = {
        id: `host-${settings.hostSignalerId}`,
        channel: dataChannel
    }

    dataChannel.addEventListener('open', () => logDataChannelOpen(connection.id))
    dataChannel.addEventListener('close', () => logDataChannelClosed(connection.id))
    dataChannel.addEventListener('message', event => settings.onDataReceive(JSON.parse(event.data)))

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    settings.signaler.channel.send(JSON.stringify({
        for: settings.hostSignalerId,
        offer: offer
    }))

    settings.signaler.channel.addEventListener('message', async event => {
        const data = JSON.parse(event.data)
        if (!isClientMessage(data)) return

        const message = data as ClientMessage
        if (isIceCandidateMessage(message)) {
            const iceMessage = message as IceMessage
            peerConnection.addIceCandidate(iceMessage.candidate)
        }

        if (!('answer' in message)) return

        console.log(`Got answer from host ${settings.hostSignalerId}`)
        const answer = message.answer as RTCSessionDescriptionInit
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    })

    peerConnection.addEventListener('icecandidate', event => onIceCandidate(settings.signaler, event, settings.hostSignalerId))
    peerConnection.addEventListener('connectionstatechange', () => onConnectionStateChanged(peerConnection, settings.hostSignalerId))

    return (data: any) => {
        if (dataChannel.readyState !== 'open') return
        dataChannel.send(JSON.stringify(data))
    }
}
