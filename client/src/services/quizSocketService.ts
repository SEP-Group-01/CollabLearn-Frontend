import { io, Socket } from 'socket.io-client';

// Remove /api suffix from API_URL for WebSocket connection
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = API_URL.replace('/api', '');

class QuizSocketService {
  private socket: Socket | null = null;
  private attemptId: string | null = null;
  private quizId: string | null = null;
  private userId: string | null = null;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      console.log('[QuizSocket] Connecting to:', `${SOCKET_URL}/quiz`);

      this.socket = io(`${SOCKET_URL}/quiz`, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('[QuizSocket] Connected successfully');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('[QuizSocket] Connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[QuizSocket] Disconnected:', reason);
      });

      this.socket.on('error', (error) => {
        console.error('[QuizSocket] Socket error:', error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      if (this.attemptId && this.userId) {
        this.leaveQuizAttempt();
      }
      this.socket.disconnect();
      this.socket = null;
      this.attemptId = null;
      this.quizId = null;
      this.userId = null;
    }
  }

  joinQuizAttempt(attemptId: string, quizId: string, userId: string) {
    if (!this.socket?.connected) {
      console.error('[QuizSocket] Cannot join - socket not connected');
      return;
    }

    this.attemptId = attemptId;
    this.quizId = quizId;
    this.userId = userId;

    console.log('[QuizSocket] Joining quiz attempt:', { attemptId, quizId, userId });

    this.socket.emit('join-quiz-attempt', {
      attemptId,
      quizId,
      userId,
    });
  }

  leaveQuizAttempt() {
    if (!this.socket?.connected || !this.attemptId || !this.userId) {
      return;
    }

    console.log('[QuizSocket] Leaving quiz attempt:', this.attemptId);

    this.socket.emit('leave-quiz-attempt', {
      attemptId: this.attemptId,
      userId: this.userId,
    });

    this.attemptId = null;
    this.quizId = null;
    this.userId = null;
  }

  submitAnswer(questionId: string, selectedOptions: string[]) {
    if (!this.socket?.connected || !this.attemptId || !this.userId) {
      console.error('[QuizSocket] Cannot submit answer - not in active attempt');
      return;
    }

    console.log('[QuizSocket] Submitting answer:', { questionId, selectedOptions });

    this.socket.emit('submit-answer', {
      attemptId: this.attemptId,
      userId: this.userId,
      questionId,
      selectedOptions,
    });
  }

  submitQuiz() {
    if (!this.socket?.connected || !this.attemptId || !this.userId) {
      console.error('[QuizSocket] Cannot submit quiz - not in active attempt');
      return;
    }

    console.log('[QuizSocket] Submitting quiz:', this.attemptId);

    this.socket.emit('submit-quiz', {
      attemptId: this.attemptId,
      userId: this.userId,
    });
  }

  onTimeUpdate(callback: (data: { attemptId: string; timeRemaining: number }) => void) {
    if (!this.socket) return;
    this.socket.on('time-update', callback);
  }

  onTimeWarning(callback: (data: { message: string; timeRemaining: number }) => void) {
    if (!this.socket) return;
    this.socket.on('time-warning', callback);
  }

  onQuizAutoSubmitted(callback: (data: { attemptId: string; message: string }) => void) {
    if (!this.socket) return;
    this.socket.on('quiz-auto-submitted', callback);
  }

  onQuizSubmitted(callback: (data: { attemptId: string; success: boolean; results?: any }) => void) {
    if (!this.socket) return;
    this.socket.on('quiz-submitted', callback);
  }

  onAnswerSubmitted(callback: (data: { attemptId: string; questionId: string; success: boolean }) => void) {
    if (!this.socket) return;
    this.socket.on('answer-submitted', callback);
  }

  onQuizAttemptJoined(callback: (data: { attemptId: string; quizId: string; userId: string }) => void) {
    if (!this.socket) return;
    this.socket.on('quiz-attempt-joined', callback);
  }

  onError(callback: (error: { message: string }) => void) {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  offTimeUpdate() {
    if (!this.socket) return;
    this.socket.off('time-update');
  }

  offTimeWarning() {
    if (!this.socket) return;
    this.socket.off('time-warning');
  }

  offQuizAutoSubmitted() {
    if (!this.socket) return;
    this.socket.off('quiz-auto-submitted');
  }

  offQuizSubmitted() {
    if (!this.socket) return;
    this.socket.off('quiz-submitted');
  }

  offAnswerSubmitted() {
    if (!this.socket) return;
    this.socket.off('answer-submitted');
  }

  offQuizAttemptJoined() {
    if (!this.socket) return;
    this.socket.off('quiz-attempt-joined');
  }

  offError() {
    if (!this.socket) return;
    this.socket.off('error');
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getCurrentAttemptId(): string | null {
    return this.attemptId;
  }
}

// Singleton instance
const quizSocketService = new QuizSocketService();

export default quizSocketService;
