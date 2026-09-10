import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { updateDeclaredSkills } from "./actions";

export default async function SkillsPage() {
  const user = await requireUser();
  const [skills, current] = await Promise.all([db.skill.findMany({ orderBy: { name: "asc" } }), db.userSkill.findMany({ where: { userId: user.id }, select: { skillId: true, evidenceLevel: true } })]);
  const selected = new Set(current.map((item) => item.skillId));
  const evidenceBySkill = new Map(current.map((item) => [item.skillId, item.evidenceLevel]));
  return <DashboardShell active="Skills" user={user}><form action={updateDeclaredSkills}><div className="dashboard-head"><div><span className="eyebrow">Reputación profesional</span><h1>Mis skills</h1><p>Declara lo que sabes hacer. Una skill declarada no aparece como validada.</p></div><button className="button button-primary" type="submit">Guardar skills</button></div><div className="skill-picker">{skills.map((skill) => { const evidence = evidenceBySkill.get(skill.id); return <label key={skill.id}><input type="checkbox" name="skillId" value={skill.id} defaultChecked={selected.has(skill.id)} /><span><b>{skill.name}</b><small>{evidence === "CONTRIBUTION_BACKED" ? "Con evidencia" : evidence === "COMMUNITY_VALIDATED" ? "Validada por la comunidad" : "Declaración propia"}</small></span></label>; })}</div></form></DashboardShell>;
}
