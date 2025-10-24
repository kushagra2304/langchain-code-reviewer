import React, {useState} from "react";
import { analyseFeedback } from "../api";
export default function Feedbackform(){
    const [formData,setFormData]=useState({
        userEmail:"",
        webUrl:"",
    })
    const [feedback,setFeedback]=useState(null);
    const [loading, setLoading]=useState(false);
    const handleChange=(e)=>{
        setFeedback({...formData,[e.target.name]:e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const res=await analyseFeedback(formData)
            setFeedback(res.data.data);

        }catch(err){
            alert("Error generating feedback");
        }
        setLoading(false);
    };
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">AI FeedBack Engine</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                name="userEmail"
                placeholder="Email"
                onChange={handleChange}
                className="border p-2 rounded"
                 />
                 <input 
                 name="webUrl"
                 placeholder="Website URL"
                 onChange={handleChange}
                 className="border p-2 rounded"
                 
                 />
                 <button 
                 type="submit"
                 className="bg-blue-200 text-white rounded p-2 hover:bg-blue-400"
                 >
                    {loading ? "Analysing...": "Get AI feedback"}
                 </button>
            </form>
            {
                feedback&&(
                    <div>
                        <h3>Feedback Report</h3>
                        <p>UI/UX:{feedback.ui_feedback}</p>
                        <p>SE0:{feedback.seo_feedback}</p>
                        <p>Performance:{feedback.performance_feedback}</p>
                    </div>
                )
            }
        </div>
    )
}
