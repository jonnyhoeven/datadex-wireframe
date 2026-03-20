async function catalogRoutes(fastify, opts) {
  // GET route to fetch catalog metadata from Postgres
  fastify.get('/api/metadata', async (request, reply) => {
    try {
      const metadata = await fastify.prisma.catalogMetadata.findMany();
      return metadata;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch metadata' });
    }
  });

  // GET route for RIN dataset (demo purpose)
  fastify.get('/api/rin-dataset', async (request, reply) => {
    const user = request.user;
    try {
      const dataset = await fastify.prisma.rinDataset.findMany({
        where: {
          OR: [
            { user_scope: user },
            { user_scope: null }
          ]
        }
      });
      return dataset;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch dataset' });
    }
  });
}

module.exports = catalogRoutes;
