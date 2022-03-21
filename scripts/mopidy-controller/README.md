# Quick Menu Mopidy Controller

## How to install
This assumes you already have mopidy working on your Deck.  
This client uses Mopidy's HTTP JSON RPC, via fetch requests. Therefore it requires some extra work to get it to collaborate with CORS.  
Caddy takes care of that and `setup.sh` installs it and sets up its service.  
You will also need to add  
`[http]`  
`csrf_protection = false`  
to your mopidy configuration. This might not be necessary under some configurations but for me it didn't work without it.