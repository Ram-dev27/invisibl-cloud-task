import "./App.css";
import { Header } from "./components/app-components/header";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DynamicForm from "./pages/DynamicForm";
import InfiniteScroll from "./pages/InfiniteScroll";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Header />
        <main className="container py-6">
          <Routes>
            <Route path="/" element={<DynamicForm />} />
            <Route path="/infinite-scroll" element={<InfiniteScroll />} />
          </Routes>
        </main>
        <Toaster richColors position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
