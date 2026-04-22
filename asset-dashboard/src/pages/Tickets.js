import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [assets, setAssets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    asset: "",
    issue: "",
  });
  const[editItem,setEditItem]=useState(null)
  const [users, setUsers] = useState([]);
  const role = localStorage.getItem('role')
  useEffect(() => {
    fetchWithAuth("https://smartasset.onrender.com/api/tickets/").then((data) =>
      setTickets(data.results || []),
    );

    fetchWithAuth("https://smartasset.onrender.com/api/assets/all/").then((data) =>
      setAssets(data || []),
    );

    fetchWithAuth("https://smartasset.onrender.com/api/users/").then((data) =>
      setUsers(data.results || []),
    );
  }, []);

  const handleAdd = () => {
    const method=editItem?"PUT":"POST"
    const url=editItem?`https://smartasset.onrender.com/api/tickets/${editItem}/`:`https://smartasset.onrender.com/api/tickets/`
    if (!newTicket.asset || !newTicket.issue) {
      alert("Fill all fields");
      return;
    }

    fetchWithAuth(url, {
      method,
      body: JSON.stringify(newTicket),
    }).then((data) => {
      if(editItem){
        setTickets(prev=>prev.map(item=>item.id===editItem?data:item))
      }else{
           setTickets([...tickets, data]);
      }
     
      setShowForm(false);
      setEditItem(null)
      setNewTicket({ asset: "", issue: "" });
    });
  };

  const handleToogleStatus = (ticket) => {
    const newStatus=ticket.status==="Open"?"Closed":"Open"
    fetchWithAuth(`https://smartasset.onrender.com/api/tickets/${ticket.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    })
      .then((data) => {
        setTickets(prev=>
          prev.map((t) => (t.id === ticket.id ? { ...t, status: newStatus } : t)),
        );
      })
      .catch((err) => console.error(err));
  };
  const handleAssignTech = (ticketId, techId) => {
    
    if (!techId) return;

    fetchWithAuth(`https://smartasset.onrender.com/api/tickets/${ticketId}/`, {
      method: "PATCH",
      body: JSON.stringify({
        technician: techId,
      }),
    }).then((data) => {
      alert("Technician assigned");

      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, technician_name: data.technician_name }
            : t,
        ),
      );
    });
  };
  const handleDelete = (id) => {
    fetchWithAuth(`https://smartasset.onrender.com/api/tickets/${id}/`, {
      method: "DELETE",
    }).then(() => {
      fetchWithAuth("https://smartasset.onrender.com/api/tickets/")
        .then((data) => setTickets(data.results || data || []))
    });
  };
  const handleEdit=(item)=>{
    setNewTicket({
      asset:item.asset,
      issue:item.issue
    })
    setShowForm(true)
    setEditItem(item.id)
  }
  const buttonStyle = {
    background: "transparent",
    border: "1px solid #aaa",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
    marginLeft: "5px",
    marginTop:"8px",
    width:"70px",
   whiteSpace: "nowrap",
  };
  const selectStyle = {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#2c2c2c",
    color: "white",
    outline: "none",
    cursor: "pointer",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#2a2a2a",
    color: "white",
  };

  const tableStyle = {
    width: "90%",
    marginTop: "20px",
    borderCollapse: "collapse",
    borderRadius: "10px",
    overflow: "hidden",
    minWidth:"600px"
  };

  const thStyle = {
    background: "#111",
    padding: "12px",
    color: "white",
  };

  const tdStyle = {
    padding: "10px",
    textAlign: "center",
  };

  const rowStyle = {
    background: "#3e3c3c",
    color: "white",
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>Tickets</h2>

      <button
        style={{...buttonStyle,width:"120px"}}
        onClick={() => setShowForm(true)}
        onMouseEnter={(e) => {
          e.target.style.background = "#4da6ff";
          e.target.style.color = "black";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "white";
        }}
      >
        + Raise Ticket
      </button>

      {showForm && (
        <div style={{ marginTop: "20px", width: "300px" }}>
          <select
            style={inputStyle}
            value={newTicket.asset}
            onChange={(e) =>
              setNewTicket({ ...newTicket, asset: e.target.value })
            }
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Enter issue"
            style={inputStyle}
            value={newTicket.issue}
            onChange={(e) =>
              setNewTicket({ ...newTicket, issue: e.target.value })
            }
          />

          <button style={buttonStyle} onClick={handleAdd}>
            {editItem?"Update":"Submit"}
          </button>
        </div>
      )}
  <div style={{overflow:"auto"}}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Asset</th>
            <th style={thStyle}>Issue</th>
            <th style={thStyle}>Technician</th>
            <th style={thStyle}>Status</th>

            {role === 'admin' && <th style={thStyle}>Technician Allocation</th>}
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.length === 0 ? (
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
            tickets.map((t) => (
              <tr
                key={t.id}
                style={rowStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#555")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#3e3c3c")
                }
              >
                <td style={tdStyle}>{t.id}</td>
                <td style={tdStyle}>{t.asset_name}</td>
                <td style={tdStyle}>{t.issue}</td>
                <td style={tdStyle}>
                  {" "}
                  {t.technician_name ? t.technician_name : "Not Assigned"}
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      color: t.status === "Open" ? "orange" : "lightgreen",
                      fontWeight: "bold",
                    }}
                  >
                    {t.status === "Open" ? "Open" : "Close"}
                  </span>

                  
                    <button
                      style={buttonStyle}
                      onClick={() =>handleToogleStatus(t)}
                    >
                      {t.status==="Open"?"Close":"Open"}
                    </button>
                  
                </td>
                {role === 'admin' && (
                <td style={tdStyle}>
                  <select
                    style={selectStyle}
                    onChange={(e) => handleAssignTech(t.id, e.target.value)}
                  >
                    <option value="">Assign Technician</option>

                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                  
                </td>
                )}
                
                <td>
                  {role === 'admin' && (<button
                    style={buttonStyle}
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                  )}
                  <button
                    style={buttonStyle}
                    onClick={() => handleEdit(t)}
                  >
                    Edit
                  </button>
                  </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Tickets;
