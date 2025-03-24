import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Header from './components/Header';
import TodoList from './components/TodoList';
import TaskForm from './components/TaskForm';
import ModifyTaskForm from './components/ModifyTaskForm';
import DeleteTaskForm from './components/DeleteTaskForm';

function App() {
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();


    // if (!isAuthenticated) {
    //     return (
    //         <div className="container text-center">
    //             <h1>Welcome to //TODO</h1>
    //             <p>Please log in to continue.</p>
    //             <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
    //                 Log In
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <div className="container">
            <Header />
            <TodoList />
            <TaskForm />
            <ModifyTaskForm />
            <DeleteTaskForm />
        </div>
    );
}

export default App;
