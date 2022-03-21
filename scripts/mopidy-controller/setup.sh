#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR;

echo 'Setting up caddy...'
echo 'This will create a service file in /etc/systemd/system and start it.'
curl -o $SCRIPT_DIR/caddy/caddy_linux_amd64 "https://caddyserver.com/api/download?os=linux&arch=amd64&idempotency=84352346474642"
sudo chmod +x $SCRIPT_DIR/caddy/caddy_linux_amd64 
sudo cp caddy/caddy.service /etc/systemd/system/
sudo sed -i "s@!CADDY_DIRECTORY!@$SCRIPT_DIR/caddy@" /etc/systemd/system/caddy.service
sudo systemctl enable --now caddy.service

systemctl status caddy
