import {http} from "./deps.ts"
import {Request} from "./src/Request.ts"
import {Response} from "./src/Response.ts"
import {simplePathMatcher} from "./src/simplePathMatcher.ts"
import {EndHandler, Method, Middleware, Next} from "./types/index.ts"
import {isPathHandler} from "./src/functions/isPathHandler.ts"


export class App {
    middlewares: Middleware[] = []

    use(m: Middleware) {
        this.middlewares.push(m)
    }

    async listen(port: number, host = "127.0.0.1") {
        const s = await http.serve(`${host}:${port}`)
        let self = this
        let abort = false

        async function start() {
            for await (const httpRequest of s) {
                if (abort) break
                const req = new Request(httpRequest)
                const res = new Response()
                try {
                    await runMiddlewares(self.middlewares, req, res)
                } catch (e) {
                    if (e instanceof Deno.errors.NotFound) {
                        res.status = 404
                        console.error(`File not found: ${req.url}`)
                    }
                }
                try {
                    await httpRequest.respond(res.toHttpResponse())
                } finally {
                    res.close()
                    // console.log(await resources());
                }
            }
        }

        function close() {
            abort = true
        }

        start()
        return {port, close}
    }

    private addPathHandler(method: Method, pattern: string, handle: EndHandler) {
        this.middlewares.push({
            method,
            pattern,
            match: simplePathMatcher(pattern),
            handle,
        })
    }

    get(pattern: any, handle: EndHandler): void {
        this.addPathHandler("GET", pattern, handle)
    }

    post(pattern: any, handle: EndHandler): void {
        this.addPathHandler("POST", pattern, handle)
    }

    put(pattern: any, handle: EndHandler): void {
        this.addPathHandler("PUT", pattern, handle)
    }

    patch(pattern: any, handle: EndHandler): void {
        this.addPathHandler("PATCH", pattern, handle)
    }

    delete(pattern: any, handle: EndHandler): void {
        this.addPathHandler("DELETE", pattern, handle)
    }
}


async function runMiddlewares(
    ms: Middleware[],
    req: Request,
    res: Response,
): Promise<void> {
    if (ms.length) {
        const [m, ...rest] = ms
        await runMiddleware(m, ms.length, req, res, () => {
            return runMiddlewares(rest, req, res)
        })
    }
}

async function runMiddleware(
    m: Middleware,
    length: number,
    req: Request,
    res: Response,
    next: Next,
): Promise<void> {
    if (isPathHandler(m)) {
        if (m.method === req.method) {
            const params = m.match(req.url)
            if (params) {
                // add split value by question mark to get real value
                Object.keys(params).map(function(key, index) {
                    params[key] = params[key].split('?')[0];
                });
                req.extra.matchedPattern = m.pattern
                req.params = params
                return m.handle(req, res)
            }
            if (length === 1) res.status = 404 // if is last next and no route is found the route does not exist
            await next()
        }
        await next()
    } else {
        await m(req, res, next)
    }
}


export const bodyParser = {
    json(): Middleware {
        return async (req, res, next) => {
            if (req.headers.get("Content-Type") === "application/json") {
                try {
                    // get full body content
                    const bodyText = new TextDecoder().decode(req.body)
                    // remove null chars
                    const clearBodyText = bodyText.replace(/\0/g, "")
                    // get only data content
                    const content = clearBodyText.split("\r\n\r\n")[1]
                    req.data = JSON.parse(content)
                } catch (e) {
                    // console.error("json: ", e.message)
                    res.status = 400
                    req.error = e.message
                    return
                }
            }
            await next()
        }
    },
    urlencoded(): Middleware {
        return async (req, res, next) => {
            if (
                req.headers.get("Content-Type") === "application/x-www-form-urlencoded"
            ) {
                try {
                    const body: any = await req.body
                    const text: any = new TextDecoder().decode(body)
                    const data: any = {}
                    for (let s of text.split("&")) {
                        const result = /^(.+?)=(.*)$/.exec(s)
                        if (result !== null) {
                            if (result.length < 3) continue
                            const key = decodeURIComponent(result[1].replace("+", " "))
                            const value = decodeURIComponent(result[2].replace("+", " "))
                            if (Array.isArray(data[key])) data[key] = [...data[key], value]
                            else if (data[key]) data[key] = [data[key], value]
                            else data[key] = value
                        }
                    }
                    req.data = data
                } catch (e) {
                    console.error("urlencoded: ", e.message)
                    res.status = 400
                    req.error = e.message
                    return
                }
            }
            await next()
        }
    },
}

export {simpleLog} from "./src/functions/simpleLog.ts"
export {static_} from "./src/functions/static.ts"
export {Request}
export {Response}
export {simplePathMatcher}
