## Solution error SSL Unsupported Protocol

```bash
# Windows
$env:NODE_OPTIONS="--tls-cipher-list=DEFAULT@SECLEVEL=0" pnpm dev
```

```bash
# Linux/macOS
set NODE_OPTIONS=--tls-cipher-list=DEFAULT@SECLEVEL=0 pnpm dev
```

## Install pm2 as global

### PM2 v7.x

### Windows / macOS / Linux
```bash
npm install -g pm2
```


### Commands
```bash
# Monitor processes
pm2 monit

# Generate the automatic startup command (you need to install pm2 as global)
pm2 startup

# Save the startup script
pm2 save

# List processes
pm2 list

# Stop a process
pm2 stop all

# Delete a process
pm2 delete all

# Restart a process
pm2 restart all

# View logs
pm2 logs