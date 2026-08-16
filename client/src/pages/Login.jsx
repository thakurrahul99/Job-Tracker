import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import Logo from "../components/Logo";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-ink text-canvas flex flex-col justify-between p-10 md:p-14">
        <div>
          <Logo dark />
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            Every application,
            <br />
            one clean record.
          </h1>
        </div>
        <p className="font-mono text-xs text-canvas/50 mt-10 md:mt-0">
          Track applications, interviews and offers in one place — no more
          scattered spreadsheets.
        </p>
      </div>

      <div className="md:w-1/2 flex items-center justify-center bg-canvas p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl mb-1">Welcome back</h2>
          <p className="text-sm text-slate mb-6">
            Log in to continue tracking.
          </p>

          {error && (
            <div className="bg-rose-soft text-rose text-sm px-3 py-2 rounded mb-4 border border-rose/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-ink/15 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-ink/15 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-canvas py-2.5 rounded font-medium text-sm hover:bg-accent transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>

          <p className="text-sm text-slate mt-6">
            New here?{" "}
            <Link
              to="/signup"
              className="text-accent font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
