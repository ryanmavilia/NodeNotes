import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import * as mongoose from "mongoose";
import * as path from "path";

// Create connection to database and log error if unable to connect
mongoose.connect("mongodb://localhost:27017/notesdb", { useNewUrlParser: true });
const db = mongoose.connection;
// tslint:disable-next-line:no-console
db.on("error", console.error.bind(console, "connection error:"));

const notesSchema = new mongoose.Schema({
    body: String,
    email: String,
});

// Create the model for the note based on the schema
const Note = mongoose.model("Note", notesSchema);

// Main class for the app
class App {
    public app: express.Application;

    // Construct the app and set the configuration, routes, and express application
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    // Configure the app with the ejs view engine, views path, parsing methods, and CSS location
    private config(): void {
        this.app.set("view engine", "ejs");
        this.app.set("views", path.join(__dirname, "../views"));
        this.app.use("/node_modules", express.static("node_modules"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static("public"));
    }

    // Set the routes of the application
    private routes(): void {
        const router = express.Router();

        // Index page render basic page
        router.get("/", (req: Request, res: Response) => {
            res.render("index", {
                title: "Welcome to Node Notes",
            });
        });

        // Render page to create a new note
        router.get("/create", (req: Request, res: Response) => {
            res.render("create", {
            });
        });

        // After submitting new note user is brought to this page to see it
        router.post("/viewNewNote", (req: Request, res: Response) => {

            const newNote = new Note({ body: req.body.main_text, email: req.body.email });

            // Insert new note into mongo and render the created note view
            newNote.save((err, savedNote) => {
                res.render("createdNote", {
                    note_id: savedNote.id,
                });
            });
        });
        // Set the app to use the correct middleware of the router for page rendering
        this.app.use("/", router);
    }
}

// Export the app class as a new app
export default new App().app;
