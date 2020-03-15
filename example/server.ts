import * as expressive from "../mod.ts";

(async () => {
  const port = 3000;
  const app = new expressive.App();
  app.use(expressive.simpleLog());
  app.use(expressive.static_("./public"));
  app.use(expressive.bodyParser.json());
  app.get("/api/todos", async (req, res) => {
    await res.json([{ name: "Buy some milk" }, {name: "Clean up the house!"}]);
  });
  app.get("/api/user/{user_id}", async (req, res) => {
    await res.json([{ id: req.params.user_id, name: "Jim Doe", phone: "12425323" }]);
  });

  /**
   * Send test call
   *
   * curl --header "Content-Type: application/json" \
   --request POST \
   --data '{"testName":"Harry Potter"}' \
   http://localhost:5000/api/todo/save
   */
  app.post("/api/todo/save", async (req, res) => {
    await res.json({ name: req.data.testName });
  });
  const server = await app.listen(port);
  console.log("app listening on port: " + server.port);
})();
