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
import { getQuizById, startQuizAttempt, getActiveAttempt, submitQuizAttempt } from '../api/quizApi';
import type { Quiz, Question } from '../types/QuizInterfaces';

const AttemptQuiz: React.FC = () => {
	const { quizId: urlQuizId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	
	const [collapsed, setCollapsed] = useState(false);
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<{ [qid: string]: string[] }>({});
	const [timeLeft, setTimeLeft] = useState(-1); // Use -1 to indicate not initialized
	const [showFinish, setShowFinish] = useState(false);
	const [showWarn, setShowWarn] = useState(false);
	const [finished, setFinished] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [attemptId, setAttemptId] = useState<string | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	
	// Get quiz ID from URL params or location state
	const quizId = urlQuizId || location.state?.quizId;

	// Fetch quiz data on component mount
	useEffect(() => {
		const fetchQuizData = async () => {
			if (!quizId) {
				setError('No quiz ID provided');
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				
				// Fetch quiz details first
				console.log('[AttemptQuiz] Fetching quiz data for quizId:', quizId);
				const quizData = await getQuizById(quizId);
				console.log('[AttemptQuiz] Fetched quiz data:', quizData);
				
				setQuiz(quizData);
				
				// Transform questions to match the expected format
				console.log('[AttemptQuiz] Raw quiz data:', quizData);
				console.log('[AttemptQuiz] Questions array:', quizData.questions);
				console.log('[AttemptQuiz] Quiz questions array:', (quizData as any).quiz_questions);
				
				const questionsArray = (quizData as any).quiz_questions || quizData.questions || [];
				console.log('[AttemptQuiz] Using questions array:', questionsArray);
				
				const transformedQuestions: Question[] = questionsArray.map((q: any, index: number) => {
					console.log(`[AttemptQuiz] Processing question ${index}:`, q);
					
					const options = (q.quiz_options || q.answer_option || q.options || []).map((opt: any, optIndex: number) => {
						console.log(`[AttemptQuiz] Processing option ${optIndex}:`, opt);
						return {
							id: opt.id || `opt${optIndex}`,
							sequenceLetter: opt.sequence_letter || opt.sequenceLetter || String.fromCharCode(65 + optIndex), // A, B, C, D
							text: opt.text || opt.answer || opt.option_text || '',
							image: opt.image || opt.image_url || null,
							isCorrect: opt.is_correct !== undefined ? opt.is_correct : (opt.isCorrect || false)
						};
					});
					
					console.log(`[AttemptQuiz] Transformed options for question ${index}:`, options);
					
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
				
				// Set timer - convert minutes to seconds  
				const timeInSeconds = (quizData.allocated_time || quizData.timeAllocated || 30) * 60;
				console.log('[AttemptQuiz] Setting timer to:', timeInSeconds, 'seconds');
				setTimeLeft(timeInSeconds);
				
		// Check for active attempt first, then start new one if needed
		try {
			console.log('[AttemptQuiz] Checking for active attempt...');
			
			try {
				// First try to get an active attempt
				const activeAttempt = await getActiveAttempt(quizId);
				console.log('[AttemptQuiz] Found active attempt:', activeAttempt);
				
				setAttemptId(activeAttempt.attemptId);
				
				// Use the remaining time from the active attempt
				if (activeAttempt.timeRemaining !== undefined) {
					console.log('[AttemptQuiz] Resuming with remaining time:', activeAttempt.timeRemaining, 'seconds');
					setTimeLeft(activeAttempt.timeRemaining);
				}
				
			} catch (noActiveError) {
				console.log('[AttemptQuiz] No active attempt found, starting new attempt...');
				
				// No active attempt, start a new one
				const startResult = await startQuizAttempt(quizId);
				console.log('[AttemptQuiz] Successfully started new quiz attempt:', startResult);
				setAttemptId(startResult.attemptId);
				
				// Use the time from the backend if available
				if (startResult.timeRemaining !== undefined) {
					console.log('[AttemptQuiz] Using backend timer:', startResult.timeRemaining, 'seconds');
					setTimeLeft(startResult.timeRemaining);
				}
			}
			
		} catch (attemptError) {
			console.error('[AttemptQuiz] Error with quiz attempt:', attemptError);
			setError('Failed to start or resume quiz attempt. Please try again.');
		}			} catch (err) {
				console.error('[AttemptQuiz] Error fetching quiz:', err);
				setError('Failed to load quiz. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchQuizData();
	}, [quizId]);

	// Timer effect - only start timer once timeLeft is properly initialized
	useEffect(() => {
		if (timeLeft > 0 && !finished && !submitting) {
			console.log('[AttemptQuiz] Starting timer with', timeLeft, 'seconds');
			timerRef.current = setInterval(() => {
				setTimeLeft((prevTime) => {
					const newTime = prevTime > 0 ? prevTime - 1 : 0;
					
					// Auto-submit when time reaches 0
					if (newTime === 0 && !finished && !submitting) {
						console.log('[AttemptQuiz] Time expired, auto-submitting quiz');
						setTimeout(() => confirmFinish(), 100); // Small delay to avoid state conflicts
					}
					
					return newTime;
				});
			}, 1000);
		} else if (timeLeft === 0 && timeLeft !== -1) {
			// Clear timer when time is up
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
		
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [timeLeft, finished, submitting]);

	// Periodic server sync to check if attempt has expired on server side
	useEffect(() => {
		if (!attemptId || attemptId.startsWith('dummy-') || finished || submitting) return;

		const syncInterval = setInterval(async () => {
			try {
				const activeAttempt = await getActiveAttempt(quizId!);
				
				// Update client time with server time if there's a significant difference
				const serverTime = activeAttempt.timeRemaining;
				if (Math.abs(serverTime - timeLeft) > 5) { // 5 second tolerance
					console.log('[AttemptQuiz] Syncing time with server:', serverTime);
					setTimeLeft(serverTime);
				}
				
			} catch (error) {
				// If server says no active attempt, the quiz has expired
				console.log('[AttemptQuiz] Server indicates quiz has expired');
				setTimeLeft(0);
			}
		}, 30000); // Check every 30 seconds

		return () => clearInterval(syncInterval);
	}, [attemptId, quizId, timeLeft, finished, submitting]);

	const handleOptionToggle = (qid: string, oid: string) => {
		setAnswers((prev) => {
			const prevAns = prev[qid] || [];
			let nextAns;
			if (prevAns.includes(oid)) {
				nextAns = prevAns.filter((id) => id !== oid);
			} else {
				nextAns = [...prevAns, oid];
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
		// Prevent submission if quiz is not loaded yet
		if (questions.length === 0) {
			console.log('[AttemptQuiz] No questions loaded, aborting submission');
			return;
		}

		setSubmitting(true);
		setShowFinish(false);
		setShowWarn(false);
		
		try {
			console.log('[AttemptQuiz] Starting quiz submission to backend...');
			console.log('[AttemptQuiz] Current answers:', answers);
			console.log('[AttemptQuiz] Questions:', questions);
			
			// Use the existing attemptId (should already be set from component initialization)
			let realAttemptId = attemptId;
			
			if (!realAttemptId || realAttemptId.startsWith('dummy-')) {
				setError('No valid quiz attempt found. Please refresh and try again.');
				setSubmitting(false);
				return;
			}
			
			// Step 2: Prepare answers in the expected format for backend
			const formattedAnswers = questions
				.filter(question => answers[question.id] && answers[question.id].length > 0)
				.map((question) => ({
					questionId: question.id,
					selectedOptionIds: answers[question.id]
				}));

			console.log('[AttemptQuiz] Formatted answers for backend:', formattedAnswers);
			
			// Step 3: Submit the attempt to backend
			if (realAttemptId && !realAttemptId.startsWith('dummy-')) {
				console.log('[AttemptQuiz] Step 3: Submitting to backend with attemptId:', realAttemptId);
				
				const attemptData = {
					attemptId: realAttemptId,
					answers: formattedAnswers
				};
				
				const result = await submitQuizAttempt(quizId!, attemptData);
				console.log('[AttemptQuiz] Backend submission result:', result);
			} else {
				console.log('[AttemptQuiz] No valid attemptId, submission will be local only');
			}
			
			// Calculate score for display
			let totalCorrect = 0;
			let totalQuestions = questions.length;
			
			questions.forEach(question => {
				const userAnswers = answers[question.id] || [];
				const correctOptions = question.options.filter(opt => opt.isCorrect);
				const correctIds = correctOptions.map(opt => opt.id);
				
				// Check if user selected exactly the correct options
				const isCorrect = userAnswers.length === correctIds.length && 
					userAnswers.every(id => correctIds.includes(id)) &&
					correctIds.every(id => userAnswers.includes(id));
				
				if (isCorrect) totalCorrect++;
			});
			
			console.log(`[AttemptQuiz] Final Score: ${totalCorrect}/${totalQuestions}`);
			
			setFinished(true);
			timerRef.current && clearInterval(timerRef.current);
			
		} catch (error) {
			console.error('[AttemptQuiz] Error submitting quiz attempt:', error);
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
													alignItems: 'center',
													minHeight: 64
												}}
												onClick={() => handleOptionToggle(q.id, opt.id)}
											>
												<CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
													<Checkbox checked={selected.includes(opt.id)} color="primary" />
													<Typography sx={{ flexGrow: 1 }}>{opt.sequenceLetter}. {opt.text}</Typography>
													{opt.image && (
														<img 
															src={typeof opt.image === 'string' ? opt.image : URL.createObjectURL(opt.image)} 
															alt={opt.sequenceLetter} 
															style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'contain' }} 
														/>
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