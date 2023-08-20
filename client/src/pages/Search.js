import React from 'react';
import Layout from '../components/Layout/Layout';
import { useSearch } from '../context/Search';
import { useNavigate } from 'react-router-dom';

const Search = () => {

    const navigate = useNavigate();

    const [values, setValues] = useSearch();

    return (
        <Layout>

            <section className="banner">
                <img src="images/banner.png" alt="Banner Image" className="w-100" />
            </section>

            <div className="container-fluid">

                <div className="text-center">
                    <h1>Search Result</h1>
                    <h6>
                        {
                            values?.results.length < 1
                                ? "No Products Found"
                                : `Found ${values.keyword}`
                        }
                    </h6>

                    <div className='d-flex flex-wrap products'>
                        {
                            values?.results?.map(p => (
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

                <div></div>

            </div>
        </Layout>
    )
}

export default Search;