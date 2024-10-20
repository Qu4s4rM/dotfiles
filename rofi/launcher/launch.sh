#!/usr/bin/env bash

## Author : Aditya Shakya (adi1090x)
## Github : @adi1090x
#
## Rofi   : Launcher (Modi Drun, Run, File Browser, Window)
#
## Available Styles
#
## style-1     style-2     style-3     style-4     style-5
## style-6     style-7     style-8     style-9     style-10

FILE="$HOME/.cache/rofi-launcher.lock"
dir="$HOME/.config/rofi/launcher/"
theme='colors'

## Run
#rofi \
#    -show drun \
#    -theme ${dir}/${theme}.rasi

if [[ ! -f "$FILE" ]]; then
    touch "$FILE"
    rofi -show drun -theme ${dir}/${theme}.rasi
    sleep 10
    killall rofi
elif [[ -f "$FILE" ]]; then
    killall rofi
    rm -rf "$FILE"
fi

