import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import {
  IconDownload,
  IconPlus,
  IconSearch,
  IconUpload,
  LogoMark,
} from "./components/Icons";
import { JobModal } from "./components/JobModal";
import { KanbanBoard } from "./components/KanbanBoard";
import { APP_NAME, OWNER, STATUS_META, STATUS_LIST } from "./constants";
import { exportJobsFile, loadJobs, parseJobsJson, saveJobs } from "./storage";
import type { Job, JobFilters, Status } from "./types";
import { countByStatus, createEmptyJob, matchesFilters, uniqueContracts } from "./utils";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(() => loadJobs());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [minFit, setMinFit] = useState(0);
  const [editing, setEditing] = useState<Job | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filters: JobFilters = {
    query,
    status: statusFilter,
    contract: contractFilter,
    minFit,
  };

  const visible = useMemo(
    () => jobs.filter((job) => matchesFilters(job, filters)),
    [jobs, query, statusFilter, contractFilter, minFit],
  );

  const counts = useMemo(() => countByStatus(jobs), [jobs]);
  const contracts = useMemo(() => uniqueContracts(jobs), [jobs]);
  const filterActive = statusFilter !== "all" || contractFilter !== "all" || minFit > 0 || query.trim() !== "";

  const upsert = (job: Job) => {
    setJobs((prev) => {
      const exists = prev.some((item) => item.id === job.id);
      return exists ? prev.map((item) => (item.id === job.id ? job : item)) : [job, ...prev];
    });
    setEditing(null);
    setToast(isNew ? "Candidature ajoutée" : "Candidature enregistrée");
  };

  const remove = (job: Job) => {
    setJobs((prev) => prev.filter((item) => item.id !== job.id));
    setPendingDelete(null);
    setEditing(null);
    setToast("Candidature supprimée");
  };

  const moveStatus = (id: string, status: Status) => {
    setJobs((prev) => prev.map((job) => (job.id === id && job.status !== status ? { ...job, status } : job)));
  };

  const onImport = async (file: File) => {
    try {
      const text = await file.text();
      const imported = parseJobsJson(text);
      setJobs(imported);
      setToast(`Import réussi · ${imported.length} offre${imported.length > 1 ? "s" : ""}`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Fichier JSON invalide");
    }
  };

  return (
    <div className="app">
      <div className="bg" aria-hidden="true">
        <div className="bg__photo" />
        <div className="bg__dim" />
        <div className="bg__grain" />
      </div>

      <header className="topbar">
        <div className="brand">
          <LogoMark size={34} />
          <div>
            <p className="brand__name">{APP_NAME}</p>
            <p className="brand__owner">{OWNER}</p>
          </div>
        </div>
        <div className="topbar__actions">
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            <IconUpload /> Importer
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              exportJobsFile(jobs);
              setToast("Export JSON téléchargé");
            }}
          >
            <IconDownload /> Exporter
          </button>
          <button
            type="button"
            className="btn btn--solid"
            onClick={() => {
              setIsNew(true);
              setEditing(createEmptyJob());
            }}
          >
            <IconPlus /> Nouvelle
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onImport(file);
              event.target.value = "";
            }}
          />
        </div>
      </header>

      <main className="shell">
        <label className="search-pill">
          <IconSearch />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Rechercher parmi ${jobs.length} offre${jobs.length > 1 ? "s" : ""} — poste, entreprise, tag…`}
          />
        </label>

        <section className="overview" aria-label="Compteurs par statut">
          {STATUS_LIST.map((status) => (
            <button
              key={status}
              type="button"
              className={`stat ${statusFilter === status ? "is-active" : ""}`}
              onClick={() => setStatusFilter((prev) => (prev === status ? "all" : status))}
            >
              <span className="stat__count">{counts[status]}</span>
              <span className="stat__label">{STATUS_META[status].label}</span>
            </button>
          ))}
        </section>

        <section className="filters" aria-label="Filtres">
          <label className="filter">
            <span>Statut</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as Status | "all")}
            >
              <option value="all">Tous</option>
              {STATUS_LIST.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter">
            <span>Contrat</span>
            <select value={contractFilter} onChange={(event) => setContractFilter(event.target.value)}>
              <option value="all">Tous</option>
              {contracts.map((contract) => (
                <option key={contract} value={contract}>
                  {contract}
                </option>
              ))}
            </select>
          </label>
          <label className="filter filter--fit">
            <span>Score min. {minFit > 0 ? `${minFit}+` : "tous"}</span>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={minFit}
              onChange={(event) => setMinFit(Number(event.target.value))}
            />
          </label>
          {filterActive ? (
            <button
              type="button"
              className="btn btn--tiny"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setContractFilter("all");
                setMinFit(0);
              }}
            >
              Réinitialiser
            </button>
          ) : null}
          <p className="filters__count">
            {visible.length} résultat{visible.length > 1 ? "s" : ""}
          </p>
        </section>

        <KanbanBoard
          jobs={visible}
          onOpen={(job) => {
            setIsNew(false);
            setEditing(job);
          }}
          onDelete={setPendingDelete}
          onDropStatus={moveStatus}
        />
      </main>

      {editing ? (
        <JobModal
          job={editing}
          isNew={isNew}
          onClose={() => setEditing(null)}
          onSave={upsert}
          onDelete={isNew ? undefined : setPendingDelete}
        />
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Supprimer cette offre ?"
          message={`${pendingDelete.title} — ${pendingDelete.company}. Cette action est définitive.`}
          confirmLabel="Supprimer"
          danger
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => remove(pendingDelete)}
        />
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
