import requests
from bs4 import BeautifulSoup
from langchain_community.vectorstores.chroma import Chroma
# from langchain_community.embeddings import OpenAIEmbeddings
# from langchain_community.chat_models import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.messages import HumanMessage
from langchain_community.llms import HuggingFaceEndpoint

from langchain_community.embeddings import HuggingFaceEmbeddings


CHROMA_PATH = "vector_store"

# Load HuggingFace Embeddings (FREE)
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Your HF token (IMPORTANT)
HF_TOKEN = "YOUR_HF_TOKEN_HERE"

# Load Mistral-7B from HuggingFace Inference API
llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.3",
    huggingfacehub_api_token=HF_TOKEN,
    temperature=0.3,
    max_new_tokens=512
)


def extract_text(url):
    """Fetch raw text from a webpage"""
    try:
        html = requests.get(url).text
        soup = BeautifulSoup(html, "html.parser")
        return soup.get_text(separator="\n", strip=True)
    except:
        return None


def generate_feedback(text):
    """Split ↦ embed ↦ store in Chroma ↦ call Mistral LLM"""
    
    # 1. Split the content
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_text(text)

    # 2. Create vector DB
    vectordb = Chroma.from_texts(
        texts=chunks,
        embedding=embedding_model,
        persist_directory=CHROMA_PATH
    )
    vectordb.persist()

    # 3. LLM Prompt (MISTRAL 7B)
    prompt = f"""
    You are a Website Feedback AI.

    Analyze the website content below and return STRICTLY a JSON object.

    WEBSITE CONTENT:
    {text}

    Return EXACTLY this format (don't add extra text):

    {{
        "ui_feedback": "...",
        "seo_feedback": "...",
        "performance_feedback": "..."
    }}
    """

    response = llm.invoke(prompt)

    return response

