const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n🔐 Setting up .env.local file...\n');
  console.log('Please provide your Azure Cosmos DB credentials from Azure Portal → Keys:\n');

  const endpoint = await question('Enter AZURE_COSMOS_ENDPOINT (URI): ');
  const key = await question('Enter AZURE_COSMOS_KEY (Primary Key): ');

  const envContent = `# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=${endpoint}
AZURE_COSMOS_KEY=${key}
AZURE_COSMOS_DATABASE=jainai

# Azure OpenAI (Optional - add when you get the keys)
# AZURE_OPENAI_API_KEY=your_key_here
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
# AZURE_OPENAI_API_VERSION=2024-02-15-preview

# ElevenLabs (Optional)
# ELEVENLABS_API_KEY=your_key_here
`;

  const envPath = path.join(__dirname, '../.env.local');
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ .env.local file created!');
  console.log('⚠️  Remember: This file contains secrets and is in .gitignore\n');
  
  rl.close();
}

setup().catch(console.error);

