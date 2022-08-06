import { posts } from '@/dummy-data/posts'
import Playlist from "@/components/Playlist"

const Discover = () => {

  return (
    <section className="mb-[7rem] lg:divide-y divide-dark pl-7">
      <Playlist
        id="1"
        name="Posts" 
        lists={posts}
      />
      <Playlist
        id="2"
        name="Playlist" 
        lists={posts}
      />
    </section>
  )
}

export default Discover