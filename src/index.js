import React from "react";
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from "./App";
import "tailwindcss/tailwind.css";

console.log("?? Latest Build Check");

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

const root = createRoot(document.getElementById('root'));
root.render(<App />);






