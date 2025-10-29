const { getRedisClient } = require('../config/redisClient');
const config = require('../config/env');

const buildShortUrl = (shortKey) => {
    if (!config.baseShortUrl) {
      return undefined;
    }
  
    const normalizedBase = config.baseShortUrl.endsWith('/')
      ? config.baseShortUrl.slice(0, -1)
      : config.baseShortUrl;
  
    return `${normalizedBase}/${shortKey}`;
};

const resolveShortUrl = async (shortKey, trackAccess = true) => {
    const client = await getRedisClient();
    
    const urlData = await client.get(shortKey);
    
    if (!urlData) {
      return null;
    }
    
    try {
      const urlObject = JSON.parse(urlData);
      
      return {
        ...urlObject,
        shortKey,
        shortUrl: buildShortUrl(shortKey)
      };
    } catch (error) {
      console.error('[resolveService:resolveShortUrl] Error parsing URL data:', error);
      return null;
    }
};

module.exports={resolveShortUrl}