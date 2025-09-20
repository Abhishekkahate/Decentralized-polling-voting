import { useState } from "react"
import { FeedbackForm } from "../FeedbackForm"
import { Toaster } from "@/components/ui/toaster"

export default function FeedbackFormExample() {
  const [isWalletConnected, setIsWalletConnected] = useState(true) // Show connected state

  const handleSubmitFeedback = (feedback: string) => {
    console.log("Feedback submitted:", feedback)
  }

  return (
    <div className="p-4 flex items-center justify-center">
      <FeedbackForm 
        isWalletConnected={isWalletConnected} 
        onSubmitFeedback={handleSubmitFeedback}
      />
      <Toaster />
    </div>
  )
}