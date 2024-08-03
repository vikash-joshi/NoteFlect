import React, { useEffect, useState, useContext } from "react";
import { GetUserDetail } from "../common/User_Detail";
import _authContext from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function Profile() {
  const [user, setuser] = useState({});
  const { logout, login } = useContext(_authContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      let Result = await FetchRequtes();
      if (Result && !Result?.message) {
        const json = Result;
        Result = await Fetchuser(json["id"]);
        console.clear();
        console.log(Result);
        if (Result?.message) {
          logout();
          navigate("/Login");
        } else {
          const res = Result;
          setuser(res);
          login(res);
        }
      } else {
        logout();
        navigate("/Login");
      }
    };

    fetchData();

    // Cleanup function if needed
    return () => {
      // Code to run on component unmount (cleanup)
    };
  }, []);
  const FetchRequtes = async () => {
    try {
      debugger;
      const response = await fetch(
        "http://localhost:3001/api/auth/verifytoken",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status == "400") {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      login();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  };

  const Fetchuser = async (Id) => {
    try {
      debugger;
      const response = await fetch(
        "http://localhost:3001/api/users/getuser/" + Id,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status == "400") {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json[0];
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container">
        <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6"><div className="registration-form">
      <div className="profile-picture">
        <img src="https://as1.ftcdn.net/v2/jpg/07/49/75/12/1000_F_749751249_V2nKiTNbk1F0Y91WIAXeqsDX61RuVrkF.jpg" alt="Profile" />
      </div>
      <form>
      <div className="form-group">
          <label className="disablelabel">{user.email}</label>
        </div>
           <div className="form-group">
        <input type="text" placeholder="User Name" value={user.name} />
                </div>
     
        <div className="form-group">
        <select
                        className="form-select"
                        aria-label="Default select example"
                        value={user.gender == 'Male' ? 1 : user.gender == 'Female' ? 2:3 }>
                        <option value="1"> Male</option>
                        <option value="2">Female</option>
                        <option value="3">Other's</option>
                      </select>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Phone Number" value={user.phoneNumber} />
        </div>
        <div className="form-group">
        <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="User Bio" rows="3" value={user.UserBio}></textarea>
        </div>
        <button type="submit" className="submit-btn">Update Profile</button>
      </form>
    </div></div>
            <div className="col-md-3"></div>
        </div>
     
    </div>
  );
}
