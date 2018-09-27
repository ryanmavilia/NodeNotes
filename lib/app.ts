import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import * as mongoose from "mongoose";
import * as path from "path";

// Create connection to database and log error if unable to connect
mongoose.connect("mongodb://localhost:27017/notesdb", { useNewUrlParser: true });
const db = mongoose.connection;
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
        this.app.set("nav", path.join(__dirname, "../views"));
        this.app.use("/node_modules", express.static("node_modules"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, "../public")));
    }

    // Set the routes of the application
    private routes(): void {
        const router = express.Router();

        // Index page render basic page
        router.get("/", (req: Request, res: Response) => {
            res.render("index", {
                title: "Welcome to Node Notes",
                welcome_message: "A quick way to upload notes using Markdown!",
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
                const noteLocation = "/view/".concat(savedNote.id);
                res.redirect(noteLocation);
            });
        });

        // To view a note we give the id associated with the document
        router.get("/view/:id", (req: Request, res: Response) => {
            const id = req.params.id;
            // Find the note by id and send that info to EJS viewing template
            Note.findById(id, (err, foundNote) => {
                if (err) {
                    console.error(err);
                } else {
                // If note saved correctly we render it with the viewNote page
                res.render("viewNote", {
                    note_body: foundNote.body,
                    note_email: foundNote.email,
                });
            }
            });
        });

        // Misc page renderings //

        router.get("/about", (req: Request, res: Response) => {
            res.render("about", {
            });
        });

        router.get("/contact", (req: Request, res: Response) => {
            res.render("contact", {
            });
        });

        // Set the app to use the correct middleware of the router for page rendering
        this.app.use("/", router);
    }
}

// Export the app class as a new app
export default new App().app;
