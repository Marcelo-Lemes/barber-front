'use client';
import { usePathname, useRouter } from 'next/navigation';
import './agendar.css';

export default function Page() {
    const router = useRouter();

  return (
    <div id='agendar-page'>
        <section className="agendar-section-orange">
        <img className="bg-agendar-img" src="bg-white.jpg" alt="" />
          <ul id="home-nav">
          </ul>
          <div id="section-one-box">
            <img id="agendar-logo" src="barber-logo.png" alt="" />
            <h1 id="agendar-slogan">
             Bem Vindo
            </h1>
            <div style={{textAlign: 'center'}}>
                <button onClick={() => router.push('/agendamento')} className='agendar-button'>Agendar horário</button>
            </div>
          </div>
      </section>
    </div>
  )
}
