import { MessageSquareText, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroSectionProps {
  onScrollToForm: () => void
}

export function HeroSection({ onScrollToForm }: HeroSectionProps) {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <Badge variant="outline" className="mb-4 text-sm font-medium">
            <Zap className="h-3 w-3 mr-1" />
            Powered by Shardeum Blockchain
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-primary">Anonymous</span> Feedback
            <br />
            <span className="text-muted-foreground text-3xl md:text-4xl">
              On-Chain & Private
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Submit your thoughts anonymously on Shardeum's ultra-fast, low-cost blockchain. 
            Your feedback is permanently stored, tamper-proof, and completely private.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Button 
            size="lg" 
            onClick={onScrollToForm}
            className="text-lg px-8 py-6 h-auto"
            data-testid="button-get-started"
          >
            <MessageSquareText className="h-5 w-5 mr-2" />
            Submit Feedback
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>100% Anonymous • Ultra-Low Fees</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">&lt;$0.01</div>
            <div className="text-sm text-muted-foreground">Transaction Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">100K+</div>
            <div className="text-sm text-muted-foreground">TPS Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">Instant</div>
            <div className="text-sm text-muted-foreground">Confirmation</div>
          </div>
        </div>
      </div>
    </section>
  )
}