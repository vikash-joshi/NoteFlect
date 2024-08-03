import React from "react"
import { Link, useLocation } from "react-router-dom";
export default function UnVerifiedNavbar() {
    const _location = useLocation();
    return (
        <>
        <li><Link className={`${_location.pathname == "/Home" ? "active" : ""} nav-link`} to="/Home">Home</Link></li>
        <li><Link className={`${_location.pathname == "/About" ? "active" : ""} nav-link`} to="/About">About</Link></li>
        <li><Link className={`${_location.pathname == "/Register" ? "active" : ""} nav-link`} to="/Register">Register</Link></li>
        <li><Link className={`${_location.pathname == "/Login" ? "active" : ""} nav-link`} to="/Login">Login</Link></li>
        </>
    );
}