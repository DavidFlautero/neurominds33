import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Vision from "./components/Vision";
import Banner from "./components/Banner";
import Servicios from "./components/Servicios";
import Segmentos from "./components/Segmentos";
import Resultados from "./components/Resultados";
import Socios from "./components/Socios";
import Proceso from "./components/Proceso";
import CTAContacto from "./components/CTAContacto";
import Floating from "./components/Floating";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Vision />
      <Banner />
      <Servicios />
      <Segmentos />
      <Resultados />
      <Socios />
       {/* <Proceso /> */}
      <CTAContacto />
      <Floating />
      <Footer />
    </>
  );
}
