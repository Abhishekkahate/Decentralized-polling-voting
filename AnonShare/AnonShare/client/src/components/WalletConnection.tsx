import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { blockchainService } from "@/lib/blockchain"

interface WalletConnectionProps {
  className?: string
  onConnectionChange?: (isConnected: boolean, address?: string) => void
}

export function WalletConnection({ className = "", onConnectionChange }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection()
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', () => {
        // Reload the page when chain changes
        window.location.reload()
      })
      
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          const address = accounts[0]
          const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
          setWalletAddress(shortAddress)
          setIsConnected(true)
          onConnectionChange?.(true, address)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      const address = accounts[0]
      const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
      setWalletAddress(shortAddress)
      setIsConnected(true)
      onConnectionChange?.(true, address)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    
    try {
      const result = await blockchainService.connectWallet()
      
      if (result.isConnected) {
        const shortAddress = `${result.address.slice(0, 6)}...${result.address.slice(-4)}`
        setWalletAddress(shortAddress)
        setIsConnected(true)
        onConnectionChange?.(true, result.address)
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Shardeum network",
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to connect wallet"
      toast({
        title: "Connection Failed", 
        description: errorMessage.includes("MetaMask") 
          ? "Please install MetaMask and try again"
          : "Please make sure MetaMask is installed and connected to Shardeum network",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    blockchainService.disconnect()
    setIsConnected(false)
    setWalletAddress("")
    onConnectionChange?.(false)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  if (isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="font-mono text-xs">
          {walletAddress}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          data-testid="button-disconnect-wallet"
        >
          <WifiOff className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      data-testid="button-connect-wallet"
      className={className}
    >
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}