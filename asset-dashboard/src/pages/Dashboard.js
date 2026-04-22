import React, { useEffect, useState } from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer} from "recharts";
import { fetchWithAuth } from "../utils/api";
function Dashboard() {
  const [data, setData] = useState({
    total_assets: 0,
    total_inventory: 0,
    assigned_assets: 0,
    open_tickets: 0,
  });
const chartData = [
  { name: "Assets", value: data.total_assets },
  { name: "Inventory", value: data.total_inventory },
  { name: "Assigned", value: data.assigned_assets },
  { name: "Tickets", value: data.open_tickets }
];
  useEffect(() => {
    fetchWithAuth("https://smartasset.onrender.com/api/dashboard/")
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  const cardStyle = {
    flex: 1,
    background: "#3a3a3a",
    padding: "20px",
    borderRadius: "10px",
    color: "white",
    border: "1px solid #555",
    textAlign: "center",
  };

  return (
    <div>
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        Dashboard
      </h2>

      <div style={{ display: "flex", gap: "20px",flexWrap: "wrap", }}>
        <div style={cardStyle}>
          <h3>Total Assets</h3>
          <p>{data.total_assets}</p>
        </div>

        <div style={cardStyle}>
          <h3>Inventory</h3>
          <p>{data.total_inventory}</p>
        </div>

        <div style={cardStyle}>
          <h3>Assigned</h3>
          <p>{data.assigned_assets}</p>
        </div>

        <div style={cardStyle}>
          <h3>Open Tickets</h3>
          <p>{data.open_tickets}</p>
        </div>
      </div>
<div style={{ width: "100%", overflowX: "auto" ,marginTop:"30px"}}>
  <div style={{ minWidth: "400px", height: "300px" }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
}

export default Dashboard;
