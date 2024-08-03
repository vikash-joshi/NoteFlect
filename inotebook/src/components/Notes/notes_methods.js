const SaveNotes=async (Notes)=>{
    try {
        console.log(Notes)
        const response = await fetch("http://localhost:3001/api/Notes/AddNote", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
            

          },
          body: JSON.stringify({
            title:Notes?.title,
            catgory:Notes?.category,
            content:Notes?.content,
            Id:''
          })
        });
        if (!response.ok) {
          throw new Error(response.message);
        }
        const json = await response.json();
        return json;
      } catch (error) {
        console.error(error.message);
      }


}

const RemoveNote=async (Notes)=>{
  try {
      console.log(Notes)
      const response = await fetch("http://localhost:3001/api/Notes/RemoveNote", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
       note:Notes?._id
        })
      });
      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }
      const json = await response.json();
      return json;
    } catch (error) {
      return   { messsage:error.message}
    }


}

const FetchCategory=async()=>{
    try {
        const response = await fetch("http://localhost:3001/api/Notes/GetAllCategory", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
  
        if (response.status == "400") {
          throw new Error(`Something Went Wrong ${response.message}`);
        }
        const json = await response.json();
        return json;
      } catch (err) {
    return   { messsage:err.message}
    }
}

const FetchAllNotes=async(Page=1)=>{
    try {
        const response = await fetch(`http://localhost:3001/api/Notes/GetAllNotesByUser?Page=${Page}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
  
        if (response.status == "400") {
          throw new Error(`Something Went Wrong ${response.message}`);
        }
        const json = await response.json();
        return json;
      } catch (err) {
    return   { messsage:err.message}
    }
}


const FetchNotesByCategory=async(Note,Page=1)=>{
    try {
        const response = await fetch(`http://localhost:3001/api/Notes/GetAllNotesByCategory?Page=${Page}&category=${Note?.category}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.status == "400") {
          throw new Error(`0:Something Went Wrong ${response.message}`);
        }
        const json = await response.json();
        return json;
      } catch (err) {
    return   { messsage:'0:'+err.message}
    }
}

  module.exports = { SaveNotes,FetchCategory,FetchNotesByCategory,FetchAllNotes,RemoveNote }