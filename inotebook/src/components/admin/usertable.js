import React from 'react';
import './admin.css';
import { formatDistanceToNow } from "date-fns";
export default function TableUsers ({UserList, onEvent }) {

  const sendValueToParent = (value) => {
    onEvent(value);
  };
  return (
    <table className="table table-striped">
    <thead>
      <tr className="text-end d-none">
        <th colspan="9">
          <span
            style={{ cursor: "pointer" }}
            className="btn btn-outline-secondary btn-sm d-inline-flex justify-content-center align-item-center"
          >
            <span
              style={{ fontSize: "20px" }}
              class="material-symbols-outlined"
            >
              autorenew
            </span>{" "}
            <span>Refresh</span>
          </span>
        </th>
      </tr>
      <tr>
        <th scope="col">#</th>
        <th scope="col">UserName</th>
        <th scope="col">Email</th>
        <th scope="col">Email Verified</th>
        <th scope="col">UserType</th>
        <th scope="col">IsLocked</th>
        <th scope="col">CreatedOn</th>
        <th scope="col">Handle</th>
      </tr>
    </thead>
    <tbody>
      {UserList &&
        UserList.length > 0 &&
        UserList.map((ele, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{ele.name}</td>
            <td>{ele.email}</td>
            <td>
              {ele.IsEmailVerified ? (
                <span className="badge bg-success">Verified</span>
              ) : (
                <span className="badge bg-danger">Unverified</span>
              )}
            </td>
            <td>{ele.UserType}</td>{" "}
            {/* Assuming you have a userType field */}
            <td>
              {ele.IsAccountLocked ? (
                <span class="material-symbols-outlined text-danger">
                  lock
                </span>
              ) : (
                <span class="text-success material-symbols-outlined">
                  lock_open
                </span>
              )}
            </td>{" "}
            {/* Assuming you have an accountLocked field */}
            <td>
              {" "}
              {formatDistanceToNow(ele.createdAt, {
                addSuffix: true
              })}
            </td>{" "}
            {/* Placeholder for any action buttons */}
            <td>
              <span  onClick={()=>sendValueToParent(ele)}
                style={{ cursor: "pointer" }}
                class="text-primary material-symbols-outlined"
              >
                edit_square
              </span>
              &nbsp;
              <span onClick={()=>sendValueToParent(ele)}
                style={{ cursor: "pointer" }}
                class="text-danger material-symbols-outlined"
              >
                delete
              </span>
            </td>{" "}
            {/* Placeholder for any action buttons */}
            <td></td> {/* Placeholder for any action buttons */}
          </tr>
        ))}
    </tbody>
  </table>
  );
};

