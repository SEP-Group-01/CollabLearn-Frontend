import type { Quiz, Question } from '../types/QuizInterfaces'


// Mock data - this would come from an API
  export const userRole = 'moderator' // 'student', 'moderator', 'admin'
  export const workspaceName = 'Advanced Web Development'
  export const threadName = 'React & TypeScript Fundamentals'

  export const quizzes: Quiz[] = [
    {
      id: '1',
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React components, hooks, and state management including useState, useEffect, and component lifecycle',
      timeAllocated: 45,
      totalMarks: 50,
      tags: ['React', 'JavaScript', 'Hooks'],
      resourceTags: ['Lecture 1: React Basics', 'Lecture 2: Hooks Deep Dive', 'Tutorial: Component State'],
      creator: 'Dr. Sarah Johnson',
      totalAttempts: 127,
      averageMarks: 38.5,
      averageTime: 32,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 42, timeTaken: 28, completed: true, date: '2025-08-10' },
        { attemptNumber: 2, marksObtained: 46, timeTaken: 35, completed: true, date: '2025-08-11' }
      ]
    },
    {
      id: '2',
      title: 'TypeScript Advanced Concepts',
      description: 'Advanced TypeScript features including generics, decorators, type manipulation, and advanced patterns for large-scale applications',
      timeAllocated: 60,
      totalMarks: 75,
      tags: ['TypeScript', 'Advanced', 'Generics'],
      resourceTags: ['Lecture 5: TypeScript Generics', 'Lecture 6: Advanced Types', 'Workshop: Type System'],
      creator: 'Prof. Michael Chen',
      totalAttempts: 89,
      averageMarks: 52.3,
      averageTime: 48
    },
    {
      id: '3',
      title: 'Material-UI Components',
      description: 'Understanding Material-UI component library, theming system, customization patterns, and responsive design principles',
      timeAllocated: 30,
      totalMarks: 40,
      tags: ['Material-UI', 'CSS', 'React'],
      resourceTags: ['Lecture 8: UI Libraries', 'Tutorial: Material-UI Setup', 'Practice: Theme Customization'],
      creator: 'Dr. Emma Williams',
      totalAttempts: 156,
      averageMarks: 32.1,
      averageTime: 22,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 35, timeTaken: 25, completed: true, date: '2025-08-09' }
      ]
    },
    {
      id: '4',
      title: 'State Management with Redux',
      description: 'Redux fundamentals, actions, reducers, middleware, and best practices for managing complex application state',
      timeAllocated: 90,
      totalMarks: 100,
      tags: ['Redux', 'State Management', 'JavaScript'],
      resourceTags: ['Lecture 10: Redux Basics', 'Lecture 11: Middleware', 'Assignment: Redux Store'],
      creator: 'Dr. Alex Rodriguez',
      totalAttempts: 73,
      averageMarks: 68.7,
      averageTime: 72
    },
    {
      id: '5',
      title: 'API Integration & HTTP Requests',
      description: 'Learn to integrate APIs using fetch, axios, and handle asynchronous operations in React applications',
      timeAllocated: 60,
      totalMarks: 80,
      tags: ['API', 'HTTP', 'Async', 'React'],
      resourceTags: ['Lecture 12: REST APIs', 'Tutorial: Axios Setup', 'Practice: API Integration'],
      creator: 'Prof. Sarah Johnson',
      totalAttempts: 142,
      averageMarks: 61.2,
      averageTime: 52,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 58, timeTaken: 45, completed: true, date: '2025-08-12' }
      ]
    },
    {
      id: '6',
      title: 'React Router & Navigation',
      description: 'Implementing client-side routing, navigation guards, and dynamic route parameters in React applications',
      timeAllocated: 45,
      totalMarks: 60,
      tags: ['React Router', 'Navigation', 'SPA'],
      resourceTags: ['Lecture 13: React Router', 'Workshop: Navigation Setup', 'Assignment: Multi-page App'],
      creator: 'Dr. Emma Williams',
      totalAttempts: 98,
      averageMarks: 48.5,
      averageTime: 38
    },
    {
      id: '7',
      title: 'Testing React Components',
      description: 'Unit testing, integration testing, and end-to-end testing strategies for React applications using Jest and Testing Library',
      timeAllocated: 75,
      totalMarks: 90,
      tags: ['Testing', 'Jest', 'React Testing Library'],
      resourceTags: ['Lecture 14: Testing Basics', 'Lecture 15: Advanced Testing', 'Lab: Test Suite Setup'],
      creator: 'Prof. Michael Chen',
      totalAttempts: 67,
      averageMarks: 71.3,
      averageTime: 63,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 78, timeTaken: 58, completed: true, date: '2025-08-13' },
        { attemptNumber: 2, marksObtained: 82, timeTaken: 65, completed: true, date: '2025-08-14' }
      ]
    },
    {
      id: '8',
      title: 'Performance Optimization',
      description: 'React performance optimization techniques including memoization, code splitting, and bundle optimization strategies',
      timeAllocated: 90,
      totalMarks: 100,
      tags: ['Performance', 'Optimization', 'React', 'Webpack'],
      resourceTags: ['Lecture 16: React Performance', 'Tutorial: Code Splitting', 'Workshop: Bundle Analysis'],
      creator: 'Dr. Alex Rodriguez',
      totalAttempts: 54,
      averageMarks: 74.8,
      averageTime: 78
    },
    {
      id: '9',
      title: 'Advanced TypeScript Patterns',
      description: 'Deep dive into advanced TypeScript patterns, utility types, conditional types, and type-level programming',
      timeAllocated: 120,
      totalMarks: 150,
      tags: ['TypeScript', 'Advanced Patterns', 'Utility Types'],
      resourceTags: ['Lecture 17: Advanced TS', 'Lecture 18: Type Magic', 'Project: Type System Design'],
      creator: 'Prof. Sarah Johnson',
      totalAttempts: 39,
      averageMarks: 98.7,
      averageTime: 102
    },
    {
      id: '10',
      title: 'React Hooks Deep Dive',
      description: 'Comprehensive exploration of React hooks including custom hooks, useReducer, useContext, and advanced hook patterns',
      timeAllocated: 75,
      totalMarks: 85,
      tags: ['React Hooks', 'Custom Hooks', 'useContext', 'useReducer'],
      resourceTags: ['Lecture 19: Hook Patterns', 'Tutorial: Custom Hooks', 'Practice: Hook Library'],
      creator: 'Dr. Emma Williams',
      totalAttempts: 156,
      averageMarks: 66.4,
      averageTime: 58,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 72, timeTaken: 61, completed: true, date: '2025-08-15' }
      ]
    }
  ]
  
// Mock data for resources
export const mockResources = [
    { id: '1', title: 'React Fundamentals', type: 'Document' },
    { id: '2', title: 'Advanced JavaScript', type: 'Video' },
    { id: '3', title: 'State Management', type: 'Article' },
    { id: '4', title: 'Component Design Patterns', type: 'Tutorial' },
    { id: '5', title: 'Testing React Applications', type: 'Guide' }
];

export const quizName = 'Sample Quiz Title';
export const mockQuestions: Question[] = [
	{
		id: 'q1',
		questionText: 'Which of the following are React hooks?',
		image: null,
		options: [
			{ id: '1', sequenceLetter: 'A', text: 'useState', image: null, isCorrect: true },
			{ id: '2', sequenceLetter: 'B', text: 'useFetch', image: null, isCorrect: false },
			{ id: '3', sequenceLetter: 'C', text: 'useEffect', image: null, isCorrect: true },
			{ id: '4', sequenceLetter: 'D', text: 'useClass', image: null, isCorrect: false }
		],
		marks: 2,
		isEditing: false
	},
	{
		id: 'q2',
		questionText: 'What is the output of 2 + 2 in JavaScript?',
		image: null,
		options: [
			{ id: '1', sequenceLetter: 'A', text: '22', image: null, isCorrect: false },
			{ id: '2', sequenceLetter: 'B', text: '4', image: null, isCorrect: true },
			{ id: '3', sequenceLetter: 'C', text: 'undefined', image: null, isCorrect: false },
			{ id: '4', sequenceLetter: 'D', text: 'NaN', image: null, isCorrect: false }
		],
		marks: 1,
		isEditing: false
	},
	{
		id: 'q3',
		questionText: 'Select all valid CSS units.',
		image: null,
		options: [
			{ id: '1', sequenceLetter: 'A', text: 'px', image: null, isCorrect: true },
			{ id: '2', sequenceLetter: 'B', text: 'em', image: null, isCorrect: true },
			{ id: '3', sequenceLetter: 'C', text: 'pt', image: null, isCorrect: true },
			{ id: '4', sequenceLetter: 'D', text: 'xyz', image: null, isCorrect: false }
		],
		marks: 2,
		isEditing: false
	}
];

export const totalTime = 5 * 60; // 5 minutes for demo