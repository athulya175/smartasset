import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

function Inventory() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    threshold: ""
  });
  const [editingItem, setEditingItem] = useState(null);
  const role = localStorage.getItem('role');
 useEffect(() => {
  fetchWithAuth("/api/inventory/")
    .then(data => {
      if (!data) return;
      setItems(data.results || []);
    })
    .catch(err => console.error(err));
}, []);

  const handleAdd = () => {
    const method=editingItem?"PUT":"POST"
    const url=editingItem?`/api/inventory/${editingItem}/`:"/api/inventory/";
    fetchWithAuth(url, {
      method,
      body: JSON.stringify(newItem)
    })
      .then(data => {
        if (!data) return;
        if( editingItem){
          //Updating existing data
          setItems(prev=>prev.map(item=>item.id===editingItem?data:item))
        }else{
          // ading new dataset
          setItems(prev => [...prev, data]);
        }
        
        setShowForm(false);
        setEditingItem(null)
        setNewItem({ name: "", quantity: "", threshold: "" });
      });
  };

  const handleDelete = (id) => {
  fetchWithAuth(`/api/inventory/${id}/`, {
    method: "DELETE",
  })
  .then(() => {
    setItems(prev => prev.filter(item => item.id !== id));
  });
};
const handleEdit=(item)=>{
  setNewItem({
    name:item.name,
    quantity:item.quantity,
    threshold:item.threshold

  })
  setShowForm(true);
    setEditingItem(item.id);
}
  const buttonStyle = {
    background: "transparent",
    border: "1px solid #aaa",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
    marginRight: "5px",
    marginBottom:"8px",
    width:"80px",
    whiteSpace:"nowrap"
  };
  
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #555",
  background: "#2a2a2a",
  color: "white",
  boxSizing: "border-box"
};

const thStyle = {
  background: "#111",
  padding: "12px",
  color: "white"
};

const tdStyle = {
  padding: "10px",
  textAlign: "center"
};

  return (
    <div>
      <h2 style={{ color: "white" }}>Inventory</h2>
    {role==="admin"&&(
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
        + Add Item
      </button>
  )}
      {showForm && (
        <div style={{ marginTop: "20px" }}>
          <input
            placeholder="Name"
            value={newItem.name}
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Threshold"
            type="number"
            value={newItem.threshold}
            onChange={(e) =>
              setNewItem({ ...newItem, threshold: e.target.value })
            }
            style={inputStyle}
          />

          <button
            style={buttonStyle}
            onClick={handleAdd}
          >
            {editingItem ? "Update" : "Add"}
          </button>
        </div>
      )}
  <div style={{overflow:"auto"}}>
      <table
        style={{
          width: "90%",
          marginTop: "20px",
          borderCollapse: "collapse",
          borderRadius: "10px",
          overflow: "hidden",
          minWidth:"600px"
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Threshold</th>
            <th style={thStyle}>Status</th>
            {role==="admin"&&(
            <th style={thStyle}>Action</th>
            )}
          </tr>
        </thead>

        <tbody>
                {items.length === 0 ? (
    <tr>
      <td
        colSpan="6"
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#aaa"
        }}
      >
        No results found 🔍
      </td>
    </tr>
  ) : (
          Array.isArray(items)&&items.map(item => (
            
            <tr
              key={item.id}
              style={{ background: "#3e3c3c", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#555"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#3e3c3c"}
            >
              
              <td style={tdStyle}>{item.id}</td>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.quantity}</td>
              <td style={tdStyle}>{item.threshold}</td>

              <td
                style={{
                  ...tdStyle,
                  color:
                    item.quantity < item.threshold ? "red" : "lightgreen",
                  fontWeight:
                    item.quantity < item.threshold ? "bold" : "normal"
                }}
              >
                {item.quantity < item.threshold
                  ? "⚠️ Low Stock"
                  : "✅ OK"}
              </td>
              {role==="admin"&&(
              <td style={tdStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
              </td>
              )}
            </tr>
            
          )))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Inventory;
