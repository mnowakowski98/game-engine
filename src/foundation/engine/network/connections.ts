import Unique from '../../base-types/unique'

export type Connection<ChannelType> = Unique & {
    channel: ChannelType
}

export type ConnectionPool<ChannelType> = Connection<ChannelType>[]