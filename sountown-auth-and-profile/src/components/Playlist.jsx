// import Swiper core and required modules
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ArrowRight } from "./icons/IconArrows";
import { Link } from "react-router-dom";


const Playlist = ({ id, name, lists }) => {

  return (
    <section className="w-full pt-7 pb-14 pr-5 md:pr-0">
      <div className="mb-5">
        <div className='flex items-center justify-between'>
          <h3 className="text-2xl font-medium mb-1">
            {name}
          </h3>
          <Link to="/profile/playlists">
            <div className="text-gray text-sm hover:opacity-80 px-2 py-1 rounded-md transition pr-0 md:pr-5">See All</div>
          </Link>
        </div>
      </div>

      {/* Desktop View */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={50}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2
          },
          980: {
            slidesPerView: 3
          },
          1280: {
            slidesPerView: 4
          },

        }}
        navigation={{
          prevEl: `.playlist-slider-prev-${id}`,
          nextEl: `.playlist-slider-next-${id}`,

        }}
        className="relative pr-32 hidden md:block"
      >
        {lists.map((list) => (
          <SwiperSlide key={list.id}>
            <Link to={`/profile/detail/${list.id}`}>
              <img src={list.coverImage} alt="playlist cover" />
              <div className="mt-5">
                <h4 className="text-xl font-medium">{list.title}</h4>
                <p className="text-gray">{list.author}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
        <button className={`playlist-slider-prev-${id} absolute top-1/2 -translate-y-1/2 left-10 z-10 bg-primary p-4 rounded-md`} aria-label="prev">
          <ArrowRight className="rotate-180"/>
        </button>
        <button className={`playlist-slider-next-${id} absolute top-1/2 -translate-y-1/2 right-10 z-10 bg-primary p-4 rounded-md`} aria-label="next">
          <ArrowRight/>
        </button>
      </Swiper>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-10">
        {lists.map((list) => (
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

export default Playlist