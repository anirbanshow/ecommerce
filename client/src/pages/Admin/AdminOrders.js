import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from "moment";
import { Select } from 'antd';

const { Option } = Select;

const AdminOrders = () => {

    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]);
    const [changeStatus, setChangeStatus] = useState("");
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`);
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/orders-status/${orderId}`,
                { status: value }
            );
            getOrders();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center">All Orders</h1>
                        {
                            orders?.map((o, i) => {
                                return (
                                    <div className="border shadow" key={i}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Buyer</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Payment</th>
                                                    <th scope="col">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key={i}>
                                                    <th>{i + 1}</th>
                                                    <th>
                                                        <Select bordered={false}
                                                            onChange={(value) => handleChange(o._id, value)}
                                                            defaultValue={o?.status}
                                                        >
                                                            {
                                                                status.map((s, i) => (
                                                                    <Option key={i} value={s}>{s}</Option>
                                                                ))
                                                            }
                                                        </Select>
                                                    </th>
                                                    <th>{o?.buyer?.name}</th>
                                                    <th>{moment(o?.createdAt).fromNow()}</th>
                                                    <th>{o?.payment?.success ? "success" : "Failed"}</th>
                                                    <th>{o?.products?.length}</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="container">
                                            {
                                                o?.products?.map(p => (
                                                    <div className="row mb-3" key={p._id}>
                                                        <div className="col-12">
                                                            <div className="card flex-row py-2">
                                                                <div className="col-md-3">
                                                                    <img src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                                                                        className="card-img-top" alt={p.name}
                                                                    />
                                                                </div>
                                                                <div className="col-md-9 ms-3">
                                                                    <p>{p.name} </p>
                                                                    <p>{p.description.substring(0, 30)}...</p>
                                                                    <p>Price: ${p.price}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminOrders;