#!/usr/bin/env bash

echo 'This will patch the gamescope session to enable CEF remote debugging.';
echo 'This could be a security vulnerability.';
read -p "Are you sure you want to continue ? [Y\n]" -n 1 -r;
echo;
if [[ $REPLY =~ ^[Yy]$ ]]
then
	line=$(awk '/steamargs/{print NR; exit}' < /usr/bin/gamescope-session);
	line_to_write=$(expr $line + 1);
	sudo sed -i "$line_to_write i steamargs+=(\"-cef-enable-debugging\")" /usr/bin/gamescope-session;
fi
