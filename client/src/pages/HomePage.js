import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart';

const HomePage = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [cart, setCart] = useCart();

    // get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);

            if (data?.success) {
                setCategories(data?.category);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    // get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product//product-list/${page}`);
            setLoading(false);
            if (data?.success) {
                setProducts(data?.products);
            }

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    // filterby category
    const handleFilter = (value, id) => {
        let all = [...checked];

        if (value) {
            all.push(id);
        } else {
            all = all.filter(c => c !== id);
        }
        setChecked(all);
    }

    // get Total Count
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    }

    // get filter product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, {
                checked, radio
            });
            setProducts(data?.products);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (page === 1) return;
        loadmore();
    }, [page]);

    //load more
    const loadmore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product//product-list/${page}`);
            setProducts([...products, ...data?.products]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    // life cycle method
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    return (
        <Layout title={"About us - Ecommerce app"}>

            <section className="banner">
                <img src="images/banner.png" alt="Banner Image" className="w-100" />
            </section>

            <div className="container-fluid">
                <div className="row my-5">

                    <div className="col-md-3">

                        {/* Filter By Category */}
                        <h4 className='text-center'>Filter By Category</h4>
                        <div className="d-flex flex-column">
                            {
                                categories?.map(c => (
                                    <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                        {c.name}
                                    </Checkbox>
                                ))
                            }
                        </div>

                        {/* Filter By Price */}
                        <h4 className='text-center mt-2'>Filter By Price</h4>
                        <div className="d-flex flex-column">
                            <Radio.Group onChange={e => setRadio(e.target.value)}>
                                {
                                    Prices.map(p => (
                                        <div key={p._id}>
                                            <Radio value={p.array}>{p.name}</Radio>
                                        </div>
                                    ))
                                }
                            </Radio.Group>
                        </div>

                        {/* Filter By Reset */}
                        <h4 className='text-center mt-2'>Reset Filter</h4>
                        <div className="d-flex flex-column">
                            <button className="btn btn-danger" onClick={() => window.location.reload()}>RESET FILTERS</button>
                        </div>

                    </div>

                    <div className="col-md-9">
                        <h1 className='text-center'>All Products</h1>

                        <div className='d-flex flex-wrap products'>
                            {
                                products?.map(p => (
                                    <div className="card m-2" key={p._id}>
                                        <img src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                                            className="card-img-top" alt={p.name}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name} </h5>
                                            <p className="card-text">{p.description.substring(0, 30)}...</p>
                                            <p className="card-text">$ {p.price}</p>
                                            <button className="btn btn-primary me-2"
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                            >
                                                More Details
                                            </button>
                                            <button className="btn btn-secondary"
                                                onClick={() => {
                                                    setCart([...cart, p]);
                                                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                                }}
                                            >
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/*** Pagination ***/}
                        <div className='m-2 p-3'>
                            {
                                products && products.length < total && (
                                    <button className="btn btn-warning"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(page + 1);
                                        }}>
                                        {loading ? "Loading..." : "Load More"}
                                    </button>
                                )
                            }
                        </div>

                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default HomePage;