"use client";
import React, { useState, useEffect } from "react";
import "./globals.css";
import { IoHome } from "react-icons/io5";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import NavbarComponent from "@/components/navbar-component/navbar-component";

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/images/carrousel-img1.jpg",
    "/images/carrousel-img2.jpg",
    "/images/carrousel-img3.jpg",
    "/images/carrousel-img4.jpg",
    "/images/carrousel-img5.jpg",
    "/images/carrousel-img6.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="container">
        {/* Main Content */}
        <main>
          {/* Banner */}

          {/* Imagen de fondo fija */}

          <div className="hero-container">
            <section
              className="hero-image"
              style={{
                backgroundImage: `url(${images[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                margin: "20px",
                marginTop: "20px",
                width: "97%",
                height: "700px",
                position: "relative",
                justifyContent: "center",
                borderRadius: "60px 60px 60px 60px",
              }}
            >
              <NavbarComponent />
              {/* <header className="header">
                <div className="logo-title">
                  <img src="/images/LOGO.png" alt="Logo" className="logo" />
                  <h1>Solar Sync</h1>
                </div>
                <nav>
                  <ul>
                    <li>
                      <Link href="/">
                        <Button>
                          <IoHome /> Inicio
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about-us">
                        <Button>
                          <BsFillInfoCircleFill /> Acerca de Nosotros
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login">
                        <Button>
                          <FaUserEdit /> Login
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/register">
                        <Button>
                          <FaUserPlus /> Registro
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </header> */}
              <div className="overlay">
                <div className="hero-text">
                  <h2 className="h222">Solar Sync</h2>
                  <h6 className="slogan">
                    Monitoreo constante con datos precisos.
                  </h6>
                </div>
              </div>
            </section>
          </div>

          <div className="antecedentes-section">
            <div className="ant-img1">
              <img src="/images/carrousel-img1.jpg" />
            </div>

            <div className="ant-img2">
              <img src="/images/carrousel-img2.jpg" />
            </div>

            <div className="ant-img3">
              <img src="/images/sun.png" />
            </div>

            <h2 className="titulo-seccion_ANT">ANTECEDENTES</h2>
            <p className="texto_antecedentes">
              El uso de paneles solares en México ha aumentado por la demanda de
              energía limpia. Sin embargo, las condiciones ambientales afectan
              su rendimiento. Con tecnología IoT, es posible monitorear datos en
              tiempo real para optimizar el mantenimiento y mejorar decisiones
              energéticas.
            </p>
          </div>

          {/* Secciones informativas */}
          <section className="info">
            <div className="problem-cards-section">
              <h2 className="titulo-seccion">PROBLEMÁTICA</h2>
              <p className="texto_problematica">
                El mayor reto en el monitoreo de paneles solares es la falta de
                sistemas accesibles y eficientes que detecten fallas en tiempo
                real. Muchos sistemas actuales no recopilan ni transmiten datos
                de forma continua.
              </p>
              <div className="cards-grid">
                <div className="card-problema1">📉 Monitoreo Ineficiente</div>
                <div className="card-problema2">
                  ⚠️ Falta de Detección Automática
                </div>
                <div className="card-problema3">🔒 Acceso Limitado</div>
                <div className="card-problema4">🔌 Compatibilidad Reducida</div>
                <div className="card-problema5">💸 Monitoreo Costoso</div>
                <div className="card-problema6">🍃 DMSB </div>
                <div className="full-moon">
                  <img src="/images/full-moon.png" />
                </div>
              </div>
            </div>
          </section>

          <div className="tittle-solucion">
            NUESTRA SOLUCIÓN
            <div className="ns-img">
              <img src="/images/panel-personaje.jpg" />
            </div>
            <div className="ns-img1">
              <img src="/images/solucion1.png" />
            </div>
            <div className="ns-img2">
              <img src="/images/carrousel-img4.jpg" />
            </div>
            <div className="ns-img3">
              <img src="/images/carrousel-img5.jpg" />
            </div>
            <div className="ns-img4">
              <img src="/images/solucion2.png" />
            </div>
          </div>

          <section className="intro">
            <div className="card">
              <div className="card-content">
                <div className="card-title">MONITOREO CONSTANTE CON</div>
                <div className="card-title2">DATOS PRECISOS</div>
              </div>
            </div>
            <div className="intro-imgtext">
              <img
                src="/images/carrousel-img1.jpg"
                alt="Imagen descriptiva"
                className="intro-image"
              />
              <div>
                <p className="texto-int">
                  {" "}
                  Este proyecto tiene como objetivo optimizar la gestión y el
                  monitoreo del rendimiento de los paneles solares mediante
                  tecnologías IoT. Una Raspberry Pi recopila datos en tiempo
                  real, que se visualizan en aplicaciones web y móviles para
                  facilitar el análisis y mantenimiento.
                </p>
                <button className="knowMore">Saber Mas</button>
              </div>
            </div>
          </section>
          {/* Cards de Beneficios */}

          <section className="intro2">
            <div className="card">
              <div className="card-content">
                <div className="card-title22">OPTIMIZACIÓN</div>
                <div className="card-title222">MEJOR EFICIENCIA</div>
              </div>
            </div>
            <div className="intro-imgtext">
              <div>
                <p className="texto-int2">
                  {" "}
                  Una mejor eficiencia en el uso de energía solar no solo reduce
                  costos, sino que también contribuye a un futuro más sostenible
                  en temas de mantenimiento.
                </p>
                <button className="knowMore">Saber Mas</button>
              </div>
              <img
                src="/images/carrousel-img2.jpg"
                alt="Imagen descriptiva"
                className="intro-image"
              />
            </div>
          </section>

          <section className="intro3">
            <div className="card">
              <div className="card-content3">
                <div className="card-title3">
                  MONITOREO EN CUALQUIER MOMENTO
                </div>
                <div className="card-title33">EN CUALQUIER LUGAR</div>
              </div>
            </div>
            <div className="intro-imgtext">
              <img
                src="/images/carrousel-img4.jpg"
                alt="Imagen descriptiva"
                className="intro-image"
              />
              <div>
                <p className="texto-int">
                  Supervisa el rendimiento de tus paneles desde cualquier lugar.
                </p>
                <button className="knowMore">Saber Mas</button>
              </div>
            </div>
          </section>
          <div>
            <p className="texto-solucion">
              "Obtén GRAFICOS detallados para tomar decisiones informadas."
            </p>
          </div>

          <div className="justificacion-section">
            <h2 className="titulo-seccion">JUSTIFICACIÓN</h2>
            <p className="texto_justificacion">
              El proyecto recopila datos clave como temperatura y radiación
              solar usando IoT. La información se muestra en apps para monitoreo
              continuo, alertas y decisiones informadas.
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
              <div className="card-metodologia">
                <h3>Sprint Planning</h3>
                <p>Se establecen objetivos y tareas clave.</p>
              </div>
              <div className="card-metodologia">
                <h3>Sprint Execution</h3>
                <p>Desarrollo de funcionalidades principales.</p>
              </div>
              <div className="card-metodologia">
                <h3>Daily Standups</h3>
                <p>Revisión diaria de avances y bloqueos.</p>
              </div>
              <div className="card-metodologia">
                <h3>Sprint Review</h3>
                <p>Revisión final con stakeholders.</p>
              </div>
            </div>
          </div>

          <div className="conexion-sensores">
            <h2 className="titulo-seccion">CONEXIÓN CON SENSORES</h2>
            <p className="texto">
              Los sensores instalados en los paneles recopilan datos que se
              envían a una Raspberry Pi y luego a la aplicación en tiempo real.
            </p>
            <img
              src="/images/conexion.png"
              alt="Conexión de sensores"
              className="img-sensor"
            />
          </div>

          <div className="resultados-conclusiones">
            <h2 className="titulo-seccion">RESULTADOS Y CONCLUSIONES</h2>
            <p className="texto">
              Solar Sync logró una solución eficiente y escalable para
              monitorear paneles solares con tecnología accesible y monitoreo en
              tiempo real.
            </p>
            <div className="imagenes-resultados">
              <img src="/images/p1.jpeg" alt="Resultado 1" />
              <img src="/images/p2.jpeg" alt="Resultado 2" />
              <img src="/images/p3.jpeg" alt="Resultado 3" />
            </div>
          </div>

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
            <p>
              Accede a todas las funcionalidades desde tu dispositivo móvil.
            </p>
            <button>Descargar la App</button>
          </section>

          <section className="gray-card">
            <h2>¿Por qué elegir Solar Sync?</h2>
            <p>
              Ofrecemos soluciones innovadoras para optimizar el uso de energía
              solar con eficiencia y sostenibilidad.
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default Page;
