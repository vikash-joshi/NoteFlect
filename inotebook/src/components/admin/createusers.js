import React, { useEffect, useState } from "react";
import ToastComponent from "../common/controls/newtoast";

export default function CreateUsers({ User, onEvent }) {
  const [IsEmailVerified, SetEmailVerified] = useState(false);
  const [IsAccountLocked, SetIsAccountLocked] = useState(false);
  const [Message, SetMessage] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);


  const [UserModel, SetUserModel] = useState({
    name: "",
    email: "",
    IsAccountLocked: false,
    IsEmailVerified: false,
    UserType:'User',
    gender:'Male',
    _id: ""

  });
  useEffect(() => {
    SetIsAccountLocked(User.IsAccountLocked);

    SetEmailVerified(User.IsEmailVerified);
    SetUserModel({ name: User?.name,
      email: User?.email,
      IsAccountLocked: User?.IsAccountLocked,
      IsEmailVerified: User?.IsEmailVerified,
      UserType:User?.UserType,
      gender:User?.gender,
      _id: User?._id
  })
  handleChange('gender',User?.gender)
  handleChange('UserType',User?.UserType)
  }, [User.IsAccountLocked, User.IsEmailVerified]);

  const sendValueToParent = (value) => {
    onEvent(value);
  };

  const HandleSubmit = async (UserModel) => {
    if (UserModel) {
      if (!(UserModel?.name && UserModel?.name != "")) {
        SetMessage({ message: "Name cannot be blank", type: "text-danger" });
        handleShowToast();
      }
      if (!(UserModel?.email && UserModel?.email != "")) {
        SetMessage({ message: "Email cannot be blank", type: "text-danger" });
        handleShowToast();
      }
      if (!(UserModel?.UserType && UserModel?.UserType != "")) {
        SetMessage({
          message: "UserType cannot be blank",
          type: "text-danger"
        });
        handleShowToast();
      }

      const result = await RegisterUser(UserModel,UserModel?._id!='' ? 'update':'create');
      if (result && result?.message && result?.message != "") {
        SetMessage({
          message: result.message,
          type: result?.message.includes("1:") ? "text-success" : "text-danger"
        });
        handleShowToast();
        setTimeout(() => {
          if(result?.message.includes("1:"))
            {
              sendValueToParent(true);
            }  
        }, 500);
        
      }
    }
  };
  const handleCheckboxChange = (event, call) => {
    const isChecked = event.target.checked;
    if (call == "IsAccountLocked") {
      SetIsAccountLocked(isChecked);
      SetUserModel((prev) => ({
        ...prev,
        IsAccountLocked: isChecked
      }));
    }
    else if(call == 'IsEmailVerified')
    {
      SetEmailVerified(isChecked);
      SetUserModel((prev) => ({
        ...prev,
        IsEmailVerified: isChecked
      }));

    }
  };

  const handleChange = (field, value, call) => {
    if (call == undefined) {
      call = true;
    }
    if (call == true) {
      if (field === "name" && call) {
        UserModel.name = value;
        SetUserModel((prev) => ({
          ...prev,
          name: value
        }));
      }
      if (field === "email" && call) {
        UserModel.email = value;
        SetUserModel((prev) => ({
          ...prev,
          email: value
        }));
      }
      if (field === "gender" && call) {
        UserModel.gender = value;
        SetUserModel((prev) => ({
          ...prev,
          gender: value
        }));
      }
      if (field === "UserType" && call) {
        UserModel.UserType = value;
        SetUserModel((prev) => ({
          ...prev,
          UserType: value
        }));
      }
     // SetUserModel(UserModel)
    }
  };

  const RegisterUser = async (User,Methods) => {
    try {
      const response = await fetch("http://localhost:3001/api/Admin/"+Methods, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: User?.name,
          email: User?.email,
          Gender: User?.gender,
          UserType: User?.UserType,
          IsAccountLocked: User?.IsAccountLocked,
          IsEmailVerified: User?.IsEmailVerified,
          
          UserType:User?.UserType,
          _id: User?._id
        })
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <div
        className="position-fixed top-2 end-0 p-3"
        style={{ zIndex: 11, marginTop: "-55px" }}
      >
        <ToastComponent
          show={showToast}
          onClose={handleCloseToast}
          type={Message.type}
          message={Message.message}
          duration={3000}
        />
      </div>

      <div className="row">
        <div className="col-md-2"></div>
        <div
          className="col-md-8"
          style={{
            backgroundColor: "rgb(3 85 189 / 71%)",
            borderRadius: "15px",
            color: "white"
          }}
        >
          <div className="pt-3 pb-2 text-center">
            <h4>Add User</h4>
          </div>
          <div class="form-group d-block">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input
              onInput={(e) => handleChange("email", e.target.value)}
              type="email"
              value={UserModel.email}
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
          </div>
          <div class="form-group  d-block">
            <label htmlFor="exampleInputPassword1">UserName</label>
            <input
              onInput={(e) => handleChange("name", e.target.value)}
              type="text"
              value={UserModel.name}
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Enter username"
            />
          </div>
          <div class="form-group  d-block">
            <label htmlFor="exampleFormControlSelect1">Select Gender</label>
            <select
              onInput={(e) => handleChange("gender", e.target.value)}
              value={UserModel.gender}
              class="form-control"
              id="exampleFormControlSelect1"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div class="form-group  d-block">
            <label htmlFor="exampleFormControlSelect2">Select Usertype</label>
            <select
              onInput={(e) => handleChange("UserType", e.target.value)}
              value={UserModel.UserType}
              class="form-control"
              id="exampleFormControlSelect2"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {UserModel.UserType}
          </div>
          <div class="form-check  d-block">
            <input
              checked={IsAccountLocked}
              onChange={(event) =>
                handleCheckboxChange(event, "IsAccountLocked")
              }
              value={UserModel.IsAccountLocked}
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" htmlFor="exampleCheck1">
              Is Account Locked
            </label>
          </div>
          <div class="form-check  d-block">
            <input
              checked={IsEmailVerified}
              onChange={(event) =>
                handleCheckboxChange(event, "IsEmailVerified")
              }
              value={UserModel.IsEmailVerified}
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" htmlFor="exampleCheck1">
              Is Email Verified
            </label>
          </div>
          <button
            onClick={() => HandleSubmit(UserModel)}
            class="btn bg-white text-primary"
          >
            Submit
          </button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={sendValueToParent} class="btn bg-white text-primary">
            Go Back
          </button>
          <form></form>
        </div>
        <div className="col-md-2"></div>
      </div>
    </>
  );
}
