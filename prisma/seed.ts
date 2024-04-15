import {
  PermanentPresetGroupNames,
  PersistentPresetGroupNames,
} from '@/constants/group';
import { faker } from '@faker-js/faker';
import {
  ApplicationAssetType,
  ApplicationCategory,
  ApplicationGroupType,
  ApplicationPlatform,
  ApplicationStatus,
  AuthRole,
  Prisma,
  PrismaClient,
  ProviderType,
} from '@prisma/client';
import { hash } from 'argon2';
import countries from 'countries-list/minimal/countries.2to3.min.json';
import { getLocaleStringList } from '../src/utils/getLocaleList';

const prisma = new PrismaClient();

const main = async () => {
  const genesisAdmin = await prisma.user.upsert({
    where: { username: 'Laugh-nimbly-exotica-ascribe' },
    update: {},
    create: {
      username: 'Laugh-nimbly-exotica-ascribe',
      password: await hash('hc@s9A-*w%~Q3Ub243aq'),
      role: AuthRole.Admin,
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
      role: AuthRole.User,
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

  const genesisProvider = await prisma.user.upsert({
    where: { username: 'Posse-mistress-monte-hidden' },
    update: {},
    create: {
      username: 'Posse-mistress-monte-hidden',
      password: await hash('hc@s9A-*w%~Q3Ub243aq'),
      role: AuthRole.Provider,
      UserProfile: {
        create: {
          nickname: faker.internet.userName(),
          bio: faker.person.bio(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
        },
      },
      ProviderProfile: {
        create: {
          name: faker.person.fullName(),
          type: ProviderType.IndependentDeveloper,
          bio: faker.person.bio(),
          avatar: faker.image.avatar(),
          email: faker.internet.email(),
          website: faker.internet.url(),
        },
      },
    },
  });

  console.log({ genesisProvider });

  for await (const category of getRandomApplicationCategories()) {
    const data: Prisma.ApplicationUncheckedCreateInput = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category,
      price: faker.number.float({ min: 0, max: 100, multipleOf: 2 }),
      status: getRandomApplicationStatus(),

      providerId: genesisProvider.id,

      Information: {
        create: {
          platforms: getRandomApplicationPlatforms(),
          compatibility: getRandomApplicationPlatforms().map((platform) => ({
            platform,
            requirement: platform,
          })),
          ageRating: getRandomApplicationAgeRating(),
          countries: getRandomApplicationCountries(),
          locales: getRandomApplicationLanguages(),
          website: faker.internet.url(),
          github: faker.internet.url(),
        },
      },
      VersionHistories: {
        create: {
          version: faker.system.semver(),
          releaseDate: faker.date.soon(),
          changelog: faker.commerce.productDescription(),
          latest: true,
          deprecated: Math.floor(Math.random() * 10) > 5,
          preview: Math.floor(Math.random() * 10) > 5,
        },
      },
      Assets: {
        createMany: {
          skipDuplicates: true,
          data: [
            {
              type: ApplicationAssetType.Icon,
              url: faker.image.urlLoremFlickr({ width: 128, height: 128 }),
              isPrimary: true,
              isLocal: false,
            },
            {
              type: ApplicationAssetType.Banner,
              url: faker.image.urlLoremFlickr({ width: 1280, height: 360 }),
              isPrimary: true,
              isLocal: false,
            },
            {
              type: ApplicationAssetType.Background,
              url: faker.image.urlLoremFlickr({ width: 480, height: 480 }),
              isPrimary: true,
              isLocal: false,
            },
            {
              type: ApplicationAssetType.Screenshot,
              url: faker.image.urlLoremFlickr({ width: 1280, height: 720 }),
              isPrimary: false,
              isLocal: false,
            },
            {
              type: ApplicationAssetType.Screenshot,
              url: faker.image.urlLoremFlickr({ width: 1280, height: 720 }),
              isPrimary: false,
              isLocal: false,
            },
            {
              type: ApplicationAssetType.Screenshot,
              url: faker.image.urlLoremFlickr({ width: 1280, height: 720 }),
              isPrimary: false,
              isLocal: false,
            },
            {
              type: ApplicationAssetType.Screenshot,
              url: faker.image.urlLoremFlickr({ width: 1280, height: 720 }),
              isPrimary: false,
              isLocal: false,
            },
            {
              type: ApplicationAssetType.Screenshot,
              url: faker.image.urlLoremFlickr({ width: 1280, height: 720 }),
              isPrimary: false,
              isLocal: false,
            },
          ],
        },
      },
    };

    try {
      const genesisApplication = await prisma.application.create({
        data,
      });
      console.log({ genesisApplication });
    } catch (e) {
      console.error(e);
      continue;
    }
  }

  const genesisTags = await prisma.applicationTag.createMany({
    skipDuplicates: true,
    data: Array.from({
      length: Math.floor(Math.random() * 100),
    }).map(() => ({ name: faker.commerce.productMaterial() })),
  });

  console.log({ genesisTags });

  for await (const name of Object.values(PermanentPresetGroupNames)) {
    try {
      const group = await prisma.applicationGroup.upsert({
        where: {
          name,
        },
        create: {
          name,
          description: name,
          type: ApplicationGroupType.Permanent,
        },
        update: {
          type: ApplicationGroupType.Permanent,
        },
      });
      console.log({ group });
    } catch (error) {
      console.error(error);
      continue;
    }
  }

  for await (const name of Object.values(PersistentPresetGroupNames)) {
    try {
      const group = await prisma.applicationGroup.upsert({
        where: {
          name,
        },
        create: {
          name,
          description: name,
          type: ApplicationGroupType.Persistent,
        },
        update: {
          type: ApplicationGroupType.Persistent,
        },
      });
      console.log({ group });
    } catch (error) {
      console.error(error);
      continue;
    }
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
  const _values = Object.keys(countries);
  const _start = Math.floor(Math.random() * _values.length);
  const _end =
    _start + Math.floor(Math.random() * (_values.length - _start)) + 1;
  return _values.slice(_start, _end);
};

const getRandomApplicationAgeRating = (): string => {
  return faker.number.int({ min: 3, max: 18 }) + '+';
};

const getRandomApplicationLanguages = (): string[] => {
  const _values = getLocaleStringList();
  const _start = Math.floor(Math.random() * _values.length);
  const _end =
    _start + Math.floor(Math.random() * (_values.length - _start)) + 1;
  return _values.slice(_start, _end);
};
