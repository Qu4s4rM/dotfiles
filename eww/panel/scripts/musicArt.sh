#!/bin/bash
if [[ $1 == "--art" ]]; then
    tmp_dir="$HOME/.config/eww/images"
    tmp_temp_path=$tmp_dir/temp.png

    if [ ! -d $tmp_dir ]; then
        mkdir -p $tmp_dir
    fi

    artlink="$(playerctl -p spotify,$any,nuclear,mpd,firefox,chromium,brave metadata mpris:artUrl | sed -e 's/open.spotify.com/i.scdn.co/g')"
    artFromBrowser=$(playerctl metadata mpris:artUrl | sed 's/file:\/\///g')

    if [ $(playerctl -p spotify,%any,firefox,chromium,brave,mpd metadata mpris:artUrl) ]; then
        curl -s "$artlink" --output $tmp_temp_path
        echo $tmp_temp_path
    elif [[ -n $artFromBrowser ]]; then
        cp $artFromBrowser $tmp_temp_path
        echo $tmp_temp_path
    else
        echo images/default-music.png
    fi
fi

# Get 1st player name
if [[ $1 == "--player-name" ]]; then
    player=$(playerctl --list-all | awk 'FNR==1')
    echo "${player^}"
fi