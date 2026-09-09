# Chile DAO

**La red de confianza y reputación del ecosistema Web3 chileno.**

Chile DAO es un directorio confiable de talento basado en relaciones reales, trabajo demostrado y validaciones con contexto. El MVP implementa una experiencia completa y responsive con perfiles, onboarding de candidatos, vouches de membresía, contributions, proyectos, organizaciones, endorsements, dashboard y administración.

## Regla de producto

Las señales viven en modelos, flujos y componentes distintos:

| Pregunta | Señal | Qué significa |
| --- | --- | --- |
| ¿Quién te conoce? | `MembershipVouch` | Identidad comunitaria y vínculo con el ecosistema. |
| ¿Qué has hecho? | `Contribution` + evidencia | Proof of work registrado por su autor. |
| ¿Quién puede dar fe de tu trabajo? | `ContributionValidation` + `SkillEndorsement` | Validación profesional contextual. |

Un vouch nunca crea un endorsement. Un endorsement nunca aumenta el progreso de membresía. Una contribution comienza siempre como `SELF_CLAIMED` y solo cambia de estado por registros de validación.

## Lo implementado

- Landing editorial, accesible y responsive.
- Directorio filtrable de talento en `/members`.
- Perfiles públicos con vouches, contributions, skills, endorsements y badges como señales observables.
- Catálogo de proyectos y organizaciones con páginas públicas.
- Onboarding en tres pasos y experiencia Candidate `0/5`.
- Página compartible `/vouch/[token]` con el significado explícito del vouch.
- Dashboard de Candidate y Member, bandeja de solicitudes y alta de contributions.
- Zona administrativa para candidatos, organizaciones y disputas.
- Server Actions validadas con Zod, autorización por rol y rate limiting básico.
- Schema Prisma PostgreSQL con constraints, índices y enums de dominio.
- Seed idempotente: 8 miembros, 2 candidatos, 4 organizaciones, 6 proyectos, 15 contributions, skills, badges, vouches y validations.
- `AttestationProvider` desacoplado, proveedor mock y boundary EVM.
- Analytics agnóstico de proveedor.
- 10 tests de las reglas críticas del grafo de confianza.

## Arquitectura

```text
app/                     App Router, páginas, Server Actions y API health
components/              Componentes compartidos de producto
lib/domain/              Reglas puras y testeables de membresía/reputación
lib/auth/                Boundary de sesión y autorización server-side
lib/attestations/        Contrato, mock y scaffold EVM
lib/demo-data.ts         Dataset navegable sin credenciales
prisma/schema.prisma     Modelo PostgreSQL de producción
prisma/seed.ts           Seed idempotente
```

La app usa Server Components para lecturas públicas y Client Components solo donde hay interacción. Las mutaciones de producción entran por Server Actions tratadas como endpoints no confiables: autentican, autorizan, validan input y limitan frecuencia.

### Modo demo y producción

`DEMO_MODE=true` permite recorrer el producto inmediatamente sin GitHub, Google, wallet ni base de datos. Los formularios interactivos de la demo persisten temporalmente en el navegador. El schema y las acciones server-side son el boundary de producción: al configurar PostgreSQL y OAuth, el repositorio Prisma sustituye los fixtures sin cambiar la UI ni las reglas de dominio.

No uses `DEMO_MODE=true` para un despliegue público con datos reales.

## Setup local

Requisitos: Node.js 20.9 o superior y PostgreSQL 15 o superior.

```bash
npm install
cp .env.example .env.local
npm run db:generate
npx prisma db push
npm run db:seed
npm run dev
```

Abre `http://localhost:3000`. Si todavía no tienes PostgreSQL, deja `DEMO_MODE=true`, omite `db push`/`db:seed` y navega el MVP con los datos incluidos.

## Variables de entorno

Consulta [`.env.example`](./.env.example). Las únicas obligatorias para persistencia real son:

- `DATABASE_URL`: conexión PostgreSQL con TLS.
- `AUTH_SECRET`: secreto largo para el proveedor de sesión.
- `DEMO_MODE=false`: desactiva el fallback demo.

GitHub/Google OAuth y EVM son adapters opcionales. Nunca se incluyen emails, razones privadas de vouch, teléfonos o mensajes personales en attestations.

## Calidad

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Los tests cubren el umbral 5/5, duplicados, auto-vouch, elegibilidad del validador, revocación y la separación estricta entre membership, proof of work y reputación profesional.

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Conecta una base PostgreSQL y define `DATABASE_URL`.
3. Configura `AUTH_SECRET`, OAuth y `DEMO_MODE=false`.
4. Ejecuta `npx prisma db push && npm run db:seed` una sola vez contra la base inicial.
5. Despliega. `npm run build` genera Prisma Client y compila Next.js con Turbopack.

`vercel.json` ya declara el framework. El endpoint `/api/health` permite verificar el runtime.

## Capa onchain

La base de datos es la capa de producto; blockchain es la capa verificable. `AttestationProvider` expone membresía, contribution y verificación de organizaciones. El mock genera UIDs locales; `EvmAttestationProvider` es el punto de conexión para EAS o un contrato equivalente cuando existan RPC, schemas y signer.

Solo se deben publicar hashes y referencias mínimas: `chainId`, `txHash`, `attestationUid`, `schemaUid`, wallets y timestamps. Los datos personales permanecen offchain.
