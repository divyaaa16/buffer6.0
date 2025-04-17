import { Header } from "@/components/header";
import { ChatInterface } from "@/components/chat-interface";
import { Footer } from "@/components/footer";
import { AnimatedHero } from "@/components/AnimatedHero";
import { AboutUsSection } from "@/components/AboutUsSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatedHero />
        <div id="chat" className="mb-16">
          <ChatInterface />
        </div>
      </main>
      <AboutUsSection />
      <Footer />
    </div>
  );
}
