from requests import get
from websocket import create_connection
from json import dumps, loads
from sys import argv
from os import listdir, path
from time import sleep

BASE_ADDRESS = "http://localhost:8080"

class Tab:
    def __init__(self, res) -> None:
        self.title = res["title"]
        self.id = res["id"]
        self.ws_url = res["webSocketDebuggerUrl"]

    def evaluate_js(self, js):
        ws = create_connection(self.ws_url)
        ws.send(dumps({
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": js,
                "userGesture": True
            }
        }))
        response = ws.recv()
        ws.close()
        return response
    
    def __str__(self):
        return self.title
    
    def __repr__(self):
        return self.title

def get_tabs():
    res = get("{}/json".format(BASE_ADDRESS)).json()
    return [Tab(i) for i in res]

def main():
    tabs = None
    while True:
        try:
            tabs = get_tabs()
            break
        except Exception as e:
            print("Could not fetch tabs from Steam CEF instance. Are you sure steam is running ?")
            print(e)
            print("Retrying in 5 seconds")
            sleep(5)
    files = listdir(argv[1])
    print(files)
    for file in files:
        fp = open(path.join(argv[1], file, "main.js"), "r")
        cfg = loads(fp.readline()[2:])
        if not cfg.get("enabled"):
            continue
        print("Loading {} with cfg {}".format(file, cfg))
        while True:
            tab = next((i for i in tabs if i.title == cfg["target_tab"]), None)
            if tab:
                print("Found tab {} with ID {}. Injecting JS...".format(tab.title, tab.id))
                print(tab.evaluate_js(fp.read()))
                break
            else:
                print("Target tab {} not found in fetched tabs. Refreshing tabs and retrying in 5 seconds".format(cfg["target_tab"]))
                tabs = get_tabs()
                sleep(5)

if __name__ == "__main__":
    main()
