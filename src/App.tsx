import ChatWidget from "./components/chatbot/chat-widget";
import { ThemeProvider } from "./components/chatbot/theme-provider";
import "./index.css";
import Main from "./pages";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="scitech-theme">
      <Main />
      <ChatWidget />
    </ThemeProvider>
  );
}

export default App;
