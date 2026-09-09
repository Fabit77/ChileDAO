import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const skills = ["Solidity", "Smart Contracts", "Rust", "Frontend", "Backend", "Full Stack", "DevRel", "Product", "UX/UI", "Design", "Community Building", "Marketing", "Growth", "Content", "Events", "Education", "Research", "Partnerships", "Governance", "Founder"];

async function main() {
  for (const name of skills) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.skill.upsert({ where: { slug }, update: { name }, create: { name, slug, category: "Web3" } });
  }
  console.log(`Taxonomía inicial creada: ${skills.length} skills. No se crearon personas demo.`);
}

main().finally(() => prisma.$disconnect());
