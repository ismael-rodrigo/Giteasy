import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./providers/theme-provider";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function GitEasy() {
  const client = new QueryClient()


  return (
  <QueryClientProvider client={client}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
)}


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<GitEasy/>);
