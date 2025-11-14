import { CosmosClient, Database, Container } from '@azure/cosmos';

if (!process.env.AZURE_COSMOS_ENDPOINT || !process.env.AZURE_COSMOS_KEY) {
  throw new Error('Azure Cosmos DB credentials not configured');
}

const client = new CosmosClient({
  endpoint: process.env.AZURE_COSMOS_ENDPOINT,
  key: process.env.AZURE_COSMOS_KEY,
});

const databaseId = process.env.AZURE_COSMOS_DATABASE || 'jainai';

export async function getDatabase(): Promise<Database> {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  return database;
}

export async function getContainer(containerId: string): Promise<Container> {
  const database = await getDatabase();
  const { container } = await database.containers.createIfNotExists({ id: containerId });
  return container;
}

export interface Quote {
  id: string;
  quote: string;
  author?: string;
  source: string;
  category: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  url: string;
  category?: string;
  scrapedAt?: string;
  createdAt: string;
}

export async function getRandomQuote(): Promise<Quote | null> {
  const container = await getContainer('quotes');
  
  const querySpec = {
    query: 'SELECT * FROM c',
  };
  
  const { resources } = await container.items.query(querySpec).fetchAll();
  
  if (resources.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * resources.length);
  return resources[randomIndex] as Quote;
}

export async function getAllQuotes(): Promise<Quote[]> {
  const container = await getContainer('quotes');
  
  const querySpec = {
    query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
  };
  
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources as Quote[];
}

export async function getArticles(limit: number = 10): Promise<Article[]> {
  const container = await getContainer('articles');
  
  const querySpec = {
    query: 'SELECT TOP @limit * FROM c ORDER BY c.createdAt DESC',
    parameters: [{ name: '@limit', value: limit }],
  };
  
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources as Article[];
}

export { client };

