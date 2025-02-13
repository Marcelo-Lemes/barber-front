'use client'
import Menu from '../components/menu/menu'
import './agendamento.css';
import Services from '../components/services/services';
import Workers from '../components/workers/workers';
import { useState } from 'react';
import Schedules from '../components/schedules/schedules';

export default function Agendamento() {
  const [option, setOption] = useState(1);

  const agendarServico = () => {
    switch (option) {
      case 1:
        return (<Workers setOption={setOption} title={true} />)

      case 2:
        return (<Services  setOption={setOption} />)

      case 3:
        return (<Schedules />)
    
      default:
        return (<Workers setOption={setOption} />)
    }
  }

  return (
    <div id='agenda-container'>
      <div>
        <h1 id='agenda-title' style={{textAlign: 'center'}}>Agendamento</h1>
        <div id='agenda-box'>
          {agendarServico()}
        </div>
      </div>
    </div>
  )
}
