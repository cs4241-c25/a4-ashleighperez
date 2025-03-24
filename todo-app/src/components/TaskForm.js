import React, { useState } from 'react';

function TaskForm() {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = { task, priority, deadline };

        fetch('http://localhost:5001/addTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        })
            .then(response => {
                response.json()
                if (response.ok) {
                    alert("Task successfully added, please reload the page to see changes.");
                    setTask(''); setPriority(''); setDeadline(''); // reset form
                } else {
                    alert("Error adding task");}
            })
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setTask('');
                    setPriority('');
                    setDeadline('');
                    console.log("Task added: ", data);
                }
            })
            .catch(error => console.log("Error adding task"));
    };

    return (
        <div>
            <h4>Enter task details below</h4>
            <form onSubmit={handleSubmit} className="requires-validation" noValidate>
                <div className="form-group form-row">
                    <label className="col-form-label">Task:</label>
                    <input type="text" className="form-control col-7" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Describe your task" required />
                </div>

                <div className="form-group form-row">
                    <label className="col-form-label">Priority:</label>
                    <select className="form-control col-2" value={priority} onChange={(e) => setPriority(e.target.value)} required>
                        <option value="" disabled>Choose...</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>

                    <label className="col-form-label">Deadline:</label>
                    <input type="date" className="form-control col-auto" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-primary btn-sm">Add Task</button>
                <button type="reset" className="btn btn-outline-secondary btn-sm" onClick={() => { setTask(''); setPriority(''); setDeadline(''); }}>Reset Form</button>
            </form>
            <hr />
        </div>
    );
}

export default TaskForm;
