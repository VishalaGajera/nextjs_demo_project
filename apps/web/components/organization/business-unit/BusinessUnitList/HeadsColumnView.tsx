import { Avatar, Stack, Tooltip, Typography } from "@mui/material";

type Head = {
  employee_id: string | number;
  employee_name: string;
  avatar?: string;
};

type HeadsColumnViewProps<T extends Head> = {
  headsData: T[];
};

const HeadsColumnView = <T extends Head>({
  headsData,
}: HeadsColumnViewProps<T>) => {
  const [firstHead, ...remainingHeads] = headsData;

  return (
    <Tooltip
      title={
        remainingHeads.length > 0 && (
          <Stack direction="column" padding="5px" gap="5px">
            {remainingHeads.map((head) => (
              <Stack
                key={head.employee_id}
                flexDirection="row"
                gap="5px"
                alignItems="center"
              >
                <Avatar
                  sx={{ height: "30px", width: "30px" }}
                  src={head.avatar ?? ""}
                />
                <Typography variant="body2">{head.employee_name}</Typography>
              </Stack>
            ))}
          </Stack>
        )
      }
    >
      <Stack flexDirection="row" gap="5px" alignItems="center">
        <Avatar
          sx={{ height: "30px", width: "30px" }}
          src={firstHead?.avatar ?? ""}
        />
        <Typography variant="body2">
          {remainingHeads.length > 0
            ? `${firstHead?.employee_name} +${remainingHeads.length} more`
            : firstHead?.employee_name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default HeadsColumnView;
