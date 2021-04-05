import {Handler} from "../../types/index.ts"
import {cyan, green, red, yellow} from "../../deps.ts"
import {Request} from "../Request.ts"

export function simpleLog(timer: boolean = true): Handler {
    return async (req, res, next) => {
        const begin = Date.now()
        await next();
        if (!res) return console.log(req.method, req.url);
        if (req.error) console.log(red(req.error + ""));
        if (res.status >= 500) {
            return output(red(res.status + ""), req, begin, timer)
        }
        if (res.status >= 400) {
            return output(yellow(res.status + ""), req, begin, timer)
        }
        if (res.status >= 300) {
            return output(cyan(res.status + ""), req, begin, timer)
        }
        if (res.status >= 200) {
            return output(green(res.status + ""), req, begin, timer)
        }
    };
}

function getSpendTime(start: number, end: number): string{
    return "("+(end-start)+" MS)"
}

function output(status: string,req: Request, begin: number, timer: boolean): void{
    console.log(status, timer ? getSpendTime(begin, Date.now()) : "" , req.method, req.url);
}
