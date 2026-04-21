import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const role = localStorage.getItem("role");
  const fetchAssignments = () => {
    fetchWithAuth("https://smartasset.onrender.com/api/assignments/")
      .then((data) => {
        if (!data) return;
        setAssignments(data.results || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleToggle = (item) => {
    const updatedData = item.date_returned
      ? { date_returned: null } // undo return
      : { date_returned: new Date().toISOString().split("T")[0] };

    fetchWithAuth(`/api/assignments/${item.id}/`, {
      method: "PATCH",
      body: JSON.stringify(updatedData),
    })
      .then(() => fetchAssignments())
      .catch((err) => console.error(err));
  };
  const thStyle = {
    padding: "12px",
    borderBottom: "1px solid #444",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #333",
  };
  const handleDelete = (id) => {
    fetchWithAuth(`/api/assignments/${id}/`, {
      method: "DELETE",
    }).then(() => {
      setAssignments((prev) =>
        prev.filter((assignments) => assignments.id !== id),
      );
    });
  };
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2 style={{ marginBottom: "20px" }}>Assignments</h2>
      <div style={{ overflow: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            overflow: "hidden",
            minWidth: "600px",
          }}
        >
          <thead style={{ backgroundColor: "#111" }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Asset</th>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Assigned Date</th>
              <th style={thStyle}>Status</th>
              {role === "admin" && <th style={thStyle}>Action</th>}
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#aaa",
                  }}
                >
                  No results found 🔍
                </td>
              </tr>
            ) : (
              Array.isArray(assignments) &&
              assignments.map((a) => (
                <tr key={a.id} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{a.id}</td>
                  <td style={tdStyle}>{a.asset_name}</td>
                  <td style={tdStyle}>{a.employee_name}</td>
                  <td style={tdStyle}>{a.assigned_date}</td>

                  {/* STATUS */}
                  <td style={tdStyle}>
                    {a.date_returned ? (
                      <span style={{ color: "lightgreen" }}>Returned</span>
                    ) : (
                      <span style={{ color: "orange" }}>In Use</span>
                    )}
                  </td>

                  {role==="admin"&&(
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => handleToggle(a)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: a.date_returned
                            ? "#28a745"
                            : "#ff4d4d",
                          color: "white",
                          cursor: "pointer",
                          width: "80px",
                          marginBottom: "8px",
                        }}
                      >
                        {a.date_returned ? "Undo" : "Return"}
                      </button>
                      <button
                        style={{
                          background: "transparent",
                          color: "white",
                          border: "1px solid white",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          width: "80px",
                          marginBottom: "8px",
                        }}
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignments;
