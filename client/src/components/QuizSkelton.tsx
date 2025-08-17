 import {
  Box,
  Card,
  CardContent,
  Stack,
  Skeleton
} from '@mui/material'


const SkeletonCard = () => (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flex: 1 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Skeleton 
                variant="circular" 
                width={48} 
                height={48} 
                sx={{ mr: 2 }}
                animation="wave"
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={32} 
                  animation="wave"
                />
                <Skeleton 
                  variant="text" 
                  width="40%" 
                  height={20} 
                  animation="wave"
                />
              </Box>
            </Box>
            <Skeleton 
              variant="text" 
              width="100%" 
              height={20} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="90%" 
              height={20} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="75%" 
              height={20} 
              sx={{ mb: 3 }}
              animation="wave"
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Skeleton 
                variant="rectangular" 
                width="50%" 
                height={80} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
              <Skeleton 
                variant="rectangular" 
                width="50%" 
                height={80} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
            </Box>
            <Skeleton 
              variant="text" 
              width="30%" 
              height={24} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              <Skeleton variant="rounded" width={60} height={24} animation="wave" />
              <Skeleton variant="rounded" width={80} height={24} animation="wave" />
              <Skeleton variant="rounded" width={70} height={24} animation="wave" />
            </Box>
            <Skeleton 
              variant="text" 
              width="40%" 
              height={24} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={100} 
              sx={{ borderRadius: 1 }}
              animation="wave"
            />
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Skeleton 
                variant="text" 
                width="60%" 
                height={24} 
                sx={{ mb: 2 }}
                animation="wave"
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={120} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Skeleton 
                variant="text" 
                width="50%" 
                height={24} 
                sx={{ mb: 2 }}
                animation="wave"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton 
                  variant="rectangular" 
                  width="50%" 
                  height={80} 
                  sx={{ borderRadius: 1 }}
                  animation="wave"
                />
                <Skeleton 
                  variant="rectangular" 
                  width="50%" 
                  height={80} 
                  sx={{ borderRadius: 1 }}
                  animation="wave"
                />
              </Box>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={10} 
                sx={{ mt: 2, borderRadius: 5 }}
                animation="wave"
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={10} 
                sx={{ mt: 2, borderRadius: 5 }}
                animation="wave"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={48} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  )

export default SkeletonCard;