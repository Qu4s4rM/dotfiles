#!/usr/bin/bash

# Brightness notification: dunst


icon_path=/usr/share/icons/Papirus/32x32/categories/
notify_id=921


function get_percentage {
    brightnessctl -m | grep -o '[0-9]\+%'
}

function get_brightness {
    brightnessctl -m | grep -o '[0-9]\+%' | head -c-2
}

function brightness_notification {
    percentage=`get_percentage`
    brightness=`get_brightness`
    bar=$(seq -s "󰹞" $(($brightness/3)) | sed 's/[0-9]//g')
    dunstify -r $notify_id -u normal -i ${icon_path}brightness.svg "$percentage  $bar" 
}

case $1 in
    up)
        brightnessctl s 5%+
        brightness_notification
        ;;
    down)
        brightnessctl s 5%-
        brightness_notification
        brightness_min=$(brightnessctl get)
        if [ $(brightnessctl get) = "0" ]
        then
            brightnessctl s 1%+
        else
            brightnessctl get
        fi
	    ;;
    *)
        echo "Usage: $0 up | down "
        ;;
esac