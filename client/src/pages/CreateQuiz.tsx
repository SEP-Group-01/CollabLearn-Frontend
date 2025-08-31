import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    IconButton,
    Divider,
    Chip,
    Container,
    Paper,
    Breadcrumbs,
    Link,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    NavigateNext as NavigateNextIcon,
    Home as HomeIcon,
    Quiz as QuizIcon,
    Timer as TimerIcon,
    Grade as GradeIcon
} from '@mui/icons-material';

import Footer from '../components/Footer';
import SidebarComponent from '../components/SideBar';
import {mockResources} from '../mocks/Quizzes';
import type {Option, Question, QuizDetails} from '../types/QuizInterfaces'
import DragDropImageUpload from '../components/DragDropImageUpload'


const CreateQuiz: React.FC = () => {
    const [openSaveDialog, setOpenSaveDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [dragOver, setDragOver] = useState<string | null>(null);

    const [quizDetails, setQuizDetails] = useState<QuizDetails>({
        title: '',
        description: '',
        allocatedTime: 0,
        topics: '',
        selectedResources: []
    });

    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: '',
        questionText: '',
        image: null,
        options: [
            { id: '1', sequenceLetter: 'A', text: '', image: null, isCorrect: false },
            { id: '2', sequenceLetter: 'B', text: '', image: null, isCorrect: false }
        ],
        marks: 1,
        isEditing: false
    });

    const generateSequenceLetter = (index: number): string => {
        return String.fromCharCode(65 + index); // A, B, C, D, etc.
    };

    const validateQuizDetails = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        if (!quizDetails.title.trim()) {
            newErrors.title = 'Quiz title is required';
        }
        
        if (!quizDetails.allocatedTime || quizDetails.allocatedTime <= 0) {
            newErrors.allocatedTime = 'Allocated time must be greater than 0';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateQuestion = (question: Question): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        if (!question.questionText.trim()) {
            newErrors.questionText = 'Question text is required';
        }
        
        if (question.marks <= 0) {
            newErrors.marks = 'Marks must be greater than 0';
        }
        
        const validOptions = question.options.filter(opt => opt.text.trim() || opt.image);
        if (validOptions.length < 2) {
            newErrors.options = 'At least 2 options with text or image are required';
        }
        
        if (validOptions.length > 10) {
            newErrors.options = 'Maximum 10 options allowed';
        }
        
        const correctOptions = question.options.filter(opt => opt.isCorrect);
        if (correctOptions.length === 0) {
            newErrors.correctOptions = 'At least one correct option must be selected';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleQuizDetailsChange = (field: keyof QuizDetails, value: any) => {
        setQuizDetails(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleResourceSelection = (resourceId: string) => {
        setQuizDetails(prev => ({
            ...prev,
            selectedResources: prev.selectedResources.includes(resourceId)
                ? prev.selectedResources.filter(id => id !== resourceId)
                : [...prev.selectedResources, resourceId]
        }));
    };

    const handleAddOption = () => {
        if (currentQuestion.options.length < 10) {
            const newOption: Option = {
                id: Date.now().toString(),
                sequenceLetter: generateSequenceLetter(currentQuestion.options.length),
                text: '',
                image: null,
                isCorrect: false
            };
            
            setCurrentQuestion(prev => ({
                ...prev,
                options: [...prev.options, newOption]
            }));
        }
    };

    const handleRemoveOption = (optionId: string) => {
        if (currentQuestion.options.length > 2) {
            setCurrentQuestion(prev => ({
                ...prev,
                options: prev.options.filter(opt => opt.id !== optionId)
                    .map((opt, index) => ({
                        ...opt,
                        sequenceLetter: generateSequenceLetter(index)
                    }))
            }));
        }
    };

    const handleOptionChange = (optionId: string, field: keyof Option, value: any) => {
        setCurrentQuestion(prev => ({
            ...prev,
            options: prev.options.map(opt =>
                opt.id === optionId ? { ...opt, [field]: value } : opt
            )
        }));
    };

    const handleImageUpload = (file: File, type: 'question' | 'option', optionId?: string) => {
        if (!validateImageFile(file)) {
            return;
        }
        
        if (type === 'question') {
            setCurrentQuestion(prev => ({ ...prev, image: file }));
        } else if (type === 'option' && optionId) {
            handleOptionChange(optionId, 'image', file);
        }
        
        // Clear any previous image errors
        setErrors(prev => ({ ...prev, image: '' }));
    };

    const handleDragOver = (e: React.DragEvent, dropId: string) => {
        e.preventDefault();
        setDragOver(dropId);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(null);
    };

    const handleDrop = (e: React.DragEvent, type: 'question' | 'option', optionId?: string) => {
        e.preventDefault();
        setDragOver(null);
        
        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));
        
        if (imageFile) {
            handleImageUpload(imageFile, type, optionId);
        }
    };

    const validateImageFile = (file: File): boolean => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, image: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' }));
            return false;
        }
        
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
            return false;
        }
        
        return true;
    };

    const handleSaveQuestion = () => {
        if (!validateQuestion(currentQuestion)) {
            return;
        }

        const questionToSave: Question = {
            ...currentQuestion,
            id: currentQuestion.id || Date.now().toString(),
            isEditing: false
        };

        if (currentQuestion.id && questions.find(q => q.id === currentQuestion.id)) {
            // Update existing question
            setQuestions(prev => prev.map(q => 
                q.id === currentQuestion.id ? questionToSave : q
            ));
        } else {
            // Add new question
            setQuestions(prev => [...prev, questionToSave]);
        }

        // Reset form
        setCurrentQuestion({
            id: '',
            questionText: '',
            image: null,
            options: [
                { id: '1', sequenceLetter: 'A', text: '', image: null, isCorrect: false },
                { id: '2', sequenceLetter: 'B', text: '', image: null, isCorrect: false }
            ],
            marks: 1,
            isEditing: false
        });
        
        setIsAddingQuestion(false);
        setErrors({});
    };

    const handleEditQuestion = (question: Question) => {
        setCurrentQuestion({ ...question, isEditing: true });
        setIsAddingQuestion(true);
    };

    const handleDeleteQuestion = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

    const handleCancelQuestion = () => {
        setCurrentQuestion({
            id: '',
            questionText: '',
            image: null,
            options: [
                { id: '1', sequenceLetter: 'A', text: '', image: null, isCorrect: false },
                { id: '2', sequenceLetter: 'B', text: '', image: null, isCorrect: false }
            ],
            marks: 1,
            isEditing: false
        });
        setIsAddingQuestion(false);
        setErrors({});
    };

    const handleCreateQuiz = () => {
        if (!validateQuizDetails()) {
            return;
        }
        
        if (questions.length === 0) {
            setErrors({ general: 'At least one question is required to create a quiz' });
            return;
        }

        // Here you would typically send the data to the backend
        console.log('Creating quiz with details:', quizDetails);
        console.log('Questions:', questions);
        
        // Show success message or redirect
        alert('Quiz created successfully!');
    };

    const handleSaveAndExit = () => {
        setOpenSaveDialog(true);
    };

    const handleCancelAndExit = () => {
        setOpenCancelDialog(true);
    };

    const confirmSaveAndExit = () => {
        setOpenSaveDialog(false);
        handleCreateQuiz();
        window.history.back();
    };

    const confirmCancelAndExit = () => {
        setOpenCancelDialog(false);
        window.history.back();
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />

            <Box sx={{
                flexGrow: 1,
                ml: collapsed ? '80px' : '250px',
                transition: 'margin-left 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                {/* Save & Exit and Cancel & Exit Buttons */}
                <Box sx={{ position: 'absolute', top: 24, right: 40, zIndex: 10, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        sx={{ fontWeight: 'bold', textTransform: 'none', borderRadius: 2, boxShadow: 2 }}
                        onClick={handleSaveAndExit}
                    >
                        Save and Exit
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        sx={{ fontWeight: 'bold', textTransform: 'none', borderRadius: 2, boxShadow: 2 }}
                        onClick={handleCancelAndExit}
                    >
                        Cancel and Exit
                    </Button>
                </Box>

                {/* Save Confirmation Dialog */}
                <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
                    <DialogTitle>Save and Exit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to save your changes and exit?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenSaveDialog(false)} color="inherit">Cancel</Button>
                        <Button onClick={confirmSaveAndExit} color="primary" variant="contained">Save and Exit</Button>
                    </DialogActions>
                </Dialog>

                {/* Cancel Confirmation Dialog */}
                <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
                    <DialogTitle>Cancel and Exit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to discard your changes and exit? Unsaved changes will be lost.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCancelDialog(false)} color="inherit">Back</Button>
                        <Button onClick={confirmCancelAndExit} color="secondary" variant="contained">Cancel and Exit</Button>
                    </DialogActions>
                </Dialog>

                <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
                    {/* Breadcrumbs */}
                    <Box sx={{ mb: 3 }}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                            <Link color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                Workspace1
                            </Link>
                            <Typography color="text.primary">Thread3</Typography>
                            <Typography color="text.primary">Quizzes</Typography>
                            <Typography color="text.primary">Create Quiz</Typography>
                        </Breadcrumbs>
                    </Box>

                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <QuizIcon fontSize="large" />
                            Create New Quiz
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Create an interactive quiz with multiple choice questions for your learners
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {errors.general && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {errors.general}
                        </Alert>
                    )}

                    {/* Quiz Details Section */}
                    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                                color: 'primary.main',
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: '1.3rem'
                            }}>
                                Quiz Details
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                                    <TextField
                                        fullWidth
                                        label="Quiz Title"
                                        required
                                        value={quizDetails.title}
                                        onChange={(e) => handleQuizDetailsChange('title', e.target.value)}
                                        error={!!errors.title}
                                        helperText={errors.title}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Allocated Time (minutes)"
                                        type="number"
                                        required
                                        value={quizDetails.allocatedTime}
                                        onChange={(e) => handleQuizDetailsChange('allocatedTime', parseInt(e.target.value) || 0)}
                                        error={!!errors.allocatedTime}
                                        helperText={errors.allocatedTime}
                                        InputProps={{
                                            startAdornment: <TimerIcon sx={{ color: 'action.active', mr: 1 }} />
                                        }}
                                    />
                                </Box>
                                
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={quizDetails.description}
                                    onChange={(e) => handleQuizDetailsChange('description', e.target.value)}
                                    placeholder="Brief description of the quiz content and objectives..."
                                />
                                
                                <TextField
                                    fullWidth
                                    label="Topics"
                                    value={quizDetails.topics}
                                    onChange={(e) => handleQuizDetailsChange('topics', e.target.value)}
                                    placeholder="Enter topics separated by commas (e.g., React, JavaScript, State Management)"
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Available Resources Section */}
                    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                                color: 'primary.main',
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: '1.3rem'
                            }}>
                                Available Resources
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Select resources that students can reference during the quiz. Click on a resource to select or deselect it:
                            </Typography>
                            
                            <Box sx={{ 
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: 2
                            }}>
                                {mockResources.map((resource) => (
                                    <Paper
                                        key={resource.id}
                                        sx={{
                                            p: 3,
                                            cursor: 'pointer',
                                            border: '2px solid',
                                            borderColor: quizDetails.selectedResources.includes(resource.id)
                                                ? 'primary.main'
                                                : 'divider',
                                            bgcolor: quizDetails.selectedResources.includes(resource.id)
                                                ? 'rgba(25, 118, 210, 0.08)'
                                                : 'background.paper',
                                            borderRadius: 2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                bgcolor: quizDetails.selectedResources.includes(resource.id)
                                                    ? 'rgba(25, 118, 210, 0.12)'
                                                    : 'action.hover',
                                                transform: 'translateY(-1px)',
                                                boxShadow: 2
                                            }
                                        }}
                                        onClick={() => handleResourceSelection(resource.id)}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            <Typography 
                                                variant="subtitle1" 
                                                sx={{ 
                                                    fontWeight: 'medium',
                                                    color: quizDetails.selectedResources.includes(resource.id)
                                                        ? 'primary.main'
                                                        : 'text.primary'
                                                }}
                                            >
                                                {resource.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Chip 
                                                    label={resource.type} 
                                                    size="small" 
                                                    variant={quizDetails.selectedResources.includes(resource.id) ? "filled" : "outlined"}
                                                    color={quizDetails.selectedResources.includes(resource.id) ? "primary" : "default"}
                                                    sx={{ fontWeight: 'medium' }}
                                                />
                                                {quizDetails.selectedResources.includes(resource.id) && (
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            color: 'primary.main',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        ✓ Selected
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Questions Section */}
                    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                                color: 'primary.main',
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: '1.3rem'
                            }}>
                                Questions ({questions.length})
                            </Typography>

                            {/* Existing Questions */}
                            {questions.map((question, index) => (
                                <Card key={question.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                Question {index + 1}
                                            </Typography>
                                            <Box>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleEditQuestion(question)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {question.questionText}
                                        </Typography>
                                        
                                        {question.image && (
                                            <Box sx={{ mb: 2 }}>
                                                <img 
                                                    src={URL.createObjectURL(question.image)} 
                                                    alt="Question" 
                                                    style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '8px' }}
                                                />
                                            </Box>
                                        )}
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Chip 
                                                icon={<GradeIcon />}
                                                label={`${question.marks} mark${question.marks !== 1 ? 's' : ''}`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                        
                                        <Box>
                                            {question.options.map((option) => (
                                                <Box key={option.id} sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    mb: 1,
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: option.isCorrect ? 'success.lighter' : 'background.paper',
                                                    border: '1px solid',
                                                    borderColor: option.isCorrect ? 'success.main' : 'divider'
                                                }}>
                                                    <Typography sx={{ 
                                                        fontWeight: 'bold', 
                                                        mr: 2,
                                                        minWidth: '24px'
                                                    }}>
                                                        {option.sequenceLetter}.
                                                    </Typography>
                                                    <Typography sx={{ flexGrow: 1 }}>
                                                        {option.text}
                                                    </Typography>
                                                    {option.image && (
                                                        <img 
                                                            src={URL.createObjectURL(option.image)} 
                                                            alt={`Option ${option.sequenceLetter}`}
                                                            style={{ 
                                                                width: '40px', 
                                                                height: '40px', 
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                                marginLeft: '8px'
                                                            }}
                                                        />
                                                    )}
                                                    {option.isCorrect && (
                                                        <Chip 
                                                            label="Correct" 
                                                            size="small" 
                                                            color="success"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add Question Form */}
                            {isAddingQuestion && (
                                <Card sx={{ mb: 2, border: '2px solid', borderColor: 'primary.main' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 3 }}>
                                            {currentQuestion.id ? 'Edit Question' : 'Add New Question'}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Question Text"
                                                required
                                                multiline
                                                rows={3}
                                                value={currentQuestion.questionText}
                                                onChange={(e) => setCurrentQuestion(prev => ({ 
                                                    ...prev, 
                                                    questionText: e.target.value 
                                                }))}
                                                error={!!errors.questionText}
                                                helperText={errors.questionText}
                                            />
                                            
                                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                                                <TextField
                                                    fullWidth
                                                    label="Marks"
                                                    type="number"
                                                    required
                                                    value={currentQuestion.marks}
                                                    onChange={(e) => setCurrentQuestion(prev => ({ 
                                                        ...prev, 
                                                        marks: parseInt(e.target.value) || 1
                                                    }))}
                                                    error={!!errors.marks}
                                                    helperText={errors.marks}
                                                    InputProps={{ inputProps: { min: 1 } }}
                                                />
                                                
                                                <DragDropImageUpload
                                                    onImageUpload={(file) => handleImageUpload(file, 'question')}
                                                    currentImage={currentQuestion.image}
                                                    label="Upload Question Image"
                                                    fullWidth
                                                    height="120px"
                                                    dragOverId="question-image"
                                                    isDragOver={dragOver === 'question-image'}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={(e) => handleDrop(e, 'question')}
                                                />
                                            </Box>
                                            
                                            {errors.image && (
                                                <Alert severity="error" sx={{ mt: 1 }}>
                                                    {errors.image}
                                                </Alert>
                                            )}
                                            
                                            {currentQuestion.image && (
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => setCurrentQuestion(prev => ({ 
                                                            ...prev, 
                                                            image: null 
                                                        }))}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Remove Image
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                        
                                        <Divider sx={{ my: 3 }} />
                                        
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'medium' }}>
                                            Options ({currentQuestion.options.length}/10)
                                        </Typography>
                                        
                                        {errors.options && (
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {errors.options}
                                            </Alert>
                                        )}
                                        
                                        {errors.correctOptions && (
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {errors.correctOptions}
                                            </Alert>
                                        )}
                                        
                                        {currentQuestion.options.map((option) => (
                                            <Card key={option.id} sx={{ mb: 2, bgcolor: 'background.default' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                        <Typography sx={{ 
                                                            fontWeight: 'bold', 
                                                            mt: 2,
                                                            minWidth: '24px'
                                                        }}>
                                                            {option.sequenceLetter}.
                                                        </Typography>
                                                        
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <TextField
                                                                fullWidth
                                                                label="Option Text"
                                                                value={option.text}
                                                                onChange={(e) => handleOptionChange(
                                                                    option.id, 
                                                                    'text', 
                                                                    e.target.value
                                                                )}
                                                                sx={{ mb: 2 }}
                                                            />
                                                            
                                                            <DragDropImageUpload
                                                                onImageUpload={(file) => handleImageUpload(file, 'option', option.id)}
                                                                currentImage={option.image}
                                                                label="Add Option Image"
                                                                fullWidth
                                                                height="80px"
                                                                dragOverId={`option-image-${option.id}`}
                                                                isDragOver={dragOver === `option-image-${option.id}`}
                                                                onDragOver={handleDragOver}
                                                                onDragLeave={handleDragLeave}
                                                                onDrop={(e) => handleDrop(e, 'option', option.id)}
                                                            />
                                                        </Box>
                                                        
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={option.isCorrect}
                                                                        onChange={(e) => handleOptionChange(
                                                                            option.id, 
                                                                            'isCorrect', 
                                                                            e.target.checked
                                                                        )}
                                                                        color="success"
                                                                    />
                                                                }
                                                                label="Correct"
                                                            />
                                                            
                                                            {option.image && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOptionChange(option.id, 'image', null)}
                                                                    color="warning"
                                                                    title="Remove Image"
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                            
                                                            {currentQuestion.options.length > 2 && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleRemoveOption(option.id)}
                                                                    color="error"
                                                                    title="Remove Option"
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        
                                        {currentQuestion.options.length < 10 && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={handleAddOption}
                                                fullWidth
                                                sx={{ 
                                                    mb: 3, 
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    fontWeight: 'medium',
                                                    textTransform: 'none',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                Add Option
                                            </Button>
                                        )}
                                        
                                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                                onClick={handleSaveQuestion}
                                                sx={{
                                                    flex: 1,
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    fontWeight: 'medium',
                                                    textTransform: 'none'
                                                }}
                                            >
                                                Save Question
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={handleCancelQuestion}
                                                sx={{
                                                    flex: 1,
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    fontWeight: 'medium',
                                                    textTransform: 'none'
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Add Question Button */}
                            {!isAddingQuestion && (
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => setIsAddingQuestion(true)}
                                    fullWidth
                                    sx={{ 
                                        mb: 3, 
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 'medium',
                                        textTransform: 'none',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Add Question
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Container>
                
                <Footer />
            </Box>
        </Box>
    );
};

export default CreateQuiz;