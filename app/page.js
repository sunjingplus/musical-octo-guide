import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImageRotator from "@/components/ImageRotator";
import MusicGaird from "@/components/MusicGaird";
import Testimonials1 from "@/components/Testimonials1";
import Testimonials3 from "@/components/Testimonials3";
import MusicGeneratorInfo from "@/components/MusicGeneratorInfo";
import WhyMusic from "@/components/WhyMusic";
import MusicWorld from "@/components/MusicWorld";
import FeaturesAIMusic from "@/components/FeaturesAIMusic";
import Pricing from "@/components/Pricing";
import Questions from "@/components/Questions";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <header>
        <Header></Header>
      </header>
      <main>
        <Hero></Hero>
        <ImageRotator></ImageRotator>
        <MusicGaird></MusicGaird>
        <Testimonials1></Testimonials1>
        <Testimonials3></Testimonials3>
        <MusicGeneratorInfo></MusicGeneratorInfo>
        <WhyMusic></WhyMusic>
        <MusicWorld></MusicWorld>
        <FeaturesAIMusic></FeaturesAIMusic>
        <Pricing></Pricing>
        <Questions></Questions>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
}
