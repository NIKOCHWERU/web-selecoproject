module.exports = {
  apps: [
    {
      name: "web-seleco",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
