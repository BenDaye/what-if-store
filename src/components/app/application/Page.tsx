import { useAppApplication } from '@/hooks';
import { Avatar, Card, CardHeader } from '@mui/material';

type ApplicationPageProps = {
  applicationId: string;
};
export const ApplicationPage = ({ applicationId }: ApplicationPageProps) => {
  const { data: application } = useAppApplication(applicationId);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar src={application.primaryIcon?.url}>
            {application.primaryIconText}
          </Avatar>
        }
        title={application.name}
        subheader={application.description}
      ></CardHeader>
    </Card>
  );
};
