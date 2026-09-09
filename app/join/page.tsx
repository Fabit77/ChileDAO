import type { Metadata } from "next";
import { JoinFlow } from "./join-flow";
export const metadata: Metadata = { title: "Crear perfil" };
export default function JoinPage() { return <main className="join-page"><JoinFlow /></main>; }
