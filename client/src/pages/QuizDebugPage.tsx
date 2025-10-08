import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Typography, TextField, Paper } from '@mui/material'
import { getQuizById } from '../api/quizApi'

export default function QuizDebugPage() {
  const params = useParams<{ quizId: string }>()
  const initialId = params.quizId || ''
  const [quizId, setQuizId] = useState<string>(initialId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<unknown | null>(null)

  const handleFetch = async () => {
    setError(null)
    setLoading(true)
    setData(null)
    try {
      const res = await getQuizById(quizId)
      setData(res)
    } catch (err: unknown) {
      // If the error includes an `attempts` array (from api helper), include that info in the displayed error
      if (err instanceof Error) {
        const possibleAttempts = (err as unknown) as { attempts?: unknown }
        if (Array.isArray(possibleAttempts.attempts)) {
          const attempts = possibleAttempts.attempts as { url: string; status?: number; error?: string }[]
          const message = `${err.message} — attempts:\n${attempts.map(a => `${a.url} => ${a.status ?? 'no response'} ${a.error ? '- ' + a.error : ''}`).join('\n')}`
          setError(message)
        } else {
          setError(err.message)
        }
      } else {
        setError(String(err))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Quiz Debug Console
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Quiz ID" value={quizId} onChange={(e) => setQuizId(e.target.value)} />
        <Button variant="contained" onClick={handleFetch} disabled={!quizId || loading}>
          {loading ? 'Fetching...' : 'Fetch'}
        </Button>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.lighter' }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      )}

      {data && (
        <Paper sx={{ p: 2, maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="subtitle2">Raw response:</Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {String(typeof data === 'string' ? data : JSON.stringify(data, null, 2))}
          </pre>
        </Paper>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption">Note: API_BASE = VITE_API_URL or default http://localhost:3000</Typography>
      </Box>
    </Box>
  )
}
