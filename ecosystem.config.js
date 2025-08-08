module.exports = {
  apps: [
    {
      name: 'cofounder-backend',
      cwd: './backend',
      script: 'python3',
      args: '-m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2',
      env: {
        NODE_ENV: 'production',
        PYTHONPATH: './backend',
        PYTHONUNBUFFERED: '1',
        PYTHONDONTWRITEBYTECODE: '1'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1536M',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    },
    {
      name: 'cofounder-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=1536'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1536M',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    }
  ]
}; 