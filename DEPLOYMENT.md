# Deployment

## Correct Production Frontend

The full Audit Rescue Desk product UI is the React/Vite app.

Deploy it with Vercel or Netlify, not Streamlit.

Recommended Vercel settings:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

This repo includes `vercel.json`, so Vercel should detect these settings automatically.

## Streamlit Fallback

`app.py` exists only as a lightweight fallback for Streamlit Cloud.

It is not the full product UI.

If Streamlit asks for a main module, use:

```text
app.py
```

Do not use:

```text
server/cognee_sdk_bridge.py
```

## Cognee SDK Bridge

The Cognee SDK bridge is a local companion service:

```powershell
npm run cognee:sdk
```

It is not the frontend entry point and should not be used as a Streamlit main module.
