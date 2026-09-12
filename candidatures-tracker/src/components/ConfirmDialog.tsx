import { useEffect } from "react";
import { IconClose } from "./Icons";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="overlay" onClick={onCancel} role="presentation">
      <div
        className="modal modal--narrow"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__head">
          <h2 id="confirm-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Fermer">
            <IconClose />
          </button>
        </header>
        <p className="confirm-copy">{message}</p>
        <footer className="modal__foot">
          <span />
          <div className="modal__foot-right">
            <button type="button" className="btn" onClick={onCancel}>
              Annuler
            </button>
            <button
              type="button"
              className={danger ? "btn btn--danger" : "btn btn--solid"}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
