import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderNew from "../../components/HeaderNew";

const Calendar = () => {
  const theme = useTheme();
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setCurrentEvents(savedEvents);
  }, []);

  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setOpenAddDialog(true);
  };

  const handleAddEvent = () => {
    if (newEventTitle) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectedDate.dateStr}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.startStr,
        end: selectedDate.endStr,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      const updatedEvents = [...currentEvents, newEvent];
      setCurrentEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));

      setOpenAddDialog(false);
      setNewEventTitle("");
    }
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    const updatedEvents = currentEvents.filter(
      (event) => event.id !== selectedEvent.id
    );
    setCurrentEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    selectedEvent.remove();
    setOpenDeleteDialog(false);
    setSelectedEvent(null);
  };

  return (
    <Box m="20px">
      <HeaderNew title="Calendar" subtitle="Enter Fuel delivery days" />

      <Box display="flex" justifyContent="space-between">
        <Box
          flex="1 1 20%"
          backgroundColor={theme.palette.background.alt}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: theme.palette.success.main,
                  margin: "10px 0",
                  borderRadius: "2px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    setSelectedEvent(event);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={currentEvents}
            select={handleDateClick}
            eventClick={handleEventClick}
          />
        </Box>
      </Box>

      {/* Add Event Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} color="primary" variant="contained">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the event '{selectedEvent?.title}'?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
