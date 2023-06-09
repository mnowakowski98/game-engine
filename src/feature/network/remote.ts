export interface Remote {
    onRemoteUpdate: <T>(data: T) => void
}