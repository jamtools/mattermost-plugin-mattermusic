const secondsToMinutes = (seconds = 0) => {
  const minute = Math.floor(seconds/60)
  const second = Math.floor(seconds%60)
  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

export default secondsToMinutes