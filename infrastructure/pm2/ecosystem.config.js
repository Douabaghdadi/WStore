module.exports = {
  apps: [
    {
      name: 'wstore-backend',
      cwd: '/var/www/wstore/backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: '/var/www/wstore/logs/backend-error.log',
      out_file: '/var/www/wstore/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Stratégie de redémarrage
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Variables d'environnement de production
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'wstore-frontend',
      cwd: '/var/www/wstore/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      error_file: '/var/www/wstore/logs/frontend-error.log',
      out_file: '/var/www/wstore/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Stratégie de redémarrage
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Variables d'environnement de production
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: '51.254.135.247',
      ref: 'origin/main',
      repo: 'git@github.com:votre-username/wstore.git',
      path: '/var/www/wstore',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
