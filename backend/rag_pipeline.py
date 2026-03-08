from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
from config import EMBEDDING_MODEL

client = chromadb.Client()

collection = client.get_or_create_collection("study_material")

model = SentenceTransformer(EMBEDDING_MODEL)


def process_pdf(file_path):

    loader = PyPDFLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(documents)

    texts = [chunk.page_content for chunk in chunks]

    embeddings = model.encode(texts)

    for i, text in enumerate(texts):
        collection.add(
            documents=[text],
            embeddings=[embeddings[i].tolist()],
            ids=[f"chunk_{i}"]
        )

    return len(texts)


def retrieve_context(query):

    query_embedding = model.encode([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=3
    )

    docs = results["documents"][0]

    return "\n".join(docs)