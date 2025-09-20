import { useState, forwardRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Loader2, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { blockchainService } from "@/lib/blockchain"

const MAX_CHARACTERS = 500

interface FeedbackFormProps {
  isWalletConnected: boolean
  onSubmitFeedback: (feedback: string) => void
  walletAddress?: string
}

const FeedbackFormComponent = forwardRef<HTMLDivElement, FeedbackFormProps>(
  ({ isWalletConnected, onSubmitFeedback, walletAddress }, ref) => {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gasEstimate, setGasEstimate] = useState("0.001 SHM")
  const { toast } = useToast()

  // Update gas estimate when feedback changes
  useEffect(() => {
    if (isWalletConnected && feedback.trim().length > 0) {
      updateGasEstimate()
    }
  }, [feedback, isWalletConnected])

  const updateGasEstimate = async () => {
    try {
      const estimate = await blockchainService.estimateGasFee(feedback)
      setGasEstimate(`${estimate} SHM`)
    } catch (error) {
      setGasEstimate("~0.001 SHM")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit feedback",
        variant: "destructive",
      })
      return
    }

    if (feedback.trim().length === 0) {
      toast({
        title: "Feedback Required",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await blockchainService.submitFeedback(feedback)
      
      onSubmitFeedback(feedback)
      setFeedback("")
      
      toast({
        title: "Feedback Submitted",
        description: `Your anonymous feedback has been recorded on the blockchain. TX: ${result.txHash.slice(0, 10)}...`,
      })
    } catch (error: any) {
      console.error("Feedback submission error:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const characterCount = feedback.length
  const isOverLimit = characterCount > MAX_CHARACTERS

  return (
    <Card className="w-full max-w-2xl shadow-lg" ref={ref}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Lock className="h-5 w-5 text-primary" />
          Submit Anonymous Feedback
        </CardTitle>
        <CardDescription className="text-base">
          Your feedback will be stored permanently on the Shardeum blockchain. While your wallet address is visible on-chain, no personal information is collected.
          <br />
          <span className="text-primary font-medium">Ultra-low gas fees • Instant confirmation • Immutable record</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts anonymously..."
              className="min-h-32 resize-none"
              data-testid="input-feedback"
            />
            <div className="flex justify-between items-center text-sm">
              <span className={`text-muted-foreground ${isOverLimit ? "text-destructive" : ""}`}>
                {characterCount}/{MAX_CHARACTERS} characters
              </span>
              {isWalletConnected && (
                <Badge variant="outline" className="text-xs">
                  Est. Gas: {gasEstimate}
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!isWalletConnected || isSubmitting || isOverLimit || feedback.trim().length === 0}
            className="w-full"
            data-testid="button-submit-feedback"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting to Blockchain...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
          
          {!isWalletConnected && (
            <p className="text-sm text-muted-foreground text-center">
              Connect your wallet to submit anonymous feedback
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
})

export const FeedbackForm = FeedbackFormComponent