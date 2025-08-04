import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/chatbot/theme-provider";
import "./index.css";
import Main from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="scitech-theme">
        <QueryClientProvider client={queryClient}>
          <Main />
          <Toaster />
          {/* <ChatWidget /> */}
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
