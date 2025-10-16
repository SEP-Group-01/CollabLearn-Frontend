import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Tooltip, Zoom } from '@mui/material'

export interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
  percentage: number
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: '', color: '#e5e7eb', percentage: 0 }
  }

  let score = 0
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    longLength: password.length >= 12
  }

  // Basic scoring
  if (checks.length) score += 1
  if (checks.lowercase) score += 1
  if (checks.uppercase) score += 1
  if (checks.numbers) score += 1
  if (checks.symbols) score += 1
  if (checks.longLength) score += 1

  // Bonus for variety
  const variety = Object.values(checks).filter(Boolean).length
  if (variety >= 4) score += 1
  if (variety >= 5) score += 1

  // Map score to strength levels
  if (score <= 2) {
    return { score: 0, label: 'Too Weak', color: '#ef4444', percentage: 20 }
  } else if (score <= 4) {
    return { score: 1, label: 'Weak', color: '#f97316', percentage: 40 }
  } else if (score <= 6) {
    return { score: 2, label: 'Medium', color: '#eab308', percentage: 60 }
  } else if (score <= 7) {
    return { score: 3, label: 'Strong', color: '#22c55e', percentage: 80 }
  } else {
    return { score: 4, label: 'Very Strong', color: '#16a34a', percentage: 100 }
  }
}

export const getPasswordCriteria = (password: string) => {
  return [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains number', met: /\d/.test(password) },
    { text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { text: 'At least 12 characters (bonus)', met: password.length >= 12 },
  ]
}

interface PasswordStrengthIndicatorProps {
  password: string
  showCriteria?: boolean
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  showCriteria = true 
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const strength = calculatePasswordStrength(password)
  const criteria = getPasswordCriteria(password)

  const CriteriaTooltip = () => (
    <Box sx={{ p: 2, maxWidth: 280 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        Password Requirements:
      </Typography>
      {criteria.map((criterion, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: criterion.met ? '#22c55e' : '#e5e7eb',
              mr: 1,
              transition: 'background-color 0.3s ease',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: criterion.met ? '#22c55e' : '#6b7280',
              fontSize: '0.875rem',
              transition: 'color 0.3s ease',
            }}
          >
            {criterion.text}
          </Typography>
        </Box>
      ))}
    </Box>
  )

  if (!password) {
    return null
  }

  return (
    <Box sx={{ mt: 1 }}>
      {/* Strength Bar */}
      <Tooltip
        title={<CriteriaTooltip />}
        placement="top"
        arrow
        TransitionComponent={Zoom}
        open={showTooltip}
        onClose={() => setShowTooltip(false)}
        onOpen={() => setShowTooltip(true)}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#374151',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            },
          },
          arrow: {
            sx: {
              color: 'rgba(255, 255, 255, 0.95)',
            },
          },
        }}
      >
        <Box
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          sx={{ cursor: 'pointer' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Password Strength
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                ml: 'auto', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                color: strength.color 
              }}
            >
              {strength.label}
            </Typography>
          </Box>
          
          <Box
            sx={{
              width: '100%',
              height: 6,
              backgroundColor: '#f3f4f6',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength.percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                height: '100%',
                backgroundColor: strength.color,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                }}
              />
            </motion.div>
          </Box>
        </Box>
      </Tooltip>

      {/* Criteria List (optional) */}
      <AnimatePresence>
        {showCriteria && password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 1 }}>
              {criteria.slice(0, 5).map((criterion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                    <motion.div
                      animate={{
                        backgroundColor: criterion.met ? '#22c55e' : '#e5e7eb',
                        scale: criterion.met ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        marginRight: 8,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: criterion.met ? '#22c55e' : '#9ca3af',
                        fontSize: '0.75rem',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {criterion.text}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default PasswordStrengthIndicator