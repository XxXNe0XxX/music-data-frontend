# International Tube

**International Tube** is a web application that lets you select a country on the interactive globe and explore the most trending content from **YouTube**, **Netflix**, and **Spotify**.

**Live Demo:** [International Tube](https://music-data-frontend.onrender.com/)

---

## Overview

International Tube provides a unique way to discover regional trends across multiple media platforms. Simply choose a country on the globe, and the app displays the latest trending content from your favorite services. Please note that due to server limitations, the initial load might take a bit longer. Once loaded, subsequent interactions are much faster.

---

## Tech Stack & Libraries

This project is built using a modern front-end toolchain:

- **React:** For building the user interface.
- **Vite:** As the build tool and development server for fast Hot Module Replacement (HMR) and an optimized build process.
- **Tailwind CSS:** For utility-first styling.
- **PostCSS:** For processing CSS.
- **ESLint:** For maintaining code quality and consistency.

### Vite Plugins

- **@vitejs/plugin-react:** Uses Babel for fast refresh during development.
- **@vitejs/plugin-react-swc:** Alternatively leverages SWC for fast refresh, offering a speed boost over Babel.

---

## Libraries

- **D3 geo** Display geo coordinates
- **D3 Versor** Controls dragging and zooming with mobile device partial support

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js) or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/XxXNe0XxX/music-data-frontend.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd music-data-frontend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

Refer to the backend server at https://github.com/1SJulioS1/music-data-visualization-backend

4. **Building for Production**

To create an optimized production build, run:

    ```bash
    npm run build
    ```

After building, you can serve the static files from the dist directory with your favorite static server.

Contributing
Contributions are welcome! If you have suggestions, improvements, or bug fixes, please open an issue or submit a pull request.

## License

    This project is licensed under the MIT License.
