// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
const dotenv = require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "TweetFeed",
      script: "./src/server/server.js",
      // args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
      // env: {
      //   NODE_ENV: 'development'
      // },
      // env_production: {
      //   NODE_ENV: 'production'
      // }
    }
  ],

  deploy: {
    production: {
      key: process.env.TF_LOCAL_SSHKEY,
      user: process.env.TF_PROD_USERNAME,
      host: process.env.TF_PROD_SERVER,
      ref: "origin/master",
      repo: "git@github.com:greendost/TweetFeed.git",
      path: process.env.TF_PROD_PATH,
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
      "post-deploy":
        "npm run pm2prod && pm2 startOrRestart ecosystem.json --env production"
    }
  }
};
