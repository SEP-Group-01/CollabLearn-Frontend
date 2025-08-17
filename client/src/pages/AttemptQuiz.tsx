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
	Alert
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	ArrowForward as ArrowForwardIcon,
	AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import SidebarComponent from '../components/SideBar';
// import Footer from '../components/Footer';
import type { Question } from '../types/QuizInterfaces';

// Mock quiz name and questions for demo (replace with real data fetch)
const quizName = 'Sample Quiz Title';
const mockQuestions: Question[] = [
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

const totalTime = 5 * 60; // 5 minutes for demo

const AttemptQuiz: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<{ [qid: string]: string[] }>({});
	// removed skipped state, not needed
	const [timeLeft, setTimeLeft] = useState(totalTime);
	const [showFinish, setShowFinish] = useState(false);
	const [showWarn, setShowWarn] = useState(false);
	const [finished, setFinished] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		timerRef.current = setInterval(() => {
			setTimeLeft((t) => (t > 0 ? t - 1 : 0));
		}, 1000);
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (timeLeft === 0 && !finished) {
			setShowFinish(true);
		}
	}, [timeLeft, finished]);

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
		setCurrent((c) => (c < mockQuestions.length - 1 ? c + 1 : c));
	};

	const handlePrev = () => {
		setCurrent((c) => (c > 0 ? c - 1 : c));
	};

	const handleFinish = () => {
		const unmarked = mockQuestions.filter((q) => !(answers[q.id] && answers[q.id].length));
		if (unmarked.length > 0) {
			setShowWarn(true);
		} else {
			setShowFinish(true);
		}
	};

	const confirmFinish = () => {
		setShowFinish(false);
		setShowWarn(false);
		setFinished(true);
		timerRef.current && clearInterval(timerRef.current);
	};

	const formatTime = (sec: number) => {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};

	// UI
	if (finished) {
		return (
			<Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
				<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				<Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Card sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
						<Typography variant="h5" color="primary" gutterBottom>Quiz Submitted!</Typography>
						<Typography variant="body1" sx={{ mb: 2 }}>Thank you for your attempt.</Typography>
						<Button variant="contained" color="primary" onClick={() => window.location.href = '/quizzes'}>Back to Quizzes</Button>
					</Card>
				</Box>
			</Box>
		);
	}

	const q = mockQuestions[current];
	const selected = answers[q.id] || [];

		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
				<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				<Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', ml: collapsed ? '80px' : '250px', transition: 'margin-left 0.3s', p: 0 }}>
					{/* Main Quiz Area */}
					<Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
						{/* Quiz Title outside the card */}
						<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
							<Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>{quizName}</Typography>
						</Box>
						<Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
									<Chip label={`Max Marks: ${q.marks}`} color="info" size="small" />
									<Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
										Question {current + 1} of {mockQuestions.length}
									</Typography>
								</Box>
									<Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>{q.questionText}</Typography>
									{q.image && (
										<Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
											<img src={URL.createObjectURL(q.image)} alt="Question" style={{ maxWidth: '100%', maxHeight: 350, borderRadius: '12px', objectFit: 'contain' }} />
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
														<img src={URL.createObjectURL(opt.image)} alt={opt.sequenceLetter} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'contain' }} />
													)}
												</CardContent>
											</Card>
										))}
									</Stack>
								<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
									<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handlePrev} disabled={current === 0}>Previous</Button>
									{current < mockQuestions.length - 1 ? (
										<Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}>Next</Button>
									) : (
										<Button variant="contained" color="success" onClick={handleFinish}>Finish Attempt</Button>
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
							{mockQuestions.map((q, idx) => {
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
				<Dialog open={showFinish} onClose={() => setShowFinish(false)}>
					<DialogTitle>Finish Attempt?</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure you want to submit your attempt? You won't be able to change your answers after this.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowFinish(false)} color="inherit">Cancel</Button>
						<Button onClick={confirmFinish} color="success" variant="contained">Finish</Button>
					</DialogActions>
				</Dialog>
				{/* Unmarked Warning Dialog */}
				<Dialog open={showWarn} onClose={() => setShowWarn(false)}>
					<DialogTitle>Unmarked Questions</DialogTitle>
					<DialogContent>
						<Alert severity="warning" sx={{ mb: 2 }}>You have unmarked questions. Are you sure you want to finish?</Alert>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowWarn(false)} color="inherit">Back</Button>
						<Button onClick={confirmFinish} color="success" variant="contained">Finish Anyway</Button>
					</DialogActions>
				</Dialog>
			</Box>
		);
};

export default AttemptQuiz;
