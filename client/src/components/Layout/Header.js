import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { GiShoppingBag } from 'react-icons/gi';
import { useAuth } from '../../context/auth';
import SeachInput from '../Form/SeachInput';
import useCategory from "../../hooks/useCategory";
import { useCart } from '../../context/cart';

const Header = () => {

    const [auth, setAuth] = useAuth();
    const [cart] = useCart();

    const categories = useCategory();

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: null
        })
        localStorage.removeItem("auth");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01"
                        aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarTogglerDemo01">

                        <Link className="navbar-brand" to="/">
                            <GiShoppingBag />  Ecommerce APP
                        </Link>

                        <SeachInput />

                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink
                                    to="/"
                                    className="nav-link"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to={"/categories"}
                                    data-bs-toggle="dropdown"
                                >
                                    Categories
                                </Link>

                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item" to={`/categories`}>All Categories</Link>
                                    </li>
                                    {
                                        categories.map(c => (
                                            <li key={c._id}>
                                                <Link className="dropdown-item" to={`/category/${c.slug}`}>
                                                    {c.name}
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </li>
                            {
                                !auth.user ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink
                                                to="/register"
                                                className="nav-link"
                                            >
                                                Register
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                to="/login"
                                                className="nav-link"
                                            >
                                                Login
                                            </NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                                aria-expanded="false">
                                                {
                                                    auth?.user?.name
                                                }
                                            </a>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <NavLink
                                                        className="dropdown-item"
                                                        to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                                                    >
                                                        Dashboard
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/login"
                                                        className="dropdown-item"
                                                        onClick={handleLogout}
                                                    >
                                                        Logout
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                )
                            }
                            <li className="nav-item">
                                <NavLink
                                    to="/cart"
                                    className="nav-link"
                                >
                                    Cart {cart?.length}
                                </NavLink>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;