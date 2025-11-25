import requests
from bs4 import BeautifulSoup
from langchain_community.vectorstores import Chroma
# from langchain_community.embeddings import OpenAIEmbeddings
# from langchain_community.chat_models import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.messages import HumanMessage
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
import os
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

hf_token=os.getenv("HUGGINGFACEHUB_API_TOKEN")

CHROMA_PATH="vector_store"
# embeddings = OpenAIEmbeddings()

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def extract_website(url):
    try:
        html=requests.get(url).text
        soup= BeautifulSoup(html,'html.parser')
        return soup.get_text(separator='\n',strip=True)
    except Exception :
        return "unable to fetch content"
    
def generate_feedback(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)

    # ➤ Correct Chroma initialization
    vectordb = Chroma.from_texts(
        texts=chunks,
        embedding=embedding_model,
        persist_directory=CHROMA_PATH
    )


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
    "performance_feedback": ""
}}

If you cannot analyze, return empty strings but ALWAYS return valid JSON.
"""

    prompt = PromptTemplate(
        input_variables=["text"],
        template=template
    )

    final_prompt = prompt.format(text=text)

    hf_llm = ChatHuggingFace(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    task="conversational",     
    huggingfacehub_api_token=hf_token,
    max_new_tokens=512,
    temperature=0.2
)
    
    llm = ChatHuggingFace(llm=hf_llm)
    

    raw_response = llm.invoke([
    HumanMessage(content=final_prompt)
])
    # print("RAW RESPONSE:", raw_response)


    # Handle HF output formats
    if isinstance(raw_response, dict) and "generated_text" in raw_response:
        return raw_response["generated_text"]

    return str(raw_response)




    # response = llm(HumanMessage(content=prompt)).content
    # return response




