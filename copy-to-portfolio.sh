#!/bin/bash

# Script to copy the React Windows build to a target directory for portfolio integration
# To run the script: `./copy-to-portfolio.sh ../portfolio/public/react-windows`
# Link to open build:
# ```
# <a href="/react-windows" 
#   target="_blank" 
#   rel="noopener noreferrer"
#   className="project-link">
#  Try React Windows Demo
# </a>
# ```
# Make sure script has `+x` permissions
# Change `"hompage": "<portfolio-path>/react-windows"` in `package.json`

# Exit on any error
set -e

# Check if target directory is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <target-directory>"
  echo "Example: $0 ../portfolio/public/react-windows"
  exit 1
fi

TARGET_DIR="$1"

echo "🔨 Building React Windows app..."
npm run build

# Check if build directory exists
if [ ! -d "build" ]; then
  echo "❌ Error: Build directory not found. Build may have failed."
  exit 1
fi

echo "📋 Copying build to $TARGET_DIR"
# Remove existing target directory to avoid stale files
rm -rf "$TARGET_DIR"
# Create target directory
mkdir -p "$TARGET_DIR"
# Copy all contents from build to target
cp -r build/* "$TARGET_DIR/"

echo "✅ Successfully copied React Windows build to $TARGET_DIR"
echo "📝 Note: Remember to rebuild and redeploy your portfolio to include these changes."
