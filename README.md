# CampusConnect - AI-Powered Lost & Found

CampusConnect is a full-stack web application designed to streamline the process of reporting and recovering lost items on campus. It leverages an **AI Image Captioning Model (BLIP)** hosted on **Google Colab** to automatically generate item titles and descriptions from uploaded images. The platform also features a **Real-Time Chat System** for secure communication and includes a robust **Admin Dashboard** for moderation.

---

## Key Features

- **AI Auto-Generation (BLIP Model):** Upload an image, and the AI automatically generates a meaningful title and description.
- **Secure Real-Time Chat:** Users can chat with item owners instantly via a private inbox without sharing personal phone numbers.
- **Admin Dashboard:** Dedicated admin role to view security logs, monitor chats, and delete any post.
- **Fully Responsive:** Optimized UI for Mobile, Tablet, and Desktop.
- **Authentication:** Secure JWT-based Login and Registration.

---

## Tech Stack

**Frontend:** React, Tailwind CSS, Lucide React, Axios  
**Backend:** FastAPI (Python), Motor (MongoDB Async Driver)  
**Database:** MongoDB  
**AI Service:** BLIP Image Captioning Model (Hosted via Google Colab + Ngrok)

---

## AI Architecture

- Image uploaded from React frontend
- Sent to FastAPI backend
- Forwarded to Google Colab API endpoint (via Ngrok)
- BLIP model generates:
  - Title
  - Description
- Backend stores generated data in MongoDB

---

## Installation & Setup Guide

### Prerequisites

Ensure you have the following installed:

- Node.js (v18+)
- Python (v3.10+)
- MongoDB (Local or Atlas)
- Git

---

### Clone the Repository

```bash
git clone <YOUR_GITHUB_REPO_URL_HERE>
cd campus-connect
```

---

### Start the AI Service (Google Colab)

Since the BLIP model runs on a free GPU:

1. Open your BLIP Google Colab Notebook.
2. Go to **Runtime → Change runtime type → Select T4 GPU**.
3. Run all cells.
4. Copy the **Ngrok Public URL** generated.
   Example:
   ```
   https://xxxx-xxxx.ngrok-free.app/analyze
   ```
5. Keep the Colab tab OPEN while using the app.

---

### Backend Setup

```bash
cd backend
```

#### Create Virtual Environment

```bash
python -m venv venv
```

Activate:

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Create `.env` file inside backend folder

```env
Option 1: If using Local MongoDB (installed on your system)
MONGO_URL=mongodb://localhost:27017

Option 2: If using MongoDB Atlas (Cloud) 
Replace <username>, <password>, and <cluster-url>
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net

DB_NAME=campus_connect_db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Paste your Colab Ngrok URL here:
COLAB_AI_URL=https://xxxx-xxxx.ngrok-free.app/analyze
```

#### Create Admin User

```bash
python create_admin.py
```

#### Start Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at:
http://localhost:8000

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
http://localhost:5173

---

## User Roles

### Regular User
- Post lost/found items
- Chat with other users
- Manage their own posts

### Admin
- Delete any post
- Monitor chats
- View system logs

---

## Default Admin Credentials

If you ran `create_admin.py`:

Email:
```
admin@campusconnect.com
```

Password:
```
admin123
```

---

## Important Notes

- Keep Google Colab running while using AI feature.
- MongoDB must be running before starting backend.
- Admin features are role-based and protected.

---

## Future Improvements

- Replace polling chat with WebSockets
- Deploy BLIP model to a dedicated cloud server
- Add AI-based image moderation
- Deploy full stack to AWS / Render / Vercel