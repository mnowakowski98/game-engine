import Unique from './Unique'

export default interface Syncable extends Unique {
    sync?: (data: any) => void
    getSyncData?: () => ((Unique & any) | null)
}