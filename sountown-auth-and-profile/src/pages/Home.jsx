import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="grid place-items-center h-screen text-white font-semibold">
      <div className="space-x-5">
        <Link to={'/login'} className="hover:underline">
          Login Form
        </Link>
        <Link to={'/profile'} className="hover:underline">
          Profile Page
        </Link>
      </div>
    </div>
  )
}

export default Home