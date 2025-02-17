function handleLogin() {
    // ...
    const redirectUrl = "https://auto-tube-web-v2.vercel.app/"; // Update the redirect URL
    // Ensure that the redirect happens after successful login
    if (loginSuccessful) { // Assuming you have a condition to check if login is successful
        window.location.href = redirectUrl; // Redirect to the specified URL
    }
    // ...
} 