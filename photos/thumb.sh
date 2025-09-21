#!/bin/bash

for img in *.jpg; do
    thumb="thumbs/$img"
    read width height < <(magick identify -format "%w %h" "$img")

    if (( width * 3 <= height * 4 )); then
        magick "$img" -resize 180x "$thumb"
    else
        magick "$img" -resize x135 "$thumb"
    fi
done
