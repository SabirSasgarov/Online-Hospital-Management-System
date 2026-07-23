# CareFlow — Online Hospital Management System

CareFlow is a full-stack hospital management platform: an ASP.NET Core Web API backend built with
clean architecture and CQRS, paired with a React/TypeScript frontend. It covers the full patient
care loop — appointments, visits, prescriptions, lab results, discharge summaries, messaging — plus
role-based dashboards for admins, doctors, nurses, and patients, and a public marketing site with
an admin-managed content system.

This repo contains the backend (`HospitalManagementSystem/`). The frontend lives alongside it in
`OHM.Frontend/`.

## Contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration & secrets](#configuration--secrets)
- [Database migrations](#database-migrations)
- [Seeded accounts](#seeded-accounts)
- [API documentation](#api-documentation)

## Architecture

The backend follows Clean Architecture with a CQRS flow through MediatR:

```
HMS.Domain          Entities, enums, permission constants — no dependencies on anything else.
HMS.Application      CQRS commands/queries + handlers, DTOs, AutoMapper profiles, FluentValidation
                     validators, and the abstractions (interfaces) the outer layers implement.
HMS.Infrastructure   Concrete implementations of Application abstractions: email (MailKit), JWT
                     issuing, Google token validation, Azure Blob Storage uploads.
HMS.Persistence      EF Core DbContext, entity configurations, migrations, and one-time seed data.
HMS.API              Controllers, authentication/authorization wiring, SignalR hub, Serilog setup,
                     the appointment-reminder background job, and Program.cs composition root.
```

Authorization is permission-claim based: every role (Admin, Doctor, Nurse, Patient) is granted a
specific set of `Permissions.*` claims at seed time, and every endpoint declares the permission it
requires via `[HasPermission(...)]` rather than checking roles directly. Admins are granted every
permission that exists (`Permissions.All()`), so new features only need their permission added to
the relevant role lists in `UserAndRoleSeeds.cs`.

## Tech stack

**Backend**
- .NET 10 / ASP.NET Core Web API
- PostgreSQL via EF Core + Npgsql
- ASP.NET Core Identity (users/roles) + JWT bearer auth (access + refresh tokens) + Google Sign-In
- MediatR (CQRS), AutoMapper, FluentValidation
- SignalR — real-time chat (push-only hub; sends/reads still go through REST, the hub just notifies)
- Serilog — logs to console + Azure Blob Storage
- Azure Blob Storage — profile photos, announcement images, application logs
- MailKit/MimeKit — transactional email (confirmation codes, password resets, reminders, etc.)
- Swagger / Swashbuckle

**Frontend**
- React 19 + TypeScript + Vite
- TailwindCSS v4 + Radix UI primitives
- TanStack Query v5 (server state) + TanStack Table
- React Router v7
- React Hook Form
- Recharts (analytics)
- `@microsoft/signalr` (real-time chat client)

## Features

**Auth & account management** — register/login with email confirmation, Google Sign-In, forgot/reset
password via emailed code, self-service profile editing (name, phone, email change with
re-confirmation, password change, profile photo upload), refresh-token rotation with a "sign out of
all other sessions" option, admin-created Nurse/Admin staff accounts.

**Clinical workflow** — appointment booking with doctor-schedule conflict detection, ward/room/bed
management and patient admission (visits), prescriptions, lab results, discharge summaries.

**Communication** — real-time messaging over SignalR between roles, in-app notifications, and
automatic appointment-reminder emails sent ~1 day before an appointment via a background job (also
triggerable on demand by nurses/admins).

**Admin tools** — analytics dashboard, audit log (every entity create/update/delete is recorded
automatically), staff account management, and a small CMS for the public site: announcements
(blog-style posts) and "offers" (the feature cards on the home page), each with image upload.

**Public site** — a marketing home page listing doctors and published announcements/offers, with no
login required.

## Project structure

```
HospitalManagementSystem/
├── HMS.API/              Controllers, Program.cs, SignalR hub, background services, auth wiring
├── HMS.Application/      CQRS commands/queries, DTOs, mapping profiles, validators
├── HMS.Domain/           Entities, enums, permission constants
├── HMS.Infrastructure/   Email, JWT, Google auth, Azure Blob Storage implementations
└── HMS.Persistence/      DbContext, entity configurations, migrations, seed data

OHM.Frontend/
├── src/
│   ├── pages/            Route-level pages grouped by role (admin/doctor/nurse/patient/public/auth)
│   ├── components/       Shared UI (shadcn-style components, layout)
│   ├── hooks/            React Query hooks wrapping the API client
│   ├── lib/api/          Thin fetch wrappers per resource
│   ├── contexts/         Auth context/provider
│   └── types/            Frontend-side DTO/type definitions
```

## Getting started

### Prerequisites

- .NET 10 SDK
- Node.js 18+ (project is tested on Node 22)
- PostgreSQL running locally (or reachable via connection string)
- Optional but recommended for full functionality: an Azure Storage account (image uploads +
  centralized logs), SMTP credentials (email), a Google OAuth client (Google Sign-In)

### Backend

```bash
cd HospitalManagementSystem
# configure appsettings.json / appsettings.Development.json — see "Configuration & secrets" below
dotnet ef database update --project HMS.Persistence --startup-project HMS.API
dotnet run --project HMS.API
```

The API starts on the port in `HMS.API/Properties/launchSettings.json` (default
`http://localhost:5182`), applies pending migrations automatically on boot, seeds roles/permissions
and demo accounts, and serves Swagger at `/swagger`.

### Frontend

```bash
cd OHM.Frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` by default. Copy `.env` and set:

```
VITE_API_BASE_URL=http://localhost:5182/api
VITE_GOOGLE_CLIENT_ID=<must match GoogleAuthSettings:ClientId in appsettings>
```

## Configuration & secrets

`HMS.API/appsettings.json` currently contains real credentials (database password, JWT signing key,
SMTP password, Google OAuth client secret, Azure Storage account key) checked in as placeholders for
local development. **Before pushing this repo anywhere public, or deploying it,** move the real
values into `appsettings.Development.json` / `appsettings.Local.json` (already gitignored) or proper
secret storage (user-secrets, environment variables, Azure Key Vault, etc.), replace the values in
`appsettings.json` with dummy placeholders, and rotate any keys that have already been committed.

Key settings blocks in `appsettings.json`:

| Section | Purpose |
|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string |
| `JwtSettings` | Access/refresh token signing key, issuer, audience, lifetimes |
| `SmtpSettings` | Outgoing email (confirmation codes, password resets, reminders) |
| `GoogleAuthSettings` | Google Sign-In client ID/secret |
| `AzureBlobStorage` | Storage account connection string + container names for images and logs |
| `Cors:AllowedOrigins` | Frontend origin(s) allowed to call the API |

### CORS

The API only accepts requests from origins listed under `Cors:AllowedOrigins`. Add your deployed
frontend's URL there before pointing a production frontend at the API.

## Database migrations

Migrations live in `HMS.Persistence/Migrations` and are applied automatically on API startup. To add
a new one after changing an entity:

```bash
dotnet ef migrations add <Name> --project HMS.Persistence --startup-project HMS.API
```

## Seeded accounts

On first run the API seeds one demo account per role (all with `EmailConfirmed = true`):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hms.com` | `Admin123!` |
| Doctor | `doctor@hms.com` | `Doctor123!` |
| Nurse | `nurse@hms.com` | `Nurse123!` |
| Patient | `patient@hms.com` | `Patient123!` |

Admins additionally sign in via a separate `/admin-login` route/endpoint.

## API documentation

With the backend running, Swagger UI is available at `/swagger` and documents every endpoint,
grouped by controller, with the JWT bearer scheme wired up for "Try it out" requests.
