import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from "braintree-web-drop-in-react";

const CartPage = () => {

    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();

    const [clientToken, setClientToken] = useState("");
    const [instance, setinstance] = useState("");
    const [loading, setLoading] = useState(false);

    const naigate = useNavigate();


    // total price
    const totalPrice = () => {
        try {
            let total = 0;

            cart?.map(item => {
                return total = total + item.price;
            })
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            });
        } catch (error) {
            console.log(error);
        }
    }

    // delete item
    const removeCartItem = async (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex(item => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    }

    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    // handle payments
    const handlePayment = async () => {
        try {
            setLoading(true)
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment/`, {
                nonce, cart
            });
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            naigate("/dashboard/user/orders");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="container">

                <div className="row my-5">
                    <div className="col-md-12">
                        <h1 className="text-center bg-light p-2">
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className="text-center">
                            {
                                cart?.length > 0 ? `You have ${cart.length} items in your cart 
                                    ${auth?.token ? "" : "Please login to checkout"} `
                                    : "Your cart is empty"
                            }
                        </h4>
                    </div>
                </div>

                <div className="row my-5">

                    <div className="col-md-6">
                        {
                            cart?.map(p => (
                                <div className="row mb-3" key={p._id}>
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
                                            <button className="btn btn-danger"
                                                onClick={() => removeCartItem(p._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="col-md-6">
                        <h3>Cart Summary</h3>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total: {totalPrice()}</h4>
                        {
                            auth?.user?.address ? (
                                <>
                                    <div className="mb-3">
                                        <h4>Current Address:</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button className="btn btn-outline-warning"
                                            onClick={() => naigate('/dashboard/user/profile')}
                                        >
                                            Update Address
                                        </button>
                                    </div>
                                </>
                            ) : (<>
                                <div className="mb-3">
                                    {
                                        auth?.token ? (
                                            <button className="btn btn-outline-warning"
                                                onClick={() => naigate('/dashboard/user/profile')}
                                            >
                                                Update Address
                                            </button>
                                        ) : (
                                            <button className="btn btn-outline-warning"
                                                onClick={() => naigate('/login', {
                                                    state: "/cart"
                                                })}
                                            >
                                                Please Login to Checkout
                                            </button>
                                        )
                                    }
                                </div>
                            </>)
                        }

                        {
                            !clientToken || !cart?.length ? ("") : (
                                <>
                                    <DropIn
                                        options={{
                                            authorization: clientToken,
                                            paypal: {
                                                flow: 'vault'
                                            }
                                        }}
                                        onInstance={instance => setinstance(instance)}
                                    />

                                    <button className="btn btn-primary"
                                        onClick={handlePayment}
                                        disabled={loading || !instance || !auth?.user?.address}
                                    >
                                        {loading ? "Processing..." : " Make Payment"}
                                    </button>
                                </>
                            )
                        }

                    </div>

                </div>

            </div>
        </Layout>
    )
}

export default CartPage;