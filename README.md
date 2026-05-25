# 🤖 Robot Fleet Dashboard

A real-time management system for a Robot Fleet. This project includes a Frontend (Next.js), Backend (Node.js/uWebSockets), Robot Simulator, MongoDB database, and Redis Pub/Sub. The entire system is packaged with Docker.

## 🚀 Quick Start with Docker Compose (Demo Mode)

To start the entire system (including the Robot Simulator that auto-emits data), simply install Docker Desktop and follow these 2 easy steps:

### Step 1: Stop old processes (if any)
If you are running the app manually (e.g. `npm run dev` or `npm run cluster`) in your terminals, **make sure to press `Ctrl + C` to stop them all** to free up the network ports (port 8080 and 3000) and avoid conflicts.

### Step 2: Run Docker Compose
Open a terminal in the root directory of this project and run the following command:

```bash
docker compose up --build -d
```

This command will automatically:
1. Download and configure **MongoDB** & **Redis**.
2. Build the **Backend** image and start it in Multi-core (Cluster) mode.
3. Build the static image for the **Frontend (Next.js)**.
4. Start the **Robot Simulator** to simulate 5 active robots continuously sending data to the Backend.

### Step 3: Enjoy the result
Wait a moment for the build process to complete. Then, open your browser and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

You will see the Dashboard interface appear, with the Robots' telemetry metrics updating smoothly in real-time!

---

## 🛑 How to Stop the System

To stop and shut down the entire system running in the background, run:
```bash
docker compose down
```

If you also want to delete the data (MongoDB volume) to reset everything from scratch, add the `-v` flag:
```bash
docker compose down -v
```

---

## 🔧 For Developers (Manual Run)
If you want to edit the code and run it manually without Docker, please check the system architecture details in `INSTRUCTIONS.md` or view the individual `README.md` files in the `frontend` and `backend` directories.

Link video demo: https://drive.google.com/file/d/1yHNt7Lw5qa-E_XJ3OLdLNULqcLs-lqLe/view
