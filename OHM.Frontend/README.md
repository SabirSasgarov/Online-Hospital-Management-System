# CareFlow Frontend

The React/TypeScript frontend for CareFlow, a full-stack hospital management platform. Connects to
the ASP.NET Core Web API in the sibling `HospitalManagementSystem/` project — see that project's
[README](../HospitalManagementSystem/README.md) for backend setup, architecture, and configuration.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **React Router v7** — client-side routing
- **TailwindCSS v4** + **Radix UI** — styling and headless UI primitives
- **TanStack Query v5** — server state, caching, and cache invalidation
- **TanStack Table** — data tables (patients, doctors, staff, etc.)
- **React Hook Form** — forms and validation
- **Recharts** — analytics charts
- **@microsoft/signalr** — real-time chat client (messages arrive instantly instead of polling)

## Roles

The app has four authenticated roles plus a public, unauthenticated marketing site:

| Role | Access |
|---|---|
| `admin` | Patients, Doctors, Appointments, Wards & Beds, Analytics, Audit Log, Staff Accounts, Announcements & Offers CMS |
| `doctor` | My Patients, Appointments, Prescriptions, Lab Results, Discharge, Messages |
| `nurse` | Patients, Wards, Appointments, Lab Results |
| `patient` | Appointments, Medical History, Prescriptions, Lab Results, Messages |
| *(public)* | Home page listing doctors and published announcements/offers, registration, sign-in |

Every role also has a self-service Profile page (name, phone, email change, password change, photo
upload).

## Getting started

### Prerequisites

- Node.js 18+ (tested on 22)
- The backend API running (see the [backend README](../HospitalManagementSystem/README.md))

### Install & run

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` by default.

### Environment variables

Set in `.env`:

```
VITE_API_BASE_URL=http://localhost:5182/api
VITE_GOOGLE_CLIENT_ID=<must match GoogleAuthSettings:ClientId in the backend's appsettings.json>
```

### Build for production

```bash
npm run build
```

## Project structure

```
src/
├── pages/            Route-level pages, grouped by role
│   ├── admin/         Patients, Doctors, Appointments, Wards, Analytics, Audit Log, Staff, Announcements, Offers
│   ├── doctor/        Patients, Appointments, Prescriptions, Lab Results, Discharge, Messages
│   ├── nurse/         Patients, Wards, Appointments, Lab Results
│   ├── patient/       Appointments, Medical History, Prescriptions, Lab Results, Messages
│   ├── public/        Marketing home page
│   ├── auth/           Login, Register, Admin Login, Confirm Email, Forgot/Reset Password
│   └── shared/         Profile settings (used by every role)
├── components/        Shared UI (shadcn-style primitives, layout, image upload widget)
├── contexts/          Auth + Sidebar context/providers
├── hooks/             TanStack Query hooks wrapping each API resource
├── lib/
│   ├── api/           Thin fetch wrappers per backend resource
│   ├── apiClient.ts   Low-level fetch wrapper (auth headers, token refresh, error shaping)
│   ├── signalrClient.ts  Shared SignalR connection for real-time chat
│   └── adapters.ts    Maps backend DTOs to frontend view models
└── types/             Frontend-side type definitions (api.ts mirrors backend DTOs)
```

## Backend

This frontend is fully wired to the ASP.NET Core Web API in `HospitalManagementSystem/` — there is
no mock data. See that project's README for setup, environment configuration, seeded demo accounts,
and API documentation (Swagger, available at `/swagger` on the running backend).
