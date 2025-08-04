"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  List,
  ListOrdered,
  Code,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Highlighter,
  ImageIcon,
  Undo,
  Redo,
  Moon,
  Sun,
  FileText,
  Users,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { Button, buttonVariants} from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

// Mock data for collaborators
const collaborators = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32&text=AJ",
    color: "bg-blue-500",
    isActive: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=32&width=32&text=BS",
    color: "bg-green-500",
    isActive: true,
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=32&width=32&text=CD",
    color: "bg-purple-500",
    isActive: false,
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=32&width=32&text=DW",
    color: "bg-orange-500",
    isActive: true,
  },
]

// Mock data for shared documents
const sharedDocuments = [
  {
    id: 1,
    title: "Project Proposal 2024",
    lastEdited: "2 hours ago",
    preview: "This document outlines our strategic initiatives...",
    isActive: false,
  },
  {
    id: 2,
    title: "Team Meeting Notes",
    lastEdited: "1 day ago",
    preview: "Weekly sync discussion points and action items...",
    isActive: true,
  },
  {
    id: 3,
    title: "Product Roadmap",
    lastEdited: "3 days ago",
    preview: "Q1-Q4 feature development timeline...",
    isActive: false,
  },
  {
    id: 4,
    title: "Design System Guidelines",
    lastEdited: "1 week ago",
    preview: "Brand colors, typography, and component specs...",
    isActive: false,
  },
]

const highlightColors = [
  { name: "Yellow", class: "bg-yellow-200 dark:bg-yellow-800" },
  { name: "Green", class: "bg-green-200 dark:bg-green-800" },
  { name: "Pink", class: "bg-pink-200 dark:bg-pink-800" },
  { name: "Blue", class: "bg-blue-200 dark:bg-blue-800" },
  { name: "Purple", class: "bg-purple-200 dark:bg-purple-800" },
]

const CollaborativeEditor = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeDocument, setActiveDocument] = useState("Team Meeting Notes")
  const [editorContent, setEditorContent] = useState(`
    <h1>Team Meeting Notes - January 2024</h1>
    <p>Welcome to our weekly team sync. Here are the key discussion points and action items from today's meeting.</p>
    
    <h2>Agenda Items</h2>
    <ul>
      <li>Project status updates</li>
      <li>Resource allocation review</li>
      <li>Upcoming deadlines</li>
    </ul>
    
    <blockquote>
      "Great teams are built on trust, communication, and shared goals." - Team Lead
    </blockquote>
    
    <p>Let's continue collaborating effectively to achieve our objectives.</p>
  `)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  
  }
  const ToolbarButton = ({
    icon: Icon,
    tooltip,
    isActive = false,
    onClick = () => {},
  }: {
    icon: React.ElementType
    tooltip: string
    isActive?: boolean
    onClick?: () => void
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={isActive ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={onClick}>
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <TooltipProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          {/* Top Navigation Bar */}
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{activeDocument}</h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* User Presence Area */}
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div className="flex -space-x-2">
                    {collaborators.map((user) => (
                      <Tooltip key={user.id}>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-900">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback className={`text-white text-xs ${user.color}`}>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {user.isActive && (
                              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900"></div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {user.name} {user.isActive ? "(Active)" : "(Away)"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 p-0">
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Formatting Toolbar */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {/* Text Formatting */}
              <div className="flex items-center space-x-1">
                <ToolbarButton icon={Bold} tooltip="Bold (Ctrl+B)" />
                <ToolbarButton icon={Italic} tooltip="Italic (Ctrl+I)" />
                <ToolbarButton icon={Underline} tooltip="Underline (Ctrl+U)" />
                <ToolbarButton icon={Strikethrough} tooltip="Strikethrough" />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Script */}
              <div className="flex items-center space-x-1">
                <ToolbarButton icon={Subscript} tooltip="Subscript" />
                <ToolbarButton icon={Superscript} tooltip="Superscript" />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Headings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Heading1 className="h-4 w-4 mr-1" />
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Heading1 className="h-4 w-4 mr-2" />
                    Heading 1
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heading2 className="h-4 w-4 mr-2" />
                    Heading 2
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heading3 className="h-4 w-4 mr-2" />
                    Heading 3
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heading4 className="h-4 w-4 mr-2" />
                    Heading 4
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heading5 className="h-4 w-4 mr-2" />
                    Heading 5
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heading6 className="h-4 w-4 mr-2" />
                    Heading 6
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="h-6" />

              {/* Block Elements */}
              <div className="flex items-center space-x-1">
                <ToolbarButton icon={Quote} tooltip="Blockquote" />
                <ToolbarButton icon={List} tooltip="Bullet List" />
                <ToolbarButton icon={ListOrdered} tooltip="Numbered List" />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Code */}
              <div className="flex items-center space-x-1">
                <ToolbarButton icon={Code} tooltip="Inline Code" />
                <ToolbarButton icon={Code2} tooltip="Code Block" />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Alignment */}
              <div className="flex items-center space-x-1">
                <ToolbarButton icon={AlignLeft} tooltip="Align Left" />
                <ToolbarButton icon={AlignCenter} tooltip="Align Center" />
                <ToolbarButton icon={AlignRight} tooltip="Align Right" />
                <ToolbarButton icon={AlignJustify} tooltip="Justify" />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Insert Elements */}
              <div className="flex items-center space-x-1">
                <ToolbarButton icon={Link} tooltip="Insert Link" />

                {/* Highlight Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Highlighter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {highlightColors.map((color) => (
                      <DropdownMenuItem key={color.name}>
                        <div className={`w-4 h-4 rounded mr-2 ${color.class}`}></div>
                        {color.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <ToolbarButton icon={ImageIcon} tooltip="Insert Image" />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* History */}
              <div className="flex items-center space-x-1">
                <ToolbarButton icon={Undo} tooltip="Undo (Ctrl+Z)" />
                <ToolbarButton icon={Redo} tooltip="Redo (Ctrl+Y)" />
              </div>
            </div>
          </div>

          <div className="flex flex-1">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Editor Area with Collaborative Cursors */}
                  <div className="relative">
                    <div
                      className="min-h-[600px] p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200"
                      contentEditable
                      suppressContentEditableWarning={true}
                      dangerouslySetInnerHTML={{ __html: editorContent }}
                      style={{
                        outline: "none",
                        lineHeight: "1.6",
                        fontSize: "16px",
                        color: isDarkMode ? "#f3f4f6" : "#1f2937",
                      }}
                    />

                    {/* Collaborative Cursors */}
                    <div className="absolute top-20 left-40 pointer-events-none">
                      <div className="flex items-center">
                        <div className="w-0.5 h-5 bg-blue-500 animate-pulse"></div>
                        <Badge variant="secondary" className="ml-1 text-xs bg-blue-500 text-white">
                          Alice
                        </Badge>
                      </div>
                    </div>

                    <div className="absolute top-32 left-60 pointer-events-none">
                      <div className="flex items-center">
                        <div className="w-0.5 h-5 bg-green-500 animate-pulse"></div>
                        <Badge variant="secondary" className="ml-1 text-xs bg-green-500 text-white">
                          Bob
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Shared Documents */}
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Shared Documents</h3>
                <div className="space-y-2">
                  {sharedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                        doc.isActive
                          ? "bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                          : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                      }`}
                      onClick={() => setActiveDocument(doc.title)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{doc.preview}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{doc.lastEdited}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default CollaborativeEditor