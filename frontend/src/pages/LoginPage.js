import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./App.css";
import "../styles/components.css";


function App() {
  // use AuthContext to get the login function
  const { login } = useContext(AuthContext);

  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";

    if (!password.trim()) newErrors.password = "Password is required";

    if (mode === "signup") {
      if (!confirm.trim()) newErrors.confirm = "Please confirm your password";
      else if (confirm !== password)
        newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    const url =
      mode === "login"
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/register"; // adjust to your backend

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setServerError(
          mode === "login"
            ? "Invalid email or password"
            : "Could not create account"
        );
        return;
      }

      const data = await res.json();

      // store token in AuthContext
      if (data.token) {
        login(data.token, email);
      } 
      else {
        setServerError("No token returned from server");
      }

      alert(mode === "login" ? "Logged in (stub)" : "Account created (stub)");
    } catch {
      setServerError("Network error, please try again");
    }
  };

  const switchToSignup = () => {
    setMode("signup");
    setErrors({});
    setServerError("");
    setPassword("");
    setConfirm("");
  };

  const switchToLogin = () => {
    setMode("login");
    setErrors({});
    setServerError("");
    setPassword("");
    setConfirm("");
  };

  const isLogin = mode === "login";

  return (
    <div className="app">
      <div className="login-card">
        <h1>USC Study Spot Finder</h1>
        <h2>{isLogin ? "Log in with your account" : "Create your account"}</h2>
        <p className="tagline">
          Find the perfect study spot within 10 miles of campus.
        </p>

        {serverError && <div className="error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@usc.edu"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </label>

          {!isLogin && (
            <label>
              Confirm password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
              {errors.confirm && (
                <p className="field-error">{errors.confirm}</p>
              )}
            </label>
          )}

          <button type="submit">{isLogin ? "Log in" : "Sign up"}</button>
        </form>

        <div className="helper-row">
          {isLogin ? (
            <>
              <span>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={switchToSignup}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#ffc72c",
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  Sign up
                </button>
              </span>
              <a href="#">Forgot password?</a>
            </>
          ) : (
            <>
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#ffc72c",
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  Log in
                </button>
              </span>
              <span />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
