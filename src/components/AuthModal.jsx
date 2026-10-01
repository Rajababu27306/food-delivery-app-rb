import { useState } from "react";

function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

      const body = isLogin
        ? {
            email,
            password,
          }
        : {
            name,
            email,
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      // Save logged-in user
      localStorage.setItem(
        "foodieGoUser",
        JSON.stringify(data.user)
      );

      // Update Navbar
      onLogin(data.user);

      // Close modal
      onClose();

    } catch (error) {
      console.error("Authentication Error:", error);

      setError(
        "Unable to connect to server. Please make sure backend is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">

        <button
          className="auth-close"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>
          {isLogin
            ? "Welcome Back 👋"
            : "Create Account 🎉"}
        </h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Login to continue ordering delicious food."
            : "Create your FoodieGo account."}
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        <div className="auth-switch">

          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin
              ? "Sign Up"
              : "Login"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default AuthModal;