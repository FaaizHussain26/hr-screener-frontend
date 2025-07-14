import ChatWidget from "./components/chatbot/chat-widget";
import { ThemeProvider } from "./components/chatbot/theme-provider";
import { BrowserRouter } from "react-router";
import "./index.css";
import Main from "./pages";
import { Toaster } from "sonner";

function App() {
  return (
    
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="scitech-theme">
        <Main />
        <Toaster />
        <ChatWidget />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
