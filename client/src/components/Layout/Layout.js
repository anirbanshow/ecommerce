import React from 'react';
import Header from './Header';
import Footer from './Footer';

import { Toaster } from 'react-hot-toast';

const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <>
            <Header />
            <main>
                <Toaster />
                {children}
            </main>
            <Footer />
        </>
    )
}

Layout.defaultProps = {
    title: "Ecommerce app - shop now",
    description: "mern stack app",
    keywords: "mern, react, node mongdb",
    author: "anirban dev"
}

export default Layout;