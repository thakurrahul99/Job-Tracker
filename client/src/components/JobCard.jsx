import { useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import api from "../services/api";

const JobCard = ({ job, onJobUpdated, onJobDeleted, color }) => {
  const [status, setStatus] = useState(job.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      const response = await api.put(`/jobs/${job._id}`, { status: newStatus });
      onJobUpdated(response.data);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/jobs/${job._id}`);
      onJobDeleted(job._id);
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  return (
    <div className="flex bg-white border border-ink/10 rounded-lg overflow-hidden">
      <div className="w-1" style={{ backgroundColor: color }} />
      <div className="flex-1 px-4 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="font-display text-lg leading-none">{job.company}</h4>
            <span className="text-sm text-slate">{job.role}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-[11px] text-slate/70">
              {new Date(job.appliedDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            {job.jobLink && (
              <a
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-accent hover:underline flex items-center gap-1"
              >
                Posting <ExternalLink size={10} />
              </a>
            )}
          </div>
          {job.notes && <p className="text-xs text-slate mt-1">{job.notes}</p>}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={status}
            onChange={handleStatusChange}
            className="font-mono text-xs uppercase tracking-wide px-2 py-1 rounded border border-ink/15 bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/30"
            style={{ color }}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={handleDelete}
            className="text-slate hover:text-rose transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
