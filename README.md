# 🎫 Support Ticket Center

> Intelligent ticket management system with LLM-powered classification.

---

## 🧰 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Django 6.0
- **Database:** PostgreSQL 15
- **Containerization:** Docker + Docker Compose
- **LLM:** OpenRouter API (LLM-powered ticket classification)

---

## ⚙️ Prerequisites

Before running the project, make sure you have the following installed:

- **Docker Desktop** — [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** — [Download here](https://git-scm.com/)
- An **OpenRouter API Key** — [Get one here](https://openrouter.ai/)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

- Open a terminal or command prompt
- Run the following command:
  ```bash
  git clone <your-repo-url>
  ```
- Navigate into the project folder:
  ```bash
  cd TICKET-SUPOORT-SYSTEM
  ```

### 2. Configure Environment Variables

- Open the `docker-compose.yml` file in any text editor
- Locate the `OPENROUTER_API_KEY` field under the backend service environment
- Replace the placeholder with your actual OpenRouter API key:
  ```
  OPENROUTER_API_KEY=your_actual_api_key_here
  ```

### 3. Start Docker Desktop

- Open **Docker Desktop** on your machine
- Wait until it shows **"Engine running"** in the bottom left

### 4. Build and Run the Application

- In your terminal, from the project root folder, run:
  ```bash
  docker-compose up --build
  ```
- Wait for all 3 services to start:
  - ✅ `db` — PostgreSQL database healthy
  - ✅ `backend` — Django server running on `http://localhost:8000/`
  - ✅ `frontend` — Vite dev server running on `http://localhost:5173/`

### 5. Open the Application

- Visit the frontend in your browser:
  ```
  http://localhost:5173/
  ```

### 6. Create an Admin Account (First Time Only)

- Open a **new terminal window** in the project root
- Run the following command:
  ```bash
  docker-compose exec backend python manage.py createsuperuser
  ```
- Follow the prompts to set a username, email, and password
- Access the Django Admin panel at:
  ```
  http://localhost:8000/admin/
  ```

### 7. Stop the Application

- Press `Ctrl + C` in the terminal running docker-compose
- Then run:
  ```bash
  docker-compose down
  ```

---

## 🤖 LLM Used & Why

**LLM Provider:** [OpenRouter](https://openrouter.ai/)

**Why OpenRouter?**

- Provides access to multiple LLM models through a single unified API
- Cost-effective for development and testing
- Easy to swap models without changing code logic
- Supports models like `mistral`, `openai/gpt-3.5-turbo`, and others through one endpoint

**How it's used:**

- When a new support ticket is submitted, the ticket title and description are sent to the LLM
- The LLM automatically classifies the ticket into:
  - **Category** — Bug Report, Billing, General, etc.
  - **Priority** — High, Medium, or Low
- This removes the need for manual tagging and speeds up ticket triage

---

## 🏗️ Design Decisions

**1. Django REST Framework for the Backend**
- Django provides a robust ORM, built-in admin panel, and easy migration management
- Ideal for rapid development of REST APIs with authentication

**2. PostgreSQL as the Database**
- Chosen over SQLite for production-readiness
- Better support for concurrent connections and complex queries
- Configured with a healthcheck in Docker to ensure the backend waits for DB readiness

**3. React + Vite for the Frontend**
- Vite offers fast hot module replacement (HMR) for quick development
- React component model makes the ticket dashboard easy to build and maintain

**4. Docker Compose for Orchestration**
- All three services (db, backend, frontend) are defined in a single `docker-compose.yml`
- Reviewer can run the entire stack with one command: `docker-compose up --build`
- No need to install Python, Node.js, or PostgreSQL locally

**5. Environment Variables for Secrets**
- The `OPENROUTER_API_KEY` and database credentials are passed via environment variables
- Keeps sensitive data out of the codebase

**6. Auto-migration on Startup**
- The backend Dockerfile is configured to automatically run `python manage.py migrate` on startup
- Ensures the database schema is always up to date without manual steps

---

## 📁 Project Structure

```
TICKET-SUPOORT-SYSTEM/
├── docker-compose.yml        # Orchestrates all services
├── README.md                 # This file
├── BACKEND/
│   ├── Dockerfile            # Backend container config
│   ├── manage.py
│   ├── ticket_system/
│   │   └── settings.py       # Django settings with env variables
│   └── core/
│       └── views.py          # API views + LLM integration
└── FRONTEND/
    ├── src/
    └── ...
```

---

## 🌐 Service URLs

| Service       | URL                          |
|---------------|------------------------------|
| Frontend App  | http://localhost:5173/       |
| Backend API   | http://localhost:8000/       |
| Django Admin  | http://localhost:8000/admin/ |

---

## ❓ Troubleshooting

- **Docker not starting?** Make sure Docker Desktop is open and the engine is running
- **Port already in use?** Stop any other services using ports `5173` or `8000`
- **Database connection error?** Wait a few seconds and retry — PostgreSQL may still be initializing
- **LLM not classifying tickets?** Double-check your `OPENROUTER_API_KEY` in `docker-compose.yml`
