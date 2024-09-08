import React from "react";
import {
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";

const NotificationMenu = ({ anchorEl, open, onClose, notifications, markAsRead }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "300px",
        },
      }}
    >
      <List>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <ListItem key={index} button>
              <ListItemText
                primary={notification.message}
                secondary={`Task ID: ${notification.taskId}`}
              />
              <ListItemSecondaryAction>
                <Button
                  size="small"
                  onClick={() => markAsRead(index)}
                  sx={{
                    marginRight: "10px",
                    backgroundColor: "#673AB7",
                    "&:hover": {
                      backgroundColor: "#5e35b1",
                    },
                  }}
                >
                  Mark as Read
                </Button>
                <Button
                  size="small"
                  onClick={onClose}
                  sx={{
                    backgroundColor: "gray",
                    "&:hover": {
                      backgroundColor: "darkgray",
                    },
                  }}
                >
                  Cancel
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </List>
    </Menu>
  );
};

export default NotificationMenu;
