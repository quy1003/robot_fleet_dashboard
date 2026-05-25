# 🤖 Robot Fleet Dashboard - Frontend

This project is the central control interface (Dashboard) for the Robot Fleet system. It helps users monitor the real-time status of numerous robots on maps and charts.

## 🌟 Technologies Used
- **Next.js 14 (App Router)**: Modern React framework optimizing performance and routing.
- **TypeScript**: Ensures strict, safe, and maintainable code.
- **Tailwind CSS**: Utility-first CSS framework for rapid and beautiful UI development.
- **Recharts**: Professional charting library for React.
- **Native WebSockets**: Direct connection to the Backend to receive continuous data without reloading.

## 📂 Architecture & Directory Structure

```text
frontend/
├── src/
│   ├── app/                 # Next.js Pages
│   │   ├── layout.tsx       # Main layout structure
│   │   ├── page.tsx         # Dashboard home page displaying everything
│   │   └── globals.css      # Global CSS and design tokens
│   │
│   ├── components/          # UI Components
│   │   ├── AppHeader.tsx    # Top navigation bar
│   │   ├── MainLayout.tsx   # Main application layout wrapper
│   │   ├── RobotCharts.tsx  # Charts displaying Robot status
│   │   └── SummaryCards.tsx # Summary cards (Total, Battery, Network...)
│   │
│   └── hooks/               # Shared Logic Hooks
│       └── useRobotsData.ts # Crucial custom hook:
│                            # 1. Calls API for initial state
│                            # 2. Opens WebSocket connection for live updates
│
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## ⚙️ Data Flow

1. **Initial Load:**
   - When you open the Dashboard in your browser, the `useRobotsData` hook executes.
   - It immediately sends an HTTP GET request (REST API) to the Backend to fetch the current "Snapshot" of all robots.

2. **Real-time Stream:**
   - Right after the initial data is fetched, `useRobotsData` establishes a WebSocket connection to the Backend (`/ws/dashboard`).
   - Every second, when the Backend aggregates new data from the Robots, it pushes this data through the WebSocket.
   - The Frontend receives the new data -> Automatically triggers React to update the Tables and Charts on the screen.

3. **UI Rendering:**
   - `page.tsx` acts as the orchestrator, taking data from `useRobotsData` and distributing it:
     - Distributes overview metrics to `SummaryCards`
     - Distributes detailed metrics to `RobotCharts`

## 🚀 Installation & Setup

1. **Install Dependencies:**
   Navigate to the `frontend` directory and run:
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy the `.env.example` file to `.env.local` and fill in the details:
   ```bash
   cp .env.example .env.local
   ```
   *Note: `NEXT_PUBLIC_API_URL` should point to the Backend's port.*

3. **Run the Project:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to view the result.

## 🧠 Performance Optimization & Clean Code

During development, the interface was refactored to ensure two things: **High Performance** and **Maintainability**.

### 1. Clean Code Architecture & Custom Hooks
- **Separation of Logic and UI:** Complex logic (API calls, WebSocket handling, state management) is completely decoupled from UI Components and placed into **Custom Hooks** (e.g., `useRobotsData`, `useRobotDetail`).
- **Dumb Components:** Components like `RobotTelemetryStats` or `RobotHistoryCharts` only receive `props` and render JSX. This makes the code concise, readable, and highly reusable.
- **Elimination of Magic Numbers/Strings:** All API states (`success`, `error`), quantity limits, and chart configurations are centrally defined in `constants/config.ts`.

### 2. Chart Performance Optimization (Recharts)
- When receiving continuous WebSocket data, charts are the components most prone to causing browser lagging.
- **Data Downsampling:** The system automatically limits the number of data points displayed on the chart (e.g., maximum 120 points). When data exceeds this limit, the oldest point is removed, preventing the DOM from bloating.
- **Disable Unnecessary Animations:** Chart animations (`isAnimationActive={false}`) are disabled during real-time updates to ensure smooth rendering and prevent stuttering over many render cycles.
