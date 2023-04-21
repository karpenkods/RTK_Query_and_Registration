import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@mui/material'

import './serviceUnable.scss'

export const ServiceUnable: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="unable">
      <h1 className="unable__title">Ошибка</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ textTransform: 'none', fontSize: 24 }}
      >
        На главную
      </Button>
    </div>
  )
}
