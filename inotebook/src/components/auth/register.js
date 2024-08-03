import React, { useState } from "react";
import { Link } from "react-router-dom";
import ToastComponent from "../common/controls/newtoast";

export default function Register() {
  const [EyeIcon, SetEyeIcon] = useState("visibility");
  const [errors, SetMessage] = useState({});
  const [name, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Gender, handleSelectChange] = useState("1");

  const handleForm = (field, value, call) => {
    return validate(field, value);
  };
  const handleChange = (field, value, call) => {
    if (call == undefined) {
      call = true;
    }
    if (call == true) {
      if (field === "name" && call) {
        setUserName(value);
      }
      if (field === "email" && call) {
        setEmail(value);
      }
      if (field === "password" && call) {
        setPassword(value);
      }
    }
    validate(field, value);
  };

  const validate = (field, value) => {
    const newErrors = { ...errors };

    if (field === "name") {
      if (!value) {
        newErrors.name = "Name Cannot be Blank / Empty";
      } else {
        delete newErrors.name;
      }
    }

    if (field === "email") {
      if (!value) {
        newErrors.email = "Email Cannot be Blank / Empty";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Email format is invalid";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      if (!value) {
        newErrors.password = "Password Cannot be Blank / Empty";
      } else {
        delete newErrors.password;
      }
    }

    SetMessage(newErrors);
    return newErrors;
  };

  const RegisterUser = async (name, email, password, gender) => {
    try {
      const response = await fetch("http://localhost:3001/api/Users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          Gender: gender,
          phoneNumber: "1234567890",
          UserBio: "Hello World",
          password: password,
          UserType:'user'
        })
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  };

  const OnSubmits = async (event) => {
    event.preventDefault();
    let _errors = {};
    console.log(name, Email, Password, Gender);
    _errors = handleForm("name", name, false);
    if (!_errors || Object.keys(_errors)?.length == 0) {
      _errors = _errors ? _errors : {};
      _errors = handleForm("email", Email, false);
      if (!_errors || Object.keys(_errors)?.length == 0) {
        _errors = _errors ? _errors : {};
        _errors = handleForm("password", Password, false);
        _errors = _errors ? _errors : {};
      }
    }
    console.clear();
    console.log(_errors);
    if (
      _errors != null &&
      _errors != undefined &&
      Object.keys(_errors)?.length == 0
    ) {
      let result = await RegisterUser(
        name,
        Email,
        Password,
        Gender == 1 ? "Male" : Gender == 2 ? "Female" : "Other"
      );
      if(result && result?.message && result?.message!='')
        {
          Setmessage({ message: result.message, type:result?.message.includes('1:') ? 'text-success': "text-danger" });
          handleShowToast();
        }
    }
  };

  const TogglePassword = () => {
    let _togglepwd = document.getElementById("togglepwd");
    let inputPassword3 = document.getElementById("inputPassword3");

    if (_togglepwd && inputPassword3) {
      SetEyeIcon(
        inputPassword3.type == "text" ? "visibility" : "visibility_off"
      );
      inputPassword3.type = inputPassword3.type == "text" ? "password" : "text";
    }
  };

  
  const [Message, Setmessage] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div style={{ backgroundColor: "white", height: "auto" }}>
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
      <div
        className="container mt-5"
        style={{ border: "1.5px solid #e1e1e1", borderRadius: "3px" }}
      >
        <div className="row">
          <div
            className="col-md-6 left-panel text-white"
            style={{ backgroundColor: "#0052c0" }}
          >
            <div className="m-5 resigters" style={{ padding: "50px" }}>
              <div>
                <h1>Welcome Back</h1>
              </div>
              <div>
                <p>
                  To keep connected with us please login with your personal
                  information.
                </p>
              </div>
              <div>
                <Link to="/Login">
                  <button
                    type="submit"
                    style={{ width: "100%", borderRadius: "30px" }}
                    className="btn btn-primary"
                  >
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 bg-white right-panel">
            <div style={{ padding: "30px" }}>
              <div>
                <h3 className="text-center">Register</h3>
              </div>
              <form
                onSubmit={(e) => {
                  OnSubmits(e);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: " center"
                  }}
                >
                  <div className="form-group row ">
                    <label
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                    >
                      Name
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="inputEmail3"
                        placeholder="Name"
                        onInput={(e) => handleChange("name", e.target.value)}
                      />
                      <div className="col-sm-12 mt-2">
                        {errors.name && (
                          <p
                            className="text-danger"
                            style={{ fontSize: "10px" }}
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row ">
                    <label
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                    >
                      Email
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="inputEmail3"
                        placeholder="Email"
                        onInput={(e) => handleChange("email", e.target.value)}
                      />
                      <div className="col-sm-12 mt-2">
                        {errors.email && (
                          <p
                            className="text-danger"
                            style={{ fontSize: "10px" }}
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row mb-2">
                    <label
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                    >
                      Gender
                    </label>
                    <div className="col-sm-10">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        value={Gender}
                        onInput={(e) => handleSelectChange(e.target.value)}
                      >
                        <option value="1"> Male</option>
                        <option value="2">Female</option>
                        <option value="3">Other's</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group  row">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label"
                      style={{marginLeft: '-17px'}}
                    >
                      Password
                    </label>
                    <div className="col-sm-10 passwords">
                      <input
                        type="password"
                        className="form-control"
                        id="inputPassword3"
                        placeholder="Password"
                        onInput={(e) =>
                          handleChange("password", e.target.value)
                        }
                      />
                      <span
                        id="togglepwd"
                        onClick={TogglePassword}
                        className="eyeicon material-symbols-outlined"
                      >
                        {EyeIcon}
                      </span>
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-10 mt-2">
                      {errors.email && (
                        <p className="text-danger" style={{ fontSize: "10px" }}>
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="form-group mt-2 row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-10">
                      <input
                        type="submit"
                        style={{ width: "100%", borderRadius: "30px" }}
                        className="btn btn-primary"
                        value="Submit"
                      />
                    </div>
                  </div>
                  <div>
                    {/*_Message && _Message?.length > 0 ? (
                      <ul
                        className="alert alert-danger d-flex align-items-center"
                        style={{ listStyle: "none" }}
                      >
                        {_Message &&
                          _Message.map((x) => (
                            <li name={"ps" + x.index} id={"ps" + x.index}>
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: "15px" }}
                              >
                                error
                              </span>
                              &nbsp;
                              {x.message}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      ""
                    ) */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
