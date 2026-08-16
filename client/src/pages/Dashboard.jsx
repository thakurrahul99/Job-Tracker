import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, LogOut, X } from "lucide-react";
import api from "../services/api";
import JobForm from "../components/JobForm";
import JobCard from "../components/JobCard";
import Logo from "../components/Logo";

const STATUS_COLORS = {
  Applied: "#6E7F5C",
  Interview: "#B98B36",
  Offer: "#8C3B3B",
  Rejected: "#B94F4F",
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchJobs, 0);
    return () => window.clearTimeout(timer);
  }, [fetchJobs]);

  const handleJobAdded = (newJob) => {
    setJobs([newJob, ...jobs]);
    setShowForm(false);
  };
  const handleJobUpdated = (updatedJob) => {
    setJobs(jobs.map((job) => (job._id === updatedJob._id ? updatedJob : job)));
  };
  const handleJobDeleted = (deletedId) => {
    setJobs(jobs.filter((job) => job._id !== deletedId));
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const statusList = ["Applied", "Interview", "Offer", "Rejected"];
  const total = jobs.length;
  const chartData = statusList
    .map((s) => ({ name: s, value: jobs.filter((j) => j.status === s).length }))
    .filter((s) => s.value > 0);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-ink/10 bg-white/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <Logo dark />
            <h1 className="font-display text-2xl">
              {user?.name}'s applications
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate hover:text-rose transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white border border-ink/10 rounded-lg mb-8 flex flex-col md:flex-row overflow-hidden">
          <div className="flex flex-1 divide-x divide-ink/10 flex-wrap">
            <div className="flex-1 px-5 py-5 min-w-[90px]">
              <p className="font-mono text-3xl">{total}</p>
              <p className="text-xs text-slate mt-1 uppercase tracking-wide">
                Total
              </p>
            </div>
            {statusList.map((s) => (
              <div className="flex-1 px-5 py-5 min-w-[90px]" key={s}>
                <p
                  className="font-mono text-3xl"
                  style={{ color: STATUS_COLORS[s] }}
                >
                  {jobs.filter((j) => j.status === s).length}
                </p>
                <p className="text-xs text-slate mt-1 uppercase tracking-wide">
                  {s}
                </p>
              </div>
            ))}
          </div>

          {total > 0 && (
            <div className="w-full md:w-40 h-32 md:h-auto border-t md:border-t-0 md:border-l border-ink/10 flex items-center justify-center py-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={3}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 12,
                      borderRadius: 6,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-ink text-canvas px-5 py-2.5 rounded font-medium text-sm hover:bg-accent transition-colors"
            >
              <Plus size={16} /> New Entry
            </button>
          ) : (
            <div className="bg-white border border-ink/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl">New Entry</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>
              <JobForm onJobAdded={handleJobAdded} />
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">
            {loading
              ? "Loading…"
              : `${jobs.length} ${jobs.length === 1 ? "entry" : "entries"}`}
          </p>

          {!loading && jobs.length === 0 ? (
            <div className="border border-dashed border-ink/20 rounded-lg py-14 text-center">
              <p className="text-slate text-sm">No applications logged yet.</p>
              <p className="text-slate text-sm">
                Add your first one above to start tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onJobUpdated={handleJobUpdated}
                  onJobDeleted={handleJobDeleted}
                  color={STATUS_COLORS[job.status]}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
