const path = require('path');
const fastify = require('fastify')({
  logger: true
});

// Load environment variables
require('dotenv').config();

// Plugins
fastify.register(require('./plugins/prisma'));
fastify.register(require('./plugins/auth'));
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'static'),
  prefix: '/'
});

// Proxy route for MapProxy
if (process.env.MAPPROXY_URL) {
  fastify.register(require('@fastify/http-proxy'), {
    upstream: process.env.MAPPROXY_URL,
    prefix: '/proxy/mapproxy',
    replyOptions: {
      queryString: (request, query) => {
        return { ...query, user_scope: request.user };
      }
    }
  });
}

// Proxy route for GeoServer
if (process.env.GEOSERVER_URL) {
  fastify.register(require('@fastify/http-proxy'), {
    upstream: process.env.GEOSERVER_URL,
    prefix: '/proxy/geoserver',
    replyOptions: {
      queryString: (request, query) => {
        return { ...query, user_scope: request.user };
      }
    }
  });
}

// Routes
fastify.register(require('./routes/catalog'));

// Default route to serve index.html (fallback for SPA if needed, but here explicit)
fastify.get('/', (request, reply) => {
  reply.sendFile('index.html');
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ 
      port: process.env.PORT || 3000, 
      host: process.env.HOST || '0.0.0.0' 
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
