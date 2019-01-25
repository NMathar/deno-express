# Node Exrpress way for Deno

This Project is inspired by https://github.com/jinjor/deno-playground/tree/master/expressive it shows a solution to run a Deno Webserver like the node express way


## Example 

```typescript
import * as expressive from "PATH/TO/GIT/REPO/mod.ts";

(async () => {
  const port = 3000;
  const app = new expressive.App();
  app.use(expressive.simpleLog());
  app.use(expressive.static_("./public"));
  app.use(expressive.bodyParser.json());
  app.get("/api/todos", async (req, res) => {
    await res.json([{ name: "Buy some milk" }]);
  });
  const server = await app.listen(port);
})();
```
