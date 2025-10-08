import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const getThread = async (threadId: string) => {
  const response = await axios.get(`${API_URL}/threads/${threadId}`)
  return response.data
}

export const getThreadResources = async (threadId: string) => {
  const response = await axios.get(`${API_URL}/threads/${threadId}/resources`)
  return response.data
}

export default {
  getThread,
  getThreadResources,
}
