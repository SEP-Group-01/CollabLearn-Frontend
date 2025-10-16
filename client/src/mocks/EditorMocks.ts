import type { CollaborativeUser, DocumentData, Operation } from '../types/EditorInterfaces';

 // Current user (this would come from your auth system)
export const currentUser: CollaborativeUser = {
    id: 'current-user-id',
    name: 'You',
    avatar: 'YU',
    color: 'bg-purple-500',
    isActive: true,
  };

  // Mock documents data
export const sharedDocuments: DocumentData[] = [
    {
      id: 'doc-1',
      title: 'Project Proposal 2024',
      lastEdited: '2 hours ago',
      preview: 'This document outlines our strategic initiatives...',
      isActive: false,
    },
    {
      id: 'doc-2',
      title: 'Team Meeting Notes',
      lastEdited: '1 day ago',
      preview: 'Weekly sync discussion points and action items...',
      isActive: true,
    },
    {
      id: 'doc-3',
      title: 'Product Roadmap',
      lastEdited: '3 days ago',
      preview: 'Q1-Q4 feature development timeline...',
      isActive: false,
    },
  ];

  // Font options
export const fontOptions = ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Courier New', 'Comic Sans MS'];
export const fontSizeOptions = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  // Predefined color palettes with better organization
export const textColors = [
    // Basic colors
    '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F3F7', '#FFFFFF',
    // Primary colors  
    '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
    // Light shades
    '#F7C6CE', '#FFE6CC', '#FFEAA7', '#DFF2BF', '#BDE6FF', '#BDB4FE', '#C6A4C6', '#FFCCC9',
    // Medium shades
    '#E06B6B', '#DD8500', '#B8860B', '#2E8B57', '#4682B4', '#6A5ACD', '#9370DB', '#DA70D6',
    // Dark shades
    '#8B0000', '#B22222', '#DC143C', '#C71585', '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'
  ];

export const highlightColors = [
    // Popular highlight colors
    '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500', '#FF69B4', '#98FB98', '#87CEEB',
    // Light highlights  
    '#FFE4B5', '#F0E68C', '#E0FFFF', '#F5DEB3', '#FFB6C1', '#D3D3D3', '#FAFAFA', '#FFFFFF',
    // Pastel highlights
    '#FFCCCB', '#FFE4E1', '#F0F8FF', '#F5F5DC', '#FDF5E6', '#F0FFF0', '#FFF8DC', '#FFFACD',
    // Soft highlights
    '#E6E6FA', '#FFF0F5', '#F8F8FF', '#FFFAF0', '#F5FFFA', '#F0FFFF', '#F0FFFF', '#FFFFF0'
  ];