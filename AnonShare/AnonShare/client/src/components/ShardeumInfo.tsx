import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, DollarSign, Layers, Shield } from "lucide-react"

export function ShardeumInfo() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Ultra-Fast Speed",
      description: "100,000+ TPS capacity with transaction finality in seconds",
      highlight: "100K+ TPS"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Ultra-Low Fees",
      description: "Transaction costs under $0.01 with predictable pricing",
      highlight: "<$0.01"
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Auto-Scaling",
      description: "Linear scalability through dynamic state sharding",
      highlight: "Linear Scale"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "EVM Compatible",
      description: "Fully compatible with Ethereum tools and smart contracts",
      highlight: "EVM Ready"
    }
  ]

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-3">
          Powered by <span className="text-primary">Shardeum</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The world's first auto-scaling EVM-compatible Layer 1 blockchain that solves the blockchain trilemma 
          while maintaining decentralization, security, and ultra-low fees forever.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover-elevate border-primary/10">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center text-primary">
                {feature.icon}
              </div>
              <Badge variant="secondary" className="mb-3 text-xs font-semibold">
                {feature.highlight}
              </Badge>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>No MEV Exploitation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Fair Transaction Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Proof of Quorum Consensus</span>
          </div>
        </div>
      </div>
    </div>
  )
}