import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BiLogInCircle } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux'
import { login, reset, getUserInfo } from '../features/auth/authSlice'
//import { toast } from 'react-toastify'
import Spinner from "../components/Spinner"

const LoginPage = () => {

    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
    })

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password,
        }
        dispatch(login(userData))
    }


    useEffect(() => {
        if (isError) {
            //toast.error(message)
        }

        if (isSuccess || user) {
            navigate("/home")
        }

        dispatch(reset())
        dispatch(getUserInfo())

    }, [isError, isSuccess, user, navigate, dispatch])



    return (
        <>
            <div className="auth__container">
                <h1 className="main__title">Login <BiLogInCircle /></h1>

                {isLoading && <Spinner />}

                <form className="auth__form">
                    <input type="text"
                        placeholder="email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        required
                    />
                    <input type="password"
                        placeholder="password"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        required
                    />
                    <Link to="/reset-password">Forget Password ?</Link>

                    <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Login</button>
                <p style={{color:'#fff'}}>Don&apos;t you have account yet? <Link to="/register">Sign up</Link></p>
                <Link to="/home/publiczone"><h3>Public Zone</h3></Link>
                </form>
            </div>
        </>
    )
}

export default LoginPage