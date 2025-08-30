import type { Workspace, Thread } from "../types/WorkspaceInterfaces";
import course_1 from "../assets/course_1.png";
import course_2 from "../assets/course_2.png";
import course_3 from "../assets/course_3.png";
import course_4 from "../assets/course_4.png";
import { mockThreads } from "../mocks/Workspace";

export const mockWorkspaces: Workspace[] = [
  {
    id: 1,
    title: "Web Design",
    category: "Design",
    image: course_1,
    lightColor: "#E0F2FE",
    darkColor: "#0369A1",
    members: 120,
    studyHours: 20, // <-- Add this line
    description: "Learn web design from basics to advanced topics.",
    requiresApproval: false,
    isMember: false,
    isPending: false,
    isAdmin: false,
  },
  {
    id: 2,
    title: "Web Development",
    category: "Development",
    image: course_2,
    lightColor: "#F0F9FF",
    darkColor: "#0284C7",
    members: 95,
    studyHours: 25, // <-- Add this line
    description: "Master web development skills and frameworks.",
    requiresApproval: true,
    isMember: false,
    isPending: false,
    isAdmin: false,
  },
  {
    id: 3,
    title: "Digital Marketing",
    category: "Marketing",
    image: course_3,
    lightColor: "#EFF6FF",
    darkColor: "#1D4ED8",
    members: 80,
    studyHours: 15, // <-- Add this line
    description: "Explore digital marketing strategies and tools.",
    requiresApproval: false,
    isMember: false,
    isPending: false,
    isAdmin: false,
  },
  {
    id: 4,
    title: "App Design",
    category: "Design",
    image: course_4,
    lightColor: "#DBEAFE",
    darkColor: "#1E40AF",
    members: 60,
    studyHours: 30, // <-- Add this line
    description: "Design modern and user-friendly mobile apps.",
    requiresApproval: true,
    isMember: false,
    isPending: false,
    isAdmin: false,
  },
];

export const mockThreads: Thread[] = [
  {
    id: 1,
    title: "Getting Started with HTML & CSS",
    description: "Basics of HTML structure and CSS styling for web design.",
    resources: 8,
    sessions: 2,
    enrolled: false,
  },
  {
    id: 2,
    title: "Responsive Design Principles",
    description: "Learn how to make your websites look great on any device.",
    resources: 6,
    sessions: 2,
    enrolled: false,
  },
  {
    id: 3,
    title: "UI/UX Fundamentals",
    description: "Understand user experience and interface design best practices.",
    resources: 10,
    sessions: 3,
    enrolled: false,
  },
];