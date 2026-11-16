import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Audience } from "@/components/sections/Audience";
import { Process } from "@/components/sections/Process";
import { WeeklyReport } from "@/components/sections/WeeklyReport";
import { Pricing } from "@/components/sections/Pricing";
import { Proof } from "@/components/sections/Proof";
import { FAQ } from "@/components/sections/FAQ";
import { Closing } from "@/components/sections/Closing";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Audience />
      <Process />
      <WeeklyReport />
      <Pricing />
      <Proof />
      <FAQ />
      <Closing />
      <Contact />
    </main>
  );
}
