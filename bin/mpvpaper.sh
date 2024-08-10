#!/bin/bash

pkill hyprpaper
killall hyprpaper
pkill mpvpaper
killall mpvpaper

mpvpaper -o "input-ipc-server=/tmp/mpv-socket" '*' /home/qu4s4r/Wallpapers/drift-infinite-live.mp4 --auto-stop --auto-pause -n loop 
