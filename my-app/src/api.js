import axios from axios;
const API=axios.create({
    baseURL:"http://localhost:5000/api/feedback",

})
export const analyseFeedback=(data)=>API.post("/",data);