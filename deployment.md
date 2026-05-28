# Deployment Guide for AI Tutor

Deploying an application that relies on a local LLM (like `deepseek-r1:8b` via Ollama) "for free" with a public link requires some specific strategies, because free-tier cloud platforms do not offer enough RAM or GPU to run an 8B parameter model.

Here are the best strategies to deploy and host the AI Tutor project for free with a public link.

---

## Option 1: Expose your Local Environment for Free (Recommended & Easiest)
Since you already have the setup running locally, the absolute easiest way to get a public link "for free" is using an HTTP tunnel. This securely exposes your local web servers to the internet without needing a VPS or cloud hosting.

**How to do it with Ngrok:**
1. Keep your backend (`uvicorn main:app`) and frontend (`npm run dev`) running locally.
2. Download and install [Ngrok](https://ngrok.com/).
3. Run the following command to expose your React frontend (assuming it runs on port 5173):
   ```bash
   ngrok http 5173
   ```
4. Ngrok will give you a public HTTPS link (e.g., `https://<random-id>.ngrok-free.app`).
5. **Important:** You will need to update your frontend's API URL configuration to optionally point to another Ngrok tunnel for your backend (`ngrok http 8000`), or configure Vite to proxy requests and run both through one tunnel.

**Alternative Tunnel:** [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) (completely free, custom domain support).

---

## Option 2: True Cloud Deployment (Free Tier APIs + Free Hosting)
If you want the application to be online 24/7 without keeping your computer on, you **cannot** use local Ollama (`deepseek-r1:8b`) for free. Instead, you must migrate the backend to use a generous Free-Tier LLM API (like Groq, Gemini, or Together AI).

### Step 1: Migrate LLM and Embeddings to Free Cloud APIs
- Open `backend/config.py` and replace Ollama integration with a cloud API.
- **LLM Engine:** Use [Groq API](https://console.groq.com/) (provides Llama 3/DeepSeek extremely fast and free).
- **Embeddings:** Use [HuggingFace Inference API](https://huggingface.co/docs/api-inference/index) or OpenAI's free tier credits.
- Update `backend/tutor_engine.py` and `backend/rag_pipeline.py` to make HTTP requests to Groq/HuggingFace instead of `localhost:11434`.

### Step 2: Deploy Backend to Render or Koyeb
Both [Render](https://render.com/) and [Koyeb](https://www.koyeb.com/) offer a free tier for hosting Python APIs.
1. Push your code to GitHub.
2. Sign up for Render.
3. Create a new "Web Service" and link your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set the Build Command to `pip install -r requirements.txt`.
6. Set the Start Command to `uvicorn main:app --host 0.0.0.0 --port 10000`.
7. Your backend will now have a free public URL (`https://your-api.onrender.com`).

### Step 3: Deploy Frontend to Vercel or Netlify
To deploy the React application:
1. Open the frontend code and update your `axios` or API fetch calls to use your newly generated Render API link instead of `http://localhost:8000`.
2. Push the changes to GitHub.
3. Sign up for [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
4. Create a new Site/Project and select your GitHub repository.
5. Set the Root Directory to `frontend`.
6. Framework preset: `Vite`.
7. Build command: `npm run build`.
8. Output directory: `dist`.
9. Deploy! You will get a free, permanent public link (e.g., `https://your-ai-tutor.vercel.app`).

---

## Option 3: Hugging Face Spaces (All-in-One Cloud Environment)
[Hugging Face Spaces](https://huggingface.co/spaces) offers a free Docker environment equipped with 16GB of RAM and basic CPU (and occasionally free GPU grants).

1. Create a free Hugging Face account.
2. Create a new Space and select **Docker** as the SDK.
3. Write a `Dockerfile` that:
   - Installs Python and Node.js.
   - Installs Ollama and downloads `deepseek-r1:8b` (this takes time on boot).
   - Builds the React frontend.
   - Starts the FastAPI backend, pointing static files to the React `dist` folder.
4. Push your code.
**Note:** Booting up a local LLM in a free CPU space will be very slow to respond to queries (often 10s-30s per token).

### Summary & Recommendation
- If you want to keep **exactly the current code** (Ollama DeepSeek): Use **Ngrok or Cloudflare Tunnels** (Option 1).
- If you want a **true 24/7 cloud app that anyone can use anytime setup-free**: Change to the **Groq API** and deploy to **Render + Vercel** (Option 2).
