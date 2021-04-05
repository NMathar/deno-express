import {Middleware} from "../../types/index.ts"
import {PathHandler} from "../../types/interfaces/PathHandler.ts"

export function isPathHandler(m: Middleware): m is PathHandler {
    return typeof m !== "function";
}
