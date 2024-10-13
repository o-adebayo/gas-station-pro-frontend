import React, { useState } from "react";
import Card from "../../components/card/Card";
import "./Contact.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../services/authService";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [issueType, setIssueType] = useState("");

  const data = {
    subject,
    message,
    issueType,
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!issueType) {
      toast.error("Please select an issue type.");
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/api/contactus`, data);
      setSubject("");
      setMessage("");
      setIssueType("");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="contact">
      <Card cardClass="card">
        {" "}
        {/* Card outside the form */}
        <form onSubmit={sendEmail}>
          <label>Issue Type</label>
          <select
            name="issueType"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          >
            <option value="">Select Issue Type</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Billing Issue">Billing Issue</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Other">Other</option>
          </select>

          <label>Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <label>Message</label>
          <textarea
            cols="30"
            rows="10"
            name="message"
            placeholder="Message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button type="submit" className="text-large navigation__cta">
            Send Message
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Contact;
