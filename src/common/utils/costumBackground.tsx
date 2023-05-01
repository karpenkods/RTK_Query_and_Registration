import { FC } from 'react'

import { useAppSelector } from '../hooks'
import dark from '../../assets/dark.png'
import light from '../../assets/light.png'

export const CostumBackground: FC = () => {
  const darkTheme = useAppSelector((store) => store.theme.theme) === 'dark'

  return (
    <img
      src={darkTheme ? dark : light}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
      }}
    />
  )
}
