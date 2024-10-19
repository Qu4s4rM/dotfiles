#!/usr/bin/env bash

for dispositivo in $(upower -e); do upower -i $dispositivo; done | grep percentage | head -n 1 | awk '{print $2}'