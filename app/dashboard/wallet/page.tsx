import { KeyRound, ShieldAlert } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function WalletPage() {
  const user = await requireUser();
  const wallets = await db.wallet.findMany({ where: { userId: user.id }, orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] });
  return <DashboardShell active="Wallet / Onchain" user={user}><div className="dashboard-head"><div><span className="eyebrow">Identidad onchain</span><h1>Wallet</h1><p>Las attestations importantes podrán vincularse a una wallet verificada.</p></div></div><div className="wallet-panel"><KeyRound size={28} /><h2>{wallets.length ? "Wallets registradas" : "Aún no hay una wallet conectada"}</h2>{wallets.map((wallet) => <p key={wallet.id}><code>{wallet.address}</code> · {wallet.verifiedAt ? "Verificada" : "Pendiente de firma"}</p>)}<div className="info-inline"><ShieldAlert size={15} /> La conexión se habilitará cuando incluya firma criptográfica. Chile DAO no marcará una dirección como verificada solo por escribirla.</div></div></DashboardShell>;
}
