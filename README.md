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
- Login real con GitHub mediante Supabase Auth y onboarding Candidate `0/5`.
- Página compartible `/vouch/[token]` con el significado explícito del vouch.
- Dashboard de Candidate y Member, bandeja de solicitudes y alta de contributions.
- Zona administrativa separada para verificar miembros fundadores, desactivar/reactivar cuentas, crear y entregar badges y designar otros `SUPER_ADMIN` entre usuarios registrados.
- Server Actions validadas con Zod, autorización por rol y rate limiting básico.
- Schema Prisma PostgreSQL con constraints, índices y enums de dominio.
- Seed idempotente solo para la taxonomía de skills; nunca crea personas ficticias.
- `AttestationProvider` desacoplado, proveedor mock y boundary EVM.
- Analytics agnóstico de proveedor.
- 10 tests de las reglas críticas del grafo de confianza.

## Arquitectura

```text
app/                     App Router, páginas, Server Actions y API health
components/              Componentes compartidos de producto
lib/domain/              Reglas puras y testeables de membresía/reputación
lib/auth/                Sesión Supabase y autorización server-side
lib/supabase/            Cliente SSR de Supabase
lib/attestations/        Contrato, mock y scaffold EVM
prisma/schema.prisma     Modelo PostgreSQL de producción
prisma/seed.ts           Taxonomía inicial, sin perfiles demo
```

La app usa Server Components para lecturas públicas y Client Components solo donde hay interacción. Las mutaciones de producción entran por Server Actions tratadas como endpoints no confiables: autentican, autorizan, validan input y limitan frecuencia.

Las operaciones de superadmin se registran en `Activity`. La desactivación de una cuenta es reversible: bloquea el acceso y oculta al usuario de las vistas públicas sin destruir su historial de confianza o reputación. Incorporar un perfil manualmente usa `membershipSource = FOUNDING` y nunca fabrica vouches.

### Identidades y datos reales

No existe modo demo. Los perfiles se crean después de autenticar una cuenta de GitHub y toda la información persiste en PostgreSQL de Supabase. Si Supabase todavía no está configurado, las vistas públicas muestran estados vacíos y el login explica que falta configuración.

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

En Supabase Auth habilita GitHub y registra `http://localhost:3000/auth/callback` como redirect local.

## Variables de entorno

Consulta [`.env.example`](./.env.example). Las únicas obligatorias para persistencia real son:

- `DATABASE_URL`: conexión PostgreSQL de Supabase con TLS.
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública `anon` (nunca `service_role`).
- `SUPERADMIN_GITHUB_USERNAMES`: handles exactos de GitHub que reciben el bootstrap inicial. El username público de Chile DAO puede ser distinto.

GitHub se configura como proveedor dentro de Supabase Auth. Nunca se incluyen emails, razones privadas de vouch, teléfonos o mensajes personales en attestations.

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
2. Crea un proyecto Supabase y define las cuatro variables anteriores en Vercel.
3. Habilita GitHub en Supabase Auth y autoriza `https://chile-dao-orcin.vercel.app/auth/callback`.
4. Ejecuta `npx prisma migrate deploy && npm run db:seed` una sola vez contra la base inicial.
5. Despliega. `npm run build` genera Prisma Client y compila Next.js con Turbopack.

`vercel.json` ya declara el framework. El endpoint `/api/health` permite verificar el runtime.

## Capa onchain

La base de datos es la capa de producto; blockchain es la capa verificable. `AttestationProvider` expone membresía, contribution y verificación de organizaciones. El mock genera UIDs locales; `EvmAttestationProvider` es el punto de conexión para EAS o un contrato equivalente cuando existan RPC, schemas y signer.

Solo se deben publicar hashes y referencias mínimas: `chainId`, `txHash`, `attestationUid`, `schemaUid`, wallets y timestamps. Los datos personales permanecen offchain.
