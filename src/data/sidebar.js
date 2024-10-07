import {
  FaTh,
  FaRegChartBar,
  FaCommentAlt,
  FaUserCog,
  FaGasPump,
  FaPencilAlt,
} from "react-icons/fa";

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
    icon: <FaUserCog />,
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
    icon: <FaGasPump />,
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
    ],
  },
  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
