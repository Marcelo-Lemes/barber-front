import { useEffect } from 'react';
import './confirmation.css';

export default function Aprove() {

    useEffect(() => {
        setTimeout(() => {
            window.location.href = '/';
           }, 1500);
    }, [])

  return (
    <div id='aprove-container'>
      <h2 style={{margin: '50px 0'}}>O horário foi agendado com sucesso.</h2>
      <div className="success-checkmark">
        <div className="check-icon">
          <span className="icon-line line-tip"></span>
          <span className="icon-line line-long"></span>
          <div className="icon-circle"></div>
          <div className="icon-fix"></div>
        </div>
      </div>
    </div>
  )
}
