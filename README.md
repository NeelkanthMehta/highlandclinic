# Highland Clinic 🏥

Highland Clinic is a modern healthcare web application built with Next.js 16, React 19, Prisma, and TypeScript. It features a complete patient-facing experience, doctor directory, department showcase, user authentication, and interactive appointment scheduling.

---

## 🌟 Key Features

- **Doctor Directory & Profiles**: Browse doctors by department, view credentials, ratings, and detailed profile pages.
- **Department Directory**: Explore specialized medical departments and services.
- **Appointment Scheduling Engine**: Real-time availability calculation, dynamic slot selection, and appointment confirmation.
- **Authentication & Authorization**: Secure password hashing (`bcryptjs`), JWT session management (`jose`), role-based access (`PATIENT`, `DOCTOR`, `ADMIN`), and HTTP-only cookies.
- **Responsive Healthcare UI**: Modern component design using Tailwind CSS v4, Lucide Icons, and atomic component architecture (`ui/`, `molecules/`, `organisms/`).
- **Comprehensive Test Suite**: 100+ unit, component, API, and page flow tests using Vitest and React Testing Library.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/) with `@prisma/adapter-neon`
- **Authentication**: JWT (`jose`) & `bcryptjs`
- **Testing**: [Vitest](https://vitest.dev/), React Testing Library, jsdom, V8 Coverage

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **Package Manager**: `npm` (or `pnpm` / `yarn` / `bun`)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/highlandclinic.git
cd highlandclinic
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example` if available):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/highlandclinic?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
```

### 3. Database Migration & Seeding

Generate the Prisma Client and run migrations and seed data:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 4. Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
highlandclinic/
├── app/                        # Next.js App Router (pages & API routes)
│   ├── api/                    # REST API endpoints (auth, appointments, doctors)
│   ├── book-appointment/       # Appointment booking page
│   ├── departments/            # Department listing & slug detail pages
│   ├── doctors/                # Doctor profile pages
│   ├── sign-in/ & sign-up/     # Auth pages
│   ├── layout.tsx              # Root application layout
│   └── page.tsx                # Homepage
├── components/                 # Atomic design components
│   ├── ui/                     # Basic UI primitives (card, carousel, inputs)
│   ├── molecules/              # Molecule components (cards, reviews)
│   └── organisms/              # Organism components (header, footer, banners)
├── lib/                        # Core utilities & business logic
│   ├── auth.ts                 # JWT session & password security utilities
│   ├── department-data.ts      # Department metadata & content
│   ├── prisma.ts               # Prisma database client singleton
│   ├── redirect.ts             # Safe URL redirect sanitizer
│   ├── slots.ts                # Appointment slot calculation engine
│   └── validation.ts           # Schema validation helpers
├── prisma/                     # Database schema, migrations, and seed scripts
│   ├── migrations/             # SQL migration files
│   ├── schema.prisma           # Database schema definition
│   └── seed.ts                 # Database seeding script
└── tests/                      # Vitest test suite
    ├── api/                    # API route tests
    ├── components/             # Component unit tests
    ├── pages/                  # Integration & page flow tests
    └── unit/                   # Business logic unit tests
```

---

## 🧪 Testing & Quality Assurance

Run the test suite:

```bash
# Run unit & integration tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate code coverage report
npm run test:coverage

# Perform TypeScript type checking
npm run typecheck
```

### Test Suite Architecture
- Unit and integration tests live in `tests/`.
- Mocks are configured for database models and Next.js navigation.
- Minimum coverage thresholds are enforced globally (80% lines, 75% branches) and elevated for security/auth modules (90% lines, 85% branches).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks |
| `npm test` | Runs the Vitest test suite |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run test:coverage` | Generates test coverage report |
| `npm run typecheck` | Runs TypeScript type checker without emitting files |

---

## 📄 License

This project is proprietary and confidential to Highland Clinic.
