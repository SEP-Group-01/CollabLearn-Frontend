/**
 * Document Query API Service
 */
import apiClient from '../utils/apiInterceptor';

export interface QueryDocumentsRequest {
  userId: string;
  conversationId?: string;
  query: string;
  selectedDocuments: string[]; // Array of resource IDs
}

export interface Reference {
  resourceId: string;
  documentTitle: string;
  pageNumber?: number;
  relevanceScore: number;
  excerpt: string;
}

export interface QueryDocumentsResponse {
  success: boolean;
  data?: {
    response: string;
    references: Reference[];
    conversationId: string;
    messageId: string;
    userMessageId?: string;
  };
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at?: string;
  messages?: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
    references?: Reference[];
  }>;
}

/**
 * Query documents with a question
 */
export const queryDocuments = async (
  request: QueryDocumentsRequest
): Promise<QueryDocumentsResponse> => {
  try {
    const response = await apiClient.post<QueryDocumentsResponse>(
      '/query/query-documents',
      request
    );
    return response.data;
  } catch (error: any) {
    console.error('[QueryAPI] Error querying documents:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to query documents'
    };
  }
};

/**
 * Get all conversations for a user in a thread
 */
export const getConversations = async (
  userId: string,
  threadId: string
): Promise<{ success: boolean; data?: { conversations: Conversation[] }; error?: string }> => {
  try {
    const response = await apiClient.post('/query/get-conversations', {
      userId,
      threadId
    });
    return response.data;
  } catch (error: any) {
    console.error('[QueryAPI] Error getting conversations:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get conversations'
    };
  }
};

/**
 * Get all messages in a conversation
 */
export const getConversationMessages = async (
  conversationId: string
): Promise<{ success: boolean; data?: { messages: Array<{
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  references?: Reference[];
}> }; error?: string }> => {
  try {
    const response = await apiClient.post('/query/get-conversation-messages', {
      conversationId
    });
    return response.data;
  } catch (error: any) {
    console.error('[QueryAPI] Error getting conversation messages:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get conversation messages'
    };
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  userId: string,
  threadId: string,
  title: string = 'New Conversation'
): Promise<{ success: boolean; data?: { conversationId: string; title: string }; error?: string }> => {
  try {
    const response = await apiClient.post('/query/create-conversation', {
      userId,
      threadId,
      title
    });
    return response.data;
  } catch (error: any) {
    console.error('[QueryAPI] Error creating conversation:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create conversation'
    };
  }
};
