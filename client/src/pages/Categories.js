import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import useCategory from '../hooks/useCategory';
import { Link } from 'react-router-dom';

const Categories = () => {

    const categories = useCategory();

    return (
        <Layout>

            <section className="banner">
                <img src="images/banner.png" alt="Banner Image" className="w-100" />
            </section>

            <div className="container-fluid">
                <div className="row my-5">

                    <div className="col-md-3">
                        {
                            categories.map((c) => (
                                <Link to={`/category/${c.slug}`} className="btn btn-primary d-block mb-2">
                                    {c.name}
                                </Link>
                            ))
                        }
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default Categories;