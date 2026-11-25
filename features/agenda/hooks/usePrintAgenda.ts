"use client";

import { useCallback } from "react";

import { AGENDA_EVENT } from "../utils/agenda-event";

/**
 * Opens the browser print dialog (which also offers "Save as PDF").
 * The printable layout is rendered by <PrintableAgenda />, and print CSS hides
 * everything else on the page. The document title becomes the suggested PDF
 * file name and is restored afterwards.
 */
export function usePrintAgenda(): () => void {
  return useCallback(() => {
    const previousTitle = document.title;
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };

    document.title = `${AGENDA_EVENT.name} – My Agenda`;
    window.addEventListener("afterprint", restore);
    window.print();
  }, []);
}
