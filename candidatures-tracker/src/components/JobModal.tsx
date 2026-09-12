import { useEffect, useId, useState, type FormEvent } from "react";
import { STATUS_META, STATUS_LIST } from "../constants";
import type { Job } from "../types";
import { formatFit, parseTags } from "../utils";
import { IconClose } from "./Icons";

type JobModalProps = {
  job: Job;
  isNew: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  onDelete?: (job: Job) => void;
};

export function JobModal({ job, isNew, onClose, onSave, onDelete }: JobModalProps) {
  const formId = useId();
  const [draft, setDraft] = useState<Job>(job);
  const [tagText, setTagText] = useState(job.tags.join(", "));
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const setField = <K extends keyof Job>(key: K, value: Job[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.company.trim()) {
      setError("Le titre et l’entreprise sont requis.");
      return;
    }
    onSave({
      ...draft,
      title: draft.title.trim(),
      company: draft.company.trim(),
      tags: parseTags(tagText),
    });
  };

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__head">
          <div>
            <p className="eyebrow">{isNew ? "Nouvelle offre" : "Fiche candidature"}</p>
            <h2 id={`${formId}-title`}>{isNew ? "Ajouter une candidature" : draft.title}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
            <IconClose />
          </button>
        </header>

        <form className="form" onSubmit={submit}>
          <div className="form-grid">
            <label className="field span-2">
              <span>Intitulé</span>
              <input
                value={draft.title}
                onChange={(event) => setField("title", event.target.value)}
                placeholder="Hôte / Hôtesse d'accueil"
                autoFocus
              />
            </label>
            <label className="field">
              <span>Entreprise</span>
              <input
                value={draft.company}
                onChange={(event) => setField("company", event.target.value)}
                placeholder="Florence Doré"
              />
            </label>
            <label className="field">
              <span>Lieu</span>
              <input
                value={draft.location}
                onChange={(event) => setField("location", event.target.value)}
                placeholder="Paris 8e"
              />
            </label>
            <label className="field">
              <span>Contrat</span>
              <input
                value={draft.contract}
                onChange={(event) => setField("contract", event.target.value)}
                placeholder="CDI"
              />
            </label>
            <label className="field">
              <span>Salaire</span>
              <input
                value={draft.salary}
                onChange={(event) => setField("salary", event.target.value)}
                placeholder="2 200 EUR/mois"
              />
            </label>
            <label className="field span-2">
              <span>Lien de l’offre</span>
              <input
                value={draft.url}
                onChange={(event) => setField("url", event.target.value)}
                placeholder="https://"
              />
            </label>
            <label className="field">
              <span>Statut</span>
              <select
                value={draft.status}
                onChange={(event) => setField("status", event.target.value as Job["status"])}
              >
                {STATUS_LIST.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_META[status].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Score d’adéquation · {formatFit(draft.fit_score)}/10</span>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={draft.fit_score}
                onChange={(event) => setField("fit_score", Number(event.target.value))}
              />
            </label>
            <label className="field">
              <span>Date trouvée</span>
              <input
                type="date"
                value={draft.date_found}
                onChange={(event) => setField("date_found", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Date de candidature</span>
              <input
                type="date"
                value={draft.date_applied}
                onChange={(event) => setField("date_applied", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Prochaine relance</span>
              <input
                type="date"
                value={draft.next_followup}
                onChange={(event) => setField("next_followup", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Tags (séparés par une virgule)</span>
              <input
                value={tagText}
                onChange={(event) => setTagText(event.target.value)}
                placeholder="accueil, luxe, paris-8"
              />
            </label>
            <label className="field span-2">
              <span>Notes</span>
              <textarea
                rows={3}
                value={draft.notes}
                onChange={(event) => setField("notes", event.target.value)}
                placeholder="Points d’attention, contacts, relances…"
              />
            </label>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <footer className="modal__foot">
            {!isNew && onDelete ? (
              <button type="button" className="btn btn--danger" onClick={() => onDelete(draft)}>
                Supprimer
              </button>
            ) : (
              <span />
            )}
            <div className="modal__foot-right">
              <button type="button" className="btn" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn--solid">
                Enregistrer
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
