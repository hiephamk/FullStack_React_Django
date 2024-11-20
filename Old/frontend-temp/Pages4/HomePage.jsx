import { Link } from "react-router-dom"

function App() {
  return (
    <>
      <div className="container home-page__container">
        <div className="home__buttons">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign up</Link>
        </div>
      </div>
    </>
  )
}

export default App
