# DriveProxy Gallery

A modern, high-performance photo gallery application that integrates seamlessly with Google Drive. It uses a custom Node.js/Express proxy to securely fetch and serve images, bypassing common hotlinking restrictions and providing optimized thumbnails.

## 🚀 Features

### 🖼️ Aesthetic Gallery
- **Bento Grid Layout**: A visually striking, deterministic grid layout that optimizes for different screen sizes.
- **Image Optimization**: Custom backend proxy supports thumbnail generation (`?w=`) to reduce bandwidth and improve load times.
- **Smooth Animations**: Powered by Framer Motion for elegant transitions and modal interactions.
- **Lightbox View**: Immersive full-screen image viewing with meta-data display.

### 🔐 Admin Dashboard
- **Authentication**: Secure login system powered by Firebase Authentication.
- **Category Management**: Create, edit, and organize photos with custom icons and categories.
- **Import & Sync**:
  - **Single Import**: Add photos individually via Google Drive links.
  - **Bulk Import**: Import entire folders from Google Drive in one click.
- **Advanced Deletion**:
  - **Select & Delete**: Multi-select mode for targeted cleanup.
  - **Delete All**: Clean the entire gallery instantly.
  - **Folder Cleanup**: Delete all photos imported from a specific Drive folder.
- **Real-time Progress**: Visual progress bars and status updates during bulk operations (import/delete).

## 🛠️ Tech Stack

- **Frontend**:
  - React 19
  - Vite
  - Tailwind CSS (v4)
  - Framer Motion
  - Lucide React Icons
- **Backend**:
  - Node.js & Express
  - Axios for external API requests
  - Proxy for Google Drive thumbnail & view APIs
- **Database & Auth**:
  - Firebase Firestore (NoSQL)
  - Firebase Authentication

## 📦 Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your Firebase configuration and any other required keys.
4. **Firebase Configuration**:
   Ensure you have a `firebase-applet-config.json` file in the root with your project credentials.

## 🏃 Running the App

### Development
```bash
npm run dev
```
The server will start on `http://localhost:3000`, serving both the API routes and the Vite frontend.

### Production Build
```bash
npm run build
npm start
```

## 📂 Project Structure

- `src/` - React frontend application.
  - `components/` - Reusable UI components (Modal, AuthProvider, etc.).
  - `pages/` - Main views (Gallery, AdminPanel, Login).
  - `services/` - Database and API service layers.
- `server.ts` - Express backend proxy and API handlers.
- `api/` - Vercel/Serverless compatible endpoint handlers.
- `firestore.rules` - Security rules for protected data access.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
