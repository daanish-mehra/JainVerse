import { CosmosClient, Database, Container } from '@azure/cosmos';

function getClient(): CosmosClient | null {
  const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
  const key = process.env.AZURE_COSMOS_KEY;
  
  if (!endpoint || !key) {
    return null;
  }
  
  return new CosmosClient({ endpoint, key });
}

const client = getClient();
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'jainai';

export async function getDatabase(): Promise<Database> {
  if (!client) {
    throw new Error('Azure Cosmos DB credentials not configured');
  }
  
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  return database;
}

export async function getContainer(containerId: string): Promise<Container | null> {
  if (!client) {
    return null;
  }
  
  try {
    const database = await getDatabase();
    
    // Create container if it doesn't exist, or return existing one
    try {
      const { container } = await database.containers.createIfNotExists({
        id: containerId,
        partitionKey: { paths: ["/id"] },
      });
      return container;
    } catch (createError: any) {
      // If createIfNotExists fails, try to get existing container
      try {
        const container = database.container(containerId);
        return container;
      } catch (getError) {
        console.error(`Failed to get/create container ${containerId}:`, createError || getError);
        return null;
      }
    }
  } catch (error) {
    console.error(`Error getting container ${containerId}:`, error);
    return null;
  }
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
  try {
    const container = await getContainer('quotes');
    if (!container) return null;
    
    const querySpec = {
      query: 'SELECT * FROM c',
    };
    
    const { resources } = await container.items.query(querySpec).fetchAll();
    
    if (resources.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * resources.length);
    return resources[randomIndex] as Quote;
  } catch (error) {
    console.warn('Failed to fetch quote from Cosmos DB:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function getAllQuotes(): Promise<Quote[]> {
  try {
    const container = await getContainer('quotes');
    if (!container) return [];
    
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
    };
    
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources as Quote[];
  } catch (error) {
    console.warn('Failed to fetch quotes:', error);
    return [];
  }
}

let articlesCache: Article[] | null = null;
let articlesCacheTime: number = 0;
const ARTICLES_CACHE_DURATION = 1800000;

export async function getArticles(limit: number = 10): Promise<Article[]> {
  try {
    const now = Date.now();
    
    if (articlesCache && (now - articlesCacheTime) < ARTICLES_CACHE_DURATION) {
      return articlesCache.slice(0, limit);
    }

    const container = await getContainer('articles');
    if (!container) return [];
    
    const querySpec = {
      query: 'SELECT TOP @limit * FROM c ORDER BY c.createdAt DESC',
      parameters: [{ name: '@limit', value: Math.min(limit, 50) }],
    };
    
    const { resources } = await container.items.query(querySpec).fetchAll();
    const articles = resources as Article[];
    
    articlesCache = articles;
    articlesCacheTime = now;
    
    return articles.slice(0, limit);
  } catch (error) {
    console.warn('Failed to fetch articles:', error);
    return [];
  }
}

export { client };
export function isCosmosConfigured(): boolean {
  return client !== null;
}

