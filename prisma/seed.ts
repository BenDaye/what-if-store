import {
  ApplicationCategory,
  AuthRole,
  AuthorType,
  PrismaClient,
} from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

const main = async () => {
  const genesisAdmin = await prisma.user.upsert({
    where: { username: 'Laugh-nimbly-exotica-ascribe' },
    update: {},
    create: {
      username: 'Laugh-nimbly-exotica-ascribe',
      password: await hash('hc@s9A-*w%~Q3Ub243aq'),
      role: AuthRole.ADMIN,
      UserProfile: {
        create: {
          nickname: 'Genesis Admin',
        },
      },
    },
  });

  console.log({ genesisAdmin });

  const genesisUser = await prisma.user.upsert({
    where: { username: 'Unformed-deadwood-jaundice-sage' },
    update: {},
    create: {
      username: 'Unformed-deadwood-jaundice-sage',
      password: await hash('hc@s9A-*w%~Q3Ub243aq'),
      role: AuthRole.USER,
      UserProfile: {
        create: {
          nickname: 'Genesis User',
        },
      },
    },
  });

  console.log({ genesisUser });

  const genesisAuthor = await prisma.user.upsert({
    where: { username: 'Posse-mistress-monte-hidden' },
    update: {},
    create: {
      username: 'Posse-mistress-monte-hidden',
      password: await hash('hc@s9A-*w%~Q3Ub243aq'),
      role: AuthRole.AUTHOR,
      UserProfile: {
        create: {
          nickname: 'Genesis Author',
        },
      },
      Author: {
        create: {
          name: 'Genesis Author',
          type: AuthorType.IndependentDeveloper,
          AuthorProfile: {
            create: {
              bio: 'Genesis Author Bio',
            },
          },
        },
      },
    },
    include: {
      Author: true,
    },
  });

  console.log({ genesisAuthor });

  const genesisApplication = await prisma.application.upsert({
    where: {
      name: 'Genesis Application',
      authorId: genesisAuthor.Author?.id,
    },
    update: {},
    create: {
      name: 'Genesis Application',
      category: ApplicationCategory.HealthFitness,
      ageRating: '3+',
      author: {
        connect: {
          id: genesisAuthor.Author?.id,
        },
      },
      ApplicationInformation: {
        create: {
          description: 'Genesis Application Description',
          compatibility: {},
        },
      },
    },
  });

  console.log({ genesisApplication });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
