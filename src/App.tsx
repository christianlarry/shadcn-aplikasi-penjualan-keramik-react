import "@/styles/global.css"
import AppRouter from "./routes/app-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

const App = ()=>{
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter/>
    </QueryClientProvider>
  )
}

export default App;