import React, { useState, useEffect, useRef } from 'react';
import {
	Box,
	Button,
	Typography,
	Card,
	CardContent,
	Checkbox,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Container,
	Chip,
	Stack,
	Alert,
	CircularProgress
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	ArrowForward as ArrowForwardIcon,
	AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SidebarComponent from '../components/SideBar';
import { getQuizById, startQuizAttempt, getActiveAttempt } from '../api/quizApi';
import { getAccessToken, getUserData } from '../api/authApi';
import quizSocketService from '../services/quizSocketService';
import type { Quiz, Question } from '../types/QuizInterfaces';

const AttemptQuiz: React.FC = () => {
	const { quizId: urlQuizId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	
	const [collapsed, setCollapsed] = useState(false);
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<{ [qid: string]: string[] }>({});
	const [timeLeft, setTimeLeft] = useState(-1); // Server-authoritative timer
	const [showFinish, setShowFinish] = useState(false);
	const [showWarn, setShowWarn] = useState(false);
	const [finished, setFinished] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [attemptId, setAttemptId] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [wsConnected, setWsConnected] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	
	// Get quiz ID from URL params or location state
	const quizId = urlQuizId || location.state?.quizId;

	// Initialize WebSocket connection and fetch quiz data
	useEffect(() => {
		const initializeQuiz = async () => {
			if (!quizId) {
				setError('No quiz ID provided');
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				
				// Get user data first
				const user = await getUserData();
				const currentUserId = user?.id;
				if (!currentUserId) {
					throw new Error('Unable to get user ID');
				}
				setUserId(currentUserId);
				console.log('[AttemptQuiz] User ID:', currentUserId);
				
				// Connect to WebSocket
				const token = getAccessToken();
				if (!token) {
					throw new Error('No authentication token available');
				}
				
				await quizSocketService.connect(token);
				console.log('[AttemptQuiz] WebSocket connected');
				setWsConnected(true);
				
				// Fetch quiz details
				console.log('[AttemptQuiz] Fetching quiz data for quizId:', quizId);
				const quizData = await getQuizById(quizId);
				console.log('[AttemptQuiz] Fetched quiz data:', quizData);
				
				setQuiz(quizData);
				
				// Transform questions (is_correct should now be excluded from backend)
				const questionsArray = (quizData as any).quiz_questions || quizData.questions || [];
				console.log('[AttemptQuiz] Questions array:', questionsArray);
				
				const transformedQuestions: Question[] = questionsArray.map((q: any, index: number) => {
					const options = (q.quiz_options || q.answer_option || q.options || []).map((opt: any, optIndex: number) => ({
						id: opt.id || `opt${optIndex}`,
						sequenceLetter: opt.sequence_letter || opt.sequenceLetter || String.fromCharCode(65 + optIndex),
						text: opt.text || opt.answer || opt.option_text || '',
						image: opt.image || opt.image_url || null,
						// is_correct should NOT be here anymore
						isCorrect: false // Default to false for security
					}));
					
					return {
						id: q.id || `q${index}`,
						questionText: q.question_text || q.text || q.question || '',
						image: q.image || q.attachment_url || null,
						options: options,
						marks: q.marks || 1,
						isEditing: false
					};
				});

				console.log('[AttemptQuiz] Final transformed questions:', transformedQuestions);
				setQuestions(transformedQuestions);
				
				// Check for active attempt or start new one
				let currentAttemptId: string;
				try {
					const activeAttempt = await getActiveAttempt(quizId);
					console.log('[AttemptQuiz] Found active attempt:', activeAttempt);
					console.log('[AttemptQuiz] Saved answers from backend:', activeAttempt.savedAnswers);
					console.log('[AttemptQuiz] Number of saved answers:', Object.keys(activeAttempt.savedAnswers || {}).length);
					currentAttemptId = activeAttempt.attemptId;
					setAttemptId(currentAttemptId);
					
					// Load saved answers if resuming
					if (activeAttempt.savedAnswers && Object.keys(activeAttempt.savedAnswers).length > 0) {
						console.log('[AttemptQuiz] Restoring saved answers:', activeAttempt.savedAnswers);
						setAnswers(activeAttempt.savedAnswers);
					} else {
						console.log('[AttemptQuiz] No saved answers to restore');
					}
				} catch (noActiveError) {
					console.log('[AttemptQuiz] No active attempt found, starting new attempt...');
					const startResult = await startQuizAttempt(quizId);
					console.log('[AttemptQuiz] Successfully started new quiz attempt:', startResult);
					currentAttemptId = startResult.attemptId;
					setAttemptId(currentAttemptId);
				}
				
				// Join quiz attempt via WebSocket (this starts the server timer)
				console.log('[AttemptQuiz] Joining quiz attempt via WebSocket:', currentAttemptId);
				await quizSocketService.joinQuizAttempt(currentAttemptId, quizId, currentUserId);
				
				// Setup WebSocket listeners
				quizSocketService.onTimeUpdate((data) => {
					console.log('[AttemptQuiz] Server time update:', data);
					// Backend sends {attemptId, timeRemaining} object
					const timeRemaining = typeof data === 'number' ? data : data.timeRemaining;
					setTimeLeft(timeRemaining);
				});
				
				quizSocketService.onTimeWarning((data) => {
					console.log('[AttemptQuiz] Time warning:', data);
					// data contains {attemptId, message, timeRemaining}
					// Optional: Show warning notification with data.message
				});
				
				quizSocketService.onQuizAutoSubmitted((data) => {
					console.log('[AttemptQuiz] Quiz auto-submitted by server:', data);
					setFinished(true);
					setSubmitting(false);
					// Navigate back to previous page (quizzes list)
					setTimeout(() => {
						navigate(-1);
					}, 2000); // Show "Quiz Submitted" message for 2 seconds
				});
				
				quizSocketService.onAnswerSubmitted((data) => {
					console.log('[AttemptQuiz] Answer saved on server:', data);
				});
				
			} catch (err) {
				console.error('[AttemptQuiz] Error initializing quiz:', err);
				setError('Failed to load quiz. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		initializeQuiz();
		
		// Cleanup on unmount
		return () => {
			if (quizSocketService.isConnected()) {
				quizSocketService.leaveQuizAttempt();
			}
			quizSocketService.disconnect();
		};
	}, [quizId]);

	// Note: Timer is now managed by the WebSocket server
	// The server sends 'time-update' events every second
	// No need for client-side setInterval anymore

	const handleOptionToggle = (qid: string, oid: string) => {
		setAnswers((prev) => {
			const prevAns = prev[qid] || [];
			let nextAns;
			if (prevAns.includes(oid)) {
				nextAns = prevAns.filter((id) => id !== oid);
			} else {
				nextAns = [...prevAns, oid];
			}
			
			// Submit answer in real-time to server
			const question = questions.find(q => q.id === qid);
			if (question && nextAns.length > 0) {
				// Convert option IDs to sequence letters for backend
				const selectedSequenceLetters = nextAns
					.map(optId => {
						const option = question.options.find(o => o.id === optId);
						return option?.sequenceLetter.toLowerCase();
					})
					.filter(Boolean) as string[];
				
				console.log('[AttemptQuiz] Submitting answer in real-time:', {
					questionId: qid,
					selectedOptions: selectedSequenceLetters
				});
				
				quizSocketService.submitAnswer(qid, selectedSequenceLetters);
			}
			
			return { ...prev, [qid]: nextAns };
		});
	};



	const handleNav = (idx: number) => {
		setCurrent(idx);
	};

	const handleNext = () => {
		setCurrent((c) => (c < questions.length - 1 ? c + 1 : c));
	};

	const handlePrev = () => {
		setCurrent((c) => (c > 0 ? c - 1 : c));
	};

	const handleFinish = () => {
		const unmarked = questions.filter((q) => !(answers[q.id] && answers[q.id].length));
		if (unmarked.length > 0) {
			setShowWarn(true);
		} else {
			setShowFinish(true);
		}
	};

	const confirmFinish = async () => {
		if (questions.length === 0 || !attemptId || !userId) {
			console.log('[AttemptQuiz] Cannot submit: missing required data');
			return;
		}

		setSubmitting(true);
		setShowFinish(false);
		setShowWarn(false);
		
		try {
			console.log('[AttemptQuiz] Submitting quiz via WebSocket...');
			
			// Submit via WebSocket - answers already saved in real-time
			await quizSocketService.submitQuiz();
			
			console.log('[AttemptQuiz] Quiz submitted successfully');
			setFinished(true);
			
			// Navigate back to previous page after showing success message
			setTimeout(() => {
				navigate(-1);
			}, 2000);
			
		} catch (error) {
			console.error('[AttemptQuiz] Error submitting quiz:', error);
			setError('Failed to submit quiz. Please try again.');
			setSubmitting(false);
		}
	};

	const formatTime = (sec: number) => {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};

	// Loading state
	if (loading || timeLeft === -1) {
		return (
			<Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
				<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				<Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<CircularProgress size={60} />
					<Typography variant="h6" sx={{ mt: 2 }}>Loading Quiz...</Typography>
				</Box>
			</Box>
		);
	}

	// Error state
	if (error) {
		return (
			<Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
				<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				<Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Card sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
						<Typography variant="h5" color="error" gutterBottom>Error</Typography>
						<Typography variant="body1" sx={{ mb: 2 }}>{error}</Typography>
						<Button variant="contained" color="primary" onClick={() => navigate(-1)}>Go Back</Button>
					</Card>
				</Box>
			</Box>
		);
	}

	// No questions available
	if (!questions.length) {
		return (
			<Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
				<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				<Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Card sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
						<Typography variant="h5" color="warning.main" gutterBottom>No Questions Available</Typography>
						<Typography variant="body1" sx={{ mb: 2 }}>This quiz doesn't have any questions.</Typography>
						<Button variant="contained" color="primary" onClick={() => navigate(-1)}>Go Back</Button>
					</Card>
				</Box>
			</Box>
		);
	}

	// Finished state
	if (finished) {
		return (
			<Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
				<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				<Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Card sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
						<Typography variant="h5" color="primary" gutterBottom>Quiz Submitted!</Typography>
						<Typography variant="body1" sx={{ mb: 2 }}>Thank you for your attempt.</Typography>
						<Button variant="contained" color="primary" onClick={() => navigate(-1)}>Back to Quizzes</Button>
					</Card>
				</Box>
			</Box>
		);
	}

	const q = questions[current];
	const selected = answers[q.id] || [];

		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
				<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				<Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', ml: collapsed ? '80px' : '250px', transition: 'margin-left 0.3s', p: 0 }}>
					{/* Main Quiz Area */}
					<Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
						{/* Quiz Title outside the card */}
						<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
							<Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>{quiz?.title || 'Quiz'}</Typography>
						</Box>
						<Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
									<Chip label={`Max Marks: ${q.marks}`} color="info" size="small" />
									<Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
										Question {current + 1} of {questions.length}
									</Typography>
								</Box>
									<Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>{q.questionText}</Typography>
									{q.image && (
										<Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
											<img 
												src={typeof q.image === 'string' ? q.image : URL.createObjectURL(q.image)} 
												alt="Question" 
												style={{ maxWidth: '100%', maxHeight: 350, borderRadius: '12px', objectFit: 'contain' }} 
											/>
										</Box>
									)}
									<Stack spacing={2} sx={{ mb: 2 }}>
										{q.options.map((opt) => (
											<Card
												key={opt.id}
												variant="outlined"
												sx={{
													borderColor: selected.includes(opt.id) ? 'primary.main' : 'divider',
													bgcolor: selected.includes(opt.id) ? 'primary.lighter' : 'background.paper',
													transition: '0.2s',
													cursor: 'pointer',
													'&:hover': { boxShadow: 3 },
													display: 'flex',
													flexDirection: 'column',
													minHeight: opt.image ? 450 : 64
												}}
												onClick={() => handleOptionToggle(q.id, opt.id)}
											>
												<CardContent sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: opt.image ? 2 : 1.5, flexGrow: 1 }}>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: opt.image ? 2 : 0 }}>
														<Checkbox checked={selected.includes(opt.id)} color="primary" />
														<Typography sx={{ flexGrow: 1 }}>{opt.sequenceLetter}. {opt.text}</Typography>
													</Box>
													{opt.image && (
														<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
															<img 
																src={typeof opt.image === 'string' ? opt.image : URL.createObjectURL(opt.image)} 
																alt={opt.sequenceLetter} 
																style={{ width: '100%', height: 'auto', maxHeight: 400, borderRadius: 8, objectFit: 'contain' }} 
															/>
														</Box>
													)}
												</CardContent>
											</Card>
										))}
									</Stack>
								<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
									<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handlePrev} disabled={current === 0}>Previous</Button>
									{current < questions.length - 1 ? (
										<Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}>Next</Button>
									) : (
										<Button 
											variant="contained" 
											color="success" 
											onClick={handleFinish}
											disabled={submitting}
										>
											{submitting ? 'Submitting...' : 'Finish Attempt'}
										</Button>
									)}
								</Stack>
							</CardContent>
						</Card>
					</Container>
					{/* Right Sidebar: Timer & Overview */}
					<Box sx={{ width: 300, bgcolor: 'background.paper', borderLeft: 1, borderColor: 'divider', p: 3, display: { xs: 'none', md: 'block' } }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
							<AccessTimeIcon color="primary" sx={{ mr: 1 }} />
							<Typography variant="h6" color={timeLeft < 60 ? 'error' : 'primary'}>{formatTime(timeLeft)}</Typography>
						</Box>
						<Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Question Overview</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{questions.map((q, idx) => {
								const isMarked = answers[q.id] && answers[q.id].length > 0;
								return (
									<Button
										key={q.id}
										size="small"
										variant={current === idx ? 'contained' : 'outlined'}
										sx={{
											minWidth: 40,
											width: 40,
											height: 40,
											p: 0,
											borderRadius: 2,
											fontWeight: 'bold',
											bgcolor: isMarked ? '#e0e0e0' : '#fff', // gray if marked, white if not
											color: 'text.primary',
											borderColor: current === idx ? 'primary.main' : 'divider',
											boxShadow: current === idx ? 2 : 0
										}}
										onClick={() => handleNav(idx)}
									>
										{idx + 1}
									</Button>
								);
							})}
						</Box>
					</Box>
				</Box>
				{/* Finish Confirmation Dialog */}
				<Dialog open={showFinish} onClose={() => !submitting && setShowFinish(false)}>
					<DialogTitle>Finish Attempt?</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure you want to submit your attempt? You won't be able to change your answers after this.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowFinish(false)} color="inherit" disabled={submitting}>Cancel</Button>
						<Button onClick={confirmFinish} color="success" variant="contained" disabled={submitting}>
							{submitting ? 'Submitting...' : 'Finish'}
						</Button>
					</DialogActions>
				</Dialog>
				{/* Unmarked Warning Dialog */}
				<Dialog open={showWarn} onClose={() => !submitting && setShowWarn(false)}>
					<DialogTitle>Unmarked Questions</DialogTitle>
					<DialogContent>
						<Alert severity="warning" sx={{ mb: 2 }}>You have unmarked questions. Are you sure you want to finish?</Alert>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowWarn(false)} color="inherit" disabled={submitting}>Back</Button>
						<Button onClick={confirmFinish} color="success" variant="contained" disabled={submitting}>
							{submitting ? 'Submitting...' : 'Finish Anyway'}
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		);
};

export default AttemptQuiz;