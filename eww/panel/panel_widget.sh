#!/bin/bash

## Files and CMD
FILE="$HOME/.cache/eww_panel.panel"
FILE_BLUETOOTH="$HOME/.cache/eww_bluetooth.bluetooth"

function is_panel {
    if [[ ! -f "$FILE" ]]; then
        touch "$FILE"
        eww open systemmenu -c ~/.config/eww/panel/
    elif [[ -f "$FILE" ]]; then
        eww close systemmenu -c ~/.config/eww/panel/
        rm "$FILE"
    fi
}

function is_bluetooth {
    if [[ ! -f "$FILE_BLUETOOTH" ]]; then
        touch "$FILE_BLUETOOTH"
        eww open bluetooth -c ~/.config/eww/panel/widgets/bluetooth/
    elif [[ -f "$FILE_BLUETOOTH" ]]; then
        eww close bluetooth -c ~/.config/eww/panel/widgets/bluetooth/
        rm "$FILE_BLUETOOTH"
    fi
}


case $1 in
    panel)
        is_panel
	;;
    bluetooth)
        is_bluetooth
	;;
esac
