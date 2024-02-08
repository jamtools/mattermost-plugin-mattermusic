import { posts } from '@/dummy-data/posts'
import PlaylistSlider from "@/components/PlaylistSlider"
import Playlist from "@/components/Playlist"

const Discover = () => {

  return (
    <section className="lg:mb-36 lg:divide-y divide-dark pl-3 lg:pl-5">
      <PlaylistSlider
        id="1"
        name="Posts" 
        lists={posts}
      />
      <div>
        <Playlist
          id="2"
          name="Playlist" 
          lists={posts}
        />
      </div>
    </section>
  )
}

export default Discover