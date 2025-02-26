'use client'

import Banner from "./components/banner/banner";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { RiArrowDownSLine } from 'react-icons/ri';


import './home.css';
import Carousel from "./components/carrousel/carousel";
import Link from "next/link";


export default function Home() {

  return (
    <div id="home-page">
      <section className="home-section-orange">
        <img className="bg-home-img" src="bg-white.jpg" alt="" />
          <ul id="home-nav" >
            <Link href='#sobre'>
              <li>Sobre</li>
            </Link>
            <Link href='#galeria'>
              <li>Galeria</li>
            </Link>
            <Link href='#agendamento'>
              <li>Agendamento</li>
            </Link>
            <Link href='#contato'>
              <li>Contato</li>
            </Link>
          </ul>
          <div id="section-one-box">
            <img id="home-logo" src="barber-logo.png" alt="" />
            {/* <img id="bg-home-logo" src="tinta.png" alt="" /> */}
            <h1 id="home-slogan">
              O destino certo para um visual impecável!
            </h1>
            <Link href='#sobre'>
              <RiArrowDownSLine id="down-arrow" data-aos="fade-down"/>
            </Link>
          </div>
      </section>
      <section className="home-section-white" id="sobre">
        <img className="bg-home-img-black" src="bg-white.jpg" alt="" />
        <h1 className="home-titles"></h1>
        <div id="info-home-container">
          <div id="info-home-text-box">
              <h3>Bem-vindo à Rei da Régua!</h3>
          {/* <img id="home-info-logo" src="barber-logo.png" alt="" /> */}
              <p>
                Nós acreditamos que cada cliente merece mais do que um simples corte de cabelo e sim uma experiência única. Aqui, combinamos tradição e modernidade para oferecer um ambiente acolhedor, onde estilo e cuidado pessoal se encontram.
                Nosso objetivo é proporcionar um serviço de excelência, com profissionais experientes e dedicados a entender o que você realmente precisa. Seja para um corte clássico, um visual moderno ou aquele cuidado especial com a barba, estamos prontos para garantir que você saia daqui confiante e satisfeito.</p>
          <div>
              <img id="homen-img"  src="local.jpg" alt="" /> 
          </div>

          </div>
        </div>

      </section>

      <section className="home-section-orange" id="galeria">
        <img className="bg-home-img" src="bg-white.jpg" alt="" />
        <div id="title-img-box">
          <img id="title-img" className='teste' src="galeria7.png" alt="" />
        </div>
        <Carousel id='carousel'/>
        <div id="home-box-images">
          <img id="mj-img" className="port-images" src="corte-4.jpg" alt="" />
          <img className="port-images" src="corte-1.jpg" alt="" />
          <img className="port-images" src="corte-3.jpg" alt="" />
          <img className="port-images" src="corte-2.jpg" alt="" />
        </div>
        <div style={{textAlign: 'center'}}>
          <a aria-label="Veja mais no nosso intagram" href="https://www.instagram.com/reida_regua/" target="_blank" rel="noopener noreferrer">
            <button id="insta-btn" className="hero-button ">Confira nosso instagram <FaInstagram /></button>
          </a>
        </div>
      </section>
      <section className="home-section-white" id="agendamento">
        <img className="bg-home-img-black" src="bg-white.jpg" alt="" />
        <Banner />
      </section>
      <div id="contato-container" style={{display: 'flex'}}>
        <div id="map-box">
          <iframe title="Barbearia Rei da Régua" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.79181184479398!2d-45.70554445531556!3d-22.252634533537577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cba3dd86d63329%3A0x460832be8326b352!2sRei%20da%20R%C3%A9gua%20%7C%20Barbearia!5e0!3m2!1spt-BR!2sbr!4v1736966017253!5m2!1spt-BR!2sbr" id="contato-map" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div id="contato">
          <h3 className="contact-title">Contato</h3>
          <p>(35) 99187-6307</p>
          <h3 className="contact-title">Horários</h3>
          <p>Seg a Sex ........... 08:00 às 19:00</p>
          <p>Sábado .............. 08:00 às 17:00</p>
          <div id="contato-icon-box">
          
            <a aria-label="Entre em contato com a gente via whatsapp." href="https://wa.me/5535991876307" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="contato-icons whats"/>
            </a>
            <a aria-label="Entre em contato com a gente via instagram."  href="https://www.instagram.com/reida_regua/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="contato-icons insta"/>
            </a>
          </div>
        </div>
      </div>
      <footer id='footer'>
        <p>Alameda das Flores - Praça Santa Rita, 6 - Centro, Santa Rita do Sapucaí - MG, 37536-060</p>
        <p>Barbearia Rei da Régua 2025. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
