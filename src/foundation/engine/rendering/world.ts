import Unique from '../../base-types/unique'

type ActorContainer = {
    actors?: () => Actor[]
}

export type Actor = Unique & ActorContainer

export default interface World extends ActorContainer {}