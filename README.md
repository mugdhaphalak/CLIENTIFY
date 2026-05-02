# CLIENTIFY

**Smarter client acquisition starts here.**

---

## Overview

CLIENTIFY is a full-stack AI-powered company intelligence platform designed to streamline client acquisition.
It integrates market research, decision-maker identification, competitor analysis, and outreach planning into a single system.

The platform uses a modular **agent-based backend architecture** combined with a **React-based frontend dashboard** to deliver structured and actionable insights.

---

## Tech Stack

**Frontend**

* React (Vite)
* JavaScript (JSX)
* CSS

**Backend**

* Node.js
* Express.js

**Architecture**

* Agent-based system (Research, People, Outreach, Tracking)

---

## Project Structure

```id="4c3r2a"
CLIENTIFY/
│
├── client/                  # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/                  # Backend (Node.js)
│   ├── agents/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Setup and Execution

### Install Dependencies

Frontend:

```id="c5tvkq"
cd client
npm install
```

Backend:

```id="5q8w7e"
cd ../server
npm install
```

---

### Run the Application

Backend:

```id="bd4t0m"
cd server
npm run dev
```

Frontend:

```id="c6m8hy"
cd client
npm run dev
```

---

## System Features

* Structured company intelligence generation
* Identification of key decision-makers
* Competitor landscape analysis
* Outreach strategy formulation
* Centralized dashboard for insights

---

## Screenshots

Add system screenshots here to showcase UI and features:

```
/screenshots/home.png
/screenshots/dashboard.png
/screenshots/analysis.png
```

---

## Notes

* Ensure Node.js is installed before running
* Frontend and backend should be executed in separate terminals
* Sensitive files (like `.env`) are excluded via `.gitignore`
