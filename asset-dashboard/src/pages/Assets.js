import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
function Assets() {
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    purchase_date: "",
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const filteredAssets = assets.filter((item) =>
    statusFilter ? item.status === statusFilter : true,
  );
  const role = localStorage.getItem('role');
  console.log(localStorage.getItem('role'));
  useEffect(() => {
    // Fetch assets
    fetchWithAuth("https://smartasset.onrender.com/api/assets/?search=" + search)
      .then((data) => {
        setAssets(data.results || []);
        setNextPage(data.next);
        setPrevPage(data.previous);
      })
      .catch((err) => console.error(err));

    // Fetch users
    fetchWithAuth("https://smartasset.onrender.com/api/users/")
      .then((data) => setUsers(data.results || []))
      .catch((err) => console.error(err));
  }, [search]);

  const handleAdd = () => {
    // Basic validation
    if (!newAsset.name || !newAsset.type || !newAsset.purchase_date) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      name: newAsset.name,
      asset_type: newAsset.type,
      purchase_date: newAsset.purchase_date,
    };

    if (editId) {
      // UPDATE
      fetchWithAuth(`/api/assets/${editId}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })
        .then((updatedItem) => {
          setAssets(
            assets.map((item) => (item.id === editId ? updatedItem : item)),
          );
          setEditId(null);
          setShowForm(false);
          setNewAsset({ name: "", type: "", purchase_date: "" });
        })
        .catch((err) => console.error(err));
    } else {
      // CREATE
      fetchWithAuth("https://smartasset.onrender.com/api/assets/", {
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((data) => {
          setAssets([...assets, data]);
          setShowForm(false);
          setNewAsset({ name: "", type: "", purchase_date: "" });
        })
        .catch((err) => console.error(err));
    }
  };

 const handleDelete = (id) => {
    fetchWithAuth(`https://smartasset.onrender.com/api/assets/${id}/`, {
      method: "DELETE",
    })
      .then(() => {
        // refetch the list instead of filtering locally
        fetchWithAuth("https://smartasset.onrender.com/api/assets/?search=" + search)
          .then((data) => {
            setAssets(data.results || []);
            setNextPage(data.next);
            setPrevPage(data.previous);
          })
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (item) => {
    setNewAsset({
      name: item.name,
      type: item.asset_type,
      status: item.status,
      purchase_date: item.purchase_date || "",
    });
    setShowForm(true);
    setEditId(item.id);
  };
  const handleAssign = (assetId) => {
    if (!selectedUser) {
      alert("Select user first");
      return;
    }

    fetchWithAuth("https://smartasset.onrender.com/api/assignments/", {
      method: "POST",
      body: JSON.stringify({
        asset: assetId,
        employee: parseInt(selectedUser),
      }),
    })
      .then(() => {
        alert("Assigned successfully");
        setAssets((prev) =>
          prev.map((a) =>
            a.id === assetId ? { ...a, status: "assigned" } : a,
          ),
        );

        navigate("/assigments");
      })

      .catch((err) => console.error(err));
  };

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
  });
  const loadPage = (url) => {
    fetchWithAuth(url)
      .then((data) => {
        setAssets(data.results || []);
        setNextPage(data.next);
        setPrevPage(data.previous);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div>
      <h2 style={{ color: "white", whiteSpace: "nowrap" }}>Asset List</h2>
      <div>
        {role === 'admin' && (
        <button
          style={{
            background: "transparent",
            border: "1px solid white",
            color: "white",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setNewAsset({ name: "", type: "", purchase_date: "" });
          }}
        >
          + Add Asset
        </button>
        )}

        {showForm && (
          <div style={{ marginTop: "20px" }}>
            <input
              style={{
                padding: "10px",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
              placeholder="Name"
              value={newAsset.name}
              onChange={(e) =>
                setNewAsset({ ...newAsset, name: e.target.value })
              }
            />
            <br />
            <input
              style={{
                padding: "10px",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
              placeholder="Type"
              value={newAsset.type}
              onChange={(e) =>
                setNewAsset({ ...newAsset, type: e.target.value })
              }
            />
            <br />
            <input
              style={{
                padding: "10px",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
              type="date"
              value={newAsset.purchase_date}
              onChange={(e) =>
                setNewAsset({ ...newAsset, purchase_date: e.target.value })
              }
            />
            <br />
            <button
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
                marginRight: "8px",
              }}
              onClick={handleAdd}
            >
              {editId ? "Update" : "Add"}
            </button>
            {/*  Added Cancel button to reset form cleanly */}
            <button
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setNewAsset({ name: "", type: "", purchase_date: "" });
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            alignItems: "center",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 200px",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2c2c2c",
              color: "white",
              outline: "none",
              width: "100%",
              maxWidth: "225px",
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              flex: "1 1 200px",
              maxWidth: "250px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2c2c2c",
              color: "white",
              cursor: "pointer",
            }}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              flex: "1 1 200px",
              maxWidth: "250px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2c2c2c",
              color: "white",
              cursor: "pointer",
            }}
          >
            <option value="asc">Sort by ID ↑</option>
            <option value="desc">Sort by ID ↓</option>
          </select>
          <button
            style={{
              flex: "1 1 200px",
              maxWidth: "250px",
              background: "transparent",
              color: "white",
              border: "1px solid white",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={() => {
              setStatusFilter("");
              setSortOrder("asc");
              setSearch("");
            }}
          >
            Clear
          </button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          {role==="admin" &&(
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2c2c2c",
              color: "white",
              cursor: "pointer",
            }}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          )}
        </div>
      </div>
      <div style={{overflow:"auto"}}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          minWidth:"600px"
        }}
      >
        <thead>
          <tr>
            <th
              style={{ background: "#0f0f0f", color: "white", padding: "10px" }}
            >
              ID
            </th>
            <th
              style={{ background: "#0f0f0f", color: "white", padding: "10px" }}
            >
              Name
            </th>
            <th
              style={{ background: "#0f0f0f", color: "white", padding: "10px" }}
            >
              Type
            </th>
            <th
              style={{ background: "#0f0f0f", color: "white", padding: "10px" }}
            >
              Status
            </th>
            <th
              style={{ background: "#0f0f0f", color: "white", padding: "10px" }}
            >
              Purchase Date
            </th>
          {role==="admin"&&(
            <th
              style={{ background: "#0f0f0f", color: "white", padding: "10px" }}
            >
              Actions
            </th>
            )}
          </tr>
        </thead>
        <tbody style={{ background: "#3e3c3c", color: "white" }}>
          {sortedAssets.length === 0 ? (
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
            sortedAssets.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid gray" }}>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {item.id}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {item.name}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {item.asset_type}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {item.status}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {item.purchase_date}
                </td>
                {role==="admin"&&(
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
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
                      onClick={() => handleEdit(item)}
                    >
                      Edit
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
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
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
                      onClick={() => handleAssign(item.id)}
                    >
                      Assign
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
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={() => loadPage(prevPage)}
          disabled={!prevPage}
          style={{
            background: "transparent",
            color: !prevPage ? "#777" : "white",
            cursor: !prevPage ? "not-allowed" : "pointer",
            border: "1px solid white",
            padding: "8px 12px",
            borderRadius: "5px",
            marginTop: "10px",
            
          }}
        >
          Previous
        </button>

        <button
          onClick={() => loadPage(nextPage)}
          disabled={!nextPage}
          style={{
            background: "transparent",
            color: !nextPage ? "#777" : "white",
            cursor: !nextPage ? "not-allowed" : "pointer",
            border: "1px solid white",
            padding: "8px 12px",
            borderRadius: "5px",
            marginTop: "10px",
            marginLeft: "10px",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Assets;
