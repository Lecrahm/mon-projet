import { STATUS_META } from "../constants";
import type { Job } from "../types";
import { formatFit } from "../utils";

type HubCardProps = {
  job: Job;
  layout: "grid" | "list";
  active?: boolean;
  onOpen: (job: Job, tab?: "lettre" | "cv") => void;
};

export function HubCard({ job, layout, active, onOpen }: HubCardProps) {
  return (
    <article
      className={`hub-card ${layout === "list" ? "hub-card--list" : ""} ${job.blocked ? "is-blocked" : ""} ${active ? "is-active" : ""}`}
      onClick={() => onOpen(job)}
    >
      <div className="hub-card__glow" />
      <div className="hub-card__top">
        <span className="fit-pill">{formatFit(job.fit_score)}</span>
        {job.blocked ? (
          <span className="block-pill">Bloqué · permis B</span>
        ) : (
          <span className="status-pill">
            <i className="status-dot" style={{ background: STATUS_META[job.status].accent }} />
            {STATUS_META[job.status].label}
          </span>
        )}
      </div>

      <div className="hub-card__body">
        <p className="hub-card__company">{job.company}</p>
        <h3>{job.title}</h3>
        <p className="hub-card__meta">
          {[job.location, job.contract, job.salary].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="hub-card__foot">
        <button
          type="button"
          className="btn btn--tiny"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(job, "lettre");
          }}
        >
          Lettre
        </button>
        <button
          type="button"
          className="btn btn--tiny"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(job, "cv");
          }}
        >
          CV
        </button>
        {job.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
