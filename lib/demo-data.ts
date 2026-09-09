import type { Contribution, Member, Organization, Project } from "./types";

export const members: Member[] = [
  {
    id: "m1", slug: "isidora-rojas", name: "Isidora Rojas", username: "isirojas", initials: "IR",
    headline: "Smart contract engineer · Public goods builder",
    bio: "Construyo infraestructura abierta para comunidades latinoamericanas. Me interesan la identidad verificable, los bienes públicos y la seguridad de contratos.",
    location: "Santiago, Chile", role: "ADMIN", membershipSource: "FOUNDING",
    availability: ["ADVISORY", "HACKATHONS"], vouchCount: 8, verifiedContributions: 6, contributions: 8,
    skills: [{ name: "Solidity", level: "Con evidencia", endorsements: 9 }, { name: "Smart Contracts", level: "Con evidencia", endorsements: 7 }, { name: "Governance", level: "Validada", endorsements: 4 }],
    badges: ["Founding Member", "Trusted Validator"], organizations: ["ETH Chile"], joined: "Abril 2025",
    links: { github: "https://github.com", x: "https://x.com", website: "https://ethereum.org" },
  },
  {
    id: "m2", slug: "tomas-alarcon", name: "Tomás Alarcón", username: "tomasbuilds", initials: "TA",
    headline: "Product designer for onchain products", bio: "Diseño experiencias simples para productos complejos. Trabajo entre research, sistemas de diseño y estrategia de producto.",
    location: "Valparaíso, Chile", role: "MEMBER", membershipSource: "VOUCHED", availability: ["FREELANCE", "PART_TIME"], vouchCount: 7, verifiedContributions: 4, contributions: 5,
    skills: [{ name: "UX/UI", level: "Con evidencia", endorsements: 8 }, { name: "Product", level: "Validada", endorsements: 6 }, { name: "Design", level: "Con evidencia", endorsements: 5 }],
    badges: ["5 Verified Contributions"], organizations: ["Campus On Chain"], joined: "Agosto 2025", links: { linkedin: "https://linkedin.com", website: "https://www.figma.com" },
  },
  {
    id: "m3", slug: "camila-soto", name: "Camila Soto", username: "camiweb3", initials: "CS",
    headline: "Community lead · Web3 education", bio: "Creo programas educativos y comunidades donde más personas pueden aprender, construir y encontrar oportunidades en Web3.",
    location: "Concepción, Chile", role: "TRUSTED_MEMBER", membershipSource: "FOUNDING", availability: ["SPEAKING", "ADVISORY"], vouchCount: 12, verifiedContributions: 9, contributions: 11,
    skills: [{ name: "Community Building", level: "Con evidencia", endorsements: 12 }, { name: "Education", level: "Con evidencia", endorsements: 10 }, { name: "Events", level: "Validada", endorsements: 7 }],
    badges: ["Founding Member", "Web3 Educator", "Community Builder"], organizations: ["Campus On Chain"], joined: "Abril 2025", links: { x: "https://x.com", linkedin: "https://linkedin.com" },
  },
  {
    id: "m4", slug: "benjamin-lee", name: "Benjamín Lee", username: "benjaleedev", initials: "BL",
    headline: "Full-stack engineer · Account abstraction", bio: "Ingeniero de producto enfocado en hacer que las aplicaciones onchain se sientan tan claras como cualquier producto web moderno.",
    location: "Santiago, Chile", role: "MEMBER", membershipSource: "VOUCHED", availability: ["FULL_TIME", "BOUNTIES"], vouchCount: 6, verifiedContributions: 5, contributions: 7,
    skills: [{ name: "Full Stack", level: "Con evidencia", endorsements: 7 }, { name: "Frontend", level: "Con evidencia", endorsements: 6 }, { name: "Backend", level: "Validada", endorsements: 3 }],
    badges: ["Hackathon Builder"], organizations: ["Avalanche Chile"], joined: "Septiembre 2025", links: { github: "https://github.com", website: "https://vercel.com" },
  },
  {
    id: "m5", slug: "antonia-perez", name: "Antonia Pérez", username: "antopz", initials: "AP",
    headline: "Ecosystem partnerships & growth", bio: "Conecto protocolos, comunidades y talento para crear colaboraciones sostenibles en Latinoamérica.",
    location: "Santiago, Chile", role: "MEMBER", membershipSource: "FOUNDING", availability: ["ADVISORY", "SPEAKING"], vouchCount: 9, verifiedContributions: 5, contributions: 6,
    skills: [{ name: "Partnerships", level: "Con evidencia", endorsements: 9 }, { name: "Growth", level: "Validada", endorsements: 5 }, { name: "Marketing", level: "Validada", endorsements: 4 }],
    badges: ["Founding Member", "Speaker"], organizations: ["Solana Chile"], joined: "Abril 2025", links: { linkedin: "https://linkedin.com", x: "https://x.com" },
  },
  {
    id: "m6", slug: "vicente-fuentes", name: "Vicente Fuentes", username: "vfuentes", initials: "VF",
    headline: "Rust engineer · Protocol research", bio: "Investigo sistemas distribuidos y construyo software en Rust para protocolos abiertos.",
    location: "Puerto Varas, Chile", role: "MEMBER", membershipSource: "VOUCHED", availability: ["FREELANCE", "HACKATHONS"], vouchCount: 5, verifiedContributions: 3, contributions: 5,
    skills: [{ name: "Rust", level: "Con evidencia", endorsements: 6 }, { name: "Research", level: "Validada", endorsements: 4 }, { name: "Backend", level: "Con evidencia", endorsements: 3 }],
    badges: ["Hackathon Builder"], organizations: ["Solana Chile"], joined: "Noviembre 2025", links: { github: "https://github.com" },
  },
  {
    id: "m7", slug: "florencia-vidal", name: "Florencia Vidal", username: "flovidal", initials: "FV",
    headline: "Governance researcher · DAO operator", bio: "Diseño procesos de gobernanza que ayudan a comunidades distribuidas a tomar mejores decisiones.",
    location: "Viña del Mar, Chile", role: "MEMBER", membershipSource: "VOUCHED", availability: ["PART_TIME", "ADVISORY"], vouchCount: 6, verifiedContributions: 4, contributions: 6,
    skills: [{ name: "Governance", level: "Con evidencia", endorsements: 8 }, { name: "Research", level: "Con evidencia", endorsements: 5 }, { name: "Community Building", level: "Validada", endorsements: 3 }],
    badges: ["Trusted Validator"], organizations: ["ETH Chile"], joined: "Enero 2026", links: { website: "https://ethereum.org", x: "https://x.com" },
  },
  {
    id: "m8", slug: "nicolas-mella", name: "Nicolás Mella", username: "nicomella", initials: "NM",
    headline: "Founder · Developer relations", bio: "Ayudo a builders a pasar de una idea a un producto y a protocolos a trabajar mejor con sus comunidades técnicas.",
    location: "Santiago, Chile", role: "MEMBER", membershipSource: "FOUNDING", availability: ["ADVISORY", "BOUNTIES"], vouchCount: 10, verifiedContributions: 7, contributions: 9,
    skills: [{ name: "DevRel", level: "Con evidencia", endorsements: 11 }, { name: "Founder", level: "Validada", endorsements: 7 }, { name: "Content", level: "Con evidencia", endorsements: 6 }],
    badges: ["Founding Member", "Community Builder"], organizations: ["Avalanche Chile"], joined: "Abril 2025", links: { github: "https://github.com", linkedin: "https://linkedin.com" },
  },
];

export const candidates: Member[] = [
  { id: "c1", slug: "martina-saez", name: "Martina Sáez", username: "martinasaez", initials: "MS", headline: "Frontend developer explorando Web3", bio: "Construyo interfaces accesibles y estoy colaborando en mi primer proyecto onchain.", location: "Santiago, Chile", role: "CANDIDATE", membershipSource: "VOUCHED", availability: ["FULL_TIME"], vouchCount: 3, verifiedContributions: 0, contributions: 0, skills: [{ name: "Frontend", level: "Declarada", endorsements: 0 }], badges: [], organizations: [], joined: "Candidata", links: { github: "https://github.com" } },
  { id: "c2", slug: "diego-munoz", name: "Diego Muñoz", username: "dmunoz", initials: "DM", headline: "Community organizer · Valdivia", bio: "Organizo encuentros para conectar estudiantes y builders del sur de Chile.", location: "Valdivia, Chile", role: "QUALIFIED", membershipSource: "VOUCHED", availability: ["EVENTS"], vouchCount: 5, verifiedContributions: 1, contributions: 1, skills: [{ name: "Events", level: "Declarada", endorsements: 0 }], badges: [], organizations: [], joined: "Calificado", links: { x: "https://x.com" } },
];

export const organizations: Organization[] = [
  { id: "o1", slug: "campus-on-chain", name: "Campus On Chain", initials: "CO", type: "Educación", description: "Programas y experiencias para que estudiantes latinoamericanos construyan su primer proyecto onchain.", website: "https://ethereum.org", verified: true, members: 18, projects: 3 },
  { id: "o2", slug: "eth-chile", name: "ETH Chile", initials: "ΞC", type: "Comunidad", description: "Comunidad abierta que conecta builders, investigadores y organizaciones del ecosistema Ethereum en Chile.", website: "https://ethereum.org", verified: true, members: 42, projects: 5 },
  { id: "o3", slug: "avalanche-chile", name: "Avalanche Chile", initials: "AV", type: "Protocolo", description: "Comunidad local de builders y equipos que desarrollan sobre Avalanche y sus L1 soberanas.", website: "https://avax.network", verified: true, members: 24, projects: 4 },
  { id: "o4", slug: "solana-chile", name: "Solana Chile", initials: "SO", type: "Comunidad", description: "Builders, founders y creadores impulsando el ecosistema Solana desde Chile.", website: "https://solana.com", verified: true, members: 31, projects: 6 },
];

export const projects: Project[] = [
  { id: "p1", slug: "university-tour-2026", name: "University Tour 2026", description: "Gira educativa por seis universidades chilenas con talleres prácticos para crear productos onchain.", organization: "Campus On Chain", organizationSlug: "campus-on-chain", skills: ["Education", "Events", "Community Building"], contributors: ["Camila Soto", "Tomás Alarcón"], verifiedContributions: 5, website: "https://ethereum.org" },
  { id: "p2", slug: "dao-transparency-kit", name: "DAO Transparency Kit", description: "Herramientas abiertas para publicar decisiones, tesorería y contribuciones de comunidades digitales.", organization: "ETH Chile", organizationSlug: "eth-chile", skills: ["Governance", "Full Stack", "Research"], contributors: ["Florencia Vidal", "Isidora Rojas"], verifiedContributions: 4, website: "https://github.com" },
  { id: "p3", slug: "latam-wallet-lab", name: "Latam Wallet Lab", description: "Prototipos de onboarding y account abstraction pensados para nuevos usuarios latinoamericanos.", organization: "Avalanche Chile", organizationSlug: "avalanche-chile", skills: ["Smart Contracts", "UX/UI", "Frontend"], contributors: ["Benjamín Lee", "Tomás Alarcón"], verifiedContributions: 3, website: "https://github.com" },
  { id: "p4", slug: "sur-builders", name: "Sur Builders", description: "Encuentros técnicos y mentorías para desarrolladores Web3 fuera de Santiago.", organization: "Solana Chile", organizationSlug: "solana-chile", skills: ["Rust", "Events", "Education"], contributors: ["Vicente Fuentes", "Antonia Pérez"], verifiedContributions: 4, website: "https://solana.com" },
  { id: "p5", slug: "public-goods-map", name: "Public Goods Map", description: "Directorio abierto de proyectos y financiamiento de bienes públicos en Chile.", organization: "ETH Chile", organizationSlug: "eth-chile", skills: ["Research", "Backend", "Governance"], contributors: ["Isidora Rojas", "Florencia Vidal"], verifiedContributions: 2, website: "https://github.com" },
  { id: "p6", slug: "founder-office-hours", name: "Founder Office Hours", description: "Sesiones abiertas de producto, fundraising y go-to-market para founders Web3 tempranos.", organization: "Avalanche Chile", organizationSlug: "avalanche-chile", skills: ["Founder", "Product", "Growth"], contributors: ["Nicolás Mella", "Antonia Pérez"], verifiedContributions: 3, website: "https://avax.network" },
];

const contributionSeeds = [
  ["Smart contract audit toolkit", "Diseñó reglas y pruebas automatizadas para detectar permisos inseguros.", "Protocol engineer", "Isidora Rojas", "isidora-rojas", "DAO Transparency Kit", "dao-transparency-kit", "ETH Chile", "ONCHAIN_VERIFIED", 4, "GitHub"],
  ["Research sprint y mapa de decisiones", "Documentó patrones de gobernanza y facilitó entrevistas con ocho DAOs.", "Lead researcher", "Florencia Vidal", "florencia-vidal", "DAO Transparency Kit", "dao-transparency-kit", "ETH Chile", "ORGANIZATION_VERIFIED", 3, "Deck"],
  ["Sistema de diseño para onboarding", "Creó el flujo y los componentes accesibles del laboratorio de wallets.", "Product designer", "Tomás Alarcón", "tomas-alarcon", "Latam Wallet Lab", "latam-wallet-lab", "Avalanche Chile", "ORGANIZATION_VERIFIED", 3, "Website"],
  ["Passkey wallet prototype", "Implementó onboarding sin seed phrase con recuperación progresiva.", "Full-stack engineer", "Benjamín Lee", "benjamin-lee", "Latam Wallet Lab", "latam-wallet-lab", "Avalanche Chile", "COMMUNITY_VERIFIED", 2, "GitHub"],
  ["Curriculum Solidity desde cero", "Diseñó cuatro módulos prácticos y ejercicios para estudiantes.", "Curriculum lead", "Camila Soto", "camila-soto", "University Tour 2026", "university-tour-2026", "Campus On Chain", "ORGANIZATION_VERIFIED", 5, "Deck"],
  ["Talleres regionales de Rust", "Facilitó tres talleres técnicos para 74 asistentes del sur.", "Technical mentor", "Vicente Fuentes", "vicente-fuentes", "Sur Builders", "sur-builders", "Solana Chile", "ORGANIZATION_VERIFIED", 4, "Luma"],
  ["Playbook de alianzas universitarias", "Creó un proceso reusable para activar universidades y comunidades locales.", "Partnerships lead", "Antonia Pérez", "antonia-perez", "University Tour 2026", "university-tour-2026", "Campus On Chain", "COMMUNITY_VERIFIED", 3, "URL"],
  ["Developer onboarding handbook", "Escribió una guía práctica para contribuir a repositorios Web3 abiertos.", "DevRel lead", "Nicolás Mella", "nicolas-mella", "Public Goods Map", "public-goods-map", "ETH Chile", "COMMUNITY_VERIFIED", 3, "GitHub"],
  ["Indexador de fondos públicos", "Construyó el pipeline de datos y la API de consultas del mapa.", "Backend engineer", "Isidora Rojas", "isidora-rojas", "Public Goods Map", "public-goods-map", "ETH Chile", "COMMUNITY_VERIFIED", 2, "GitHub"],
  ["Kit de facilitación para DAOs", "Publicó plantillas para propuestas, retrospectivas y resolución de conflictos.", "Governance designer", "Florencia Vidal", "florencia-vidal", "DAO Transparency Kit", "dao-transparency-kit", "ETH Chile", "COMMUNITY_VERIFIED", 2, "Deck"],
  ["Landing y registro University Tour", "Implementó una experiencia responsive para inscripciones y agenda.", "Frontend engineer", "Benjamín Lee", "benjamin-lee", "University Tour 2026", "university-tour-2026", "Campus On Chain", "SELF_CLAIMED", 0, "Website"],
  ["Mentorías de prototipado", "Acompañó a 12 equipos desde research hasta un prototipo testeable.", "Product mentor", "Tomás Alarcón", "tomas-alarcon", "Founder Office Hours", "founder-office-hours", "Avalanche Chile", "COMMUNITY_VERIFIED", 2, "Video"],
  ["Founder interview series", "Produjo seis entrevistas abiertas sobre aprendizajes construyendo desde Chile.", "Host & producer", "Nicolás Mella", "nicolas-mella", "Founder Office Hours", "founder-office-hours", "Avalanche Chile", "ORGANIZATION_VERIFIED", 3, "Video"],
  ["Estrategia de crecimiento regional", "Diseñó alianzas y un modelo de embajadores para cuatro ciudades.", "Growth strategist", "Antonia Pérez", "antonia-perez", "Sur Builders", "sur-builders", "Solana Chile", "COMMUNITY_VERIFIED", 2, "Deck"],
  ["Benchmark de programas educativos", "Analizó 22 programas y publicó recomendaciones para medir resultados.", "Researcher", "Camila Soto", "camila-soto", "University Tour 2026", "university-tour-2026", "Campus On Chain", "SELF_CLAIMED", 0, "URL"],
] as const;

export const contributions: Contribution[] = contributionSeeds.map((item, index) => ({
  id: `contribution-${index + 1}`, title: item[0], description: item[1], role: item[2], author: item[3], authorSlug: item[4], project: item[5], projectSlug: item[6], organization: item[7], status: item[8], validators: item[9], evidenceType: item[10], evidenceUrl: "https://github.com", date: `${index % 2 ? "Ago" : "Sep"} 2026`,
}));

export const skills = ["Solidity", "Smart Contracts", "Rust", "Frontend", "Backend", "Full Stack", "DevRel", "Product", "UX/UI", "Design", "Community Building", "Marketing", "Growth", "Social Media", "Content", "Events", "Education", "Research", "Partnerships", "Governance", "Founder"];

export function getMember(slug: string) { return members.find((member) => member.slug === slug); }
export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }
export function getOrganization(slug: string) { return organizations.find((organization) => organization.slug === slug); }
