import { FaTh, FaCommentAlt, FaPencilAlt, FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Report",
    icon: <FaPencilAlt />,
    path: "/add-report",
  },
  {
    title: "Account",
    icon: <FaUser />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Admin",
    icon: <FaGear />,
    isAdmin: true, // Only accessible to admins
    childrens: [
      {
        title: "Users",
        path: "/users",
      },
      {
        title: "Stores",
        path: "/stores",
      },
      {
        title: "Sales",
        path: "/sales-list",
      },
    ],
  },
  {
    title: "Help",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
