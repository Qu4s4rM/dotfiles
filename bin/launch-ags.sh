#!/usr/bin/env bash
ags -q --bus-name bar -c ~/.config/ags/config.js
sleep 5 &
ags --bus-name bar -c ~/.config/ags/config.js