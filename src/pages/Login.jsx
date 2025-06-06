import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import Button from "../components/Button";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    const registrationSuccessMessage = sessionStorage.getItem("registrationSuccessMessage");
    if (registrationSuccessMessage) {
      setToast({ message: registrationSuccessMessage, type: "success" });
      sessionStorage.removeItem("registrationSuccessMessage");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setToast({ message: "Please fill in both fields.", type: "error" });
      return;
    }
    try {
      const response = await fetch("http://192.168.16.11:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToast({ message: "Login successful!", type: "success" });
        onLogin(data.access_token);
        setTimeout(() => navigate("/home"), 1200);
      } else {
        setToast({ message: data.detail || "Login failed", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Login failed", type: "error" });
    }
  };

  return (
    <div className="container">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: "" })}
      />
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12">
          <div className="card my-5 mx-auto" style={{ borderRadius: "1.2rem", maxWidth: "320px" }}>
            <img src={require('../assets/logo.png')} alt="Storage Organizer Logo" className="card-logo" />
            <div className="card-body-content">
              <h2 className="fw-bold mb-2 text-uppercase" style={{ textAlign: "left", fontSize: "1.7rem", marginBottom: "1.1rem" }}>Login</h2>
              <p className="mb-4" style={{ color: "#93B1B5", textAlign: "left", fontSize: "1rem" }}>Please enter your login and password!</p>
              <input
                type="email"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="username"
              />
              <input
                type="password"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              <Button style={{ width: "100%", marginTop: "0.5rem" }} onClick={handleSubmit}>
                Login
              </Button>
              <div style={{ width: "100%", marginTop: "1.2rem", textAlign: "left" }}>
                <p className="mb-0" style={{ fontSize: "0.98rem" }}>
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="fw-bold"
                    style={{ color: "#6366f1", textDecoration: "underline" }}
                  >
                    Register
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;