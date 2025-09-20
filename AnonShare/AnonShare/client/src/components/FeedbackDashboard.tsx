import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare } from "lucide-react"

interface FeedbackItem {
  id: string
  content: string
  timestamp: Date
  txHash: string
}

interface FeedbackDashboardProps {
  feedbackItems: FeedbackItem[]
}

export function FeedbackDashboard({ feedbackItems }: FeedbackDashboardProps) {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Recent Feedback</h2>
        <p className="text-muted-foreground">
          All feedback is stored anonymously and permanently on the Shardeum blockchain
        </p>
      </div>

      {feedbackItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No feedback submitted yet. Be the first to share your thoughts!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {feedbackItems.map((item) => (
            <Card key={item.id} className="hover-elevate" data-testid={`card-feedback-${item.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Anonymous
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed mb-3" data-testid={`text-feedback-${item.id}`}>
                  {item.content}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-mono">
                    TX: {item.txHash}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}