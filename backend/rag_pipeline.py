from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
from config import EMBEDDING_MODEL
import uuid

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
    if not texts:
        return 0

    embeddings = model.encode(texts)

    collection.add(
        documents=texts,
        embeddings=embeddings.tolist(),
        ids=[str(uuid.uuid4()) for _ in texts]
    )

    return len(texts)


def retrieve_context(query):

    count = collection.count()
    if count == 0:
        return ""

    query_embedding = model.encode([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=min(3, count)
    )

    docs = results["documents"][0]

    return "\n".join(docs)