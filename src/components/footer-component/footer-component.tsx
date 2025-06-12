export default function FooterComponent() {
  return (
    <footer className="footer">
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>
      <ul className="social_icon">
        <li>
          <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fab fa-youtube"></i>
          </a>
        </li>
      </ul>
      <ul className="menu">
        <li>
          <a href="#">Inicio</a>
        </li>
        <li>
          <a href="#">Descargar la App</a>
        </li>
      </ul>
      <p>&copy; 2025 Solar Sync. Todos los derechos reservados.</p>
    </footer>
  );
}
