from rag_pipeline import process_pdf, retrieve_context

process_pdf("uploads/sample.pdf")

result = retrieve_context("What is entropy?")

print(result)