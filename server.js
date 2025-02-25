const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { auth, requiresAuth } = require('express-openid-connect');
const app = express();
const port = 3000;

// configuration options
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET || 'gF0vxCiXzqys_PGtpSDVe8MgoFWHJ2s1xOJxqM_pifVEWiFAN0J7i4n4NC5OOvZP',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    clientID: process.env.CLIENT_ID || 'YAfWHmFp4m2qBfwFEXzkBuPwf9VTbn15',
    issuerBaseURL: process.env.ISSUER_BASE_URL || 'https://dev-dfe1bg1tlyvaqbif.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// middleware to parse JSON bodies
app.use(express.json());

// serve static files (HTML, JS, CSS) - added index:false to direct user to login page
app.use(express.static(path.join(__dirname, "public"), { index: false }));

// connect to MongoDB
const uri = "mongodb+srv://amperez:RvZIc7AsRtorwlRN@cluster0.vcb6t.mongodb.net/tododb?retryWrites=true&w=majority";

// amperez - RvZIc7AsRtorwlRN

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB "))
    .catch(err => console.error(err));

// task schema
const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // user ID from Auth0
    task: { type: String, required: true },
    priority: { type: String, required: true },
    deadline: { type: String, required: true },
    daysLeft: { type: Number, required: true },
});

// task model
const Task = mongoose.model("Task", taskSchema);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    //res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    if (req.oidc.isAuthenticated()) {
        res.redirect('/todo');
    } else {
        res.redirect('/login');
    }
});

// send user to index.html if authenticated
app.get('/todo', requiresAuth(), (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// send appdata from results to client when user submits - making async to use await
app.get("/results", requiresAuth(), async (req, res) => {
    try {
        const userId = req.oidc.user.sub; // get logged-in user ID
        const tasks = await Task.find({ userId }); // get tasks from db for user
        res.json(tasks); // send to client
    } catch (err) {
        // catch error if not found
        res.status(500).json({ error: err.message });
    }
});

// route to add a new task - making async to use await
app.post("/submit", requiresAuth(), async (req, res) => {
    const { task, priority, deadline } = req.body;
    if (!task || !priority || !deadline) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const userId = req.oidc.user.sub; // get user for session
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.round((deadlineDate.getTime() - Date.now()) / 86400000);

    try {
        const newTask = new Task({ userId, task, priority, deadline, daysLeft });

        await newTask.save();
        console.log("New task saved:", newTask);
        const tasks = await Task.find({ userId }); // get tasks from db for user
        res.json(tasks);
    } catch (err) {
        console.error("Error in /submit route:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a task by ID
app.post("/delete", requiresAuth(), async (req, res) => {
    const { id } = req.body; // get task ID from request body
    const userId = req.oidc.user.sub; // get user ID

    if (!id) {
        return res.status(400).json({ error: "Task ID required." });
    }

    try {
        const task = await Task.findOne({ _id: id, userId }); // make sure task belongs to user

        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }

        await Task.findByIdAndDelete(id);
        const tasks = await Task.find({ userId });
        res.json(tasks); // return updated list of user's tasks
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// route to modify task
app.post("/modify", requiresAuth(), async (req, res) => {
    const { id, task, priority, deadline } = req.body;
    const userId = req.oidc.user.sub;

    if (!id || !task || !priority || !deadline) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // check if task exists under user
        const task = await Task.findOne({ _id: id, userId });
        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }

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
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// route to user for username display
app.get("/user", requiresAuth(), (req, res) => {
    res.json(req.oidc.user);
});


// Start the server
app.listen(port, () => {
    console.log('http://localhost:3000');
});


