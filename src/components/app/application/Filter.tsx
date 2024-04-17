import { CollapseList, SecondaryDrawerRnd } from '@/components/common';
import { AgeRating } from '@/constants/age_rating';
import {
  APP_PRIMARY_DRAWER_WIDTH,
  APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  APP_SECONDARY_DRAWER_WIDTH,
  APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
} from '@/constants/drawer';
import { ApplicationListInputSchema } from '@/server/schemas';
import { OverridesDrawerProps, OverridesListProps } from '@/types/overrides';
import { getLocaleStringList } from '@/utils/getLocaleList';
import {
  AppBar,
  Box,
  Checkbox,
  Drawer,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { ApplicationCategory, ApplicationPlatform } from '@prisma/client';
import countries from 'countries-list/minimal/countries.2to3.min.json';
import { useTranslation } from 'next-i18next';
import { useLocalStorage } from 'usehooks-ts';

type ApplicationFilterProps = OverridesDrawerProps &
  OverridesListProps & {
    input?: Omit<
      ApplicationListInputSchema,
      'limit' | 'skip' | 'cursor' | 'status'
    >;
    setInput?: (
      input: Omit<
        ApplicationListInputSchema,
        'limit' | 'skip' | 'cursor' | 'status'
      >,
    ) => void;
  };
export const ApplicationFilter = ({
  overrides,
  input = {
    category: Object.values(ApplicationCategory),
    platforms: Object.values(ApplicationPlatform),
    locales: [],
  },
  setInput = () => null,
}: ApplicationFilterProps) => {
  const [primaryDrawerWidth] = useLocalStorage<number>(
    APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_PRIMARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  const [secondaryDrawerWidth] = useLocalStorage<number>(
    APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_SECONDARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  return (
    <Box sx={{ position: 'fixed', left: 0, top: 0 }}>
      <SecondaryDrawerRnd />
      <Drawer
        open
        sx={{
          [`& .MuiDrawer-paper`]: {
            height: '100vh',
            width: secondaryDrawerWidth,
            boxSizing: 'border-box',
            left: primaryDrawerWidth,
          },
        }}
        transitionDuration={0}
        {...overrides?.DrawerProps}
      >
        <AppBar color="inherit">
          <Toolbar
            sx={{ flexShrink: 0, gap: 1, px: 2 }}
            variant="dense"
            disableGutters
          >
            <Typography variant="subtitle2">Application Filter</Typography>
          </Toolbar>
        </AppBar>

        <List
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            overflow: 'hidden',
          }}
          dense
          disablePadding
          {...overrides?.ListProps}
        >
          <ApplicationCategoryFilter input={input} setInput={setInput} />
          <ApplicationPlatformFilter input={input} setInput={setInput} />
          <ApplicationLocalesFilter input={input} setInput={setInput} />
          <ApplicationCountriesFilter input={input} setInput={setInput} />
          <ApplicationAgeRatingFilter input={input} setInput={setInput} />
        </List>
      </Drawer>
    </Box>
  );
};

export const ApplicationCategoryFilter = ({
  input = {
    category: Object.values(ApplicationCategory),
    platforms: Object.values(ApplicationPlatform),
    locales: [],
    countries: [],
    ageRating: undefined,
  },
  setInput = () => null,
}: Pick<ApplicationFilterProps, 'input' | 'setInput'>) => {
  const { t } = useTranslation();
  const handleSelect = (category: ApplicationCategory) => {
    const currentIndex = selected.indexOf(category);
    const newSelected = [...selected];
    if (currentIndex === -1) {
      newSelected.push(category);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setInput({ ...input, category: newSelected });
  };

  const selected = input?.category ?? Object.values(ApplicationCategory);

  return (
    <CollapseList
      localStorageKey={`app-application-category-filter`}
      primaryText={t('application:Category._')}
      secondaryText={`${selected.length}`}
      defaultExpandMore={true}
    >
      {Object.values(ApplicationCategory).map((item) => (
        <ListItemButton key={item} onClick={() => handleSelect(item)} dense>
          <ListItemText primary={t(`application:Category.Name.${item}`)} />
          <ListItemSecondaryAction>
            <Checkbox
              size="small"
              edge="end"
              checked={selected.indexOf(item) > -1}
              disableRipple
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </CollapseList>
  );
};

export const ApplicationPlatformFilter = ({
  input = {
    category: Object.values(ApplicationCategory),
    platforms: Object.values(ApplicationPlatform),
    locales: [],
    countries: [],
    ageRating: undefined,
  },
  setInput = () => null,
}: Pick<ApplicationFilterProps, 'input' | 'setInput'>) => {
  const { t } = useTranslation();
  const handleSelect = (platforms: ApplicationPlatform) => {
    const currentIndex = selected.indexOf(platforms);
    const newSelected = [...selected];
    if (currentIndex === -1) {
      newSelected.push(platforms);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setInput({ ...input, platforms: newSelected });
  };

  const selected = input?.platforms ?? Object.values(ApplicationPlatform);

  return (
    <CollapseList
      localStorageKey={`app-application-platforms-filter`}
      primaryText={t('application:Platform.Platforms')}
      secondaryText={`${selected.length}`}
      defaultExpandMore={true}
    >
      {Object.values(ApplicationPlatform).map((item) => (
        <ListItemButton key={item} onClick={() => handleSelect(item)} dense>
          <ListItemText primary={item} />
          <ListItemSecondaryAction>
            <Checkbox
              size="small"
              edge="end"
              checked={selected.indexOf(item) > -1}
              disableRipple
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </CollapseList>
  );
};

export const ApplicationLocalesFilter = ({
  input = {
    category: Object.values(ApplicationCategory),
    platforms: Object.values(ApplicationPlatform),
    locales: [],
    countries: [],
    ageRating: undefined,
  },
  setInput = () => null,
}: Pick<ApplicationFilterProps, 'input' | 'setInput'>) => {
  const { t } = useTranslation();
  const handleSelect = (locale: string) => {
    const currentIndex = selected.indexOf(locale);
    const newSelected = [...selected];
    if (currentIndex === -1) {
      newSelected.push(locale);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setInput({ ...input, locales: newSelected });
  };

  const selected = input?.locales ?? getLocaleStringList();

  return (
    <CollapseList
      localStorageKey={`app-application-locales-filter`}
      primaryText={t('application:Locales.Locales')}
      secondaryText={`${selected.length}`}
      defaultExpandMore={false}
    >
      {getLocaleStringList().map((item) => (
        <ListItemButton key={item} onClick={() => handleSelect(item)} dense>
          <ListItemText primary={item} />
          <ListItemSecondaryAction>
            <Checkbox
              size="small"
              edge="end"
              checked={selected.indexOf(item) > -1}
              disableRipple
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </CollapseList>
  );
};

export const ApplicationCountriesFilter = ({
  input = {
    category: Object.values(ApplicationCategory),
    platforms: Object.values(ApplicationPlatform),
    locales: [],
    countries: [],
    ageRating: undefined,
  },
  setInput = () => null,
}: Pick<ApplicationFilterProps, 'input' | 'setInput'>) => {
  const { t } = useTranslation();
  const handleSelect = (country: string) => {
    const currentIndex = selected.indexOf(country);
    const newSelected = [...selected];
    if (currentIndex === -1) {
      newSelected.push(country);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setInput({ ...input, countries: newSelected });
  };

  const selected = input?.countries ?? Object.keys(countries);

  return (
    <CollapseList
      localStorageKey={`app-application-countries-filter`}
      primaryText={t('application:Countries.Countries')}
      secondaryText={`${selected.length}`}
      defaultExpandMore={false}
    >
      {Object.keys(countries).map((item) => (
        <ListItemButton key={item} onClick={() => handleSelect(item)} dense>
          <ListItemText primary={item} />
          <ListItemSecondaryAction>
            <Checkbox
              size="small"
              edge="end"
              checked={selected.indexOf(item) > -1}
              disableRipple
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </CollapseList>
  );
};

export const ApplicationAgeRatingFilter = ({
  input = {
    category: Object.values(ApplicationCategory),
    platforms: Object.values(ApplicationPlatform),
    locales: [],
    countries: [],
    ageRating: undefined,
  },
  setInput = () => null,
}: Pick<ApplicationFilterProps, 'input' | 'setInput'>) => {
  const { t } = useTranslation();
  const handleSelect = (ageRating: string) => {
    setInput({
      ...input,
      ageRating: ageRating === input.ageRating ? undefined : ageRating,
    });
  };

  const selected = input?.ageRating;

  return (
    <CollapseList
      localStorageKey={`app-application-age_rating-filter`}
      primaryText={t('application:AgeRating.AgeRating')}
      secondaryText={selected ? '1' : '0'}
      defaultExpandMore={false}
    >
      {Object.values(AgeRating).map((item) => (
        <ListItemButton key={item} onClick={() => handleSelect(item)} dense>
          <ListItemText primary={item} />
          <ListItemSecondaryAction>
            <Checkbox
              size="small"
              edge="end"
              checked={selected === item}
              disableRipple
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </CollapseList>
  );
};
