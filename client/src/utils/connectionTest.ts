// Connection Test Utility for Backend API
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ConnectionTestResult {
  endpoint: string;
  status: 'success' | 'error';
  statusCode?: number;
  message: string;
  responseTime?: number;
}

export class ConnectionTester {
  private static async testEndpoint(endpoint: string, method: 'GET' | 'POST' = 'GET'): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    
    try {
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
        // For POST requests, send minimal valid data
        ...(method === 'POST' && {
          data: {}
        })
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint,
        status: 'success',
        statusCode: response.status,
        message: `✅ Connected successfully`,
        responseTime
      };
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            endpoint,
            status: 'error',
            statusCode: error.response.status,
            message: `❌ Server responded with ${error.response.status}: ${error.response.statusText}`,
            responseTime
          };
        } else if (error.request) {
          return {
            endpoint,
            status: 'error',
            message: '❌ No response from server - Check if backend is running',
            responseTime
          };
        }
      }
      
      return {
        endpoint,
        status: 'error',
        message: `❌ Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime
      };
    }
  }

  public static async testAllEndpoints(): Promise<ConnectionTestResult[]> {
    console.log('🔍 Testing Backend Connection...');
    console.log(`🌐 API URL: ${API_URL}`);
    
    const testEndpoints = [
      { path: '/api/auth/health', method: 'GET' as const },
      { path: '/api/workspaces', method: 'GET' as const },
      { path: '/api/forum/health', method: 'GET' as const },
      // Test a specific workspace/thread (you'll need to replace with real IDs)
      { path: '/api/workspaces/1/threads/1/documents', method: 'GET' as const },
      { path: '/api/workspaces/1/threads/1/videos', method: 'GET' as const },
      { path: '/api/workspaces/1/threads/1/links', method: 'GET' as const },
    ];
    
    const results: ConnectionTestResult[] = [];
    
    for (const { path, method } of testEndpoints) {
      const result = await this.testEndpoint(path, method);
      results.push(result);
      console.log(`${result.status === 'success' ? '✅' : '❌'} ${path}: ${result.message} (${result.responseTime}ms)`);
    }
    
    return results;
  }

  public static async testResourceUpload(workspaceId: string, threadId: string): Promise<ConnectionTestResult> {
    console.log('🔍 Testing Resource Upload Endpoints...');
    
    // Create a test file for upload testing
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('user_id', 'test-user');
    formData.append('title', 'Test Document');
    formData.append('description', 'Test upload');
    
    return this.testEndpoint(`/api/workspaces/${workspaceId}/threads/${threadId}/documents`, 'POST');
  }

  public static async quickHealthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/api/auth/health`, { timeout: 3000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Export a simple function for quick testing
export const testBackendConnection = async (): Promise<void> => {
  const results = await ConnectionTester.testAllEndpoints();
  
  const successCount = results.filter(r => r.status === 'success').length;
  const totalCount = results.length;
  
  console.log('\n📊 Connection Test Summary:');
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('🎉 All endpoints are working! Backend is ready.');
  } else {
    console.log('⚠️ Some endpoints failed. Check your backend configuration.');
  }
};
