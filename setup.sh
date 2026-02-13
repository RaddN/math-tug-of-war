#!/bin/bash

# Math Tug of War - Quick Setup Script
# This script helps you quickly set up and deploy the game to GitHub

echo "🎮 Math Tug of War - GitHub Setup Helper"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "📥 Please install Git from: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Get user information
read -p "Enter your GitHub username: " github_username
read -p "Enter repository name (default: math-tug-of-war): " repo_name
repo_name=${repo_name:-math-tug-of-war}

echo ""
echo "📋 Summary:"
echo "  GitHub Username: $github_username"
echo "  Repository Name: $repo_name"
echo ""

read -p "Is this correct? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Setup cancelled."
    exit 0
fi

echo ""
echo "🚀 Setting up Git repository..."

# Initialize git if not already
if [ ! -d .git ]; then
    git init
    echo "✅ Git initialized"
fi

# Add all files
git add .
echo "✅ Files staged"

# Commit
git commit -m "Initial commit: Math Tug of War game"
echo "✅ Files committed"

# Add remote
git remote add origin "https://github.com/$github_username/$repo_name.git"
echo "✅ Remote added"

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create a repository on GitHub:"
echo "   → Go to: https://github.com/new"
echo "   → Name: $repo_name"
echo "   → Make it PUBLIC"
echo "   → DO NOT add README (we already have one)"
echo ""
echo "2. After creating the repository, run:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   → Go to: https://github.com/$github_username/$repo_name/settings/pages"
echo "   → Source: Deploy from branch 'main'"
echo "   → Folder: / (root)"
echo "   → Click Save"
echo ""
echo "4. Your game will be live at:"
echo "   https://$github_username.github.io/$repo_name/"
echo ""
echo "✨ Setup complete! Follow the steps above to finish deployment."
