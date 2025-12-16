module.exports = {
  apps: [{
    name: "teknoritma-site",
    cwd: "/opt/teknoritma-site",
    script: "npm",
    args: "start",
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    env: { NODE_ENV: "production", PORT: "4000" }
  }]
}
