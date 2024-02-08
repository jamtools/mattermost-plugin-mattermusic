import { posts } from "@/dummy-data/posts"
import { Link } from "react-router-dom"

const Playlists  = () => {
  return (
    <section className="mt-24 lg:mt-14 mb-32 overflow-auto px-7">
      <h2 className="text-2xl font-medium mb-5">All: Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-col gap-10 ">
        {posts.map((list) => (
          <Link to={`/profile/detail/${list.id}`} key={list.id}>
            <div className='flex items-center gap-5' >
              <img className='aspect-square w-1/3'  src={list.coverImage} alt="playlist cover" />
              <div className="mt-5">
                <h4>{list.title}</h4>
                <p className="text-sm text-gray">{list.author}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Playlists