#!/bin/bash

# Create a backup of current assets
echo "Creating backup of current assets..."
mkdir -p assets-backup
cp -r assets/* assets-backup/

# Download default template assets from Expo's GitHub repository
echo "Downloading new assets..."

# Icon
curl -o assets/icon.png https://raw.githubusercontent.com/expo/expo/master/templates/expo-template-blank/assets/icon.png

# Splash screen
curl -o assets/splash.png https://raw.githubusercontent.com/expo/expo/master/templates/expo-template-blank/assets/splash.png

# Adaptive icon
curl -o assets/adaptive-icon.png https://raw.githubusercontent.com/expo/expo/master/templates/expo-template-blank/assets/adaptive-icon.png

# Favicon
curl -o assets/favicon.png https://raw.githubusercontent.com/expo/expo/master/templates/expo-template-blank/assets/favicon.png

echo "Assets downloaded successfully!"
echo "You can now try building your app again."

# Verify file sizes
echo "Verifying file sizes:"
ls -lh assets/*.png

echo "Done!" 