import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from "../../context/auth";
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {

    // context
    const [auth, setAuth] = useAuth();

    // state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // get user data
    useEffect(() => {
        const { name, email, phone, address } = auth?.user;
        setName(name);
        setEmail(email);
        setPhone(phone);
        setAddress(address)
    }, [auth?.user]);

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`, {
                name,
                email,
                password,
                phone,
                address
            });

            if (data?.error) {
                console.log(data?.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data?.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile updated successfully...");
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Layout>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h4 className="bg-light-subtle">User Profile</h4>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input type="text" className="form-control" id="name" value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="text" className="form-control" id="email" value={email} disabled
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input type="password" className="form-control" id="password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone:</label>
                                <input type="text" className="form-control" id="phone" value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea className="form-control" id="address" rows="3" value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                UPDATE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile