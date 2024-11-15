#!/bin/bash


status=`nmcli radio wifi`

function power {
    if [ $status = "enabled" ];then
        nmcli radio wifi off
    elif [ $status = "disabled" ];then
        nmcli radio wifi on
    fi
}

function switch_wifi {
    if [ $status = "enabled" ];then
        echo "switch-active"
    elif [ $status = "disabled" ];then
        echo "switch-none"
    fi
}
function get_list_wifi {
    nmcli -t -f ssid dev wifi
}
function get_name {
    state=`nmcli dev status | grep 'wifi' | awk '{print $3}'`
    if [ $state = "connected" ]; then
        nmcli -t -f active,ssid dev wifi | grep '^yes' | cut -d ':' -f 2
    elif [ $state = "disconnected" ]; then
        echo "Disconnected"
    fi
    
}
function get_icon {
    state=`nmcli dev status | grep 'wifi' | awk '{print $3}'`
    state_percentage=`nmcli -t -f active,signal dev wifi | grep '^yes' | cut -d ':' -f 2`
    if [ $state = "disconnected" ]; then
        echo "wifi-indicator-none"
    elif [ $state_percentage -ge 75 ]; then
        echo "wifi-level-max"
    elif [ $state_percentage -ge 50 -a $state_percentage -lt 75 ]; then
        echo "wifi-level-3"
    elif [ $state_percentage -ge 25 -a $state_percentage -lt 50 ]; then
        echo "wifi-level-2"
    elif [ $state_percentage -ge 0 -a $state_percentage -lt 25 ]; then
        echo "wifi-level-min"
    fi
}

case $1 in
    getname)
	get_name
	;;
    geticon)
    get_icon
    ;;
    getlistwifi)
    get_list_wifi
    ;;
    switchwifi)
    switch_wifi
    ;;
    power)
    power
    ;;
esac