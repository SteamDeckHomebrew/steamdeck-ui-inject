//{"target_tab": "QuickAccess", "enabled": true}
(function () {
    //------------------------------------- DISPLAY CODE ---------------------------------------------

    const PAGE_CONTENT = `
        <div class="quickaccessmenu_Title_34nl5">MOPIDY</div>
        <div class="quickaccessmenu_TabGroupPanel_1QO7b Panel Focusable gpfocuswithin" style="padding-left: 1.5rem;">
            <p id="current_song">ARTIST - TITLE</p>
            <div style="width:100%; text-align: center;">
                <button onclick="mopidy_btn_prev_action()" style="display:inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                    </svg>
                </button>
                <button id="play-button" onclick="mopidy_btn_play_action()" style="display:inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                    </svg>
                </button>
                <button onclick="mopidy_btn_next_action()" style="display:inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg>
                </button>
            </div>
            <ul id="playlist" style="overflow-y: scroll; padding: 0;">
            </ul>
        </div>
    `;
    

    const MUSIC_ICON_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-music-note" viewBox="0 0 16 16">
            <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
            <path fill-rule="evenodd" d="M9 3v10H8V3h1z"/>
            <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z"/>
        </svg>
    `;

    const PLAY_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
    </svg>
    `

    const PAUSE_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
    </svg>
    `

    //--------------------------------------- CONTROLLER CODE ------------------------------------------

    async function call_mopidy_rpc(command, params = {}) {
        let res = await fetch('https://localhost/mopidy/rpc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": command, "params": params }),
        });
        return (await res.json()).result;
    }

    function set_current_song(title, artist) {
        document.getElementById("current_song").innerText = `${artist} - ${title}`;
    }

    function set_playlist(plist) {
        document.getElementById("playlist").innerHTML = "";
        plist.forEach((el) => {
            let e = document.createElement("li");
            e.innerText = `${el.track.artists != undefined ? el.track.artists[0].name : "Unknown artist"} - ${el.track.name}`;
            e.onclick = function() {
                call_mopidy_rpc("core.playback.play", {"tlid" : el.tlid})
            }
            document.getElementById("playlist").appendChild(e);
        });
    }

    window.mopidy_btn_prev_action = function() {
        call_mopidy_rpc("core.playback.previous");
    }

    window.mopidy_btn_play_action = async function () {
        let playback_state = await call_mopidy_rpc("core.playback.get_state");
        if (playback_state.toLowerCase() == "paused") {
            call_mopidy_rpc("core.playback.resume");
            document.getElementById("play-button").innerHTML = PAUSE_ICON;
        }
        else if (playback_state.toLowerCase() == "playing") {
            call_mopidy_rpc("core.playback.pause");
            document.getElementById("play-button").innerHTML = PLAY_ICON;
        }
    }

    window.mopidy_btn_next_action = function() {
        call_mopidy_rpc("core.playback.next");
    }

    setInterval(async function () {
        let current_song = await call_mopidy_rpc("core.playback.get_current_track");
        set_current_song(current_song.name, current_song.artists[0].name);

        let tracklist = await call_mopidy_rpc("core.tracklist.get_tl_tracks");
        set_playlist(tracklist);
    }, 2000);

    //-------------------------------- INJECTION CODE --------------------------------
    function inject() {
        let page_list = document.getElementsByClassName("quickaccessmenu_AllTabContents_2yKG4 quickaccessmenu_Down_3rR0o")[0];
        page_list.children[page_list.children.length - 1].innerHTML = PAGE_CONTENT;

        let side_list = document.getElementsByClassName("quickaccessmenu_TabContentColumn_2z5NL Panel Focusable")[0];
        side_list.children[side_list.children.length - 1].innerHTML = MUSIC_ICON_SVG;
    }

    var _interval = setInterval(function () {
        if (document.hasFocus()) {
            console.log("Tab is focused. Injecting code.");
            inject();
            clearInterval(_interval);
        }
    }, 100);
})();