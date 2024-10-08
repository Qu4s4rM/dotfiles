#!/usr/bin/env bash
#  ██████╗ ██╗     ██╗   ██╗███████╗████████╗ ██████╗  ██████╗ ████████╗██╗  ██╗
#  ██╔══██╗██║     ██║   ██║██╔════╝╚══██╔══╝██╔═══██╗██╔═══██╗╚══██╔══╝██║  ██║
#  ██████╔╝██║     ██║   ██║█████╗     ██║   ██║   ██║██║   ██║   ██║   ███████║
#  ██╔══██╗██║     ██║   ██║██╔══╝     ██║   ██║   ██║██║   ██║   ██║   ██╔══██║
#  ██████╔╝███████╗╚██████╔╝███████╗   ██║   ╚██████╔╝╚██████╔╝   ██║   ██║  ██║
#  ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝
#	Script to detect and control the bluetooth information on my eww widget.
#	gh0stzk | https://github.com/gh0stzk/dotfiles
#	12.07.2024 09:51:19

get_icon() {
	if systemctl is-active --quiet bluetooth.service; then
		if [[ $(bluetoothctl show | grep "Powered" | awk '{print $2}') == "yes" ]]; then
			echo "󰂯"
		else
			echo "󰂲"
		fi
	else
		echo "󰂲"
	fi
}

get_name() {
	if systemctl is-active --quiet bluetooth.service; then
		if [[ $(bluetoothctl show | grep "Powered" | awk '{print $2}') == "yes" ]]; then
			connected_devices=$(bluetoothctl devices Connected | awk '{print $3}')
			if [ -n "$connected_devices" ]; then
				echo "$connected_devices"
			else
				echo "On"
			fi
		else
			echo "Off"
		fi
	else
		echo "Null"
	fi
}

toggle() {
	if [[ $(bluetoothctl show | grep "Powered" | awk '{print $2}') == "no" ]]; then
		bluetoothctl power on
		dunstify --icon=bluetooth --appname=Bluetooth --urgency=normal "Bluetooth" "Bluetooth has been turned on."
	else
		bluetoothctl power off
		dunstify --icon=bluetooth-disabled --appname=Bluetooth --urgency=normal "Bluetooth" "Bluetooth has been turned off."
	fi
}

case "$1" in
  --status) get_status ;;
  --icon) get_icon ;;
  --name) get_name ;;
  --toggle) toggle ;;
esac