#!/bin/sh

if command -v brightnessctl &>/dev/null; then
    if [ true == $(brightnessctl get) ]; then
        echo 0
        exit
    else
        brightnessctl get
    fi
else
    brightnessctl -m | grep -o '[0-9]\+%' | head -c-2
fi