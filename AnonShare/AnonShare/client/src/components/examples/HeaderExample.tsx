import { Header } from "../Header"
import { ThemeProvider } from "../ThemeProvider"
import { Toaster } from "@/components/ui/toaster"

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <div className="p-4">
          <p className="text-muted-foreground">Header component with wallet connection and theme toggle</p>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}