# 🧞‍♂️ ArogyaGenie Frontend

> **Enterprise AI-Powered Healthcare SaaS Platform**
>
> ArogyaGenie is a next-generation healthcare ecosystem connecting patients, doctors, labs, and pharmacies. The frontend is a highly responsive, desktop-first Single Page Application (SPA) designed to deliver complex telemedicine, Electronic Health Records (EHR) management, and AI-driven diagnostics through an intuitive, Apple Health-inspired UI.

---

## 🚀 Tech Stack

### Core Framework & State
*   **Core:** React 19, TypeScript, Vite
*   **Routing:** React Router v7 (Role-Based Protected Routes)
*   **State Management:** Redux Toolkit (RTK)
*   **Data Fetching & Caching:** RTK Query
*   **Forms & Validation:** React Hook Form, Zod

### Styling & UI
*   **CSS Framework:** TailwindCSS v4
*   **UI Primitives:** ShadCN UI, Radix UI (Fully Accessible)
*   **Icons:** Lucide Icons
*   **Animations:** Framer Motion
*   **Data Visualization:** Recharts

### Real-Time & Media
*   **Telemetry & Chat:** Socket.io Client
*   **Telemedicine:** WebRTC, React Webcam

---

## 📐 Platform Architecture 

The frontend connects to an **Event-Driven Microservices Backend** via a centralized API Gateway. 

### Role-Based Layouts
The UI architecture is driven by the user's role. React Router dynamic layouts ensure users only load the UI components necessary for their workflow:
1.  **Patient / Doctor:** Focuses on consultations, health timelines, and medical records.
2.  **Organization Admin:** Data-dense dashboards (Stripe-inspired) for revenue, staff management, and clinic infrastructure.
3.  **Employee (Receptionist / Diagnostician):** Task-oriented, Kanban-style workflows (Linear-inspired) for fast physical patient queue management and lab processing.

### Domain Integrity (The No-Medicine Rule)
In alignment with backend architectural constraints, **Medicine is not treated as a standalone entity or module.** Medicine data exists purely as embedded contextual data inside the `Prescriptions`, `Pharmacy`, and `Orders` domains.

---

## 📂 Folder Structure

The project follows a **Feature-Driven Architecture**, keeping Redux slices, API queries, and UI components closely co-located by domain.

```text
src/
├── api/                  # Global API configs (fetchBaseQuery, error loggers)
├── app/                  # Redux Store Configuration (store.ts, hooks.ts)
├── assets/               # Static assets (images, Lottie files)
├── components/           # Reusable, stateless UI components
│   ├── ui/               # ShadCN primitive components (Buttons, Modals)
│   └── shared/           # Cross-feature components (Data Grids, Avatars)
├── config/               # Environment variables and global settings
├── features/             # Feature-based domain modules
│   ├── auth/             # authSlice.ts, authApi.ts, Login.tsx
│   ├── telemedicine/     # telemedSlice.ts, telemedApi.ts, VideoRoom.tsx
│   └── pharmacy-orders/  # cartSlice.ts, ordersApi.ts, Checkout.tsx
├── layouts/              # Role-based wrappers (AdminLayout, EmployeeLayout)
├── lib/                  # Utility functions (cn, formatters)
├── routes/               # React Router configurations & Auth Guards
├── styles/               # Global Tailwind CSS entry
└── types/                # Global TypeScript definitions
