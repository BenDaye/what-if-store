import { allFakers, faker } from '@faker-js/faker';
import {
  ApplicationCategory,
  ApplicationPlatform,
  ApplicationStatus,
  AuthRole,
  AuthorType,
  Prisma,
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
          nickname: faker.internet.userName(),
          bio: faker.person.bio(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
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
          nickname: faker.internet.userName(),
          bio: faker.person.bio(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
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
          nickname: faker.internet.userName(),
          bio: faker.person.bio(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
        },
      },
      Author: {
        create: {
          name: faker.person.fullName(),
          type: AuthorType.IndependentDeveloper,
          AuthorProfile: {
            create: {
              bio: faker.person.bio(),
              avatar: faker.image.avatar(),
              email: faker.internet.email(),
              website: faker.internet.url(),
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

  for await (const category of getRandomApplicationCategories()) {
    const data: Prisma.ApplicationUncheckedCreateInput = {
      name: faker.commerce.productName(),
      category,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      authorId: genesisAuthor.Author?.id!,
      platforms: getRandomApplicationPlatforms(),
      countries: getRandomApplicationCountries(),
      ageRating: getRandomApplicationAgeRating(),
      ApplicationInformation: {
        create: {
          description: faker.commerce.productDescription(),
          website: faker.internet.url(),
          logo: faker.image.urlLoremFlickr({ width: 128, height: 128 }),
          screenshots: Array.from({ length: 5 }, () =>
            faker.image.urlLoremFlickr({ width: 800, height: 600 }),
          ),
          compatibility: getRandomApplicationPlatforms(),
          languages: getRandomApplicationLanguages(),
          copyright: faker.lorem.lines(1),
          privacyPolicy: faker.lorem.paragraphs(),
          termsOfUse: faker.lorem.paragraphs(),
          github: faker.internet.url(),
        },
      },
      VersionHistories: {
        create: {
          version: faker.system.semver(),
          releaseDate: faker.date.soon(),
          changelog: faker.commerce.productDescription(),
          latest: Math.floor(Math.random() * 10) > 5,
          deprecated: Math.floor(Math.random() * 10) > 5,
          preview: Math.floor(Math.random() * 10) > 5,
        },
      },
      price: faker.number.float({ min: 0, max: 100, multipleOf: 2 }),
      status: getRandomApplicationStatus(),
    };

    const genesisApplication = await prisma.application.create({
      data,
    });
    console.log({ genesisApplication });
  }
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

const getRandomApplicationPlatforms = (): ApplicationPlatform[] => {
  const _values = Object.values(ApplicationPlatform);
  const _start = Math.floor(Math.random() * _values.length);
  const _end =
    _start + Math.floor(Math.random() * (_values.length - _start)) + 1;
  return _values.slice(_start, _end);
};

const getRandomApplicationCategories = (): ApplicationCategory[] => {
  const _values = Object.values(ApplicationCategory);
  const _start = Math.floor(Math.random() * _values.length);
  const _end =
    _start + Math.floor(Math.random() * (_values.length - _start)) + 1;
  return _values.slice(_start, _end);
};

const getRandomApplicationStatus = (): ApplicationStatus => {
  const _platforms = Object.values(ApplicationStatus);
  const _random = Math.floor(Math.random() * _platforms.length);
  return _platforms[_random];
};

const getRandomApplicationCountries = (): string[] => {
  const _length = Math.floor(Math.random() * 10);
  return Array.from({ length: _length }, () => 1).map(() =>
    faker.location.country(),
  );
};

const getRandomApplicationAgeRating = (): string => {
  return faker.number.int({ min: 3, max: 18 }) + '+';
};

const getRandomApplicationLanguages = (): string[] => {
  const _values = Object.keys(allFakers);
  const _start = Math.floor(Math.random() * _values.length);
  const _end =
    _start + Math.floor(Math.random() * (_values.length - _start)) + 1;
  return _values.slice(_start, _end);
};
