import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";
import "./utils/i18n";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
