import Unique from './Unique'

export default interface Syncable extends Unique {
    update: (data: any) => void
}