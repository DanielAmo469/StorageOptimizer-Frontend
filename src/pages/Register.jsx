import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Toast from "../components/Toast";
import Button from "../components/Button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [registration_request_description, serRegistrationRequestDescription] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !verifyPassword) {
      setToast({ message: "Please fill in all fields.", type: "error" });
      return;
    }
    if (password !== verifyPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    try {
      const data = await registerUser({
        username,
        email,
        password,
        verify_password: verifyPassword,
        registration_request_description,
      });
      setToast({ message: "Registration Request successful", type: "success" });
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setToast({ message: error?.response?.data?.detail || "Registration Request failed", type: "error" });
    }
  };

  return (
    <div className="container h-100">
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
              <h2 className="fw-bold mb-2 text-uppercase" style={{ textAlign: "left", fontSize: "1.7rem", marginBottom: "1.1rem" }}>Register</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                autoComplete="new-password"
              />
              <input
                type="text"
                placeholder="Registration Request Description"
                value={registration_request_description}
                onChange={(e) => serRegistrationRequestDescription(e.target.value)}
              />
              <Button style={{ width: "100%", marginTop: "0.5rem" }} onClick={handleSubmit}>
                Register
              </Button>
              <div style={{ width: "100%", marginTop: "1.2rem", textAlign: "left" }}>
                <p className="mb-0" style={{ fontSize: "0.98rem" }}>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="fw-bold"
                    style={{ color: "#6366f1", textDecoration: "underline" }}
                  >
                    Login
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

export default Register;
