import React from "react";

function Profile() {
  const username = localStorage.getItem("username") || "User";
  const role=localStorage.getItem("role")||"User"
  return (
    <div
      style={{
        color: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <h2 style={{ marginBottom: "10px" }}>Profile</h2>

        <div
          style={{
            background: "#3e3c3c",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #555",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>👤 User Info</h3>

          <p><strong>Username:</strong> {username}</p>
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Status:</strong> Active</p>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            style={{
              marginTop: "15px",
              padding: "10px",
              borderRadius: "5px",
              width: "100%",
              maxWidth:"250px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
