import { WalletConnection } from "../WalletConnection"
import { Toaster } from "@/components/ui/toaster"

export default function WalletConnectionExample() {
  return (
    <div className="p-4 flex items-center justify-center">
      <WalletConnection />
      <Toaster />
    </div>
  )
}