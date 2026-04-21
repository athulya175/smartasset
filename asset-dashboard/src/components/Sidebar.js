
import { NavLink } from "react-router-dom";

function Sidebar() {
  const baseStyle = {
    display: "block",
    padding: "10px",
    textDecoration: "none",
    color: "#a29e9e",
    transition: "0.3s",
    fontWeight:"bold"
  };

  const activeStyle = {
    background: "#c9ccc9",
    color:"white"
  };

  return (
    <div
      style={{
        width: "200px",
        background: "#3e3c3c",
        borderRight:"1px solid gray",
        minHeight: "100vh",

      }}
    >
      <h3 style={{ padding: "10px", borderBottom:"1px solid gray", color:"#a29e9e"}}>Menu</h3>

      <NavLink
        to="/dashboard"
        style={({ isActive }) =>
          isActive ? { ...baseStyle, ...activeStyle } : baseStyle
        }
        onMouseEnter={(e) => (e.target.style.background = "#ddd")}
        onMouseLeave={(e) => (e.target.style.background = "transparent")}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/assets"
        style={({ isActive }) =>
          isActive ? { ...baseStyle, ...activeStyle } : baseStyle
        }
        onMouseEnter={(e) => (e.target.style.background = "#ddd")}
        onMouseLeave={(e) => (e.target.style.background = "transparent")}
      >
        Assets
      </NavLink>

      <NavLink
        to="/inventory"
        style={({ isActive }) =>
          isActive ? { ...baseStyle, ...activeStyle } : baseStyle
        }
        onMouseEnter={(e) => (e.target.style.background = "#ddd")}
        onMouseLeave={(e) => (e.target.style.background = "transparent")}
      >
        Inventory
      </NavLink>

      <NavLink
        to="/tickets"
        style={({ isActive }) =>
          isActive ? { ...baseStyle, ...activeStyle } : baseStyle
        }
        onMouseEnter={(e) => (e.target.style.background = "#ddd")}
        onMouseLeave={(e) => (e.target.style.background = "transparent")}
      >
        Tickets
      </NavLink>
        <NavLink
        to="/assigments"
        style={({ isActive }) =>
          isActive ? { ...baseStyle, ...activeStyle } : baseStyle
        }
        onMouseEnter={(e) => (e.target.style.background = "#ddd")}
        onMouseLeave={(e) => (e.target.style.background = "transparent")}
      >
        Assigment
      </NavLink>
      <NavLink
        to="/profile"
        style={({ isActive }) =>
          isActive ? { ...baseStyle, ...activeStyle } : baseStyle
        }
        onMouseEnter={(e) => (e.target.style.background = "#ddd")}
        onMouseLeave={(e) => (e.target.style.background = "transparent")}
      >
        Profile
      </NavLink>
    </div>
  );
}

export default Sidebar;
