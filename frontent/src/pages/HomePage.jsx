import { Link } from "react-router-dom"
import LoginPage from "./LoginPage"

function App() {
  return (
    <div className="home-container container">
      <h1>Welcome to ZONE2ROCK</h1>
      <div className="home-content">
        <div 
          style={{
            width:'40%',
            border:'1px solid #111',
            padding:'10px',
            margin: '10px'
          }}>
          <div>
            <LoginPage/>
          </div>
        </div>
        <div 
          style={{
            width:'40%',
            border:'1px solid #111',
            padding:'10px',
            margin:'10px'
          }}>
          <Link to="/home/publiczone">Public Zone</Link>
        </div>
      </div>
    </div>
  )
}

export default App
