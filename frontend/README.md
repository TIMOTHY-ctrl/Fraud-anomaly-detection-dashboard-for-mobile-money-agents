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

The dashboard uses representative demo data; replace the infrastructure adapter with an authenticated API integration for live transaction data. Managers can add demo transactions, filter and search them, add or deactivate demo agents, and review transaction-volume and risk summaries in **Analytics**. These changes are held in page memory and reset on reload. Authentication and password reset are not connected yet. For project demonstrations, enter any valid-format email and a password, choose a role, and continue to the dashboard; the credentials are not checked, sent, or saved. Do not enter a real password. You can also use **Explore as…** to enter without filling in the form. While in the demo, use the **Demo persona** selector in the sidebar to switch roles.
