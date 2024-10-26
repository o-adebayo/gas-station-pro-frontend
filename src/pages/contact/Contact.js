import React from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../services/authService";

const Contact = () => {
  // Yup validation schema for form validation
  const validationSchema = yup.object().shape({
    issueType: yup.string().required("Please select an issue type."),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
  });

  // Function to handle form submission
  const sendEmail = async (values, { resetForm }) => {
    const data = {
      subject: values.subject,
      message: values.message,
      issueType: values.issueType,
    };

    try {
      const response = await axios.post(`${BACKEND_URL}/api/contactus`, data);
      resetForm(); // Reset the form on success
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box m="20px">
      <Card>
        <Typography variant="h4" mb={2}>
          Contact Us
        </Typography>

        <Formik
          initialValues={{
            subject: "",
            message: "",
            issueType: "",
          }}
          validationSchema={validationSchema}
          onSubmit={sendEmail}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* Issue Type Dropdown */}
              <TextField
                fullWidth
                select
                label="Issue Type"
                name="issueType"
                value={values.issueType}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.issueType && Boolean(errors.issueType)}
                helperText={touched.issueType && errors.issueType}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Select Issue Type</MenuItem>
                <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                <MenuItem value="Billing Issue">Billing Issue</MenuItem>
                <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              {/* Subject Input */}
              <TextField
                fullWidth
                variant="filled"
                label="Subject"
                name="subject"
                value={values.subject}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.subject && Boolean(errors.subject)}
                helperText={touched.subject && errors.subject}
                sx={{ mb: 2 }}
              />

              {/* Message Input */}
              <TextField
                fullWidth
                variant="filled"
                label="Message"
                name="message"
                multiline
                rows={4}
                value={values.message}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                sx={{ mb: 2 }}
              />

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button type="submit" color="primary" variant="contained">
                  Send Message
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};

export default Contact;
