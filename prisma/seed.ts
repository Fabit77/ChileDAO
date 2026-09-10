import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const skills = ["Solidity", "Smart Contracts", "Rust", "Frontend", "Backend", "Full Stack", "DevRel", "Product", "UX/UI", "Design", "Community Building", "Marketing", "Growth", "Content", "Events", "Education", "Research", "Partnerships", "Governance", "Founder"];
const badges = [
  ["Founding Member", "Miembro incorporado durante el bootstrap inicial de Chile DAO.", "🌱"],
  ["5 Verified Contributions", "Cinco contributions verificadas por miembros u organizaciones.", "✅"],
  ["10 Verified Contributions", "Diez contributions verificadas por miembros u organizaciones.", "🏆"],
  ["Trusted Validator", "Reconocimiento por validar trabajo de forma responsable.", "🛡️"],
  ["Hackathon Builder", "Ha construido y presentado trabajo en hackathons.", "🛠️"],
  ["Web3 Educator", "Contribuye a la educación del ecosistema Web3.", "🎓"],
  ["Community Builder", "Construye y fortalece comunidades del ecosistema.", "🤝"],
  ["Speaker", "Ha compartido conocimiento como speaker.", "🎤"],
] as const;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  for (const name of skills) {
    const slug = slugify(name);
    await prisma.skill.upsert({ where: { slug }, update: { name }, create: { name, slug, category: "Web3" } });
  }
  for (const [name, description, icon] of badges) {
    const slug = slugify(name);
    await prisma.badge.upsert({
      where: { slug },
      update: { name, description, icon },
      create: { name, slug, description, icon, criteriaType: "MANUAL", criteria: {}, isAutomatic: false },
    });
  }
  console.log(`Taxonomía inicial creada: ${skills.length} skills y ${badges.length} badges. No se crearon personas demo.`);
}

main().finally(() => prisma.$disconnect());
