const fp = require('fastify-plugin');

async function authPlugin(fastify, opts) {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request, reply) => {
    // Extract user from X-Forwarded-User header (passed by OAuth2 Proxy)
    const user = request.headers['x-forwarded-user'];
    request.user = user || 'anonymous';
  });
}

module.exports = fp(authPlugin);
