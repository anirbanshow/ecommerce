import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import '../../styles/AuthStyles.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email, answer, newPassword
            });

            if (res && res.data.success) {
                toast.success(res.data.message);

                navigate("/login");
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

                <h1 className="text-center mb-3">Forgot Password Page</h1>

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
                                <label htmlFor="answer" className="form-label">Answer:</label>
                                <input type="text" className="form-control" id="answer" value={answer} required
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input type="password" className="form-control" id="password" value={newPassword} required
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Reset Password
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default ForgotPassword;