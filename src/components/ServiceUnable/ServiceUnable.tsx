import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'

import { CostumButton } from '../../common'
import image from '../../assets/404.png'
import image2 from '../../assets/404_2.png'

export const ServiceUnable: FC = () => {
  const navigate = useNavigate()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(768))

  const styles = {
    notFound: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundImage: `url(${image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      width: '100vw',
      height: '100vh',
    },
  }

  return (
    <Box sx={styles.notFound}>
      <Stack direction="column" alignItems="flex-end">
        <img
          src={image2}
          width={isMobile ? '100%' : '45%'}
          height={isMobile ? '100%' : '45%'}
        />
        <CostumButton
          color="primary"
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ fontSize: 20, width: 'fit-content', marginRight: '100px' }}
        >
          На главную
        </CostumButton>
      </Stack>
    </Box>
  )
}
