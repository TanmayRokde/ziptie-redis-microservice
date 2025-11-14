const { createClient } = require('redis');
const { Redis: UpstashRedis } = require('@upstash/redis');
const config = require('./env');

let client;
let isUpstashClient = false;

const canUseUpstash = () =>
  Boolean(config.upstash && config.upstash.restUrl && config.upstash.restToken);

const createUpstashClient = () => {
  const upstash = new UpstashRedis({
    url: config.upstash.restUrl,
    token: config.upstash.restToken
  });

  return {
    exists: (...args) => upstash.exists(...args),
    set: (key, value, options = {}) => {
      const upstashOptions = {};

      if (options.EX) {
        upstashOptions.ex = options.EX;
      }

      return upstash.set(key, value, upstashOptions);
    },
    ping: (...args) => upstash.ping(...args),
    quit: async () => {},
    disconnect: async () => {}
  };
};

const getRedisClient = async () => {
  if (!client) {
    if (canUseUpstash()) {
      client = createUpstashClient();
      isUpstashClient = true;
      console.log('[redis] using Upstash REST client');
      return client;
    }

    client = createClient(config.redis);

    client.on('error', (error) => {
      console.error('[redis:error]', error);
    });

    await client.connect();
    console.log('[redis] connected');
  }

  return client;
};

const closeRedisClient = async () => {
  if (client) {
    if (isUpstashClient) {
      await client.quit();
      await client.disconnect();
    } else {
      await client.quit();
    }

    client = null;
    isUpstashClient = false;
  }
};

module.exports = {
  getRedisClient,
  closeRedisClient
};
