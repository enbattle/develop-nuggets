The ecosystem splits into three layers — vector stores, orchestration frameworks, and eval tools. Here's what each one is good at.

## Vector Databases

| | Chroma | Pinecone | Weaviate | Qdrant |
|---|--------|----------|----------|--------|
| **Setup** | pip install | Managed cloud | Docker/cloud | Docker/cloud |
| **Scale** | <1M docs | Billions | Billions | Billions |
| **Open Source** | Yes | No | Yes | Yes |
| **Hybrid search** | No | Yes | Yes | Yes |
| **Best For** | Prototypes, MVPs | Managed production | Complex filtering | High performance |

**Recommendation:** Chroma for getting started → Qdrant or Weaviate for open-source production → Pinecone for fully managed.

## Development Frameworks

### LangChain

Most popular RAG framework. Large ecosystem, many integrations.

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA

# Load and chunk
loader = PyPDFLoader("document.pdf")
splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
docs = splitter.split_documents(loader.load())

# Embed and store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma.from_documents(docs, embeddings)

# Query
chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())
answer = chain.invoke("What is RAG?")
```

**Pros:** Massive ecosystem, fast prototyping. **Cons:** Heavy abstraction, harder to debug.

### LlamaIndex

Optimized for RAG use cases. Better data connectors and indexing options.

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data/").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()

response = query_engine.query("Explain RAG evaluation metrics")
```

**Pros:** RAG-native, great for complex indexing. **Cons:** Smaller ecosystem than LangChain.

### Custom (Recommended for Production)

Full control, no framework magic hiding bugs:
```python
# Your own stack: sentence-transformers + chromadb + anthropic
# Clean, debuggable, zero hidden behavior
```

## Evaluation Frameworks

### RAGAS

Purpose-built for RAG evaluation. Automates faithfulness, precision, recall.

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
print(results)
# {'faithfulness': 0.92, 'answer_relevancy': 0.87, 'context_precision': 0.81}
```

### LangSmith

Tracing and monitoring platform from LangChain. Good for debugging retrieval pipelines in development.

### Braintrust

Evaluation platform with dataset management, experiment tracking, and LLM-as-judge built-in.

## Embedding Models

| Provider | Model | Dimensions | Notes |
|----------|-------|-----------|-------|
| Hugging Face | `all-MiniLM-L6-v2` | 384 | Free, fast, good default |
| Voyage AI | `voyage-4-large` | 1024 | Best retrieval quality |
| OpenAI | `text-embedding-3-large` | 3072 | Strong general-purpose |
| Cohere | `embed-v4` | 1024 | Strong multilingual |
