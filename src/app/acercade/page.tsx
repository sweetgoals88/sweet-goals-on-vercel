'use client'; // Asegúrate de que esta línea esté al inicio si usas hooks o funcionalidad cliente
import '../globals.css';
import styles from "./styles.module.css";
import { IoHome } from "react-icons/io5";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { ReactNode } from 'react';

const Button = ({ children }: { children: ReactNode }) => {
    return <button className="button">{children}</button>;
};

export default function Acerca() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        "/images/a1.jpg",
        "/images/a2.jpg",
        "/images/a3.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Cambiar cada 3 segundos

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);

    return (
        <>
            <header className="header">
                <div className="logo-title">
                    <img src="/images/LOGO.png" alt="Logo" className="logo" />
                    <h1>Solar Sync</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link href="/">
                                <Button><IoHome /> Inicio</Button>
                            </Link>
                        </li>
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

            <div className="image-container">
                <video autoPlay loop muted className="video-background">
                    <source src="/videos/el otro.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>
                <div className="image-text">
                    <h1>Solar Sync</h1>
                </div>
            </div>

            <div className="contenido">
                <div className="problem-carousel-container">
                    <div className="problem-section">
                        <h2 className="titulo-seccion">PROBLEMÁTICA</h2>
                        <p className="texto">
                            El rendimiento de los paneles solares puede disminuir debido a factores como suciedad,
                            sombras, mal funcionamiento o condiciones climáticas adversas. Actualmente, muchos
                            sistemas no cuentan con herramientas para monitorear su eficiencia de manera continua, lo
                            que limita su optimización de producción de energía.
                        </p>
                        <h2 className="titulo-seccion">ALCANCE</h2>
                        <ul className="texto">
                            <li>Instalación de sensores en los paneles solares.</li>
                            <li>Configuración del Raspberry Pi para recopilación y transmisión de datos.</li>
                            <li>Desarrollo de aplicaciones web y móviles.</li>
                            <li>Análisis de datos para optimización del rendimiento.</li>
                        </ul>
                    </div>

                    <div className="carousel-section">
                        <div className="carousel">
                            <button onClick={prevSlide} className="carousel-button">❮</button>
                            <img src={images[currentIndex]} alt={`Imagen ${currentIndex + 1}`} className="carousel-image" />
                            <button onClick={nextSlide} className="carousel-button">❯</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="resultados-section">
                <h2 className="titulo-seccion">RESULTADOS</h2>
                <p className="texto">
                Se logró implementar un sistema de monitoreo 
                en tiempo real para paneles solares, capaz de 
                detectar y alertar automáticamente sobre fallos 
                mediante notificaciones en aplicaciones web y móviles. 
                La plataforma proporciona visualizaciones claras y 
                detalladas del rendimiento energético, facilitando un 
                análisis preciso y accesible desde cualquier dispositivo.
                 Además, se optimizó el mantenimiento mediante la detección
                  temprana de problemas, reduciendo significativamente las 
                  pérdidas energéticas. La arquitectura del sistema es escalable, 
                  permitiendo futuras mejoras y la incorporación de nuevas 
                  funcionalidades sin comprometer su rendimiento o accesibilidad.
                </p>
                <div className="imagenes-resultados">
                    <img src="/images/a1.jpg" alt="Panel solar 1" />
                    <img src="/images/a2.jpg" alt="Panel solar 2" />
                    <img src="/images/a3.jpg" alt="Panel solar 3" />
                </div>
            </div>

            <div className="metodologia-container">
                {/* Imagen al lado izquierdo */}
                <div className="metodologia-imagen">
                    <img src="/images/a1.jpg" alt="Metodología" />
                </div>

                {/* Contenido de Metodología */}
                <div className="metodologia-section">
                    <h2 className="titulo-seccion">METODOLOGÍA</h2>
                    <p className="texto">
                        Para llevar a cabo el proyecto, y como es costumbre en los entornos modernos de
                        desarrollo de software, la metodología a trabajar en el equipo será un modelo basado en
                        Scrum con ciclos de entrega de 2 semanas; se planea tener stand-ups diarios, pero por
                        causas de tiempo, lo más probable es que se deba reducir la frecuencia de dichas
                        reuniones a cada dos o tres días; se busca tener sesiones de sprint review y de sprint
                        planning también.
                    </p>
                    <p className="texto">
                        Se implementará la técnica de pair programming para agilizar la escritura del código fuente
                        y se buscará utilizar DevOps en las fases de pruebas y despliegue del proyecto, ya sea por
                        medio de soluciones de terceros que automaticen los flujos de trabajo, o herramientas
                        propias creadas por el equipo.
                    </p>
                </div>
            </div>

            <div className="video-section">
                <h2 className="titulo-seccion">VIDEO PUBLICITARIO</h2>
                <video controls>
                    <source src="/videos/solar-demo.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>
                <button
                    className="drive-button"
                    onClick={() => alert("Serás redirigido al enlace de Google Drive.")}
                >
                    Abrir en Google Drive
                </button>
            </div>

            <div className="equipo-section">
    <h2 className="titulo-seccion">EQUIPO DE DESARROLLO</h2>
    <div className="equipo-cards">
        {/* Primera fila con una tarjeta */}
        <div className="card">
            <img src="/images/a.jpg" className="card-img-top" alt="Desarrollador 1" />
            <div className="card-body">
                <p className="card-text">Juan Pérez - Líder de Proyecto</p>
            </div>
        </div>

        {/* Segunda fila con tres tarjetas */}
        <div className="card">
            <img src="/images/a.jpg" className="card-img-top" alt="Desarrollador 2" />
            <div className="card-body">
                <p className="card-text">María López - Desarrolladora Frontend</p>
            </div>
        </div>
        <div className="card">
            <img src="/images/a.jpg" className="card-img-top" alt="Desarrollador 3" />
            <div className="card-body">
                <p className="card-text">Carlos García - Desarrollador Backend</p>
            </div>
        </div>
        <div className="card">
            <img src="/images/a.jpg" className="card-img-top" alt="Desarrollador 4" />
            <div className="card-body">
                <p className="card-text">Ana Torres - Diseñadora UX/UI</p>
            </div>
        </div>

        {/* Tercera fila con tres tarjetas */}
        <div className="card">
            <img src="/images/a.jpg" className="card-img-top" alt="Desarrollador 5" />
            <div className="card-body">
                <p className="card-text">Luis Martínez - Ingeniero de Datos</p>
            </div>
        </div>
        <div className="card">
            <img src="/images/a.jpg" className="card-img-top" alt="Desarrollador 6" />
            <div className="card-body">
                <p className="card-text">Sofía Ramírez - Tester QA</p>
            </div>
        </div>
        <div className="card">
            <img src="/images/a.jpg" className="card-img-top" alt="Desarrollador 7" />
            <div className="card-body">
                <p className="card-text">Pedro Gómez - DevOps</p>
            </div>
        </div>
    </div>
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
                    <li><a href="#">Descargar la App</a></li>
                </ul>
                <p>&copy; 2025 Solar Sync. Todos los derechos reservados.</p>
            </footer>
        </>
    );
}