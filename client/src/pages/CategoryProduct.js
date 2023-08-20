import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryProduct = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    const getProductsByCat = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (params?.slug) getProductsByCat();
    }, [params?.slug]);

    return (
        <Layout>

            <section className="banner">
                <img src="http://localhost:3000/images/banner.png" alt="Banner Image" className="w-100" />
            </section>

            <div className="container-fluid ">
                <h4 className="text-center mt-3">{category?.name}</h4>
                <h6 className="text-center mt-3">{products?.length} result found</h6>

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
                                    <p className="card-text">${p.price}</p>
                                    <button className="btn btn-primary me-2"
                                        onClick={() => navigate(`/product/${p.slug}`)}
                                    >
                                        More Details
                                    </button>
                                    <button className="btn btn-secondary">ADD TO CART</button>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </Layout>
    )
}

export default CategoryProduct;