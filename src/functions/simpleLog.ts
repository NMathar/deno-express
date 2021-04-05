import {Handler} from "../../types/index.ts"
import {cyan, green, red, yellow} from "../../deps.ts"

export function simpleLog(): Handler {
    return async (req, res, next) => {
        await next();
        if (!res) return console.log(req.method, req.url);
        if (req.error) console.log(red(req.error + ""));
        if (res.status >= 500) {
            return console.log(red(res.status + ""), req.method, req.url);
        }
        if (res.status >= 400) {
            return console.log(yellow(res.status + ""), req.method, req.url);
        }
        if (res.status >= 300) {
            return console.log(cyan(res.status + ""), req.method, req.url);
        }
        if (res.status >= 200) {
            return console.log(green(res.status + ""), req.method, req.url);
        }
    };
}
