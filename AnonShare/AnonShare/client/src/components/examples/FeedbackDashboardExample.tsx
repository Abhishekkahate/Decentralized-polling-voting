import { FeedbackDashboard } from "../FeedbackDashboard"

// TODO: remove mock functionality
const mockFeedbackItems = [
  {
    id: "1",
    content: "The new user interface is really intuitive and easy to navigate. Great work on the design improvements!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    txHash: "0xabc123...def456"
  },
  {
    id: "2", 
    content: "Love the privacy features, knowing my feedback is truly anonymous gives me confidence to share honest thoughts.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    txHash: "0x789xyz...123abc"
  },
  {
    id: "3",
    content: "The gas fees are reasonable for submitting feedback. This makes the platform accessible to everyone.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago  
    txHash: "0xdef789...456ghi"
  }
]

export default function FeedbackDashboardExample() {
  return (
    <div className="p-4">
      <FeedbackDashboard feedbackItems={mockFeedbackItems} />
    </div>
  )
}