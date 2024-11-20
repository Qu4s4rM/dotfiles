#!/bin/bash

function get_name {
    state=`bluetoothctl show | grep "Pairable" | awk '{print $2}'`
    if [ $state == "yes" ]; then
        bluetoothctl info | grep "Alias" | awk '{print $2}'
    elif [ $state == "no" ]; then
        echo "Disconnected"
    fi
}
function get_icon {
    state=`bluetoothctl show | grep "Powered" | awk '{print $2}'`
    if [ $state == "yes" ]; then
        echo "bluetooth-indicator-full"
    elif [ $state == "no" ]; then
        echo "bluetooth-indicator-none"
    fi
}

case $1 in
    getname)
	get_name
	;;
    geticon)
    get_icon
    ;;
esac