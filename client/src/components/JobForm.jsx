import { useState } from "react";
import api from "../services/api";

const JobForm = ({ onJobAdded }) => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    jobLink: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/jobs", formData);
      onJobAdded(response.data);
      setFormData({
        company: "",
        role: "",
        status: "Applied",
        jobLink: "",
        notes: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-ink/15 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent";
  const labelClass =
    "block text-xs font-mono uppercase tracking-wide text-slate mb-1";

  return (
    <div>
      {error && (
        <div className="bg-rose-soft text-rose text-sm px-3 py-2 rounded mb-4 border border-rose/20">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className={labelClass}>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Job Link</label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            placeholder="https://…"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-6 py-2.5 rounded font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50"
          >
            {loading ? "Adding…" : "Add Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
