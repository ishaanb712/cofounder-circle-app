#!/bin/bash

# Backend startup script
cd /home/ubuntu/cofounder-circle-app/backend

# Activate virtual environment
source venv/bin/activate

# Start the backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 