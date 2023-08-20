import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [product, setproduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    // get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setproduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (params?.slug) getSingleProduct();
    }, [params?.slug]);

    // get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <div className="container-fluid">

                <div className="row mt-5 mb-3">
                    <div className="col-md-3">
                        <img
                            src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
                            className="card-img-top"
                            alt={product.name}
                        />
                    </div>
                    <div className="col-md-9">
                        <h3>Product Details</h3>
                        <h6>Name: {product.name} </h6>
                        <h6>Description: {product.description}</h6>
                        <h6>Price: {product.price}</h6>
                        <h6>Category: {product?.category?.name}</h6>
                        <button className="btn btn-secondary">ADD TO CART</button>
                    </div>
                </div>

                <hr className="border border-primary border-3 opacity-75"></hr>

                <div className='row mb-5'>
                    <h3>Similar Products</h3>

                    {relatedProducts.length < 1 && <p>No Similar Products Found</p>}

                    <div className='d-flex flex-wrap products'>
                        {
                            relatedProducts?.map(p => (
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
                                        <button className="btn btn-secondary">ADD TO CART</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default ProductDetails;