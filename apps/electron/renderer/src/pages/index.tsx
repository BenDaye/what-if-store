import { NextPageWithLayout } from '@/pages/_app';
import { Box, Link, Typography } from '@mui/material';

const Page: NextPageWithLayout = () => {
  return (
    <Box>
      <Typography
        variant="h4"
        paragraph
      >{`You wouldn't see this page normally.`}</Typography>
      <Typography variant="h4" paragraph>
        {`The redirects function was not executed.`}
      </Typography>
      <Link
        href="https://nextjs.org/docs/pages/api-reference/next-config-js/redirects"
        target="_blank"
      >
        Check This
      </Link>
    </Box>
  );
};

export default Page;
