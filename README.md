# Steam Deck UI Inject
## A tool to inject javascript into the Steam Deck client.
&nbsp;
## How it works
This tool works by taking advantage of the remote debugging capabilities of the Chromium Embedded Framework. It fetches all the tabs currently loaded, connects to their debug endpoints via websocket and then evaluates javascript loaded from an external file. This way it can place and replace content on the various UI elements, without modifying any files on the steam installation. So far the only script I have created is a Mopidy client that replaces the Help tab on the Quick Menu.
## Are these changes persistent ?
No. Scripts are injected once on startup directly into the browser sessions of the Steam client. If you want to revert, simply disable the devtools-inject service and reboot your Deck.
## Is this safe ?
Probably ? Obviously having remote debugging enabled has its own risks, and could in some cases result in leaked steam keys and what not, but then again the -cef-enable-debugging flag by default only allows access from the device itself (not even the local network). This means the device would have to be already compromised to pose any real danger, and by then I'm sure there are bigger problems. At any rate, use at your own risk.  
&nbsp;
## How to use
Run all these in `/home/deck`  
  
```
git clone https://github.com/marios8543/steamdeck-ui-inject.git
cd steamdeck-ui-inject

sudo steamos-readonly disable

curl https://bootstrap.pypa.io/get-pip.py > get-pip.py
sudo python get-pip.py
sudo python -m pip install -r requirements.txt

sudo ./patch-gamescope-session.sh
sudo cp devtools-inject.service /etc/systemd/system/
sudo systemctl enable --now devtools-inject

sudo steamos-readonly enable
```

Create a new folder in scripts and add a file named main.js  
The first line should be a commented-out JSON string with `target_tab` parameter and an optional `enabled` parameter.
Preferably, put your code in a self-calling function. Check `scripts/example`.
