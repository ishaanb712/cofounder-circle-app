module.exports = {
  apps: [
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'backend',
      cwd: './backend',
      script: 'python',
      args: '-m uvicorn app.main:app --host 0.0.0.0 --port 8000',
      env: {
        PYTHONPATH: './backend',
        VIRTUAL_ENV: './backend/venv'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      interpreter: './venv/bin/python'
    }
  ]
}; 