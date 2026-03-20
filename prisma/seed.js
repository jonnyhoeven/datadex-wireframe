const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.catalogMetadata.deleteMany();
  await prisma.rinDataset.deleteMany();

  // Seed Metadata
  await prisma.catalogMetadata.createMany({
    data: [
      {
        name: 'location_id',
        title: 'Locatie ID',
        type: 'Integer',
        description: 'Unieke identifier voor elke locatie',
        unit: '-'
      },
      {
        name: 'rin_score',
        title: 'RIN Score',
        type: 'Integer',
        description: 'Totale Risico Index Natuurbranden score voor de locatie',
        unit: '-'
      }
    ]
  });

  // Seed some RIN data
  await prisma.rinDataset.createMany({
    data: [
      {
        location_id: 101,
        rin_score: 8,
        theme: 'Natuurbrandrisico',
        source: 'Geonovation',
        classification: 'Openbaar',
        user_scope: 'admin'
      },
      {
        location_id: 102,
        rin_score: 5,
        theme: 'Natuurbrandrisico',
        source: 'Nexpri',
        classification: 'Beperkt',
        user_scope: 'user1'
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
