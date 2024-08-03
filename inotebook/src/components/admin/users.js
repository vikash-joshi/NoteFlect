import React, { useContext, useEffect, useState } from "react";
import { fetchallUsers } from "./admin_methods";
import _authContext from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import { formatDistanceToNow } from "date-fns";
import TableSkeletonLoader from "./table.skeleton";
import TableUsers from "./usertable";
import CreateUsers from "./createusers";

export default function Users() {
  const navigate = useNavigate();
  const [User,SetUser]=useState({})
  const { isAuthenticated, logout } = useContext(_authContext);
  const [UserList, SetUserLists] = useState([]);
  const [Loading, SetLoading] = useState(true);
  const [Grid_Form,setGridOrForm]=useState(true);
  const HanldeState = async(value) => {
    
    setGridOrForm(!Grid_Form);
    if(!Grid_Form){
    SetUser({ name: "",
      email: "",
      IsAccountLocked: false,
      IsEmailVerified: false,
      UserType:'',
      gender:'',
      _id: ""
  })
  if(value)
  {
    let res=await _fetchData();
  }
    }
  };

  const _fetchData = async () => {
    SetLoading(true);
    if (isAuthenticated) {
      let Res = await fetchallUsers();
      console.log(Res);
      if (Res && Res.message == undefined) {
        setTimeout(() => {
          SetLoading(false);
        }, 1000);
        SetUserLists(Res);
      } else {
        logout();
        navigate("/Login"); // Handle the case where there's no message or an empty message
      }
    } else {
      logout();
      navigate("/Login");
    }
  };

  const handleChildEvent = (value) => {
    //setMessage(value);
    //SetUser(value)
    SetUser({ name: value?.name,
      email: value?.email,
      IsAccountLocked: value?.IsAccountLocked,
      IsEmailVerified: value?.IsEmailVerified,
      UserType:value?.UserType,
      gender:value?.gender,
      _id: value?._id
  })
    HanldeState();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        let Res = await fetchallUsers();
        console.log(Res);
        if (Res && Res.message == undefined) {
          setTimeout(() => {
            SetLoading(false);
          }, 1000);
          SetUserLists(Res);
        } else {
          logout();
          navigate("/Login"); // Handle the case where there's no message or an empty message
        }
      } else {
        logout();
        navigate("/Login");
      }
    };
    fetchData();
    return () => {
      // Code to run on component unmount (cleanup)
    };
  }, [isAuthenticated, logout, navigate]);

  return (
    <>
      {Loading && <TableSkeletonLoader />}
      {!Loading && Grid_Form && <div className="row"> 
        <div className="col-md-7">{Grid_Form ? 'User Management':'Add User'} </div>
        <div className="col-md-5 d-flex justify-content-end">
          {Grid_Form && <button style={{marginLeft:'10px'}}
            type="button"
            onClick={_fetchData}
            className=" ml-10 btn btn-outline-warning justify-content-center align-items-center d-flex"
          >
            <span class="material-symbols-outlined">sync</span> Refresh
          </button> }
          <button style={{marginLeft:'10px'}}
            type="button"
            onClick={HanldeState}
            className=" ml-10 btn btn-primary justify-content-center align-items-center d-flex"
          >
            <span class="material-symbols-outlined">{Grid_Form ? 'person_add':'arrow_back'}</span>{Grid_Form ? 'Add':'Back'}
          </button>
        </div>
      </div> }
      {Loading == false  && (<>{ Grid_Form ? <TableUsers UserList={UserList} onEvent={handleChildEvent} />:<CreateUsers User={User} onEvent={HanldeState} /> }</>)}
    </>
  );
}
