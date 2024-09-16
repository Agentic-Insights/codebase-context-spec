#!/bin/bash

# Navigate to the project directory
cd examples/context-editor

# Run the existing build command
npm run build

# Generate version number
VERSION=$(date +'%Y.%m.%d-%H%M%S')

# Ensure public directory exists
mkdir -p public

# Copy built files to public directory
# Assuming the build output is in a 'build' directory, adjust if different
cp -R build/* public/

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

echo "Build completed. Version: $VERSION"