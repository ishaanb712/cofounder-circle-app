# StartupConnect Platform

A modern web platform connecting founders, investors, mentors, job seekers, and service providers in the startup ecosystem.

## 🚀 Features

- **Beautiful Landing Page**: Modern, responsive design with smooth animations
- **User Registration**: Multi-step registration for different user types
- **OAuth Integration**: LinkedIn and Gmail authentication
- **Real-time Database**: Supabase integration for data storage
- **Fast Performance**: Optimized with Next.js and TypeScript
- **Monorepo Structure**: Organized backend (Python) and frontend (Next.js) in one repository

## 🏗️ Architecture

```
landing_page/
├── frontend/              # Frontend (Next.js)
│   ├── src/              # Next.js app directory
│   ├── components/       # React components
│   └── lib/             # Utilities and services
├── backend/              # Backend (Python FastAPI)
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Core utilities
│   │   ├── schemas/     # Pydantic models
│   │   └── services/    # Business logic
│   └── requirements.txt
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.11+** - Programming language
- **Pydantic** - Data validation
- **Supabase** - Database and authentication
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Uvicorn** - ASGI server

### Database
- **Supabase** - PostgreSQL database with real-time features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- pip or poetry
- Supabase account

### 1. Clone and Install Dependencies

```bash
# Run the setup script
./setup.sh

# Or manually install dependencies
npm run install:all
```

### 2. Set Up Environment Variables

#### Frontend (frontend/.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend (backend/.env)
```bash
HOST=0.0.0.0
PORT=8000
DEBUG=true
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Create a new Supabase project
2. Create the `user_profiles` table:

```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('founder', 'investor', 'mentor', 'job_seeker', 'service_provider')),
  company TEXT,
  use_case TEXT,
  linkedin_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

Visit `http://localhost:3000` to see the landing page!
Visit `http://localhost:8000/docs` to see the API documentation!

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── src/                    # Next.js app directory
│   ├── app/page.tsx       # Beautiful landing page
│   ├── components/        # React components
│   └── lib/              # API and Supabase services
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

### Backend Structure
```
backend/
├── app/
│   ├── main.py           # FastAPI application entry point
│   ├── api/              # API routes
│   │   └── routes/       # Route handlers
│   ├── core/             # Core utilities
│   │   ├── config.py     # Settings
│   │   └── auth.py       # Authentication
│   ├── schemas/          # Pydantic models
│   └── services/         # Business logic
├── requirements.txt       # Python dependencies
└── pyproject.toml        # Poetry configuration
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/all` - Get all users (admin)

## 🎨 User Types

The platform supports five user types:

1. **Founders** - Startup founders looking for investors, mentors, and talent
2. **Investors** - Angel investors, VCs, and investment professionals
3. **Mentors** - Experienced professionals offering guidance
4. **Job Seekers** - Professionals looking for startup opportunities
5. **Service Providers** - Companies offering services to startups

## 🔐 Authentication

- **JWT Tokens** - Secure token-based authentication
- **OAuth Integration** - LinkedIn and Gmail login options
- **Password Hashing** - bcrypt for secure password storage
- **CORS Protection** - Configured for secure cross-origin requests

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render/Heroku)
```bash
cd backend
# Deploy to your preferred platform
```

## 🔧 Development Scripts

### Root (Monorepo)
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build frontend
npm run install:all      # Install all dependencies
```

### Frontend
```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Backend
```bash
cd backend
python -m uvicorn app.main:app --reload  # Start development server
pip install -r requirements.txt           # Install dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email hello@startupconnect.com or create an issue in this repository.
