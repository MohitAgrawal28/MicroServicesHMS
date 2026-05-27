import { useState } from "react";
import API from "../api/api";

function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({
    username: "mohit",
    password: "password123",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/auth/login", loginData);
      const token =
        typeof response.data === "string" ? response.data : response.data?.token;

      if (!token) {
        throw new Error("Token missing from login response");
      }

      localStorage.setItem("token", token);
      setMessage("Login successful");
      onLogin?.(token);
    } catch {
      setMessage("Login failed. Check username, password, and auth service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel auth-panel" onSubmit={handleLogin}>
      <div>
        <p className="eyebrow">Gateway auth</p>
        <h2>Sign in</h2>
      </div>

      <label>
        Username
        <input
          type="text"
          value={loginData.username}
          onChange={(event) =>
            setLoginData({ ...loginData, username: event.target.value })
          }
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={loginData.password}
          onChange={(event) =>
            setLoginData({ ...loginData, password: event.target.value })
          }
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
}

export default Login;
