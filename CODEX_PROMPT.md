# Prompt maestro para Codex — Chile DAO

Construye un MVP funcional y desplegable de **Chile DAO**, una red de confianza y reputación para el ecosistema Web3 chileno.

## Visión del producto

Chile DAO NO es un LinkedIn cripto genérico ni un directorio abierto. El producto debe funcionar como un **grafo de confianza comunitaria**.

La idea central es:

> Para formar parte de Chile DAO, otros miembros tienen que reconocerte. Una vez dentro, tu trabajo construye tu reputación.

Hay dos capas que deben estar estrictamente separadas en datos, UI y lógica:

1. **Vouch de entrada / Community Trust**: un miembro confirma que conoce al candidato y que pertenece al ecosistema.
2. **Validación profesional / Reputation**: un miembro u organización valida una skill, trabajo o contribución concreta.

Nunca mezcles ambas señales.

---

## Stack recomendado

Usa una arquitectura moderna y simple de desplegar en Vercel:

- Next.js con App Router
- TypeScript
- Tailwind CSS
- shadcn/ui o componentes propios accesibles
- PostgreSQL
- Prisma ORM
- Auth.js / NextAuth o una solución equivalente para login
- Wallet connect opcional durante onboarding, obligatorio solo cuando sea necesario para acciones onchain
- viem/wagmi para interacción EVM
- Mantén la capa onchain desacoplada del core para poder cambiar de red posteriormente

Si el repo está vacío, inicializa todo desde cero.

No agregues complejidad innecesaria como microservicios.

---

# 1. SISTEMA DE MEMBRESÍA

## Estados

Implementa como mínimo:

- VISITOR
- CANDIDATE
- QUALIFIED
- MEMBER
- TRUSTED_MEMBER
- ADMIN

### VISITOR

Puede:
- Explorar perfiles públicos
- Explorar proyectos
- Explorar organizaciones
- Ver contribuciones públicas

No puede validar ni crear reputación.

### CANDIDATE

Una persona que creó cuenta y perfil básico.

Debe ver claramente su progreso:

`3 / 5 personas te han validado`

Puede:
- completar perfil
- conectar wallet
- solicitar vouches a miembros existentes
- compartir un link personal de invitación/validación

No puede:
- validar a otros candidatos
- validar skills
- aparecer como miembro verificado

### QUALIFIED

Estado intermedio cuando alcanzó 5 vouches válidos.

Puede pasar automáticamente a MEMBER si no hay ningún requisito pendiente. Si la implementación onchain requiere una wallet o una attestation final, usar QUALIFIED mientras eso se completa.

### MEMBER

Debe haber recibido al menos **5 vouches activos de 5 miembros distintos que ya eran miembros al momento de validar**.

Puede:
- validar nuevos candidatos
- registrar contribuciones
- validar contribuciones de otros
- dar endorsements profesionales con contexto
- recibir badges
- aparecer en el directorio de talento

### TRUSTED_MEMBER

Dejar arquitectura preparada, aunque el MVP puede calcularlo de manera simple o mantenerlo solo como rol administrativo.

### ADMIN

Necesario para bootstrap inicial, moderación y gestión de organizaciones verificadas.

---

# 2. LÓGICA DE VOUCHES

Esta es una de las partes más importantes del producto.

Un vouch significa exclusivamente:

> “Conozco a esta persona y confirmo que es una persona real vinculada al ecosistema Web3.”

No significa:
- recomiendo contratarla
- es experta
- confío profesionalmente en ella
- tiene una skill determinada

## Reglas

- Solo MEMBER, TRUSTED_MEMBER o ADMIN pueden emitir vouches.
- No se puede auto-validar.
- Una persona solo puede emitir un vouch activo por candidato.
- El candidato necesita 5 vouches de 5 personas diferentes.
- Un vouch debe registrar timestamp.
- Un vouch debe registrar quién lo emitió.
- Debe poder ser revocado.
- Si se revoca antes de que el candidato complete 5, el contador baja.
- Guarda qué rol tenía el validador al momento de emitir el vouch.
- Evita race conditions al alcanzar 5.
- El sistema debe ser idempotente.

Añade un campo opcional privado para que el validador indique cómo conoce a la persona:
- worked_together
- event
- community
- hackathon
- friend
- education
- other

No mostrar esta relación públicamente por defecto.

## Futuro

Diseña el modelo de datos para poder agregar después:
- límite de vouches por miembro
- trust score del validador
- penalización por comportamiento fraudulento
- diversidad de círculos de confianza

No hace falta implementar esas reglas avanzadas en el primer MVP.

---

# 3. PERFIL PÚBLICO

Cada miembro debe tener una URL pública amigable, por ejemplo:

`/members/fabio-buscio`

Mostrar:

- foto
- nombre
- username
- headline
- bio
- ubicación
- disponibilidad laboral
- links: GitHub, LinkedIn, X, web
- wallet pública opcional
- fecha de ingreso
- estado de miembro verificado
- cantidad de personas que validaron su entrada
- skills
- badges
- contribuciones
- organizaciones relacionadas

No mostrar información privada como email.

## Community verified

Mostrar visualmente:

`Verified by 7 community members`

Permitir abrir un modal o sección donde se vean quienes dieron vouch, solo si el usuario no ha marcado su vouch como privado. Diseña el modelo con una opción `isPublic` para ello.

---

# 4. SKILLS

Crear catálogo inicial como seed:

Development:
- Solidity
- Smart Contracts
- Rust
- Frontend
- Backend
- Full Stack
- DevRel

Product & Design:
- Product
- UX/UI
- Design

Community & Growth:
- Community Building
- Marketing
- Growth
- Social Media
- Content

Ecosystem:
- Events
- Education
- Research
- Partnerships
- Governance
- Founder

Permitir que admins agreguen más después.

Una persona puede declarar una skill, pero debe distinguirse entre:

- self declared
- community validated
- contribution backed

No presentes una skill declarada como si estuviera validada.

---

# 5. ENDORSEMENTS PROFESIONALES

Un endorsement profesional debe ser distinto a un vouch de membresía.

Idealmente debe incluir:

- memberId que recibe
- skillId
- validatorId
- contributionId opcional pero recomendado
- comentario corto opcional
- createdAt

UI ejemplo:

`Mauro validated Community Building based on Campus On Chain — University Tour 2026.`

Permitir solo un endorsement por validador/skill/contribución para evitar spam.

---

# 6. CONTRIBUTIONS / PROOF OF WORK

Esta debe ser una pieza central.

Cada miembro puede registrar contribuciones.

Campos:

- title
- description
- role
- startDate
- endDate opcional
- projectId opcional
- organizationId opcional
- status
- visibility

Evidencias:

- URL
- GitHub repo
- Luma
- X
- Instagram
- video
- deck
- website
- transaction hash
- other

Cada evidencia debe tener tipo, URL y metadata mínima.

Estados de una contribución:

- SELF_CLAIMED
- COMMUNITY_VERIFIED
- ORGANIZATION_VERIFIED
- ONCHAIN_VERIFIED
- DISPUTED

No dejes que un usuario marque manualmente una contribución como verificada.

Las verificaciones deben provenir de registros de validation.

---

# 7. VALIDACIÓN DE CONTRIBUTIONS

Un miembro puede solicitar validación de una contribución a otros miembros u organizaciones.

Flujo:

1. Usuario crea contribution.
2. Selecciona miembros u organización que puedan validarla.
3. El validador recibe una solicitud.
4. Puede:
   - verify
   - reject
   - request changes
5. Guardar respuesta y timestamp.

Una contribución puede mostrar:

`Verified by 3 members`

No uses una única verificación booleana; usa registros individuales.

---

# 8. ORGANIZACIONES

Crear entidad Organization.

Ejemplos seed opcionales:
- Campus On Chain
- ETH Chile
- Avalanche Chile / Team1 Latam
- Solana Chile

Campos:

- name
- slug
- logo
- description
- website
- type
- verificationStatus

Tipos:
- COMMUNITY
- DAO
- PROTOCOL
- STARTUP
- COMPANY
- UNIVERSITY
- NONPROFIT
- OTHER

Roles internos:
- OWNER
- ADMIN
- MEMBER
- VALIDATOR

Una organización verificada puede validar contribuciones realizadas para ella.

---

# 9. PROJECTS

Crear entidad Project.

Debe poder relacionar:
- organization
- contributors
- skills
- contributions

Página pública:

`/projects/[slug]`

Mostrar qué miembros participaron y qué contribuciones están verificadas.

---

# 10. BADGES

Separar badges de skills.

Badges son logros, no capacidades.

Seeds sugeridos:
- Founding Member
- 5 Verified Contributions
- 10 Verified Contributions
- Trusted Validator
- Hackathon Builder
- Web3 Educator
- Community Builder
- Speaker

Implementa sistema de badges con:
- id
- name
- description
- icon
- criteriaType
- criteria JSON
- isAutomatic

Para MVP, implementa al menos badges manuales por admin y deja preparada automatización futura.

---

# 11. REPUTATION

No construyas un único score global arbitrario en el MVP.

Mostrar reputación por señales observables:

- número de vouches de membresía
- número de contributions
- número de verified contributions
- número de organization verified contributions
- endorsements por skill
- badges

Puedes mostrar estadísticas por skill, por ejemplo:

`Community Building · 8 endorsements · 5 verified contributions`

No inventes una cifra 0-100 sin fundamento.

---

# 12. GRAPH / DISCOVERY

Crear una vista `/network` o `/members` que permita descubrir personas.

Filtros:
- skill
- organization
- availability
- verified contributions
- location

Cards deben mostrar información compacta de confianza:
- Member verified
- X verified contributions
- top skills
- availability

No es necesario implementar visualización gráfica compleja del grafo en v1.

---

# 13. OPEN TO WORK

En perfil permitir estados:

- NOT_LOOKING
- FREELANCE
- FULL_TIME
- PART_TIME
- ADVISORY
- BOUNTIES
- HACKATHONS
- SPEAKING

Permitir múltiples opciones salvo NOT_LOOKING.

Esto debe alimentar los filtros del directorio.

---

# 14. ONCHAIN

El producto debe estar preparado para registrar attestations onchain, pero NO pongas datos personales sensibles en blockchain.

Principio:

**La base de datos es la capa de producto; blockchain es la capa verificable de attestations importantes.**

Diseña una abstracción `AttestationProvider` con funciones como:

- attestMembership(...)
- attestContribution(...)
- attestOrganizationVerification(...)
- getAttestation(...)

Para el MVP puedes implementar un `MockAttestationProvider` que genere IDs locales y una implementación EVM preparada para activarse por variables de entorno.

Nunca bloquees el desarrollo completo por depender de un contrato aún inexistente.

Guardar como mínimo:
- chainId
- txHash opcional
- attestationUid
- schemaUid opcional
- issuedAt
- subject wallet
- attester wallet
- type

## Importante

No almacenar en blockchain:
- email
- nombre legal completo si no es necesario
- teléfono
- mensajes privados
- razones privadas de un vouch

---

# 15. AUTENTICACIÓN

Implementa un sistema práctico de auth.

Preferencia:
- login por GitHub o Google
- posibilidad de conectar wallet después

No obligues a usuarios nuevos a entender wallets antes de explorar el producto.

Para acciones onchain, solicitar wallet.

---

# 16. ONBOARDING

Flujo ideal:

1. Landing
2. Create profile
3. Completar información básica
4. Candidate dashboard
5. `0/5 community vouches`
6. Buscar o invitar miembros existentes
7. Compartir link personal
8. Recibir validaciones
9. Al alcanzar 5 -> MEMBER
10. Pantalla de celebración / Welcome to Chile DAO
11. Invitación a agregar primera contribution

Crear una buena experiencia visual de progreso.

---

# 17. VALIDATION REQUEST PAGE

Una URL compartible tipo:

`/vouch/[requestToken]`

Debe mostrar:

- foto y nombre del candidato
- bio resumida
- mutual connections si existen
- explicación clara de qué significa validar

Copy recomendado:

`¿Conoces a esta persona?`

`Al validar confirmas únicamente que conoces a esta persona y que reconoces su vínculo con el ecosistema Web3. Esto no es una recomendación profesional.`

Botones:
- Sí, la conozco
- No puedo validar

Solo permitir emitir vouch si el validador está logueado y es miembro elegible.

---

# 18. DASHBOARD DE MIEMBRO

Crear `/dashboard`.

Secciones:

- Overview
- Profile
- Contributions
- Skills
- Badges
- Requests
- My vouches
- Wallet / Onchain

Candidate verá primero el progreso 0/5.

Member verá:
- requests pendientes
- contributions que necesitan validación
- actividad reciente

---

# 19. HOME / LANDING

Mensaje principal:

**Chile DAO**

**La red de confianza del ecosistema Web3 chileno.**

Subtexto:

`Para formar parte, otros miembros tienen que reconocerte. Una vez dentro, tu trabajo construye tu reputación.`

CTA principal:
- Explorar comunidad

CTA secundario:
- Crear mi perfil

Secciones:

1. Hero
2. Cómo funciona
   - Crea tu perfil
   - Consigue 5 validaciones
   - Registra lo que construyes
   - Construye reputación
3. Miembros destacados
4. Contributions recientes
5. Organizaciones
6. CTA final

Evita estética cliché crypto con exceso de neón.

---

# 20. DISEÑO

Dirección visual:

- sobria
- moderna
- editorial + tech
- confianza antes que especulación
- fondos claros u oscuros muy limpios
- buena jerarquía tipográfica
- cards simples
- badges discretos
- visualizaciones de reputación legibles

Inspiración conceptual:
- GitHub
- Linear
- Farcaster profiles
- talent networks
- onchain explorers

No copies interfaces literalmente.

Crear sistema responsive excelente en mobile y desktop.

---

# 21. MODELO DE DATOS

Diseña Prisma schema completo con entidades como mínimo:

- User
- Profile
- Wallet
- MembershipVouch
- Skill
- UserSkill
- SkillEndorsement
- Contribution
- ContributionEvidence
- ContributionValidation
- Organization
- OrganizationMember
- Project
- ProjectMember
- Badge
- UserBadge
- ValidationRequest
- Attestation
- Activity

Usa enums donde corresponda.

Agrega índices y constraints importantes.

Especialmente:
- unique validator/candidate vouch
- no self vouch a nivel app
- slugs unique
- username unique

---

# 22. SEED

Crear seed que permita demostrar la plataforma inmediatamente.

Debe incluir al menos:
- 8 miembros demo
- 2 candidatos
- 4 organizaciones
- 6 proyectos
- 15 contributions
- skills
- badges
- validations

Uno de los candidatos debe tener 3/5 vouches y otro 5/5 para mostrar ambos estados.

Usa nombres ficticios o claramente demo si no existe autorización para usar personas reales.

---

# 23. ADMIN

Crear una zona `/admin` protegida.

MVP:
- ver candidatos
- ver miembros
- aprobar/verificar organizaciones
- crear skills
- crear badges
- revisar contributions disputadas
- bootstrap de miembros fundadores

---

# 24. BOOTSTRAP DEL GRAFO

Problema: si nadie es miembro, nadie puede validar a nadie.

Resolver con `founding members` creados mediante seed/admin.

Los founding members deben aparecer marcados como tales y no simular que consiguieron 5 vouches normales.

Usa:
- `membershipSource = FOUNDING | VOUCHED`

Esto evita falsificar historial.

---

# 25. SEGURIDAD Y ANTI-ABUSO

Implementa:
- autorización server-side
- rate limiting básico preparado
- validación con Zod
- CSRF según auth utilizada
- sanitización de inputs
- URLs externas seguras
- protección de endpoints admin
- logs de acciones sensibles

Nunca confíes únicamente en ocultar botones desde frontend.

---

# 26. PRIVACIDAD

Clasifica campos entre:
- public
- members-only
- private

Por defecto:
- email privado
- reason del vouch privado
- links profesionales públicos si el usuario los activa
- wallet pública opcional

---

# 27. TESTS

Crear tests para lógica crítica:

1. candidato con 4 vouches sigue siendo CANDIDATE
2. quinto vouch transforma correctamente el estado
3. mismo miembro no puede emitir dos vouches al mismo candidato
4. candidato no puede auto-validarse
5. candidato no puede validar a otros
6. member sí puede validar
7. revocar vouch antes del ingreso reduce contador
8. endorsement profesional no cuenta como vouch
9. vouch no crea endorsement profesional
10. contribución self claimed no aparece como verified

Prioriza tests de dominio por sobre tests visuales.

---

# 28. RUTAS MVP

Crear al menos:

- `/`
- `/members`
- `/members/[slug]`
- `/projects`
- `/projects/[slug]`
- `/organizations`
- `/organizations/[slug]`
- `/join`
- `/vouch/[token]`
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/contributions`
- `/dashboard/requests`
- `/admin`

---

# 29. API / SERVER ACTIONS

Crear acciones bien separadas para:

- requestVouch
- createVouch
- revokeVouch
- createContribution
- requestContributionValidation
- validateContribution
- createEndorsement
- connectWallet

Todas las acciones deben validar permisos server-side.

---

# 30. ANALYTICS / EVENTOS

Deja un wrapper de analytics y registra eventos:

- signup_started
- profile_created
- vouch_requested
- vouch_received
- membership_completed
- contribution_created
- contribution_verified
- endorsement_received

No acoples el producto a un proveedor específico.

---

# 31. README Y DX

Actualizar README con:

- qué es Chile DAO
- arquitectura
- setup local
- variables de entorno
- DB setup
- seed
- test
- deploy Vercel
- explicación del sistema de vouches
- explicación de la capa onchain

Crear `.env.example` sin secretos reales.

---

# 32. DEFINITION OF DONE

No consideres terminado el trabajo hasta que:

- `npm install` funciona
- `npm run build` funciona
- lint pasa
- tests críticos pasan
- existe seed
- landing funciona
- onboarding funciona
- candidate puede solicitar vouches
- member puede emitir vouch
- progreso 0/5 se actualiza
- candidato pasa a MEMBER al cumplir 5
- perfiles públicos funcionan
- contributions pueden crearse
- contributions pueden validarse
- endorsements están separados de los vouches
- dashboard funciona
- admin básico funciona
- app puede desplegarse en Vercel

---

# 33. ORDEN DE IMPLEMENTACIÓN

Trabaja en este orden:

### Phase 1 — Foundation
- Next.js
- design system
- database
- auth
- schema
- seed

### Phase 2 — Membership Trust Graph
- Candidate
- vouch requests
- vouches
- 5-vouch threshold
- member activation
- public member profiles

### Phase 3 — Proof of Work
- contributions
- evidence
- validations
- organizations
- projects

### Phase 4 — Reputation
- skills
- endorsements
- badges
- discovery filters

### Phase 5 — Onchain
- AttestationProvider abstraction
- wallet connection
- mock provider
- EVM provider scaffolding

### Phase 6 — Quality
- tests
- mobile
- accessibility
- admin
- README
- deploy

---

# 34. REGLA DE PRODUCTO MÁS IMPORTANTE

Antes de implementar cualquier funcionalidad pregúntate:

> ¿Esta acción demuestra identidad comunitaria, trabajo realizado o reputación profesional?

Nunca mezcles esas tres capas.

Chile DAO debe poder responder públicamente tres preguntas distintas:

1. **¿Quién te conoce?** → Membership Vouches
2. **¿Qué has hecho?** → Contributions / Proof of Work
3. **¿Quién puede dar fe de que lo haces bien?** → Professional Validations / Endorsements

Esa separación es el núcleo del producto.

---

## Instrucción de ejecución para Codex

No te limites a proponer arquitectura. **Implementa el producto en este repositorio.**

Inspecciona el estado actual, crea los archivos necesarios, instala/configura dependencias, ejecuta tests y build, corrige errores y deja el repositorio listo para Vercel.

Si una integración externa requiere credenciales que no están disponibles, crea una implementación local/mock limpia, documenta las variables necesarias en `.env.example` y continúa construyendo el resto del producto.
