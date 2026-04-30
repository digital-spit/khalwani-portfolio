import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import WorkIndex from "@/components/work-index";
import About from "@/components/about";
import Services from "@/components/services";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <main className="bg-bone text-ink">
      <Hero />
      <Marquee />
      <WorkIndex />
      <About />
      <Services />
      <Contact />
    </main>
  );
}
