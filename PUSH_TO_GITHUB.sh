#!/bin/bash

echo "🚀 JainVerse - GitHub Repository Push Script"
echo "=============================================="
echo ""

read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

echo ""
echo "📝 Steps to create repository on GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: JainVerse"
echo "3. Description: Where Ancient Wisdom Meets Modern AI - Jain Hackathon 2025"
echo "4. Visibility: Private ✅"
echo "5. Click 'Create repository'"
echo ""
read -p "Press Enter after you've created the repository..."

echo ""
echo "🔗 Adding remote and pushing code..."
echo ""

git remote add origin https://github.com/$GITHUB_USERNAME/JainVerse.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USERNAME/JainVerse.git

git branch -M main

echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Code pushed to GitHub"
    echo "🔗 Repository: https://github.com/$GITHUB_USERNAME/JainVerse"
    echo ""
else
    echo ""
    echo "❌ Error: Failed to push to GitHub"
    echo "Please check your credentials and try again"
    echo ""
fi

