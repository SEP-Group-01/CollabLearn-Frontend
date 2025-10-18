# CollabLearn Frontend

This project uses React, TypeScript, and Vite for the frontend.

## Local Development

1. **Navigate to the frontend client directory:**
   ```bash
   cd CollabLearn-Frontend/client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Linting and Formatting

You can run ESLint to check for lint errors:

```bash
npm run lint
```

## Build for Production

To build the frontend for production:

```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed for your local setup.

### API URL Configuration

Set the API URL in your `.env` file depending on your environment:

```
VITE_API_URL='https://collablearn.duckdns.org/api'
# For local development, uncomment the line below:
# VITE_API_URL='http://localhost:3000/api'
```

By default, the production API URL is used. For local development, uncomment the local line and comment out the production line.

---

For backend and full-stack setup, see the main project README in the root directory.
