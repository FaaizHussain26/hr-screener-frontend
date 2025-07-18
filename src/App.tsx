import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/chatbot/theme-provider";
import "./index.css";
import Main from "./pages";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="scitech-theme">
        <Main />
        <Toaster />
        {/* <ChatWidget /> */}
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
