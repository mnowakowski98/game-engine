import { WebSocket } from 'ws'

export function startRemoteSyncing(broadcastUrl: string): boolean {
    const socket = new WebSocket(broadcastUrl)
    socket.addEventListener('open', () => console.log(`Connected to ${broadcastUrl}`))

    socket.addEventListener('error', event => console.error(`Failed to connect to ${broadcastUrl}: ${event.message}`))
    return false
}