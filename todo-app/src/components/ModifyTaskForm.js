import React, { useState } from 'react';


function ModifyTaskForm() {

    // for storing form data
    const [formData, setFormData] = useState({
        mid: "",
        mtask: "",
        mpriority: "",
        mdeadline: ""
    });

    // input change handler to track user input w/ react state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // run when form is submitted
    const modifyTask = async (e) => {
        e.preventDefault(); // prevent page refresh

        const body = JSON.stringify({
            id: formData.mid, // renaming keys for server
            task: formData.mtask,
            priority: formData.mpriority,
            deadline: formData.mdeadline
        });


        try { // send data to server
            const response = await fetch("http://localhost:5001/modify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body
            });

            // handle server response
            const data = await response.json();
            console.log("Server Response:", data, body);

            // show alert if submission was successful/failed
            if (response.ok) {
                alert("Task successfully modified");
                setFormData({ mid: "", mtask: "", mpriority: "", mdeadline: "" }); // reset form
            } else {
                alert("Error modifying task");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    };

    const resetForm = () => {
        setFormData({ mid: "", mtask: "", mpriority: "", mdeadline: "" });
    }

    return (
        <div>
            <h4>Modify Existing Task</h4>
            <form onSubmit={modifyTask} className="requires-validation" noValidate>
                <div className="form-group form-row">
                    <div>
                        <label htmlFor="mid">Task ID:</label>
                        <input type="text"
                               className="form-control"
                               id="mid"
                               name="mid"
                               placeholder="Enter Task ID"
                               //value={formData.mid}
                               onChange={handleChange}
                               required/>
                        <div className="invalid-feedback">
                            Please provide a valid Task ID.
                        </div>
                    </div>
                    <div>
                        <label htmlFor="mtask">Task:</label>
                        <input type="text"
                               className="form-control"
                               id="mtask"
                               placeholder="Enter Task Description"
                               //value={formData.mtask}
                               name="mtask"
                               onChange={handleChange}
                               required/>
                    </div>
                    <div>
                        <label htmlFor="mpriority">Priority:</label>
                        <select id="mpriority" className="form-control" onChange={handleChange} name="mpriority" required>
                            <option value="" disabled selected>Choose...</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="mdeadline">Deadline:</label>
                        <input type="date"
                               className="form-control"
                               id="mdeadline"
                               name="mdeadline"
                               //value={formData.mdeadline}
                               onChange={handleChange}
                               required/>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-sm">Modify Task</button>
                <button type="reset" className="btn btn-outline-secondary btn-sm" onClick={resetForm}>Reset Form
                </button>
            </form>
            <hr/>
        </div>
    );
}

export default ModifyTaskForm;
