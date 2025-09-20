import { HeroSection } from "../HeroSection"

export default function HeroSectionExample() {
  const handleScrollToForm = () => {
    console.log("Scrolling to form...")
  }

  return (
    <div className="min-h-screen">
      <HeroSection onScrollToForm={handleScrollToForm} />
    </div>
  )
}