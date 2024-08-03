
const fetchallUsers=async()=>{
    try {
        const response = await fetch(`http://localhost:3001/api/Admin/getUsers`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });

        const json = await response.json();
        return json;
      } catch (err) {
    return   { messsage:err.message}
    }
}


module.exports={fetchallUsers}
