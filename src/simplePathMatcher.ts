import {PathMatcher} from "../types/index.ts"

export const simplePathMatcher: PathMatcher = (_pattern) => {
    const pattern = _pattern.split("/");
    const names = new Set();
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      if (p[0] === "{" && p[p.length - 1] === "}") {
        const name = p.slice(1, -1).trim();
        if (!name) throw new Error("invalid param name");
        if (names.has(name)) throw new Error("duplicated param name");
        names.add(name);
      } else if (!p.trim() && i > 0 && i < pattern.length - 1) {
        throw new Error("invalid path segment");
      }
    }
    return (_path) => {
      const path = _path.split("/");
      if (pattern.length !== path.length) return null;

      const params: any = {};
      for (let i = 0; i < pattern.length; i++) {
        const p = pattern[i];
        if (p[0] === "{" && p[p.length - 1] === "}") {
          const name = p.slice(1, -1).trim();
          params[name] = path[i];
        } else if (p !== path[i]) return null;
      }
      return params;
    };
  };
