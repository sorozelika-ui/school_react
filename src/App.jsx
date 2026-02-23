// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Pages/Dashboard";
// import Notes from "./components/pages/Notes";
import Register from "./components/Pages/Register"
import Login from "./components/Pages/Login";
import Eleves from "./components/Pages/Eleves";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161f38",
            color: "#e8edf5",
            border: "1px solid rgba(255,255,255,0.07)",
            fontFamily: "DM Sans, sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
       <Route path="/gestion-eleves" element={<Eleves />} />
<Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/notes/:eleveId" element={<Notes />} /> */}
      </Routes>
    </BrowserRouter>
  );
}