import type { Workspace, Thread } from "../types/WorkspaceInterfaces";
import course_1 from "../assets/course_1.png";
import course_2 from "../assets/course_2.png";
import course_3 from "../assets/course_3.png";
import course_4 from "../assets/course_4.png";
// import { mockThreads } from "../mocks/Workspace";

export const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    title: "Web Design",
    image_url: course_1,
    description: "Learn web design from basics to advanced topics.",
    members_count: 120,
    join_policy: "Anyone",
    admin_ids: [],
    tags: ["Design", "Web", "UI/UX"],
    created_at: "2025-09-29T14:08:09.993396+00:00",
    updated_at: "2025-09-29T14:08:09.993396+00:00",
    role: "user",
  },
  {
    id: "2",
    title: "Web Development",
    image_url: course_2,
    description: "Master web development skills and frameworks.",
    members_count: 95,
    join_policy: "Requests",
    admin_ids: [],
    tags: ["Development", "Web", "Programming"],
    created_at: "2025-09-29T14:08:09.993396+00:00",
    updated_at: "2025-09-29T14:08:09.993396+00:00",
    role: "user",
  },
  {
    id: "3",
    title: "Digital Marketing",
    image_url: course_3,
    description: "Explore digital marketing strategies and tools.",
    members_count: 80,
    join_policy: "Anyone",
    admin_ids: [],
    tags: ["Marketing", "Digital", "Strategy"],
    created_at: "2025-09-29T14:08:09.993396+00:00",
    updated_at: "2025-09-29T14:08:09.993396+00:00",
    role: "member",
  },
  {
    id: "4",
    title: "App Design",
    image_url: course_4,
    description: "Design modern and user-friendly mobile apps.",
    members_count: 60,
    join_policy: "Invites",
    admin_ids: [],
    tags: ["Design", "Mobile", "Apps"],
    created_at: "2025-09-29T14:08:09.993396+00:00",
    updated_at: "2025-09-29T14:08:09.993396+00:00",
    role: "admin",
  },
];

export const mockThreads: Thread[] = [
  {
    id: "12e4d168-30d7-4c1f-82e4-7327959ebe40",
    workspace_id: "1",
    title: "Getting Started with HTML & CSS",
    description: "Basics of HTML structure and CSS styling for web design.",
    created_at: "2025-09-30T21:03:33.713018",
    updated_at: "2025-09-30T21:03:33.713018",
    subscriber_count: 0,
    resource_count: 8,
  },
  {
    id: "23f5e279-41e8-5d2g-93f5-8438069fcf51",
    workspace_id: "1",
    title: "Responsive Design Principles",
    description: "Learn how to make your websites look great on any device.",
    created_at: "2025-09-30T21:03:33.713018",
    updated_at: "2025-09-30T21:03:33.713018",
    subscriber_count: 1,
    resource_count: 6,
  },
  {
    id: "34g6f380-52f9-6e3h-a4g6-9549170geg62",
    workspace_id: "1",
    title: "UI/UX Fundamentals",
    description: "Understand user experience and interface design best practices.",
    created_at: "2025-09-30T21:03:33.713018",
    updated_at: "2025-09-30T21:03:33.713018",
    subscriber_count: 0,
    resource_count: 10,
  },
];