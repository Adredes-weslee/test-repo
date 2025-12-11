<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1i-GzGeMYjn1TKjLP6SH6yakZu05x_ODL

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create your environment files from the examples

   ```bash
   cp server/.env.example server/.env
   cp .env.local.example .env.local
   ```
3. Configure your environment variables

   * In `server.env`:

     * Set `GEMINI_API_KEY=<your-gemini-api-key>`
     * Adjust `SIMULATION_MODE` and `PORT` if needed (defaults: `SIMULATION_MODE=false`, `PORT=4000`)
   * In `.env.local`:

     * Set `GEMINI_API_KEY=<your-gemini-api-key>`
     * Leave `VITE_USE_ORCHESTRATOR=true` and `VITE_ORCHESTRATOR_BASE_URL=http://localhost:4000` unless you need a different setup
4. Run the app

   ```bash
   npm run dev
   ```