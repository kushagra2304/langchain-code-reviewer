import requests
from bs4 import BeautifulSoup
from langchain_community.vectorstores.chroma import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.chat_models import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.messages import HumanMessage


CHROMA_PATH="vector_store"
embeddings=OpenAIEmbeddings()
def extract_text(url):
    try:
        html=requests.get(url).text
        soup=BeautifulSoup(html,'html.parser')
        return soup.get_text(seperator='\n', strip=True)
    except:
        return "can't fetch website content"
def generate_fb(text):
    splitter=RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks=splitter.split_text(text)
    vectordb=Chroma.from_texts(chunks, embeddings, persist_directory=CHROMA_PATH)
    vectordb.persist()
    llm=ChatOpenAI()
    prompt = f"""
    You are an AI Feedback Engine. Analyse the website content and return JSON strictly.
    TEXT CONTENT:
    {text}

    Return format:
    {{
        "ui_feedback": "...",
        "seo_feedback": "...",
        "performance_feedback": "..."
    }}
    """
    response=llm([HumanMessage(content=prompt)]).content
    return response

