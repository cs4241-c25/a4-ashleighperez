const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//const { auth, requiresAuth } = require('express-openid-connect');

const app = express();
const PORT = process.env.PORT || 5001; // 5000 not working for some reason



// allow GET and POST requests
app.use(cors({
    origin: "*",
    //origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"], // Explicitly allow the required methods
    allowedHeaders: ["Content-Type", "Authorization"] // Explicitly allow necessary headers
}));

app.use(express.json()); // middleware to parse JSON bodies

// configuration options
// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.SECRET || 'gF0vxCiXzqys_PGtpSDVe8MgoFWHJ2s1xOJxqM_pifVEWiFAN0J7i4n4NC5OOvZP',
//     baseURL: process.env.BASE_URL || 'http://localhost:5000',
//     clientID: process.env.CLIENT_ID || 'YAfWHmFp4m2qBfwFEXzkBuPwf9VTbn15',
//     issuerBaseURL: process.env.ISSUER_BASE_URL || 'https://dev-dfe1bg1tlyvaqbif.us.auth0.com'
// };

// auth router attaches /login, /logout, and /callback routes to the baseURL
//app.use(auth(config));

// serve static files (HTML, JS, CSS) - added index:false to direct user to login page
// app.use(express.static(path.join(__dirname, "public"), { index: false }));

// connect to MongoDB
const uri = "mongodb+srv://amperez:RvZIc7AsRtorwlRN@cluster0.vcb6t.mongodb.net/todoReact?retryWrites=true&w=majority";

// amperez - RvZIc7AsRtorwlRN

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully!");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});


// task schema
const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    priority: { type: String, required: true },
    deadline: { type: String, required: true },
    daysLeft: { type: Number, required: true },
});

// task model
const Task = mongoose.model("todoReact", taskSchema, "tasks");

////// ROUTES //////

// route to add task
app.post("/addTask", async (req, res) => {
    try {
        const { task, priority, deadline } = req.body;

        if (!task || !priority || !deadline) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const deadlineDate = new Date(deadline);
        const daysLeft = Math.round((deadlineDate.getTime() - Date.now()) / 86400000);

        const newTask = new Task({ task, priority, deadline, daysLeft });
        await newTask.save();

        console.log("Task saved successfully:", newTask);
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).json({ error: err.message });
    }
});

// route to get tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: err.message });
    }
});

// route to modify task
app.post("/modify", async (req, res) => {
    const { id, task, priority, deadline } = req.body;
    if (!id || !task || !priority || !deadline) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // calculate daysLeft
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.round((deadlineDate.getTime() - Date.now()) / 86400000);

        // update task using id
        await Task.findByIdAndUpdate(
            id,
            { task, priority, deadline, daysLeft },
            { new: true }
        );
        // get updated list of tasks
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/delete", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Task ID required." });
    }

    try {
        await Task.findByIdAndDelete(id);
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// start server
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));



