import { useEffect, useState } from "react";
import { STATUS_META, STATUS_LIST } from "../constants";
import type { DrawerTab, Job } from "../types";
import { copyText } from "../utils";
import { IconCheck, IconClose, IconCopy, IconExternal } from "./Icons";

type JobDrawerProps = {
  job: Job;
  tab: DrawerTab;
  onTab: (tab: DrawerTab) => void;
  onClose: () => void;
  onChange: (job: Job) => void;
  onDelete: (job: Job) => void;
  onCopied: (label: string) => void;
};

export function JobDrawer({ job, tab, onTab, onClose, onChange, onDelete, onCopied }: JobDrawerProps) {
  const [copied, setCopied] = useState<"letter" | "cv" | "">("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const patch = <K extends keyof Job>(key: K, value: Job[K]) => {
    onChange({ ...job, [key]: value });
  };

  const copy = async (kind: "letter" | "cv") => {
    const ok = await copyText(kind === "letter" ? job.letter : job.cv);
    if (!ok) return;
    setCopied(kind);
    onCopied(kind === "letter" ? "Lettre copiée" : "CV copié");
    window.setTimeout(() => setCopied(""), 1600);
  };

  return (
    <div className="drawer-layer">
      <button type="button" className="drawer-scrim" aria-label="Fermer" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer__head">
          <div>
            <p className="eyebrow">{job.company}</p>
            <h2 id="drawer-title">{job.title}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
            <IconClose />
          </button>
        </header>

        {job.blocked ? (
          <div className="banner-block">
            {job.blocked_reason || "Offre bloquée"}
          </div>
        ) : null}

        <nav className="tabs" aria-label="Dossier">
          {(
            [
              ["offre", "Offre"],
              ["lettre", "Lettre"],
              ["cv", "CV"],
              ["notes", "Notes"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`tab ${tab === id ? "is-on" : ""}`}
              onClick={() => onTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="drawer__body">
          {tab === "offre" ? (
            <div className="dossier">
              <dl>
                <div><dt>Lieu</dt><dd>{job.location || "—"}</dd></div>
                <div><dt>Contrat</dt><dd>{job.contract || "—"}</dd></div>
                <div><dt>Salaire</dt><dd>{job.salary || "—"}</dd></div>
                <div><dt>Fit</dt><dd>{job.fit_score}/10</dd></div>
              </dl>
              <label className="field">
                <span>Statut</span>
                <select value={job.status} onChange={(event) => patch("status", event.target.value as Job["status"])}>
                  {STATUS_LIST.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_META[status].label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-grid">
                <label className="field">
                  <span>Repérée</span>
                  <input type="date" value={job.date_found} onChange={(event) => patch("date_found", event.target.value)} />
                </label>
                <label className="field">
                  <span>Envoyée</span>
                  <input type="date" value={job.date_applied} onChange={(event) => patch("date_applied", event.target.value)} />
                </label>
                <label className="field span-2">
                  <span>Prochaine relance</span>
                  <input type="date" value={job.next_followup} onChange={(event) => patch("next_followup", event.target.value)} />
                </label>
              </div>
              {job.url ? (
                <a className="btn" href={job.url} target="_blank" rel="noreferrer">
                  <IconExternal /> Ouvrir l’annonce
                </a>
              ) : null}
              <button type="button" className="btn btn--danger" onClick={() => onDelete(job)}>
                Retirer du hub
              </button>
            </div>
          ) : null}

          {tab === "lettre" ? (
            <div className="doc-pane">
              <div className="doc-pane__bar">
                <p>Lettre — {job.company}</p>
                <button type="button" className="btn btn--solid btn--tiny" onClick={() => void copy("letter")}>
                  {copied === "letter" ? <IconCheck /> : <IconCopy />}
                  {copied === "letter" ? "Copiée" : "Copier"}
                </button>
              </div>
              <textarea
                className="doc-editor"
                value={job.letter}
                onChange={(event) => patch("letter", event.target.value)}
                placeholder="Lettre de motivation adaptée…"
              />
            </div>
          ) : null}

          {tab === "cv" ? (
            <div className="doc-pane">
              <div className="doc-pane__bar">
                <p>CV adapté — {job.company}</p>
                <button type="button" className="btn btn--solid btn--tiny" onClick={() => void copy("cv")}>
                  {copied === "cv" ? <IconCheck /> : <IconCopy />}
                  {copied === "cv" ? "Copié" : "Copier"}
                </button>
              </div>
              <textarea
                className="doc-editor"
                value={job.cv}
                onChange={(event) => patch("cv", event.target.value)}
                placeholder="CV adapté à cette maison…"
              />
            </div>
          ) : null}

          {tab === "notes" ? (
            <label className="field">
              <span>Notes personnelles</span>
              <textarea
                className="doc-editor doc-editor--notes"
                rows={12}
                value={job.notes}
                onChange={(event) => patch("notes", event.target.value)}
                placeholder="Relances, contacts, impressions…"
              />
            </label>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
