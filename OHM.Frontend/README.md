# OHM Frontend — Online Hospital Management System

A role-based hospital management frontend built with React, TypeScript, and Vite.

## Tech Stack

- **React 18** with TypeScript
- **Vite** — build tool and dev server
- **React Router v6** — client-side routing
- **TailwindCSS** — utility-first styling
- **Recharts** — analytics charts
- **React Hook Form** — form management
- **TanStack React Table** — data tables

## Roles

The application has four distinct user roles, each with its own dashboard and feature set:

| Role | Access |
|---|---|
| `admin` | Patients, Doctors, Appointments, Wards, Analytics, Audit Logs |
| `doctor` | Patients, Appointments, Prescriptions, Lab Results, Discharge, Messages |
| `nurse` | Patients, Wards & Beds, Appointments, Lab Results |
| `patient` | Appointments, Medical History, Prescriptions, Lab Results, Messages |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Shared UI components
├── contexts/         # Auth context and providers
├── lib/              # Mock data and utilities
├── pages/            # Page components grouped by role
│   ├── admin/
│   ├── doctor/
│   ├── nurse/
│   └── patient/
└── types/            # TypeScript interfaces
```

## Backend

This frontend is designed to connect to an ASP.NET Web API backend. Currently it runs on mock data. See the backend repository for API endpoint documentation.
