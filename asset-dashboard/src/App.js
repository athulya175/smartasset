
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Inventory from './pages/Inventory';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Layout from './components/Layout';
import Assignments from './pages/Assigment';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/assets" element={<Layout><Assets /></Layout>} />
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/tickets" element={<Layout><Tickets /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/assigments" element={<Layout><Assignments/></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
