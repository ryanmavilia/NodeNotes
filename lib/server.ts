/// <reference types="node" />
import app from "./app";
const port = 4040;

app.listen(port, () => {
  process.stdout.write("Express server listening on port " + port);
});
