import { STATUS_META, STATUS_LIST } from "../constants";
import type { Job, Status } from "../types";
import { JobCard } from "./JobCard";

type KanbanBoardProps = {
  jobs: Job[];
  onOpen: (job: Job) => void;
  onDelete: (job: Job) => void;
  onDropStatus: (id: string, status: Status) => void;
};

export function KanbanBoard({ jobs, onOpen, onDelete, onDropStatus }: KanbanBoardProps) {
  return (
    <section className="kanban" aria-label="Kanban des candidatures">
      {STATUS_LIST.map((status) => {
        const columnJobs = jobs.filter((job) => job.status === status);
        return (
          <div
            key={status}
            className="column"
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/job-id");
              if (id) onDropStatus(id, status);
            }}
          >
            <header className="column__head">
              <span className="column__dot" style={{ background: STATUS_META[status].accent }} />
              <div>
                <h2>{STATUS_META[status].label}</h2>
                <p>{STATUS_META[status].hint}</p>
              </div>
              <span className="count-chip">{columnJobs.length}</span>
            </header>

            <div className="column__body">
              {columnJobs.length === 0 ? (
                <p className="column__empty">Aucune offre</p>
              ) : (
                columnJobs.map((job) => (
                  <JobCard key={job.id} job={job} onOpen={onOpen} onDelete={onDelete} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
