"use client";
import React, { useState, useEffect } from 'react';
import './globals.css';
import { IoHome } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import Link from 'next/link';
import Head from "next/head";

const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <button className="button">{children}</button>
  );
}

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/images/img2.jpg',
    '/images/img4.jpg',
    '/images/img5.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    
      <div className="container">
        <header className="header">
            <div className="logo-title">
            <img src="/images/LOGO.png" alt="Logo" className="logo" />
            <h1>Solar Sync</h1>
            <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
          </div>
          <nav>
            <ul>
              <li><Button><IoHome /> Inicio</Button></li>
              <li>
                <Link href="/acerca">
                  <Button><BsFillInfoCircleFill /> Acerca de Nosotros</Button>
                </Link>
              </li>
              <li><Button><FaUserEdit /> Login</Button></li>
              <li><Button><FaUserPlus /> Registro</Button></li>
            </ul>
          </nav>
        </header>
        <main>
          <section className="promo-banner">
            <p>¡Descarga nuestra app y optimiza tu energía solar!</p>
            <button>Descargar App</button>
          </section>
          <section className="carousel">
            <div className="overlay">
              <h2 className='h222' >Con Solar Sync optimiza tu energía con datos precisos.</h2>
            </div>
            <div className="carousel-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Imagen ${index + 1}`} className="carousel-image" />
              ))}
            </div>
          </section>
          <section className="intro">
            <div className="card">
              <div className="card-content">
                <div className="card-title">Bienvenido a Solar Sync</div>
                <p>Este proyecto tiene como objetivo optimizar
                  la gestión y el monitoreo del rendimiento de
                  los paneles solares mediante el uso de
                  tecnologías IoT. Para ello, integra una
                  Raspberry Pi que recopila datos en tiempo
                  real sobre el funcionamiento del sistema,
                  permitiendo su análisis detallado a través de
                  aplicaciones web y móviles. Estas
                  herramientas facilitan la visualización de
                  información clave, mejorando la eficiencia y
                  el mantenimiento de los paneles solares.</p>
              </div>
              <img src="/images/panel.jpg" alt="Imagen descriptiva" className="intro-image" />
            </div>
          </section>
          <section className="cards-container">
            <div className="card-small">
              <img src="/images/opti.jpg" alt="Optimización" className="card-small-image" />
              <div className="card-small-content">
                <p className="card-small-title">Optimización</p>
                <p className="card-small-description">Mejora la eficiencia de tus paneles solares con datos en tiempo real.</p>
              </div>
            </div>
            <div className="card-small">
              <img src="/images/monitoreo.jpg" alt="Monitoreo" className="card-small-image" />
              <div className="card-small-content">
                <p className="card-small-title">Monitoreo</p>
                <p className="card-small-description">Supervisa el rendimiento de tus paneles desde cualquier lugar.</p>
              </div>
            </div>
            <div className="card-small">
              <img src="/images/analisis.jpg" alt="Análisis" className="card-small-image" />
              <div className="card-small-content">
                <p className="card-small-title">Análisis</p>
                <p className="card-small-description">Obtén reportes detallados para tomar decisiones informadas.</p>
              </div>
            </div>
          </section>
          <section className="upload-section">
            <h2>Galería de Fotos</h2>
            <p>Explora las imágenes que hemos subido para mostrar cómo Solar Sync optimiza la energía.</p>
            <div className="photo-gallery">
              <img src="/images/photo1.jpg" alt="Foto 1" />
              <img src="/images/photo2.jpg" alt="Foto 2" />
              <img src="/images/photo3.jpg" alt="Foto 3" />
            </div>
            <h2>Descarga nuestra App</h2>
            <p>Accede a todas las funcionalidades de Solar Sync desde tu dispositivo móvil. Descarga nuestra app ahora.</p>
            <button>Descargar la App</button>
          </section>
          <section className="gray-card">
            <h2>¿Por qué elegir Solar Sync?</h2>
            <p>Solar Sync ofrece soluciones innovadoras para optimizar el uso de energía solar, garantizando eficiencia y sostenibilidad.</p>
          </section>
        </main>
      </div>
      <footer className="footer">
        <div className="waves">
          <div className="wave" id="wave1"></div>
          <div className="wave" id="wave2"></div>
          <div className="wave" id="wave3"></div>
          <div className="wave" id="wave4"></div>
        </div>
        <ul className="social_icon">
          <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
          <li><a href="#"><i className="fab fa-twitter"></i></a></li>
          <li><a href="#"><i className="fab fa-instagram"></i></a></li>
          <li><a href="#"><i className="fab fa-youtube"></i></a></li>
        </ul>
        <ul className="menu">
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Descargar la App </a></li>
        </ul>
        <p>&copy; 2025 Solar Sync. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default Page;