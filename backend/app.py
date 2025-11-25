import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.messages import HumanMessage
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)   

hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

CHROMA_PATH = "vector_store"

def extract_website(url):
    try:
        html = requests.get(url).text
        soup = BeautifulSoup(html, "html.parser")
        return soup.get_text(separator="\n", strip=True)
    except:
        return "unable to fetch content"

def generate_feedback(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)

    # vector store
    vectordb = Chroma.from_texts(
        texts=chunks,
        embedding=embedding_model,
        persist_directory=CHROMA_PATH
    )

    # Prompt
    template = """
You are an AI Website Feedback Engine.
Analyze the website text and return STRICT JSON only.

TEXT CONTENT:
{text}

Return ONLY valid JSON. No explanation. No markdown. No extra text.

STRICT FORMAT:
{{
    "ui_feedback": "",
    "seo_feedback": "",
    "performance_feedback": "",
    "recommendations":""
}}
"""
    prompt = PromptTemplate(
        input_variables=["text"],
        template=template
    )

    final_prompt = prompt.format(text=text)

    endpoint_llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Meta-Llama-3-8B-Instruct",
    huggingfacehub_api_token=hf_token,
    temperature=0.2,
    max_new_tokens=512
)

    llm = ChatHuggingFace(llm=endpoint_llm)

    response = llm.invoke([HumanMessage(content=final_prompt)])

    raw= response.content
    
    try:
        parsed = json.loads(raw)
    except:
        parsed = {
            "ui_feedback": "",
            "seo_feedback": "",
            "performance_feedback": ""
        }

    return parsed

@app.route("/api/feedback", methods=["POST"])
def feedback_route():
    try:
        data = request.get_json()
        url = data.get("webUrl")

        text = extract_website(url)

        raw_feedback = generate_feedback(text)  

        structured_feedback = {}

        for category, feedback_obj in raw_feedback.items():

            if isinstance(feedback_obj, str):
                details_list = [
                    {"type": "info", "text": line.strip()} 
                    for line in feedback_obj.split(".") 
                    if line.strip()
                ]
                structured_feedback[category] = {
                    "score": min(100, max(50, 50 + len(details_list) * 5)),
                    "summary": feedback_obj,
                    "details": details_list,
                    "recommendations": []
                }

            elif isinstance(feedback_obj, dict):
                summary = feedback_obj.get("summary", "")
                details = feedback_obj.get("details", [])
                details_list = [
                    {"type": "info", "text": d} if isinstance(d, str) else d 
                    for d in details
                ]
                recommendations = feedback_obj.get("recommendations", [])

                structured_feedback[category] = {
                    "score": min(100, max(50, 50 + len(details_list) * 5)),
                    "summary": summary,
                    "details": details_list,
                    "recommendations": recommendations
                }

            else:

                structured_feedback[category] = {
                    "score": 50,
                    "summary": "",
                    "details": [],
                    "recommendations": []
                }

        return jsonify({"status": "success", "feedback": structured_feedback})

    except Exception as e:
        print("ERROR >>>", e)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
