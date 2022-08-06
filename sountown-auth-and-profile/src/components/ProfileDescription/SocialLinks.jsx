import { InstagramIcon, BandcampIcon, TwitterIcon } from "@/components/icons/IconSocials";

const SocialLinks = ({ twitter, bandcamp, instagram }) => {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-medium mb-3">
        Social Links
      </h2>
      <div className="flex items-center flex-wrap gap-5 w-[80%]">
        <a href={twitter} className="text-primary flex items-center gap-3 group">
          <TwitterIcon/> <span className="group-hover:underline">Twitter</span>
        </a>
        <a href={bandcamp} className="text-primary flex items-center gap-3 group">
          <BandcampIcon/> <span className="group-hover:underline">Bandcamp</span>
        </a>
        <a href={instagram} className="text-primary flex items-center gap-3 group">
          <InstagramIcon/> <span className="group-hover:underline">Instagram</span>
        </a>
      </div>
    </div>
  )
}

export default SocialLinks