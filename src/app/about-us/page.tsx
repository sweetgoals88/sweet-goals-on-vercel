'use client'; // Asegúrate de que esta línea esté al inicio si usas hooks o funcionalidad cliente

import styles from "./styles.module.css";

import { IoHome } from "react-icons/io5";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { ReactNode } from 'react';
import ShortNavbarComponent from "@/components/short-navbar-component/short-navbar-component";

const Button = ({ children }: { children: ReactNode }) => {
    return <button className={styles["button"]}>{children}</button>;
};

export default function Acerca() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        "/images/n1.jpeg",
        "/images/n2.jpeg",
        "/images/n3.jpeg",
        "/images/n4.jpeg",
        "/images/n5.jpeg"
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
            <ShortNavbarComponent />

            <div className={styles["image-container"]}>
                <video autoPlay loop muted className={styles["video-background"]}>
                    <source src="/videos/publi.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>
                <div className={styles["image-text"]}>
                    <h1>Solar Sync</h1>
                </div>
            </div>

            <div className={styles["contenido"]}>
                <div className={styles["problem-carousel-container"]}>
                    <div className={styles["problem-section"]}>
                        <h2 className={styles["titulo-seccion"]}>PROBLEMÁTICA</h2>
                        <p className={styles["texto"]}>
                            El rendimiento de los paneles solares puede disminuir debido a factores como suciedad,
                            sombras, mal funcionamiento o condiciones climáticas adversas. Actualmente, muchos
                            sistemas no cuentan con herramientas para monitorear su eficiencia de manera continua, lo
                            que limita su optimización de producción de energía.
                        </p>
                        <h2 className={styles["titulo-seccion"]}>ALCANCE</h2>
                        <ul className={styles["texto"]}>
                            <li>Instalación de sensores en los paneles solares.</li>
                            <li>Configuración del Raspberry Pi para recopilación y transmisión de datos.</li>
                            <li>Desarrollo de aplicaciones web y móviles.</li>
                            <li>Análisis de datos para optimización del rendimiento.</li>
                        </ul>
                    </div>

                    <div className={styles["carousel-section"]}>
                        <div className={styles["carousel"]}>
                            <button onClick={prevSlide} className={styles["carousel-button"]}>❮</button>
                            <img src={images[currentIndex]} alt={`Imagen ${currentIndex + 1}`} className={styles["carousel-image"]} />
                            <button onClick={nextSlide} className={styles["carousel-button"]}>❯</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles["resultados-section"]}>
                <h2 className={styles["titulo-seccion"]}>RESULTADOS</h2>
                <p className={styles["textol"]}>
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
                <div className={styles["imagenes-resultados"]}>
                    <img src="/images/p1.jpeg" alt="Panel solar 1" />
                    <img src="/images/p2.jpeg" alt="Panel solar 2" />
                    <img src="/images/p3.jpeg" alt="Panel solar 3" />
                </div>
            </div>

            <div className={styles["metodologia-container"]}>
                {/* Imagen al lado izquierdo */}
                <div className={styles["metodologia-imagen"]}>
                    <img src="/images/a1.jpg" alt="Metodología" />
                </div>

                {/* Contenido de Metodología */}
                <div className={styles["metodologia-section"]}>
                    <h2 className={styles["titulo-seccion"]}>METODOLOGÍA</h2>
                    <p className={styles["texto"]}>
                        Para llevar a cabo el proyecto, y como es costumbre en los entornos modernos de
                        desarrollo de software, la metodología a trabajar en el equipo será un modelo basado en
                        Scrum con ciclos de entrega de 2 semanas; se planea tener stand-ups diarios, pero por
                        causas de tiempo, lo más probable es que se deba reducir la frecuencia de dichas
                        reuniones a cada dos o tres días; se busca tener sesiones de sprint review y de sprint
                        planning también.
                    </p>
                    <p className={styles["texto"]}>
                        Se implementará la técnica de pair programming para agilizar la escritura del código fuente
                        y se buscará utilizar DevOps en las fases de pruebas y despliegue del proyecto, ya sea por
                        medio de soluciones de terceros que automaticen los flujos de trabajo, o herramientas
                        propias creadas por el equipo.
                    </p>
                </div>
            </div>

            <div className={styles["video-section"]}>
                <h2 className={styles["titulo-seccion"]}>VIDEO PUBLICITARIO</h2>
                <video controls>
                    <source src="/videos/comercial.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>
                <button
                    className={styles["drive-button"]}
                    onClick={() => alert("Serás redirigido al enlace de Google Drive.")}
                >
                    Abrir en Google Drive
                </button>
            </div>

            <div className={styles["equipo-section"]}>
    <h2 className={styles["titulo-seccion"]}>EQUIPO DE DESARROLLO</h2>
    <div className={styles["equipo-cards"]}>
        {/* Primera fila con una tarjeta */}
        <div className={styles["card"]}>
            <img src="/images/ñañi.jpeg" className={styles["card-img-top"]} alt="Desarrollador 1" />
            <div className={styles["card-body"]}>
                <p className={styles["card-text"]}>Daniela Ortiz - Líder de Proyecto</p>
            </div>
        </div>

        {/* Segunda fila con tres tarjetas */}
        <div className={styles["card"]}>
            <img src="/images/mariana.jpeg" className={styles["card-img-top"]} alt="Desarrollador 2" />
            <div className={styles["card-body"]}>
                <p className={styles["card-text"]}>Mariana Cano - Desarrolladora Frontend</p>
            </div>
        </div>
        <div className={styles["card"]}>
            <img src="/images/karol.jpeg" className={styles["card-img-top"]} alt="Desarrollador 3" />
            <div className={styles["card-body"]}>
                <p className={styles["card-text"]}>Karol Gonzales - Desarrollador Backend</p>
            </div>
        </div>
        <div className={styles["card"]}>
            <img src="/images/nancy.jpg" className={styles["card-img-top"]} alt="Desarrollador 4" />
            <div className={styles["card-body"]}>
            <p className={styles["card-text"]}>Nancy Moreno - Tester QA</p>
                
            </div>
        </div>

        {/* Tercera fila con tres tarjetas */}
        <div className={styles["card"]}>
            <img src="/images/edgar.jpeg" className={styles["card-img-top"]} alt="Desarrollador 5" />
            <div className={styles["card-body"]}>
                <p className={styles["card-text"]}>Edgar Ávila - Ingeniero de Datos</p>
            </div>
        </div>
        <div className={styles["card"]}>
            <img src="/images/ulises.jpg" className={styles["card-img-top"]} alt="Desarrollador 6" />
            <div className={styles["card-body"]}>
            <p className={styles["card-text"]}>Ulises Acosta - Diseñador UX/UI</p>
            </div>
        </div>
        <div className={styles["card"]}>
            <img src="/images/aldo.jpeg" className={styles["card-img-top"]} alt="Desarrollador 7" />
            <div className={styles["card-body"]}>
                <p className={styles["card-text"]}>Aldo Martínez - DevOps</p>
            </div>
        </div>
    </div>
</div>

            {/* <footer className={styles["footer"]}>
                <div className={styles["waves"]}>
                    <div className={styles["wave"]} id="wave1"></div>
                    <div className={styles["wave"]} id="wave2"></div>
                    <div className={styles["wave"]} id="wave3"></div>
                    <div className={styles["wave"]} id="wave4"></div>
                </div>
                <ul className={styles["social_icon"]}>
                    <li><a href="#"><i className={`${styles["fab"]} ${styles["fa-facebook-f"]}`}></i></a></li>
                    <li><a href="#"><i className={`${styles["fab"]} ${styles["fa-twitter"]}`}></i></a></li>
                    <li><a href="#"><i className={`${styles["fab"]} ${styles["fa-instagram"]}`}></i></a></li>
                    <li><a href="#"><i className={`${styles["fab"]} ${styles["fa-youtube"]}`}></i></a></li>
                </ul>
                <ul className={styles["menu"]}>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Descargar la App</a></li>
                </ul>
                <p>&copy; 2025 Solar Sync. Todos los derechos reservados.</p>
            </footer> */}
        </>
    );
}
