import { ApplicationListInputSchema } from '@/server/schemas';
import { OverridesProps } from '@/types/overrides';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  IconButton,
  InputBase,
  InputBaseProps,
  alpha,
  styled,
} from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white,
    0.15,
  ),
  '&:hover': {
    backgroundColor: alpha(
      theme.palette.mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
      0.25,
    ),
  },
  transition: theme.transitions.create('background-color'),
  marginLeft: 0,
  width: '100%',
  flexGrow: 1,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  height: 36,
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

type SearchTextFieldProps = InputBaseProps;
export const SearchTextField = (props: SearchTextFieldProps) => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        {...props}
      />
    </Search>
  );
};

export const SearchInput = ({
  overrides,
  input,
  setInput,
}: OverridesProps<{ InputBaseProps?: InputBaseProps }> & {
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
}) => {
  return (
    <Search>
      <InputBase
        value={input?.query ?? ''}
        onChange={(e) =>
          setInput?.({ ...input, query: e.target.value.trimStart() })
        }
        fullWidth
        autoFocus
        placeholder="Search…"
        size="small"
        startAdornment={
          <IconButton size="small" edge="start" disableRipple disabled>
            <SearchIcon fontSize="small" />
          </IconButton>
        }
        endAdornment={
          Boolean(input?.query) ? (
            <IconButton
              size="small"
              edge="end"
              disableRipple
              onClick={() => setInput?.({ ...input, query: undefined })}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : null
        }
        {...overrides?.InputBaseProps}
      />
    </Search>
  );
};
