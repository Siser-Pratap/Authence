
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If using react-router for navigation

const SignIn = ({ path, signUpUrl, forceRedirectUrl }) => {
  const navigate = useNavigate(); // for navigation

  // Placeholder function for handling sign-in logic
  const handleSignIn = () => {
    // Perform sign-in logic here, e.g., authenticate user, API call, etc.
    // const isAuthenticated = true; // Assume user is authenticated for demo purposes

    // if (isAuthenticated) {
    //   navigate(forceRedirectUrl); // Redirect to dashboard or desired route
    // } else {
    //   console.log('Sign-in failed');
    // }
    navigate("/dashboard");
    console.log("true");

  };

//   useEffect(() => {
//     // Simulate checking if user is already signed in
//     const isSignedIn = false; // Add real logic for checking signed-in status

//     if (isSignedIn) {
//       navigate(forceRedirectUrl); // Redirect if already signed in
//     }
//   }, [forceRedirectUrl, navigate]);

  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={handleSignIn}>Sign In</button>
      <p>
        Don't have an account? <a href={signUpUrl}>Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;
