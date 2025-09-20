import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { ShardeumInfo } from "@/components/ShardeumInfo"
import { FeedbackForm } from "@/components/FeedbackForm"
import { FeedbackDashboard } from "@/components/FeedbackDashboard"
import { blockchainService } from "@/lib/blockchain"

interface FeedbackItem {
  id: string
  content: string
  timestamp: Date
  txHash: string
}

// TODO: remove mock functionality - keeping minimal initial data
const initialMockFeedback: FeedbackItem[] = [
  {
    id: "1",
    content: "The new user interface is really intuitive and easy to navigate. Great work on the design improvements!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    txHash: "0xabc123...def456"
  }
]

export default function Home() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(initialMockFeedback)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const feedbackFormRef = useRef<HTMLDivElement>(null)

  // Load feedback from blockchain when wallet connects
  useEffect(() => {
    if (isWalletConnected) {
      loadFeedbackFromBlockchain()
    }
  }, [isWalletConnected])

  const loadFeedbackFromBlockchain = async () => {
    try {
      const blockchainFeedback = await blockchainService.getLatestFeedback(20)
      if (blockchainFeedback.length > 0) {
        // Replace any existing blockchain items and add new ones
        setFeedbackItems(prev => {
          const nonBlockchainItems = prev.filter(item => !item.id.startsWith('blockchain-'))
          return [...blockchainFeedback, ...nonBlockchainItems]
        })
      }
    } catch (error) {
      console.error("Failed to load feedback from blockchain:", error)
    }
  }

  const handleScrollToForm = () => {
    feedbackFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  const handleWalletConnectionChange = (connected: boolean, address?: string) => {
    setIsWalletConnected(connected)
    setWalletAddress(address || "")
  }

  const handleSubmitFeedback = (content: string) => {
    // Add feedback to local state immediately for UX
    const pendingId = `pending-${Date.now()}`
    const newFeedback: FeedbackItem = {
      id: pendingId,
      content,
      timestamp: new Date(),
      txHash: "pending..."
    }
    
    setFeedbackItems(prev => [newFeedback, ...prev])
    
    // Refresh blockchain data after a delay to get real transaction
    setTimeout(() => {
      loadFeedbackFromBlockchain()
      // Remove pending item after loading fresh data
      setFeedbackItems(prev => prev.filter(item => item.id !== pendingId))
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onWalletConnectionChange={handleWalletConnectionChange} />
      
      <main>
        {/* Hero Section */}
        <HeroSection onScrollToForm={handleScrollToForm} />
        
        {/* Shardeum Info Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <ShardeumInfo />
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="py-16 px-4" id="feedback-form">
          <div className="container mx-auto flex justify-center">
            <FeedbackForm
              ref={feedbackFormRef}
              isWalletConnected={isWalletConnected}
              walletAddress={walletAddress}
              onSubmitFeedback={handleSubmitFeedback}
            />
          </div>
        </section>

        {/* Feedback Dashboard Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto flex justify-center">
            <FeedbackDashboard feedbackItems={feedbackItems} />
          </div>
        </section>
      </main>
    </div>
  )
}