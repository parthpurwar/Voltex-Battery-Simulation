# Voltex Battery Simulation Platform

A full-stack battery simulation platform for modeling and analyzing various battery chemistries using PyBaMM. Features JWT authentication, real-time visualization, **AI-powered chatbot using OpenAI GPT-3.5**, and support for multiple battery models (SPM, SPMe, DFN, MPM, MSMR).



## Table of Contents

- [Features](#features)
- [AI-Powered Chatbot](#ai-powered-chatbot)
- [Technologies Used](#technologies-used)
- [Skills Demonstrated](#skills-demonstrated)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Battery Models Supported](#battery-models-supported)

## Features

- **Multi-Chemistry Simulation**: Lithium-Ion, Lead-Acid, Sodium-Ion, Lithium-Metal, Lithium-Sulfur, Zinc-Air
- **Mathematical Models**: SPM, SPMe, DFN, MPM, MSMR with customizable parameters (Chen2020, Marquis2019, Sulzer2019)
- **Real-Time Visualization**: Dynamic voltage plotting with matplotlib
- **Generative AI Chatbot**: OpenAI GPT-3.5 Turbo integration for intelligent conversational assistance
- **Authentication**: JWT-based system with OTP password reset via email
- **Modern UI**: Responsive design with React, Bootstrap, and Tailwind CSS

## AI-Powered Chatbot

The platform integrates a **Generative AI chatbot** powered by **OpenAI's GPT-3.5 Turbo** model, providing users with intelligent, context-aware assistance for battery simulation queries and technical support.

**Key Features:**
- Real-time conversational AI using OpenAI Chat Completions API
- Context-aware responses with conversation history tracking
- Dedicated chatbot interface with message threading
- Error handling with rate limit and authentication management
- RESTful API endpoint for seamless frontend-backend communication

**Technical Implementation:**
- Backend: Django view with OpenAI API integration (`ChatbotView` in `views.py`)
- Frontend: React component with real-time message handling (`chatbot.jsx`)
- Model: GPT-3.5-Turbo with configurable temperature and max tokens
- API: `/api/chat/` endpoint for message processing

## Technologies Used

- **Backend**: Python, Django 5.1.6, Django REST Framework, PyBaMM, NumPy, SciPy, Matplotlib, Pandas, CasADi, JWT, PostgreSQL/SQLite, **OpenAI GPT-3.5 API**
- **Frontend**: React 19.1.0, React Router, Axios, Bootstrap 5.3.6, Tailwind CSS, Lucide Icons
- **AI/ML**: OpenAI Chat Completions API, GPT-3.5-Turbo model
- **Tools**: pytest, CORS Headers, WhiteNoise, Gunicorn

## Skills Demonstrated

- **Generative AI Integration**: OpenAI GPT-3.5 API implementation with conversation management
- Full-stack development with RESTful API design and JWT authentication
- Scientific computing with PyBaMM, NumPy, SciPy integration
- Modern React development with hooks and responsive design
- Security best practices and environment-based configuration

## Installation and Setup

### Prerequisites
- Python 3.8+, Node.js 14.x+, npm 6.x+

### Backend Setup

```bash
# Clone and navigate
git clone <repository-url>
cd Voltex-Battery-Simulation/backend

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure .env file
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
OPENAI_API_KEY=your-openai-key

# Run migrations and collect static files
python manage.py migrate
python manage.py collectstatic --noinput
```

### Frontend Setup

```bash
# Navigate and install
cd ../frontend
npm install
```

## Running the Application

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver  # Runs on http://localhost:8000

# Terminal 2 - Frontend
cd frontend
npm start  # Runs on http://localhost:3000
```

**Access Points**: Frontend (http://localhost:3000), API (http://localhost:8000), Admin (http://localhost:8000/admin)

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/register/` | Register user | No |
| POST | `/api/login/` | User login | No |
| POST | `/api/token/` | Get JWT token | No |
| POST | `/api/token/refresh/` | Refresh token | No |
| POST | `/api/request-password-reset-otp/` | Password reset OTP | No |
| POST | `/api/simulate/` | Run simulation | JWT |
| POST | `/api/chat/` | **AI Chatbot (GPT-3.5)** | No |
| GET | `/api/chat/` | Chatbot API status | No |

## Battery Models Supported

**Lithium-Ion**: SPM, SPMe, DFN, MPM, MSMR (Parameter sets: Chen2020, Marquis2019, Mohtat2020)

**Lead-Acid**: LOQS, Full (Parameter sets: Sulzer2019, Quarti2020)

**Sodium-Ion**: SPM, SPMe, DFN, BasicDFN (Parameter sets: Palmer2015, Tomaszewska2019)

## Project Structure

```
backend/
├── simulation/
│   ├── pybamm_runner.py    # Battery simulation engine
│   ├── views.py            # API views (includes ChatbotView)
│   ├── models.py           # Database models
│   └── aihelper.py         # OpenAI GPT-3.5 integration
└── backend/
    └── settings.py         # Django configuration

frontend/
├── src/
│   ├── components/
│   │   ├── BatteryForm.jsx # Simulation form
│   │   ├── chatbot.jsx     # AI chatbot UI (GenAI)
│   │   └── Results.jsx     # Results display
│   ├── App.jsx             # Main component
│   └── Login.js/Register.js # Auth pages
└── package.json
```

## Contributing

Fork the repository, create a feature branch, commit changes, and open a pull request. Ensure code follows existing style and includes tests.

---

**Developed by**: Parth Purwar | **Institution**: IIT BHU | **Contact**: parth.purwar.ece23@itbhu.ac.in


