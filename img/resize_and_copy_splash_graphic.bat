@echo off
REM Script to create a split-screen image with context-editor.png and context-editor-screenshot.png

REM Resize context-editor.png to half width
magick convert context-editor.png -resize 600x630^ -gravity center -extent 600x630 temp_left.png

REM Resize context-editor-screenshot.png to half width
magick convert context-editor-screenshot.png -resize 600x630^ -gravity center -extent 600x630 temp_right.png

REM Combine the two images side by side
magick convert +append temp_left.png temp_right.png temp_combined.png

REM Add text overlay (optional)
magick convert temp_combined.png -fill white -font Arial -pointsize 48 -gravity center final_og_image.png

REM Copy the final image to the context-editor public folder
copy final_og_image.png ..\examples\context-editor\public\og-image.png

REM Clean up temporary files
del temp_left.png temp_right.png temp_combined.png final_og_image.png

echo Split-screen image created and copied successfully.