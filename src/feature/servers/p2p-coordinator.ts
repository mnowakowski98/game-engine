import { WebSocket, WebSocketServer } from 'ws'
import { Connection, ConnectionPool } from '../../foundation/engine/network/connections'
import { ClientMessage, isClientMessage } from '../../foundation/engine/network/p2p/p2p'

export type Host<ChannelType> = Connection<ChannelType> | null

export function startCoordinator(port: number) {
    console.log(`Starting signaling server on port ${port}`)

    const connectionPool: ConnectionPool<WebSocket> = []
    let _host: Host<WebSocket> = null
    const host = (): Host<WebSocket> => _host

    const server = new WebSocketServer({ port: port })
    let connectionId = 0

    server.addListener('connection', socket => {
        console.log(`New connection: ${connectionId}`)
        const connection: Connection<WebSocket> = {
            id: (connectionId++).toString(),
            channel: socket
        }

        connectionPool.push(connection)

        console.log(`Sending connection id to ${connection.id}`)
        socket.send(JSON.stringify({
            action: 'set-id',
            id: connection.id
        }))

        if (host() === null) {
            console.log(`Setting connection ${connection.id} as the host`)
            _host = connection
            socket.send(JSON.stringify({ action: 'set-host' }))
        } else {
            console.log(`Sending host id (${host()!.id}) to ${connection.id}`)
            socket.send(JSON.stringify({
                action: 'call-host',
                id: host()!.id
            }))
        }

        socket.addEventListener('message', event => {
            const data = JSON.parse(event.data.toString())
            if (!isClientMessage(data)) return

            const message = data as ClientMessage
            message.from = connection.id
            const forSocket = connectionPool.find(conn => message.for === conn.id)?.channel
            if (forSocket) {
                console.log(`Forwarding message from ${connection.id} to ${message.for}`)
                forSocket.send(JSON.stringify(message))
            }
        })

        socket.addEventListener('close', () => {
            console.log(`Connection ${connection.id} disconnected`)
            connectionPool.splice(connectionPool.findIndex(conn => conn === connection), 1)
            if (connection.id === host()!.id) {
                console.log('Host disconnected')
                if (connectionPool.length === 0) {
                    _host = null
                    console.log('No clients left to host')
                }
                else {
                    _host = connectionPool[0]
                    console.log(`Setting host to ${host()!.id}`)
                }
            }
            
        })
    })
}