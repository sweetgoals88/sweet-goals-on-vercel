"use client";
import React, { useState, useEffect } from 'react';
import './globals.css';
import { IoHome } from "react-icons/io5";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import Link from 'next/link';

const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button className="button">{children}</button>
);

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/images/img2.jpg',
    '/images/img4.jpg',
    '/images/img5.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="container">
        <header className="header">
          <div className="logo-title">
            <img src="/images/LOGO.png" alt="Logo" className="logo" />
            <h1>Solar Sync</h1>
          </div>
          <nav>
            <ul>
              <li>
                <Link href="/"><Button><IoHome /> Inicio</Button></Link>
              </li>
              <li>
                <Link href="/about-us"><Button><BsFillInfoCircleFill /> Acerca de Nosotros</Button></Link>
              </li>
              <li>
                <Link href="/login"><Button><FaUserEdit /> Login</Button></Link>
              </li>
              <li>
                <Link href="/register"><Button><FaUserPlus /> Registro</Button></Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          {/* Banner */}
          <section className="promo-banner">
            <p>¡Descarga nuestra app y optimiza tu energía solar!</p>
            <button>Descargar App</button>
          </section>

          {/* Carrusel */}
          <section className="carousel">
            <div className="overlay">
              <h2 className="h222">Con Solar Sync optimiza tu energía con datos precisos.</h2>
            </div>
            <div className="carousel-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Imagen ${index + 1}`} className="carousel-image" />
              ))}
            </div>
          </section>

          {/* Introducción */}
          <section className="intro">
            <div className="card">
              <div className="card-content">
                <div className="card-title">Bienvenido a Solar Sync</div>
                <p>
                  Este proyecto tiene como objetivo optimizar la gestión y el monitoreo del rendimiento de los paneles solares
                  mediante tecnologías IoT. Una Raspberry Pi recopila datos en tiempo real, que se visualizan en aplicaciones
                  web y móviles para facilitar el análisis y mantenimiento.
                </p>
              </div>
              <img src="/images/panel.jpg" alt="Imagen descriptiva" className="intro-image" />
            </div>
          </section>

          {/* Cards de Beneficios */}
          <section className="cards-container">
            {[
              {
                img: "/images/opti.jpg",
                title: "Optimización",
                desc: "Mejora la eficiencia de tus paneles solares con datos en tiempo real."
              },
              {
                img: "/images/monitoreo.jpg",
                title: "Monitoreo",
                desc: "Supervisa el rendimiento de tus paneles desde cualquier lugar."
              },
              {
                img: "/images/analisis.jpg",
                title: "Análisis",
                desc: "Obtén reportes detallados para tomar decisiones informadas."
              }
            ].map((item, i) => (
              <div className="card-small" key={i}>
                <img src={item.img} alt={item.title} className="card-small-image" />
                <div className="card-small-content">
                  <p className="card-small-title">{item.title}</p>
                  <p className="card-small-description">{item.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Secciones informativas */}
          <section className="info">
          <div className="antecedentes-section">
            <h2 className="titulo-seccion">ANTECEDENTES</h2>
            <p className="texto">
              El uso de paneles solares en México ha aumentado por la demanda de energía limpia. Sin embargo, las condiciones
              ambientales afectan su rendimiento. Con tecnología IoT, es posible monitorear datos en tiempo real para optimizar
              el mantenimiento y mejorar decisiones energéticas.
            </p>
          </div>

          <div className="problem-cards-section">
            <h2 className="titulo-seccion">PROBLEMÁTICA</h2>
            <p className="texto">
              El mayor reto en el monitoreo de paneles solares es la falta de sistemas accesibles y eficientes que detecten fallas
              en tiempo real. Muchos sistemas actuales no recopilan ni transmiten datos de forma continua.
            </p>
            <div className="cards-grid">
              <div className="card-problema">📉 Monitoreo Ineficiente</div>
              <div className="card-problema">⚠️ Falta de Detección Automática</div>
              <div className="card-problema">🔒 Acceso Limitado</div>
              <div className="card-problema">🔌 Compatibilidad Reducida</div>
            </div>
          </div>

          <div className="justificacion-section">
            <h2 className="titulo-seccion">JUSTIFICACIÓN</h2>
            <p className="texto">
              El proyecto recopila datos clave como temperatura y radiación solar usando IoT. La información se muestra en apps para monitoreo continuo, alertas y decisiones informadas.
            </p>
            <div className="cards-grid">
              <div className="card-justificacion">🌐 Accesibilidad remota</div>
              <div className="card-justificacion">📈 Optimización</div>
              <div className="card-justificacion">⚙️ Escalabilidad</div>
              <div className="card-justificacion">🔁 Monitoreo continuo</div>
            </div>
          </div>

          <div className="metodologia-scrum">
            <h2 className="titulo-seccion">METODOLOGÍA APLICADA</h2>
            <div className="cards-grid-metodologia">
              <div className="card-metodologia"><h3>Sprint Planning</h3><p>Se establecen objetivos y tareas clave.</p></div>
              <div className="card-metodologia"><h3>Sprint Execution</h3><p>Desarrollo de funcionalidades principales.</p></div>
              <div className="card-metodologia"><h3>Daily Standups</h3><p>Revisión diaria de avances y bloqueos.</p></div>
              <div className="card-metodologia"><h3>Sprint Review</h3><p>Revisión final con stakeholders.</p></div>
            </div>
          </div>

          <div className="conexion-sensores">
            <h2 className="titulo-seccion">CONEXIÓN CON SENSORES</h2>
            <p className="texto">
              Los sensores instalados en los paneles recopilan datos que se envían a una Raspberry Pi y luego a la aplicación en tiempo real.
            </p>
            <img src="/images/conexion.png" alt="Conexión de sensores" className="img-sensor" />
          </div>

          <div className="resultados-conclusiones">
            <h2 className="titulo-seccion">RESULTADOS Y CONCLUSIONES</h2>
            <p className="texto">
              Solar Sync logró una solución eficiente y escalable para monitorear paneles solares con tecnología accesible y monitoreo en tiempo real.
            </p>
            <div className="imagenes-resultados">
              <img src="/images/p1.jpeg" alt="Resultado 1" />
              <img src="/images/p2.jpeg" alt="Resultado 2" />
              <img src="/images/p3.jpeg" alt="Resultado 3" />
            </div>
          </div>
          </section>

          {/* Galería */}
          <section className="upload-section">
            <h2>Galería de Fotos</h2>
            <p>Explora cómo Solar Sync optimiza la energía solar.</p>
            <div className="photo-gallery">
              <img src="/images/photo1.jpg" alt="Foto 1" />
              <img src="/images/photo2.jpg" alt="Foto 2" />
              <img src="/images/photo3.jpg" alt="Foto 3" />
            </div>
            <h2>Descarga nuestra App</h2>
            <p>Accede a todas las funcionalidades desde tu dispositivo móvil.</p>
            <button>Descargar la App</button>
          </section>

          <section className="gray-card">
            <h2>¿Por qué elegir Solar Sync?</h2>
            <p>Ofrecemos soluciones innovadoras para optimizar el uso de energía solar con eficiencia y sostenibilidad.</p>
          </section>
        </main>
      </div>

      {/* Footer */}
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
          <li><a href="#">Descargar la App</a></li>
        </ul>
        <p>&copy; 2025 Solar Sync. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default Page;
