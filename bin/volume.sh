#!/bin/bash

# You can call this script like this:
# $./volume.sh up
# $./volume.sh down
# $./volume.sh mute

icon_path=/usr/share/icons/Papirus/32x32/panel/
notify_id=1024


function get_percentage {
    amixer get Master | grep '%' | awk '{print$5}' | grep -o '[0-9]\+%'
}

function get_volume {
    amixer get Master | grep '%' | head -n 1 | cut -d '[' -f 2 | cut -d '%' -f 1
}

function is_mute {
    amixer get Master | grep '%' | grep -oE '[^ ]+$' | grep off > /dev/null
}

function send_notification {
    percentage=`get_percentage`
    volume=`get_volume`
    bar=$(seq -s "󰹞" $(($volume/3)) | sed 's/[0-9]//g')
    # Send the notification
    dunstify -r $notify_id -u normal -i ${icon_path}volume-level-high-panel.svg "$percentage  $bar" 

}

case $1 in
    up)
	# Set the volume on (if it was muted)
	amixer set Master on > /dev/null
	# Up the volume (+ 5%)
	amixer sset Master 5%+ > /dev/null
	send_notification
	;;
    down)
	amixer set Master on > /dev/null
	amixer sset Master 5%- > /dev/null
	send_notification
	;;
    toggle)
    	# Toggle mute
	amixer set Master 1+ toggle > /dev/null
    dunstify -r $notify_id -u normal -i ${icon_path}volume-mute.svg "Mute" -t 2000
	;;
esac
