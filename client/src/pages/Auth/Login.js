import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
                email, password
            });

            if (res && res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Layout>
            <div className='container login form-container'>

                <h1 className="text-center mb-3">Login Page</h1>

                <div className="row justify-content-center align-items-center">
                    <div className="col-md-5">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="text" className="form-control" id="email" value={email} required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input type="password" className="form-control" id="password" value={password} required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="button" className="btn btn-info mb-2"
                                onClick={() => { navigate('/forgot-password') }}
                            >
                                Forogot Password
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default Login;