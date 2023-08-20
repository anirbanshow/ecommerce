import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name,
                email,
                password,
                phone,
                address,
                answer
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
            <div className='container register form-container'>

                <h1 className="text-center mb-3">Register Page</h1>

                <div className="row justify-content-center align-items-center">
                    <div className="col-md-5">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input type="text" className="form-control" id="name" value={name} required
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

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

                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone:</label>
                                <input type="text" className="form-control" id="phone" value={phone} required
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea className="form-control" id="address" rows="3" value={address} required
                                    onChange={(e) => setAddress(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="text" className="form-label">Answer:</label>
                                <input type="text" className="form-control" id="phone" value={answer} required
                                    placeholder='What is your hobby ?'
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default Register;