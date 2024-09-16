#!/bin/bash

# Generate version number
VERSION=$(date +'%Y.%m.%d-%H%M%S')

# Ensure public directory exists
mkdir -p public

# Copy required MD files from root
cp ../../CODEBASE-CONTEXT.md public/
cp ../../CODING-ASSISTANT-PROMPT.md public/
cp ../../GENERATE-CONTEXT-PROMPT.md public/

# Create version file
echo $VERSION > public/version.txt

# Create a simple HTML page to display the version
cat << EOF > public/version.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Version Information</title>
</head>
<body>
    <h1>Current Version: <span id="version"></span></h1>
    <script>
        fetch('version.txt')
            .then(response => response.text())
            .then(version => {
                document.getElementById('version').textContent = version;
            });
    </script>
</body>
</html>
EOF

echo "Publish step completed. Version: $VERSION"