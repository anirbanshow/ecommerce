import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer">
            <h5 className="text-center mb-0">
                All Right Reserver &copy; Anirban Dev
            </h5>
            <p className='text-center mt-3 mb-0'>
                <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|<Link to="/policy">Privacy Policy</Link>
            </p>
        </div>
    )
}

export default Footer;