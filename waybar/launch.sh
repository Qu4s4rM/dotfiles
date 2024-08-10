#!/bin/bash

killall waybar
pkill waybar
sleep 0.2

# Execute
waybar -c ~/.config/waybar/config.jsonc -s ~/.config/waybar/style.css
