import React ,{ useContext } from "react"
import { Link, useLocation,useNavigate } from "react-router-dom";
import _authContext from "../../context/authContext";
import {driver} from "driver.js";
//import Driver from 'driver.js';

export default function VerifiedNavbar(props) {
    const steps = [
        {
          element: '#step1',
          popover: {
            title: 'Step 1',
            description: 'This is the first step.',
            position: 'bottom'
          }
        },
        {
          element: '#step2',
          popover: {
            title: 'Step 2',
            description: 'This is the second step.',
            position: 'right'
          }
        }
      ];

      
    const startTour = () => {
        driver().drive(0)
        //const _driver = new Driver();
        //_//driver.defineSteps(steps);
        //_driver.start();
      };

    const { logout,user } = useContext(_authContext);
    const navigate = useNavigate();
    const _logout=()=>{
        logout();
        navigate('/Login')
      };

    const _location = useLocation();
    return (
        <>
        { props?.UserType == 'Admin' &&  <li id="step2"><Link className={`${_location.pathname == "/ManageUsers" ? "active" : ""} nav-link`} to="/ManageUsers">Manage</Link></li> } 
        <li id="step1"><Link className={`${_location.pathname == "/Profile" ? "active" : ""} nav-link`} to="/Profile">Profile</Link></li>
        <li id="step2"><Link className={`${_location.pathname == "/Notes" ? "active" : ""} nav-link`} to="/Notes">Notes</Link></li>
        <li id="step2"><Link className={`${_location.pathname == "/Dashboard" ? "active" : ""} nav-link`} to="/Dashboard">Tickets</Link></li>
        
        

        <li class="nav-link dropdown">
          <a class="nav-link dropdown-toggle text-center" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          { user  && user?.name && user?.name}
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><Link className={`${_location.pathname == "/ChangePassword" ? "active" : ""} dropdown-item`} to="/ChangePassword">Change Password</Link></li>
            
            <li onClick={_logout}><a class="dropdown-item" href="#">Logout</a></li>
          </ul>
        </li>
        
        </>
    );
}