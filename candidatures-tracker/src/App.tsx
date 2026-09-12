import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { HubCard } from "./components/HubCard";
import {
  IconDownload,
  IconGrid,
  IconKanban,
  IconList,
  IconPlus,
  IconSearch,
  IconUpload,
  LogoMark,
} from "./components/Icons";
import { JobDrawer } from "./components/JobDrawer";
import { JobModal } from "./components/JobModal";
import { KanbanBoard } from "./components/KanbanBoard";
import { APP_NAME, OWNER, TAGLINE } from "./constants";
import { exportJobsFile, loadJobs, parseJobsJson, saveJobs } from "./storage";
import type { BlockedFilter, DrawerTab, Job, JobFilters, Status, ViewMode } from "./types";
import { createEmptyJob, matchesFilters, uniqueContracts } from "./utils";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(() => loadJobs());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [blockedFilter, setBlockedFilter] = useState<BlockedFilter>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<DrawerTab>("offre");
  const [creating, setCreating] = useState<Job | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
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
    minFit: 0,
    blocked: blockedFilter,
  };

  const visible = useMemo(
    () => jobs.filter((job) => matchesFilters(job, filters)),
    [jobs, query, statusFilter, contractFilter, blockedFilter],
  );

  const contracts = useMemo(() => uniqueContracts(jobs), [jobs]);
  const openJob = jobs.find((job) => job.id === openId) ?? null;
  const blockedCount = jobs.filter((job) => job.blocked).length;
  const activeCount = jobs.length - blockedCount;
  const avgFit = jobs.length
    ? Math.round((jobs.reduce((sum, job) => sum + job.fit_score, 0) / jobs.length) * 10) / 10
    : 0;

  const patchJob = (next: Job) => {
    setJobs((prev) => prev.map((job) => (job.id === next.id ? next : job)));
  };

  const remove = (job: Job) => {
    setJobs((prev) => prev.filter((item) => item.id !== job.id));
    setPendingDelete(null);
    if (openId === job.id) setOpenId(null);
    setToast("Offre retirée du hub");
  };

  const open = (job: Job, nextTab: DrawerTab = "offre") => {
    setOpenId(job.id);
    setTab(nextTab);
  };

  const onImport = async (file: File) => {
    try {
      const imported = parseJobsJson(await file.text());
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
        <div className="bg__glow" />
      </div>

      <header className="hero">
        <div className="brand brand--hero">
          <LogoMark size={44} />
          <div>
            <p className="brand__name">{APP_NAME}</p>
            <p className="brand__owner">{OWNER}</p>
          </div>
        </div>
        <p className="hero__tag">{TAGLINE}</p>

        <label className="search-pill search-pill--hero">
          <IconSearch />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une maison, un poste, une lettre…"
          />
        </label>

        <div className="hero__actions">
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
          <button type="button" className="btn btn--solid" onClick={() => setCreating(createEmptyJob())}>
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
        <section className="overview" aria-label="Vue d'ensemble">
          <button type="button" className="stat" onClick={() => setBlockedFilter("all")}>
            <span className="stat__count">{jobs.length}</span>
            <span className="stat__label">Offres</span>
          </button>
          <button
            type="button"
            className={`stat ${blockedFilter === "active" ? "is-active" : ""}`}
            onClick={() => setBlockedFilter((prev) => (prev === "active" ? "all" : "active"))}
          >
            <span className="stat__count">{activeCount}</span>
            <span className="stat__label">Actives</span>
          </button>
          <button
            type="button"
            className={`stat ${blockedFilter === "blocked" ? "is-active" : ""}`}
            onClick={() => setBlockedFilter((prev) => (prev === "blocked" ? "all" : "blocked"))}
          >
            <span className="stat__count">{blockedCount}</span>
            <span className="stat__label">Bloquées</span>
          </button>
          <div className="stat">
            <span className="stat__count">{avgFit}</span>
            <span className="stat__label">Fit moyen</span>
          </div>
        </section>

        <section className="toolbar">
          <div className="view-switch" role="tablist" aria-label="Vue">
            {(
              [
                ["grid", "Grille", IconGrid],
                ["list", "Liste", IconList],
                ["kanban", "Kanban", IconKanban],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                className={`view-switch__btn ${view === id ? "is-on" : ""}`}
                onClick={() => setView(id)}
              >
                <Icon /> {label}
              </button>
            ))}
          </div>

          <label className="filter">
            <span>Statut</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as Status | "all")}>
              <option value="all">Tous</option>
              <option value="à_traiter">À traiter</option>
              <option value="adapté">Adapté</option>
              <option value="candidaté">Candidaté</option>
              <option value="relancé">Relancé</option>
              <option value="entretien">Entretien</option>
              <option value="offre">Offre</option>
              <option value="refusé">Refusé</option>
              <option value="archivé">Archivé</option>
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
          <p className="filters__count">
            {visible.length} dossier{visible.length > 1 ? "s" : ""}
          </p>
        </section>

        {view === "kanban" ? (
          <KanbanBoard
            jobs={visible}
            onOpen={(job) => open(job)}
            onDelete={setPendingDelete}
            onDropStatus={(id, status) => {
              setJobs((prev) =>
                prev.map((job) => (job.id === id && job.status !== status ? { ...job, status } : job)),
              );
            }}
          />
        ) : (
          <section className={view === "list" ? "hub-list" : "hub-grid"}>
            {visible.map((job) => (
              <HubCard
                key={job.id}
                job={job}
                layout={view}
                active={openId === job.id}
                onOpen={open}
              />
            ))}
          </section>
        )}
      </main>

      {openJob ? (
        <JobDrawer
          job={openJob}
          tab={tab}
          onTab={setTab}
          onClose={() => setOpenId(null)}
          onChange={patchJob}
          onDelete={setPendingDelete}
          onCopied={setToast}
        />
      ) : null}

      {creating ? (
        <JobModal
          job={creating}
          isNew
          onClose={() => setCreating(null)}
          onSave={(job) => {
            setJobs((prev) => [job, ...prev]);
            setCreating(null);
            setOpenId(job.id);
            setTab("offre");
            setToast("Dossier ajouté");
          }}
        />
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Retirer cette offre ?"
          message={`${pendingDelete.title} — ${pendingDelete.company}.`}
          confirmLabel="Retirer"
          danger
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => remove(pendingDelete)}
        />
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
