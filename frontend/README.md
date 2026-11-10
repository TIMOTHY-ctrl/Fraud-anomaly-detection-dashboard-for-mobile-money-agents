# NexaGuard fraud intelligence

A responsive TypeScript and React fraud-monitoring workspace for mobile-money agent networks. Its spreadsheet-style manager interface organizes transactions, risk alerts, agents, and detection rules into searchable tables. Separate demo screens provide a personal activity dashboard for agents and an investigation queue for fraud analysts.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`. Styling uses Tailwind CSS utility classes in the React presentation components. `src/presentation/theme/global.css` is reserved for Tailwind directives and site-wide defaults such as typography, focus indicators, reduced-motion support, and print defaults.

## Architecture

- `src/domain` contains framework-independent entities and risk/currency rules.
- `src/application` contains the dashboard repository port and data-loading hook.
- `src/infrastructure` provides the demo dashboard adapter.
- `src/presentation` contains the dashboard UI, reusable components, and Tailwind-styled responsive views.

The dashboard uses representative demo data; replace the infrastructure adapter with an authenticated API integration for live transaction data. Sign-in and password-reset screens are UI-only until an authentication service is connected. In development (`npm run dev`), the login form is prefilled with the network manager demo credentials. Select another demo role to autofill its account:

| Role | Email |
|---|---|
| Network manager | `manager@nexaguard.demo` |
| Mobile money agent | `agent@nexaguard.demo` |
| Fraud analyst | `analyst@nexaguard.demo` |

All three use the development-only password `Demo123!`. Select **Sign in** to enter the matching role's workspace, or use **Explore as…** to skip the login form. These are sample-only development credentials, not real authentication. While in the demo, use the **Demo persona** selector in the sidebar to switch roles.
