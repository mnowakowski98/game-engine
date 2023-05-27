import Unique from '../../foundation/base-types/unique'

export default interface Command extends Unique {
    execute: () => void
}