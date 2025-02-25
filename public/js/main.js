// Global current table data
let tableCurr = [];

// we use async functions when we don't want JS to stop running and "wait forever" for a response
const submit = async function( event ) {
    event.preventDefault()

    const taskInput = document.getElementById("task");
    const priorityInput = document.getElementById("priority");
    const deadlineInput = document.getElementById("deadline");

    const task = taskInput.value;
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    console.log("Submitting task:", { task, priority, deadline });

    let isValid = true;

    // validation logic
    if (!task.trim()) {
        taskInput.classList.add("is-invalid");
        isValid = false;
    } else {
        taskInput.classList.remove("is-invalid");
    }

    if (priority === "Choose...") {
        priorityInput.classList.add("is-invalid");
        isValid = false;
    } else {
        priorityInput.classList.remove("is-invalid");
    }

    if (!deadline) {
        deadlineInput.classList.add("is-invalid");
        isValid = false;
    } else {
        deadlineInput.classList.remove("is-invalid");
    }

    // return if input returns invalid
    if (!isValid) return;

    // send data to server
    const body = JSON.stringify({ task, priority, deadline });

    try {
        const response = await fetch("/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // JSON format
            body,
        });

        if (!response.ok) throw new Error(`${response.status}`);

        const updatedData = await response.json();
        updateTable(updatedData);
        resetForm();
    } catch (error) {
        console.error("Error submitting task:", error);
    }
};

const del = async function(event) {
    event.preventDefault(); // stop form submission from trying to load a new html page

    const tidInput = document.getElementById("tid");
    const tid = tidInput.value.trim();  // read as string (_id isn't int)

    // check if val was entered
    if (!tid) {
        tidInput.classList.add("is-invalid");
        return;
    }

    // check if val exists in db in current table data
    if (!tableCurr.some(task => task._id.toString() === tid)) {
        tidInput.classList.add("is-invalid");
        return;
    } else {
        tidInput.classList.remove("is-invalid");
    }

    try {
        const response = await fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // JSON format
            body: JSON.stringify({ id: tid }),
        });

        if (!response.ok) throw new Error(`${response.status}`);

        const updatedData = await response.json(); // get updated todo list
        updateTable(updatedData);
        tidInput.value = ""; // reset task ID input

    } catch (error) {
        console.error("Error Deleting Task:", error);
    }
};

const modifyTask = async function(event) {
    event.preventDefault();

    const idInput = document.getElementById("modify-id");
    const taskInput = document.getElementById("modify-task");
    const priorityInput = document.getElementById("modify-priority");
    const deadlineInput = document.getElementById("modify-deadline");

    const id = idInput.value.trim();
    const task = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    let isValid = true;

    // Validate Task ID: must be non-empty and exist in the current table data.
    if (!id) {
        idInput.classList.add("is-invalid");
        isValid = false;
    } else if (!tableCurr.some(task => task._id.toString() === id)) {
        idInput.classList.add("is-invalid");
        isValid = false;
    } else {
        idInput.classList.remove("is-invalid");
    }

    if (!task) {
        taskInput.classList.add("is-invalid");
        isValid = false;
    } else {
        taskInput.classList.remove("is-invalid");
    }

    if (!priority) {
        priorityInput.classList.add("is-invalid");
        isValid = false;
    } else {
        priorityInput.classList.remove("is-invalid");
    }

    if (!deadline) {
        deadlineInput.classList.add("is-invalid");
        isValid = false;
    } else {
        deadlineInput.classList.remove("is-invalid");
    }

    if (!isValid) return;

    const body = JSON.stringify({ id, task, priority, deadline });

    try {
        const response = await fetch("/modify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });
        if (!response.ok) throw new Error(`${response.status}`);
        const updatedData = await response.json();
        updateTable(updatedData);
        // Optionally, reset the modify form fields
        idInput.value = "";
        taskInput.value = "";
        priorityInput.value = "";
        deadlineInput.value = "";
    } catch (error) {
        console.error("Error modifying task:", error);
    }
};


// function to update the table dynamically
const updateTable = (data) => {
    const table = document.getElementById("todo-list");
    tableCurr = data; // latest table data

    table.innerHTML = data.map(task =>
        `<tr>
            <td>${task._id}</td>
            <td>${task.task}</td>
            <td>${task.priority}</td>
            <td>${task.deadline}</td>
            <td>${task.daysLeft}</td>
        </tr>`
    ).join("");
};

// reset form fields
const resetForm = function () {
    document.getElementById("task").value = "";
    document.getElementById("priority").value = "Choose...";
    document.getElementById("deadline").value = "";
    document.getElementById("tid").value = "";

    document.querySelector("#task").classList.remove("is-invalid");
    document.querySelector("#priority").classList.remove("is-invalid");
    document.querySelector("#deadline").classList.remove("is-invalid");
    document.querySelector("#tid").classList.remove("is-invalid");
};

// On window load, set event listeners and fetch initial task data
window.onload = async function () {
    document.querySelector("#submit").onclick = submit;
    document.querySelector("#delete").onclick = del;
    document.querySelector("#reset").onclick = resetForm;
    document.querySelector("#resetdelete").onclick = resetForm;
    document.querySelector("#modify-submit").onclick = modifyTask;


    // fetch data with try catch
    try {

        const userResponse = await fetch("/user");
        if (!userResponse.ok) throw new Error(`${userResponse.status}`);
        const user = await userResponse.json();

        document.getElementById("username").textContent = `Welcome, ${user.name}`;

        // Fetch existing tasks for the user
        const taskResponse = await fetch("/results");
        if (!taskResponse.ok) throw new Error(`${taskResponse.status}`);
        const data = await taskResponse.json();

        tableCurr = data;
        updateTable(data);
    } catch (error) {
        console.error("Error Fetching Data:", error);
    }

    // // Fetch existing data from the server
    // fetch("/results")
    //     .then(response => {
    //         if (!response.ok) throw new Error(`${response.status}`);
    //         return response.json();
    //     })
    //     .then(data => {
    //         tableCurr = data;
    //         updateTable(data);
    //     })
    //     .catch(error => {
    //         console.error("Error Fetching Data:", error);
    //     });
};