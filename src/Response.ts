import {EndHandler, Json} from "../types/index.ts"
import {http, lookup, path} from "../deps.ts"

export class Response {
    status = 200
    headers = new Headers()
    body?: string | Uint8Array | Deno.Reader
    resources: Deno.Closer[] = []

    toHttpResponse(): http.Response {
        let {status = 200, headers, body = new Uint8Array(0)} = this
        if (typeof body === "string") {
            body = new TextEncoder().encode(body)
            if (!headers.has("Content-Type")) {
                headers.append("Content-Type", "text/plain")
            }
        }
        return {status, headers, body}
    }

    close() {
        for (const resource of this.resources) resource.close()
    }

    empty(status: number): void {
        this.status = status
        this.body = ""
    }

    json(json: Json): void {
        this.headers.append("Content-Type", "application/json")
        this.body = JSON.stringify(json)
    }

    send(text: string): void {
        this.headers.append("Content-Type", "text/plain")
        this.body = text
    }

    async file(
        filePath: string,
        transform?: (src: string) => string
    ): Promise<void> {
        // console.log("filepath: ", filePath)
        const extname: string = path.extname(filePath)
        // console.log("extname: ", extname)
        const contentType: string | undefined = lookup(extname.slice(1)) || ""
        const fileInfo = await Deno.stat(filePath)
        if (!fileInfo.isFile || !contentType) {
            return
        }
        this.headers.append("Content-Type", contentType)
        if (transform) {
            const bytes = await Deno.readFile(filePath)
            let str = new TextDecoder().decode(bytes)
            str = transform(str)
            this.body = new TextEncoder().encode(str)
        } else {
            const file = await Deno.open(filePath)
            this.resources.push(file)
            this.body = file
        }
    }
}
