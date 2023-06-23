import { ClientMessage } from './p2p';

export default interface IceMessage extends ClientMessage {
    candidate: RTCIceCandidate
}

export function isIceCandidateMessage(message: ClientMessage): message is IceMessage {
    const candidateMessage = message as IceMessage
    return candidateMessage.candidate !== undefined
}
