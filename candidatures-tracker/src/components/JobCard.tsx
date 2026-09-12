import { STATUS_META } from "../constants";
import type { Job } from "../types";
import { formatDate, formatFit } from "../utils";
import { IconExternal, IconTrash } from "./Icons";

type JobCardProps = {
  job: Job;
  onOpen: (job: Job) => void;
  onDelete: (job: Job) => void;
};

export function JobCard({ job, onOpen, onDelete }: JobCardProps) {
  return (
    <article
      className="job-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/job-id", job.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onOpen(job)}
    >
      <div className="job-card__top">
        <span className="fit-pill" title="Score d'adéquation">
          {formatFit(job.fit_score)}
        </span>
        <div className="job-card__actions">
          {job.url ? (
            <a
              className="icon-btn"
              href={job.url}
              target="_blank"
              rel="noreferrer"
              title="Voir l'offre"
              onClick={(event) => event.stopPropagation()}
            >
              <IconExternal />
            </a>
          ) : null}
          <button
            type="button"
            className="icon-btn"
            title="Supprimer"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(job);
            }}
          >
            <IconTrash />
          </button>
        </div>
      </div>

      <h3 className="job-card__title">{job.title}</h3>
      <p className="job-card__company">{job.company}</p>

      <p className="job-card__meta">
        {[job.location, job.contract].filter(Boolean).join(" · ")}
      </p>
      {job.salary ? <p className="job-card__salary">{job.salary}</p> : null}

      {job.tags.length > 0 ? (
        <div className="tag-row">
          {job.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="job-card__footer">
        <span className="status-dot" style={{ background: STATUS_META[job.status].accent }} />
        {job.date_found ? <span>Repéré {formatDate(job.date_found)}</span> : <span>Sans date</span>}
      </div>
    </article>
  );
}
