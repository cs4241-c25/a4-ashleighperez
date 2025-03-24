import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
    // get Auth0 authentication state
    const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();

    useEffect(() => {
        console.log("Auth0 Debug -> isAuthenticated:", isAuthenticated);
        console.log("Auth0 Debug -> user:", user);
    }, [isAuthenticated, user]);


    return (
        <div className="d-flex justify-content-between align-items-center my-3">
            <h1 className="text-primary font-weight-bold">//TODO: Your Task Assistant</h1>
            {/*<div>*/}
            {/*    {isAuthenticated ? (*/}
            {/*        <>*/}
            {/*            <span className="mr-2">Welcome, <strong>{user?.email}</strong></span>*/}
            {/*            <button className="btn btn-danger btn-sm"*/}
            {/*                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>*/}
            {/*                Log Out*/}
            {/*            </button>*/}
            {/*        </>*/}
            {/*    ) : (*/}
            {/*        // <button*/}
            {/*        //     className="btn btn-primary btn-sm"*/}
            {/*        //     onClick={() => loginWithRedirect()}*/}
            {/*        // >*/}
            {/*        //     Log In*/}
            {/*        // </button>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    );
}

export default Header;
