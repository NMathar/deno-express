import {Middleware, Next} from "../../types/index.ts"
import {path} from "../../deps.ts"
import {Request} from "../Request.ts"
import {Response} from "../Response.ts"

export function static_(dir: string, ext = "html"): Middleware {
    return async (req: Request, res: Response, next: Next) => {
        try {
        //     console.log("why is api url in static?", req.url)
            await res.file(path.join(dir, req.url.slice(1) || "index." + ext));
        } catch (e) {
            //console.log(`${e}`);
            // console.error(e)
            await next();
        }
    };
}
