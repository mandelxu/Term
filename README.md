<div align="center">
  <h1>Term</h1>
  <p><em>A minimal, AI‑powered desktop app for 408 algorithm practice.</em></p>

  <p>
    <img alt="Build Status" src="https://img.shields.io/badge/build-passing-brightgreen" />
    <img alt="Platform" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue" />
    <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey" />
  </p>
</div>

> Term is an elegant, distraction‑free environment for students preparing for the CS **408** postgraduate entrance exam. It leverages the **Gemini API** to generate an infinite stream of unique algorithm problems and provide instant, rubric‑based feedback on your handwritten solutions.
>
> Built with **React**, **Electron**, and **Tailwind CSS**.

<p align="center">
  <em>这个人很懒什么都没有留下。。。</em>
</p>

---

## Features

* **AI Problem Generation** – Get unique, exam‑style 408 problems on demand.
* **Intelligent Feedback** – Submit your solution (pseudocode or text) and receive an instant score and actionable suggestions.
* **Targeted Practice** – Filter by topic (e.g., Linear List, Tree & Binary Tree, Graph) and difficulty.
* **Elegant UI** – Minimal, white, focused interface inspired by OpenAI’s aesthetic.
* **Handwritten Code Pad** – A simple textarea designed to mimic exam conditions.
* **Height‑aware Pagination** – Precise, CJK‑friendly pagination so long problems/feedback fit the viewport without scrolling.
* **Bilingual** – Toggle English / Chinese for generated content.

## Tech Stack

* **Frontend**: React (v18), Tailwind CSS, Framer Motion, lucide‑react
* **Desktop**: Electron
* **AI**: Google Gemini API

---

## Getting Started

Follow these instructions to run Term locally for development and testing.

### 1) Prerequisites

* Node.js (LTS recommended)
* Git

### 2) Install

```bash
# Clone the repository
git clone https://github.com/mandelxu/Term.git
cd Term

# Install dependencies
npm install
# or: pnpm i / yarn
```

### 3) Configure API Key

> Quick local dev is fine with a client env var, but **do not** ship client keys in production. See the **Security** note.

Create a **.env** file in the project root (where `package.json` is):

```
REACT_APP_GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

* For Create React App, `REACT_APP_` prefix is required.
* `.env` is in `.gitignore` and should **never** be committed.

### 4) Run the App (React + Electron, concurrently)

This project uses **concurrently** to run the React dev server and the Electron app at the same time.

```bash
npm start
```

This will:

* start the React development server at `http://localhost:3000`
* launch the Electron shell that loads the React app
* enable hot‑reload for both the renderer (React) and the main process (Electron)

> If your setup is custom, ensure your `package.json` has scripts similar to:
>
> ```json
> {
>   "scripts": {
>     "start": "concurrently \"npm:react\" \"npm:electron\"",
>     "react": "react-scripts start",
>     "electron": "wait-on http://localhost:3000 && electron ."
>   }
> }
> ```

### 5) (Optional) Build & Package

If you use `electron-builder` (recommended), add scripts like:

```json
{
  "scripts": {
    "build:react": "react-scripts build",
    "build:electron": "tsc -p electron",
    "dist": "npm run build:react && electron-builder"
  }
}
```

Then:

```bash
npm run dist
```

This will build the production React bundle and create desktop installers for macOS/Windows/Linux (depending on your `electron-builder` config).

---

## Security

* **Do not** expose API keys in client bundles.
* For production, prefer a small **proxy** (Express / serverless) that forwards requests to Gemini with your secret. Example proxy is included in the template README; adapt it to your stack.

---

## How to Contribute

Contributions are welcome! If you have suggestions or find a bug:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/YourAmazingFeature`
3. Make your changes
4. Commit: `git commit -m "feat: add YourAmazingFeature"`
5. Push: `git push origin feat/YourAmazingFeature`
6. Open a Pull Request

Please keep PRs focused and small. Include before/after screenshots for UI changes when possible.

---

## License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.
