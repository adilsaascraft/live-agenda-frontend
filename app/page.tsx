import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AgendaPage } from "@/features/agenda/components/AgendaPage";

export const metadata: Metadata = {
  title: "Agenda | AROICON 2026",
  description:
    "Session-wise agenda, speakers and personal schedule for AROICON 2026 at the Hyderabad International Convention Centre (HICC).",
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <AgendaPage />
      </main>

      <Footer />
    </div>
  );
}