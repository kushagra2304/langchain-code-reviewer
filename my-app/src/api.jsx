import axios from "axios";
export const analyseFeedback = (formData) => {
  return axios.post("http://localhost:5000/analyse-feedback", formData);
};