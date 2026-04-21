import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin = () => {
  fetch("https://smartasset.onrender.com/api/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.access) {
        //  store token
        localStorage.setItem("token", data.access);

        // optional
        localStorage.setItem("username", username);
         localStorage.setItem("role", data.role); 

        alert("Login successful");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    })
    .catch((err) => console.error(err));
};
 return (
  <div
    style={{
      background: "#2f2f2f",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: "400px",   
        background: "#3a3a3a",
        border: "1px solid #555555",
        borderRadius: "10px",
        overflow: "hidden",
        
      }}
    >
      
      <h2
        style={{
          background: "#1a1a1a",
          margin: 0,
          padding: "15px 20px",
          color: "white",
          borderRadius: "10px 10px 0 0",
        }}
      >
        Login
      </h2>

      
      <div style={{ padding: "20px" }}>
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",   
            padding: "10px",
            marginBottom: "15px",
            background: "#2a2a2a",
            border: "1px solid #555",
            borderRadius: "5px",
            color: "white",
            boxSizing:"border-box"
          }}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            background: "#2a2a2a",
            border: "1px solid #555",
            borderRadius: "5px",
            color: "white",
            boxSizing: "border-box"

          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",  
            padding: "10px",
            background: "transparent",
            border: "1px solid #aaa",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  </div>
);
}

export default Login;
