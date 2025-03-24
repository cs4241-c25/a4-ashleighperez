import React, { useState, useEffect } from 'react';

function TodoList() {
    const [tasks, setTasks] = useState([]);

    // get tasks from backend
    useEffect(() => {
        fetch('http://localhost:5001/tasks')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch tasks');
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setTasks(data);
                } else {
                    console.error('Unexpected response:', data);
                    setTasks([]); // fallback
                }
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setTasks([]); // fallback
            });
    }, []);

    return (
        <div>
            <hr />
            <h2>TODO List</h2>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Days Remaining</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map(task => (
                    <tr key={task._id}>
                        <td>{task._id}</td>
                        <td>{task.task}</td>
                        <td>{task.priority}</td>
                        <td>{task.deadline}</td>
                        <td>{task.daysLeft}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <hr />
        </div>
    );
}

export default TodoList;
