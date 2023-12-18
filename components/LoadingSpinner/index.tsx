import React from 'react'
import styles from './styles.module.css'

type Props = {
  width?: string;
  height?: string;
}

const LoadingSpinner = ({width='2rem', height='2rem'}: Props) => {
  return (
    <div className={`${styles['spinner']} ${width && 'w-['+ width +']'} ${height && 'h-['+ height +']'}`}></div>
  )
}

export default LoadingSpinner