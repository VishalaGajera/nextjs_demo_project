import { AppBar, UserProfileMenu } from "@codezee/sixtify-brahma";
import { Close, Logout, Menu } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useApplicationContext } from "../../app/context/ApplicationContext";
import { useDialogActions } from "../../hooks/useDialogActions";
import type { DialogRenderer } from "../../types/dialogs";
import type { DrawerMenuItemsKeys } from "../Drawer/hooks/useDrawerMenuItems";
import { drawerMenuItems } from "../Drawer/hooks/useDrawerMenuItems";
import AddDraftEmployeeDialog from "../EmployeeManagement/Employee/AddEmployee/AddDraftEmployeeDialog";

export const Header = ({
  isDrawerOpen = false,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}) => {
  const currentPathname = usePathname();

  const theme = useTheme();

  const { red } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { isOpenAddEditEmployeePage } = useApplicationContext();

  const dialogRenderer: DialogRenderer = {
    saveAsDraft: (
      <AddDraftEmployeeDialog
        open
        onDialogClose={onDialogClose}
        onSuccess={() => {
          signOut();
        }}
      />
    ),
  };

  const { data } = useSession();

  const onClick = () => {
    if (isOpenAddEditEmployeePage) {
      onDialogOpen("saveAsDraft");
    } else {
      signOut();
    }
  };

  const menulist = [
    {
      key: "signOut",
      label: "Sign Out",
      icon: <Logout fontSize="small" />,
      sx: {
        color: `${red[700]}`,
      },
      onClick: () => onClick(),
    },
  ];

  const menuKey = (
    currentPathname?.split("/")?.[1] ? currentPathname.split("/")[1] : "home"
  ) as DrawerMenuItemsKeys;

  const headerTitleItems: Record<DrawerMenuItemsKeys, string> = drawerMenuItems;

  return (
    <>
      <AppBar drawerOpen={isDrawerOpen}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Stack gap="24px" direction="row" alignItems="center">
            <IconButton
              color="primary"
              aria-label="open drawer"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              edge="start"
            >
              {isDrawerOpen ? <Close /> : <Menu />}
            </IconButton>

            <Typography variant="h6" color="primary">
              {menuKey && headerTitleItems[menuKey]}
            </Typography>
          </Stack>

          <UserProfileMenu
            userDetails={{
              name: data?.user.name ?? "",
              email: data?.user.email ?? "",
              avatar: data?.user.avatar ?? "",
            }}
            menuItems={menulist}
          />
        </Stack>
      </AppBar>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
