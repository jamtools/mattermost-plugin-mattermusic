import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { soundOnSeeking } from "../../store/soundplay"
import { soundCommentOnSeeking } from "../../store/soundplay_comment"

const SoundSeekSlider = ({size, rounded, currentTime = 0, length = 100, onSeek, disabled, isComment}) => {

  const seekRef = useRef(null)
  const [value, setValue] = useState(0)
  const [isSeeking, setIsSeeking] = useAtom(soundOnSeeking)
  const [isCommentSeeking, setIsCommentSeeking] = useAtom(soundCommentOnSeeking)

  useEffect(() => {
    const time = Math.floor((currentTime/length)*100)
    if(!isSeeking && !isCommentSeeking) {
      seekRef.current.value = time || 0
      setValue(seekRef.current.value)
    }
  }, [currentTime])

  const onSeeking = (e) => {
    setValue(seekRef.current.value)
    isComment ? setIsCommentSeeking(true) : setIsSeeking(true)
  }
  
  const onTouchLeave = () => {
    isComment ? setIsCommentSeeking(false) : setIsSeeking(false)
    onSeek((value/100)*length)
  }

  return (
    <div className={`relative bg-dark ${size == 'small' ? 'h-2.5' : 'h-2.5 lg:h-[15px]'} ${rounded && 'rounded-full'}`}>
      <div className={`absolute h-full bg-primary ${rounded && 'rounded-full'}`} style={{width: value+'%'}}></div>
      <input 
        ref={seekRef} 
        onInput={onSeeking} 
        onMouseUp={onTouchLeave}
        onTouchEnd={onTouchLeave}
        disabled={disabled} 
        type="range" 
        min="0" 
        max="100" 
        defaultValue={0} 
        className={`seek-sound-player ${size} absolute top-1/2 -translate-y-1/2 cursor-pointer`}
        aria-label="seek-slider"
      />
    </div>
  )
}

export default SoundSeekSlider