#!/bin/bash

FILE="$HOME/.cache/dock.panel"

function is_dock {
    if [[ ! -f "$FILE" ]]; then
        touch "$FILE"
        nwg-dock-hyprland -r -mb 8 -i 25 -c "rofi -show drun -config ~/.config/rofi/launcher/colors.rasi" -lp "start" -ico "/usr/share/icons/Papirus/64x64/apps/redhat-linux.svg"
    elif [[ -f "$FILE" ]]; then
        killall nwg-dock-hyprland
        rm "$FILE"
    fi
}

case $1 in
    dock)
        is_dock
	;;
esac