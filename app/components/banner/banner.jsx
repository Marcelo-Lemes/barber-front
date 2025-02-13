import { useRouter } from 'next/navigation';
import './banner.css';

export default function Banner() {

  const router = useRouter();

    return (
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-image b1-rmv">
              <img
                src="celular.png"
                alt="Mobile App Screens"
              />
            </div>
            <div className="hero-text">
              <h1>AGENDE O SEU HORÁRIO</h1>
              <div className="hero-image b2-rmv">
                <img
                  src="celular.png"
                  alt="Mobile App Screens"
                />
              </div>
              <p>
                Agende agora mesmo seu corte de maneira simples e fácil, acesse o link para conferir os horários disponíveis e realizar o seu agendamento.
              </p>
              <div id='banner-btn-box' style={{textAlign: 'center'}}>
                <a href="https://api.whatsapp.com/send?phone=5535997686526&text=Olá!%20Gostaria%20de%20agendar%20um%20horário" target="_blank" rel="noopener noreferrer">
                  <button  className="hero-button">Agende Agora</button>
                </a>
              </div>
            </div>
          </div>
          <div id='banner-btn-box-resp' style={{textAlign: 'center'}}>
            <a href="https://api.whatsapp.com/send?phone=5535997686526&text=Olá!%20Gostaria%20de%20agendar%20um%20horário" target="_blank" rel="noopener noreferrer">
            <button  className="hero-button">Agende Agora</button>
            </a>
          </div>
        </div>
      );
}
