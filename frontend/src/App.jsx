import React, { useEffect, useState } from "react"
import axios from "axios"
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom"
import Login from './Components/Login'
import Navbar from "./Components/Navbar"
import Register from './Components/Register'
import Chatlist from './Components/Chatlist'
import Chat from './Components/Chat'

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate=useNavigate();
  
  useEffect(() => {
    if(user){
      const fetchUsers = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { username, password });
          const filteredUsers = response.data.filter(u => u.id !== user.id);
          setUser({ id: response.data.userId, username });
      } catch (error) {
          console.error('Error', error);
      }
      };
      fetchUsers();
      
  }
}, [user])

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <div>
        <Navbar isAuthenticated={!!user} handleLogout={handleLogout} />
        <div>
          <div>
            <Routes>
            <Route path="/login" element={!user?<Login setUser={setUser} />:<Navigate to="/Chat" />}/>
            <Route path="/Register" element={<Register />} />
            <Route path="/Chat" element={<Chatlist users={users} setSelectedUser={setSelectedUser} />} />
            <Route path="/Chat/:id" element={<Chat/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

