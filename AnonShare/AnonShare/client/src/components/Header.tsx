import { Shield, Globe } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { WalletConnection } from "./WalletConnection"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  onWalletConnectionChange?: (isConnected: boolean, address?: string) => void
}

export function Header({ onWalletConnectionChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Anonymous Feedback</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    Shardeum Network
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <WalletConnection onConnectionChange={onWalletConnectionChange} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}