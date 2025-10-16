import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';

interface SimpleQuizCardProps {
  quiz: {
    id: string;
    title: string;
    timeAllocated: number;
    totalAttempts: number;
    questions?: any[];
  };
  onStartQuiz: (quizId: string) => void;
}

const SimpleQuizCard: React.FC<SimpleQuizCardProps> = ({ quiz, onStartQuiz }) => {
  const questionCount = quiz.questions?.length || 0;
  const timeInMinutes = quiz.timeAllocated || 30;

  return (
    <Card sx={{ 
      height: '100%',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: 2,
        transform: 'translateY(-2px)',
      }
    }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Quiz Title */}
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 600,
            mb: 2,
            lineHeight: 1.3
          }}
        >
          {quiz.title}
        </Typography>

        {/* Quiz Stats */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {questionCount} questions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {timeInMinutes} min
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {quiz.totalAttempts || 0} attempts
          </Typography>
        </Box>

        {/* Difficulty Badge */}
        <Box sx={{ mb: 3 }}>
          <Chip 
            label="Medium" 
            size="small" 
            color="warning" 
            sx={{ fontWeight: 'medium' }}
          />
        </Box>

        {/* Start Button */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onStartQuiz(quiz.id)}
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 'bold',
              py: 1.5
            }}
          >
            START
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimpleQuizCard;