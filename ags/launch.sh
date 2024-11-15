#!/usr/bin/env bash

FILEVOL="$HOME/.cache/vol-ags.lock"
FILESIDEBAR="$HOME/.cache/sidebar-ags.lock"

function launch_vol {
    if [[ ! -f "$FILEVOL" ]]; then
        touch "$FILEVOL"
        ags --bus-name volume -c ~/.config/ags/configVol.js
    elif [[ -f "$FILEVOL" ]]; then
        ags -q --bus-name volume -c ~/.config/ags/configVol.js
        rm -rf "$FILEVOL"
    fi
}
function launch_sidebar {
    #rm -rf "$FILESIDEBAR"
    if [[ ! -f "$FILESIDEBAR" ]]; then
        touch "$FILESIDEBAR"
        ags --bus-name quicksettings -c ~/.config/ags/configSidebar.js
    elif [[ -f "$FILESIDEBAR" ]]; then
        ags -q --bus-name quicksettings -c ~/.config/ags/configSidebar.js
        rm -rf "$FILESIDEBAR"
    fi
}

case $1 in
	launchvol)
	launch_vol
	;;
    launchsidebar)
    launch_sidebar
	;;
    launchwlogout)
    bash ~/.config/wlogout/launch.sh
esac
