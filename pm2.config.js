module.exports = {
  apps: [
    {
      name: "index",
      script: "src/index.ts",
      interpreter: "npx",
      interpreter_args: "ts-node",
      instances: "max",     // cluster mode, max CPU cores
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
