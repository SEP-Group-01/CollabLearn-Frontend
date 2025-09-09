export interface Document {
  id: number
  title: string
  description: string
  fileName: string
  fileType: "pdf"
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  pages?: number
  tags: string[]
  views: number
  isSelected: boolean
}

export interface ChatMessage {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
  selectedDocuments?: number[]
  references?: Array<{
    documentId: number
    documentTitle: string
    page?: number
    section: string
    text: string
  }>
  isLoading?: boolean
}