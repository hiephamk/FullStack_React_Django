
import { Link } from "react-router-dom"

function HomePage() {
  return (
    <>
      <div className="container home-page__container">
        <h1 className="main__title">Infacad</h1>
        <div className="home__buttons">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign up</Link>
          
        </div>
      </div>
    </>
  )
}

export default HomePage