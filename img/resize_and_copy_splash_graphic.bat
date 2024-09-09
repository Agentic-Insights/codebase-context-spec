@echo off
REM Script to resize codebase-context.png and copy to other locations

REM Resize and copy to context-editor
magick convert codebase-context.png -resize 1200x630^ -gravity center -extent 1200x630 ..\examples\context-editor\public\og-image.png

REM Add more resize and copy commands here for other locations as needed

echo Image resized and copied successfully.