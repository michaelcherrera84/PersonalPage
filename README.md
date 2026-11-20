
# Personal Page

A personal productivity application built to centralize everyday tools, workflows, and information.

Personal Page is an evolving application currently focused on work and delivery management for my job at Papa Johns. It provides a centralized place to track shifts, deliveries, earnings, and work history, replacing the need for manually maintained records and spreadsheets.

While its current functionality is centered around work management, the long-term goal is to expand Personal Page into a broader personal platform, incorporating useful tools, automation, and data analysis to support everyday life.

## Features

### Work & Shift Management
- Start and end work shifts.
- Track shift durations and working hours.
- Maintain historical shift records.
- Associate deliveries with individual shifts.

### Delivery Management
- Record individual deliveries.
- Track delivery times and associated information.
- Maintain delivery history for reporting and analysis.

### Earnings & Reporting
- Track earnings across different pay categories.
- Record tips and mileage-related compensation.
- View historical earnings and working hours.
- Filter records by date ranges.
- Organize records into recurring 14-day pay periods.
- Compare current and previous pay periods.

### Cross-Device Experience
- Designed for standalone use on iPhone and desktop.
- Responsive interface for different screen sizes.
- Centralized data accessible across devices.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack application framework |
| React | User interface |
| TypeScript | Static typing |
| PostgreSQL | Relational database |
| Drizzle ORM | Database access and schema management |
| Material UI | UI components |
| Tailwind CSS | Styling |
| Vercel | Deployment and hosting |

## Architecture

Personal Page uses the Next.js App Router to organize application routes and separate server-side and client-side responsibilities.

Server Components handle server-side data access and rendering, while Client Components provide interactive functionality where needed.

Database operations are managed through Drizzle ORM, with PostgreSQL serving as the primary data store in both development and production environments.

The application follows a relational data model, allowing work shifts, deliveries, and associated financial records to be connected and queried for reporting.

## Development

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Getting Started

Clone the repository:

```bash
git clone https://github.com/michaelcherrera84/PersonalPage
cd personal-page
```

Install dependencies:

```bash
npm install
```

Configure the environment variables in a `.env.local` file.

```env
DATABASE_URL=postgresql://user:password@localhost:5432/personal_page
```

Run database migrations:

```bash
npx drizzle-kit migrate
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Future Development

Personal Page is intended to grow beyond its current work-management functionality.

Potential areas of future development include:

- **Personal Analytics:** More advanced reporting, historical trends, and data visualization.
- **Financial Tracking:** Tools for organizing and analyzing personal finances.
- **Automation:** Tools to simplify recurring tasks and everyday workflows.
- **Additional Utilities:** Small applications and features that solve practical, everyday problems.

The long-term objective is to build a flexible personal platform that becomes increasingly useful through continued development and real-world use.

---

Developed as a personal project by [Michael C. Herrera](https://www.michaelcherrera.com).
