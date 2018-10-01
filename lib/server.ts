/// <reference types="node" />
import app from "./app";
const port = 8080;

// Run the app on the specified port
app.listen(port, () => {
  process.stdout.write("Express server listening on port " + port);
});
