#!/bin/bash

function get_percentage {
    acpi -b | awk '{print $4}' | cut -d ',' -f 1
}
function get_icon {
    state=`acpi -b | awk '{print $3}' | cut -d ',' -f 1`
    state_percentage=`acpi -b | awk '{print $4}' | cut -d ',' -f 1 | cut -d '%' -f 1`
    if [ $state_percentage -le 15 ]; then
        echo "battery-discharging"
    elif [ $state_percentage -ge 70 ]; then
        echo "battery-level-max"
    elif [ $state_percentage -gt 30 -a $state_percentage -lt 70 ]; then
        echo "battery-level-medium"
    elif [ $state_percentage -gt 15 -a $state_percentage -lt 30 ]; then
        echo "battery-level-min"
    fi
}

case $1 in
    getpercentage)
	get_percentage
	;;
    geticon)
    get_icon
    ;;
esac