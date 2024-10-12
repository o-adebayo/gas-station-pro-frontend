import {
  FaThumbsUp,
  FaGlobe,
  FaCloud,
  FaChartPie,
  FaDatabase,
  FaFileExport,
} from "react-icons/fa";

// Logo Images
const logos = [
  require("../assets/LogoBanner/logo1.png"),
  require("../assets/LogoBanner/logo2.png"),
  require("../assets/LogoBanner/logo3.png"),
  require("../assets/LogoBanner/logo4.png"),
  require("../assets/LogoBanner/logo4.png"),
  require("../assets/LogoBanner/logo1.png"),
  require("../assets/LogoBanner/logo2.png"),
  require("../assets/LogoBanner/logo3.png"),
];

const features = [
  {
    gridArea: "tl",
    icon: <FaThumbsUp size={25} color="#048c80" />, // Using React Icon
    heading: "Cross-Platform Accessibility",
    description: `Whether you're on your desktop, tablet, or smartphone, 
                      GasStationPro is accessible across all devices. Work seamlessly 
                      on the go and never miss a beat.`,
  },
  {
    gridArea: "tr",
    icon: <FaGlobe size={25} color="#048c80" />, // Using React Icon
    heading: "Email Notification",
    description: `Stay informed with instant email alerts whenever a store manager uploads a daily sales report or when an admin makes updates, ensuring everyone is always up to date.`,
  },
  {
    gridArea: "bl",
    icon: <FaCloud size={25} color="#048c80" />, // Using React Icon
    heading: "Secure Cloud Storage",
    description: `Rest easy knowing that your sales data are securely stored in the cloud. 
                      Access your information from any device, anytime, without worrying about 
                      losing important data.`,
  },
  {
    gridArea: "blm",
    icon: <FaChartPie size={25} color="#048c80" />, // Using React Icon
    heading: "Data Insights",
    description: `Gain valuable insights into daily sales across all your stores and locations, empowering you to make informed decisions and optimize business strategies in real time.`,
  },
  {
    gridArea: "brm",
    icon: <FaDatabase size={25} color="#048c80" />, // Using React Icon
    heading: "Disaster Recovery",
    description: `Our robust disaster recovery system guarantees secure retrieval of your data, even in the event of accidental deletion.`,
  },
  {
    gridArea: "br",
    icon: <FaFileExport size={25} color="#048c80" />, // Using React Icon
    heading: "Data Exports",
    description: `Easily and securely export your data for seamless integration with external tools, enabling deeper analysis and insights.`,
  },
];

const pricingData = [
  {
    darkMode: false,
    plan: "Gold Plan",
    planIcon: require("../assets/pricing/individual-plan.png"), // Using PNG image
    planPrice: 99.99,
    bullets: [
      "Save and Upload Daily Sales",
      "1 Admin and 5 Managers",
      "5GB cloud storage",
      "Basic integrations",
    ],
    CallToAction: "Start Free Trial",
  },
  {
    darkMode: true,
    plan: "Platinum Plan",
    planIcon: require("../assets/pricing/team-plan.png"), // Using PNG image
    planPrice: 129.99,
    bullets: [
      "Everything in the Gold Plan",
      "Unlimited cloud storage",
      "5 Admins and 15 Managers",
      "Team management and permissions",
      "Data Exports",
    ],
    CallToAction: "Start Free Trial",
  },
  {
    darkMode: false,
    plan: "Enterprise Plan",
    planIcon: require("../assets/pricing/enterprise-plan.png"), // Using PNG image
    bullets: [
      "Everything in the Platinum Plan",
      "Dedicated account manager",
      "Unlimited Users",
      "Enterprise-grade security",
      "Customized onboarding",
      "Advanced analytics",
    ],
    CallToAction: "Contact support",
  },
];

const faqItems = [
  {
    id: 1,
    question: "What is GasStationPro?",
    answerHeading: "How do I get started with GasStationPro?",
    answer: `Getting started with GasStationPro is easy! Simply visit
               our website, sign up for a free trial, and start exploring 
               the features. Our intuitive interface and comprehensive onboarding 
               materials will guide you through the process.`,
  },
  {
    id: 2,
    question: "What are the key features of GasStationPro?",
    answerHeading: "What can I do with Gas Station Pro?",
    answer: `Gas Station Pro enables seamless management of your daily sales reports with secure cloud storage. It also allows you to add and manage multiple admins and store managers, assigning specific roles and stores to each, ensuring streamlined operations across your stations.`,
  },
  {
    id: 3,
    question: "How much does GasStationPro cost?",
    answerHeading: "What are the pricing options for Gas Station Pro?",
    answer: `Gas Station Pro offers flexible pricing to meet your business needs. The Gold Plan is priced at $99.99 per month, while the Platinum Plan is available for $129.99 per month. For larger businesses, our Enterprise Plan is customized based on your requirements—contact our sales team for more details. Getting started is easy! Simply sign up for a free trial on our website and explore all the features with our intuitive onboarding process.`,
  },
  {
    id: 4,
    question: "Who is GasStationPro for?",
    answerHeading: "Who can benefit from Gas Station Pro?",
    answer: `Gas Station Pro is designed for gas station owners and managers who want to streamline daily operations, track sales, and manage multiple locations effortlessly. Whether you're managing a single station or a network of stores, Gas Station Pro provides the tools you need to run your business efficiently. To get started, visit our website, sign up for a free trial, and explore the features with our easy-to-follow onboarding process.`,
  },
  {
    id: 5,
    question: "Can I manage multiple gas stations with Gas Station Pro?",
    answerHeading: "Does Gas Station Pro support multiple locations?",
    answer: `Yes, Gas Station Pro is built to manage multiple locations seamlessly. You can assign different managers to each station, track sales data across all locations, and get consolidated reports, all in one easy-to-use platform.`,
  },
  {
    id: 6,
    question: "Is my data secure with Gas Station Pro?",
    answerHeading: "How does Gas Station Pro ensure data security?",
    answer: `Absolutely. Gas Station Pro uses secure cloud storage and follows industry-standard encryption protocols to protect your data. Whether it's daily sales reports or user access logs, your data is stored safely and is accessible only by authorized personnel.`,
  },
  {
    id: 7,
    question: "Can I customize the features in Gas Station Pro?",
    answerHeading: "Does Gas Station Pro offer customization options?",
    answer: `Yes, Gas Station Pro offers a variety of customizable features. You can personalize user roles, manage store assignments, and adjust settings based on your specific operational needs, ensuring that the platform fits seamlessly with your business processes.`,
  },
  {
    id: 8,
    question: "Does Gas Station Pro offer real-time updates?",
    answerHeading: "How quickly does Gas Station Pro update sales data?",
    answer: `Yes, Gas Station Pro provides real-time updates. All sales data, reports, and user activity are synced to the cloud instantly, so you always have the latest information at your fingertips, no matter where you are.`,
  },
  {
    id: 9,
    question: "Is there customer support available?",
    answerHeading: "What kind of support does Gas Station Pro provide?",
    answer: `Yes, we offer comprehensive customer support through various channels. Whether you have questions about the features, need help troubleshooting, or require assistance with onboarding, our support team is available via email, chat, or phone to assist you.`,
  },
];

export { logos, features, pricingData, faqItems };
