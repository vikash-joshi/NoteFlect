import React from "react";
import { Link } from "react-router-dom";
export default function Home(){
    return(
        <div className="container">
          <div className="row homecontent mt-4">
            <div className="col-md-5">
            <div className="jumbotron">
  <h3 className="display-4">Capture Your Thoughts with NoteFlect</h3>
 <p>A seamless way to take notes, reflect, and organize your ideas. Whether you're jotting down quick thoughts, compiling research, or reflecting on your day, NoteFlect helps you keep everything in one place and easily accessible</p>
  <hr />
  <p>Enhance your productivity and stay organized with our intuitive features designed for every note-taker.</p>
  <Link className="btn btn-primary btn-lg" to="/Login" role="button">Get Started</Link>
</div>

            </div>
            <div className="col-md-7">
              <img className="img-fluid" src="https://img.freepik.com/free-vector/organized-archive-searching-files-database_335657-3137.jpg?t=st=1719650864~exp=1719654464~hmac=b4d1fa86e24787ec81d5267be7d7689b9f4ecd8ba1909d23ba9c20bc7d9ca4c1&w=900" />
            </div>
            </div>
        </div>
    )
}