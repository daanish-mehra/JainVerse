#!/bin/bash

echo "🔐 Setting up .env.local file..."
echo ""
echo "Please provide your Azure Cosmos DB credentials from Azure Portal → Keys:"
echo ""

read -p "Enter AZURE_COSMOS_ENDPOINT (URI): " COSMOS_ENDPOINT
read -p "Enter AZURE_COSMOS_KEY (Primary Key): " COSMOS_KEY

cat > .env.local << EOF
# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=${COSMOS_ENDPOINT}
AZURE_COSMOS_KEY=${COSMOS_KEY}
AZURE_COSMOS_DATABASE=jainai

# Azure OpenAI (Optional - add when you get the keys)
# AZURE_OPENAI_API_KEY=your_key_here
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
# AZURE_OPENAI_API_VERSION=2024-02-15-preview

# ElevenLabs (Optional)
# ELEVENLABS_API_KEY=your_key_here
EOF

echo ""
echo "✅ .env.local file created!"
echo "⚠️  Remember: This file contains secrets and is in .gitignore"
echo ""

