import "@/styles/global.css"
import AppRouter from "./routes/app-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "./components/ui/sonner";

const App = ()=>{
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter/>
      <Toaster/>
    </QueryClientProvider>
  )
}

export default App;