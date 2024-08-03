export const GetUserDetail=async()=>{
    let json ={}
    try {
        debugger;
        const response = await fetch('http://localhost:3001/api/auth/verifytoken', {
          method: "GET",
          credentials:'include',
          headers: {
            'Content-Type': 'application/json',
          },  
        });
  
        if (response.status=='400') {
          throw new Error(`Response status: ${response.status}`);
        }
        json = await response.json();
        
      } catch (error) {
       json={message:error.message};
      }
      return json;
}