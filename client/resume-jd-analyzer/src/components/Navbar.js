// src/components/Navbar.js
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const styles = `
.navbar-main {
  background: #1e3a8a;
  padding: 0.6rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.navbar-brand {
  font-size: 1.8rem;
  font-weight: 900;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.navbar-brand span {
  color: #facc15;
}
.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.navbar-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  transition: 0.2s ease;
  font-size: 1rem;
}
.navbar-link:hover,
.navbar-link.active {
  background-color: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}
.logout-btn {
  background-color: #ef4444;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}
.logout-btn:hover {
  background-color: #dc2626;
}
@media (max-width: 768px) {
  .navbar-links {
    flex-direction: column;
    gap: 0.75rem;
  }
  .navbar-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  .navbar-brand {
    font-size: 1.5rem;
  }
}
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (!document.getElementById("navbar-styles")) {
      const style = document.createElement("style");
      style.id = "navbar-styles";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar-main">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🧠 SkillMatch <span>AI</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/analyze"
            className={`navbar-link${isActive("/analyze") ? " active" : ""}`}
          >
            📁 Upload & Analyze
          </Link>
          <Link
            to="/chat"
            className={`navbar-link${isActive("/chat") ? " active" : ""}`}
          >
            💬 Chat with Resume
          </Link>
          <Link
            to="/interview"
            className={`navbar-link${isActive("/interview") ? " active" : ""}`}
          >
            🧠 Interview Questions
          </Link>
          <Link
            to="/hr-questionnaire"
            className={`navbar-link${isActive("/hr-questionnaire") ? " active" : ""}`}
          >
            🧾 HR Questionnaire
          </Link>

          {/* 🔴 Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
