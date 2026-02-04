import { useState } from "react";
import Chatroom from "./chatroom";
function Chatbox() {
  const [view, setView] = useState("home");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const goToView = (newView) => {
    setUsername("");
    setPassword("");
    setView(newView);
  };

  const handleRegister = async () => {
    try {
      // FIX 1: Corrected URL with Port 5000 and Path /register
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("Error: Is your Flask server running on port 5000?");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setView("chatroom");
        alert("Login Successful! Welcome, " + username);
        // You could setView("dashboard") here if you had one
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Connection failed. Is Flask running?");
    }
  };

  return (
    <div className="chatbox">
      <div className="content">
        {view === "home" && (
          <div className="btn-container">
            <button onClick={() => setView("login")}>Login</button>
            <button onClick={() => setView("register")}>Register</button>
          </div>
        )}

        {view === "login" && (
          <div className="login-form">
            <h1>Sign In</h1>
            <label>Username: </label>
            <input
              type="text"
              placeholder="Enter User_name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => setView("home")}>Back</button>
          </div>
        )}

        {view === "chatroom" && (
          <div className="chatroom-content">
            <Chatroom username={username}></Chatroom>
          </div>
        )}

        {view === "register" && (
          <div className="register-form">
            <h1>Sign Up</h1>
            <label>Username: </label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password: </label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password} // FIX 2: Correctly link password state
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleRegister}>Register Now</button>
            <button onClick={() => setView("home")}>Back</button>
          </div>
        )}

        {/* ... Keep login view ... */}
      </div>
    </div>
  );
}

export default Chatbox;
