import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom"

import { posts } from "@/dummy-data/posts"
import { PlayIcon, PauseIcon } from "@/components/icons/IconSoundPlayer";
import SoundSeekSlider from "../atom/SoundSeekSlider";

import { 
  soundTitle, 
  soundAuthor, 
  soundUrl, 
  soundDuration, 
  soundIsPlaying, 
  soundMuted, 
  soundSeek 
} from '@/store/soundplay';

import { soundCommentIsPlaying } from '@/store/soundplay_comment';
import secondsToMinutes from "../../utils/secondsToMinutes";

const ProfileDetailDescription = () => {

  let { musicId } = useParams();

  const [musicDetail, setMusicDetail] = useState(null)

  const [title, setTitle] = useAtom(soundTitle)
  const [author, setAuthor] = useAtom(soundAuthor)
  const [url, setUrl] = useAtom(soundUrl)
  
  const [seek, setSeek] = useAtom(soundSeek)
  const [isPlaying, setIsPlaying] = useAtom(soundIsPlaying)
  const [isCommentPlaying, setIsCommentPlaying] = useAtom(soundCommentIsPlaying)
  const [duration, setDuration] = useAtom(soundDuration)
  const [muted, setMuted] = useAtom(soundMuted)

  const [isSoundSame, setIsSoundSame] = useState(false)

  useEffect(() => {
    const music = posts.filter(list => list.id == musicId)[0]
    setMusicDetail(music)
  }, [])


  useEffect(() => {
    if(musicDetail?.musicUrl) {
      if(url == musicDetail?.musicUrl) {
        setIsSoundSame(true)
      } else {
        setIsSoundSame(false)
      }
    }
  }, [musicDetail]) 

  const playSound = () => {
    if(url !== musicDetail?.musicUrl) {
      setSeek(0)
      setTitle(musicDetail?.title)
      setAuthor(musicDetail?.author)
      setUrl(musicDetail?.musicUrl)
      setIsPlaying(false)
    }
    setIsSoundSame(true)
    setIsPlaying(val => !val)
    setIsCommentPlaying(false)
  }

  const handleOnSeek = (value) => {
    setSeek(value)
  } 

  return (
    <section className="lg:pl-5 overflow-auto lg:mt-8 w-full max-w-xl lg:max-w-none mx-auto border-b border-dark lg:border-none pb-4 lg:pb-32">
      <div className="aspect-[16/10] w-full lg:mb-6">
        <img className="w-full h-full object-cover" src={musicDetail?.coverImage} alt="" />
      </div>
      <div className="p-5 lg:p-0">
        <h2 className="text-base md:text-xl xl:text-2xl font-medium mb-1">
          {musicDetail?.title}
        </h2>
        <p className="text-sm md:text-lg xl:text-xl font-medium text-gray mb-7">
          {musicDetail?.author}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-5 lg:gap-5 xl:gap-8 w-full lg:w-[85%]">
          <button onClick={playSound} className="bg-primary w-9 md:w-10 lg:w-12 h-9 md:h-10 lg:h-12 rounded-full flex items-center justify-center" aria-label="play_pause">
            {isPlaying ? <PauseIcon/> : <PlayIcon/>}
          </button>
          <div className="rounded-full relative h-full flex-grow">
            <SoundSeekSlider 
              size="small" 
              rounded 
              length={isSoundSame ? (duration || 60) : 0} 
              onSeek={isSoundSame ? handleOnSeek : false} 
              currentTime={isSoundSame ? seek : 0}
            />
          </div>
          <div className="text-sm w-full xl:w-max">
            {secondsToMinutes((isSoundSame && seek) || 0)} / {secondsToMinutes((isSoundSame && duration) || 0)}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileDetailDescription