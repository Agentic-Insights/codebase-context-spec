#!/bin/bash

# Script to create a split-screen image with context-editor.png and context-editor-screenshot.png

# Resize codebase-context.png to half width
convert context-editor.png -resize 600x630^ -gravity center -extent 600x630 temp_left.png

# Resize context-editor-screenshot.png to half width
convert context-editor-screenshot.png -resize 600x630^ -gravity center -extent 600x630 temp_right.png

# Combine the two images side by side
convert +append temp_left.png temp_right.png temp_combined.png

# Add text overlay (optional)
convert temp_combined.png -fill white -font Arial -pointsize 48 -gravity center final_og_image.png

# Copy the final image to the context-editor public folder
cp final_og_image.png ../examples/context-editor/public/og-image.png

# Clean up temporary files
rm temp_left.png temp_right.png temp_combined.png final_og_image.png

echo "Split-screen image created and copied successfully."