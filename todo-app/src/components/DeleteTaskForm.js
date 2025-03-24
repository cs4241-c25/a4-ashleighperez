import React, { useState } from 'react';

function DeleteTaskForm() {
    const [taskId, setTaskId] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();

       // try {
            const response = await fetch("http://localhost:5001/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId }),
            });
                //.then(() => setTaskId('')) // task id cleared after submission

            // handle server response
            const data = await response.json();
            console.log("Server Response:", data, taskId);

            if (response.ok) {
                alert("Task successfully deleted, please reload the page to see changes.");
                setTaskId('');
            } else {
                alert("Error deleting task");
            }

        // } catch (error) {
        //     console.error("Error Deleting Task:", error);
        // }


    };

    return (
        <div>
            <h4>Enter Task ID to delete</h4>
            <form onSubmit={handleDelete} className="requires-validation" noValidate>
                <div className="form-group form-row">
                    <input type="text" className="form-control col-auto" value={taskId} onChange={(e) => setTaskId(e.target.value)} placeholder="Task ID..." required />
                </div>

                <button type="submit" className="btn btn-danger btn-sm">Delete Task</button>
                <button type="reset" className="btn btn-outline-secondary btn-sm" onClick={() => setTaskId('')}>Reset Form</button>
            </form>
            <hr />
        </div>
    );
}

export default DeleteTaskForm;
