import type { Metadata } from "next";
import { DemoLogin } from "./demo-login";
export const metadata: Metadata = { title: "Ingresar" };
export default function DemoAuthPage() { return <main className="login-page"><DemoLogin /></main>; }
