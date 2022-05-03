import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import DynamicRoute from "./utils/DynamicRoute";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <DynamicRoute>
                <Home auth />
              </DynamicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <DynamicRoute>
                <Login guest />
              </DynamicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <DynamicRoute>
                <Register guest />
              </DynamicRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
