import {
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from '@mui/material';

export type IconButtonWithTooltipProps = {
  title: string;
  icon: React.ReactElement;
  onClick: () => void;
  active: boolean;
  IconButtonProps?: IconButtonProps;
  TooltipProps?: TooltipProps;
};

export const IconButtonWithTooltip = (props: IconButtonWithTooltipProps) => {
  return (
    <Tooltip
      title={props.title}
      placement="right"
      arrow
      {...props.TooltipProps}
    >
      <IconButton
        color={props.active ? 'primary' : 'default'}
        onClick={props.onClick}
        {...props.IconButtonProps}
      >
        {props.icon}
      </IconButton>
    </Tooltip>
  );
};
