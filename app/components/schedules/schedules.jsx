
import { useContext, useEffect, useState } from 'react';
import camelcaseKeys from 'camelcase-keys';
import Calendar from 'react-calendar';
import axios from 'axios';
import './schedules.css';
import 'react-calendar/dist/Calendar.css';
import AuthContext from '@/app/Context/authContext';
import Modal from '../modal/modal';
import Loading from '../loading/loading';

export default function Schedules() {
    
  const [horarios, setHorarios] = useState(null);
  const [agendamentos, setAgendamentos] = useState(null);
  const [period, setPeriod] = useState('manhã');
  const [holidays, setHolidays] = useState([]);
  const [daysoff, setDaysoff] = useState();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, onChange] = useState(new Date());

  const { data, setData, setOption } = useContext(AuthContext);

  const backUrl = process.env.NEXT_PUBLIC_API_URL;

  const selectTime = (hora) => {
    setSelected(hora)
  }

  const confirm = () => {
    setData({
      ...data,
      date: formatarData(value),
      schedules: selected
    });

    setOption(true);
  }


function horarioParaMinutos(horario) {
  const [horas, minutos] = horario.split(":").map(Number);
  return horas * 60 + minutos;
}
const filtraPeriodo = () => {
  const limite = horarioParaMinutos("13:00");
  const horaFiltrada = horarios?.filter((h) => period === 'manhã' ? horarioParaMinutos(h.fim) <= limite
    : horarioParaMinutos(h.inicio) > limite);
  return horaFiltrada
}



// Função para verificar se o dia selecionado é um dia de trabalho para o trabalhador
function verificarDiaDeTrabalho(dataSelecionada, schedules) {
  const diasSemanaSiglas = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const diaSemanaSelecionado = diasSemanaSiglas[new Date(`${dataSelecionada}T00:00:00`).getDay()];

  // Verifica se o trabalhador tem expediente para o dia da semana selecionado
  const expediente = schedules.find(schedule => schedule.dayOfWeek === diaSemanaSelecionado);

  // Se encontrar expediente para o dia da semana selecionado
  return expediente ? true : false;
}

// Função para gerar intervalos de horários disponíveis
function gerarIntervalosDisponiveis(schedules, dataSelecionada, duracaoServico) {
  const intervalos = [];
  const agora = new Date(); // Obtém a data e hora atual
  const diasSemanaSiglas = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const diaSemanaSelecionado = diasSemanaSiglas[new Date(`${dataSelecionada}T00:00:00`).getDay()];

  // Encontra o expediente para o dia selecionado
  const expedienteSelecionado = schedules.find(schedule => schedule.dayOfWeek === diaSemanaSelecionado);

  if (expedienteSelecionado) {
    // Converte os horários de manhã e tarde para Date
    const [inicioManha, fimManha] = expedienteSelecionado.morning.split(' - ').map(hora => {
      const [horas, minutos] = hora.split(':');
      return new Date(`${dataSelecionada}T${horas}:${minutos}:00`);
    });

    const [inicioTarde, fimTarde] = expedienteSelecionado.afternoon.split(' - ').map(hora => {
      const [horas, minutos] = hora.split(':');
      return new Date(`${dataSelecionada}T${horas}:${minutos}:00`);
    });

    let atual = new Date(inicioManha);

    // Gera intervalos de tempo para a manhã
    while (atual < fimManha) {
      const proximo = new Date(atual.getTime() + duracaoServico * 60 * 1000);

      // Se o horário ainda não passou e está dentro do expediente da manhã
      if (proximo <= fimManha && atual >= agora) {
        intervalos.push({ inicio: formatarHora(atual), fim: formatarHora(proximo) });
      }

      atual = new Date(atual.getTime() + 30 * 60 * 1000);  // Incrementa 30 minutos
    }

    atual = new Date(inicioTarde);

    // Gera intervalos de tempo para a tarde
    while (atual < fimTarde) {
      const proximo = new Date(atual.getTime() + duracaoServico * 60 * 1000);

      // Se o horário ainda não passou e está dentro do expediente da tarde
      if (proximo <= fimTarde && atual >= agora) {
        intervalos.push({ inicio: formatarHora(atual), fim: formatarHora(proximo) });
      }

      atual = new Date(atual.getTime() + 30 * 60 * 1000);  // Incrementa 30 minutos
    }
  }

  return intervalos;
}

// Função para verificar se a data é de um feriado
function verificarFeriado(dataSelecionada) {
  if (holidays !== null) {
    return holidays?.some(feriado => feriado.date === dataSelecionada);
  }
  console.log('Erro com a api de feriados.');
  
}

// Função para verificar se é uma folga no dia selecionado
function verificarFolga(dataSelecionada, folgas) {
  console.log('teste:', folgas);
  
  const dataISO = new Date(dataSelecionada).toISOString().split('T')[0];
  return folgas?.some(folga => {
    if (folga.date) {
      const folgaDate = new Date(folga.date).toISOString().split('T')[0];
      return folgaDate === dataISO;
    }
    if (folga.startDate && folga.endDate) {
      const start = new Date(folga.startDate).toISOString().split('T')[0];
      const end = new Date(folga.endDate).toISOString().split('T')[0];
      return dataISO >= start && dataISO <= end;
    }
    return false;
  });
}

// Função para verificar se o horário já foi marcado
function verificarHorariosMarcados(intervalos, agendamentos, dataSelecionada) {
  return intervalos.filter(horario => {
    const isMarcado = agendamentos.some(({ date, startTime, endTime }) => {
      const agendadoData = new Date(date).toISOString().split('T')[0];
      const agendadoInicioCompleto = new Date(`${date}T${startTime}:00`);
      const agendadoFimCompleto = new Date(`${date}T${endTime}:00`);

      if (agendadoData !== dataSelecionada) return false;
      const horarioInicioSelecionado = new Date(`${dataSelecionada}T${horario.inicio}:00`);
      const horarioFimSelecionado = new Date(`${dataSelecionada}T${horario.fim}:00`);
      return horarioInicioSelecionado < agendadoFimCompleto && horarioFimSelecionado > agendadoInicioCompleto;
    });
    return !isMarcado;
  });
}

// Função principal para gerar os horários disponíveis
function gerarHorarios() {
  if (!value || !agendamentos || !data.workSchedules) return [];

  const { workSchedules, service } = data;
  const schedules = workSchedules;
  const duracaoServico = service?.time;
  const dataSelecionada = formatarData(value);
  const agora = new Date();
  const dataAtualFormatada = agora.toISOString().split('T')[0];

  // Verifica se o dia selecionado é um dia de trabalho
  if (!verificarDiaDeTrabalho(dataSelecionada, schedules)) {
      console.log(`Dia não é um dia de trabalho.`);
      return [];
  }

  // Verifica se a data selecionada é no futuro
  if (new Date(dataSelecionada) < new Date(dataAtualFormatada)) {
      return [];
  }

  // Verifica se a data é um feriado
  if (verificarFeriado(dataSelecionada)) {
    console.log(`O dia ${dataSelecionada} é um feriado. Não é possível agendar.`);
    return [];
  }

  // Verifica se o dia selecionado é uma folga
  if (verificarFolga(dataSelecionada, daysoff)) {
    console.log(`O dia ${dataSelecionada} é uma folga. Não é possível agendar.`);
    return [];
  }

  // Gera os intervalos disponíveis
  const intervalos = gerarIntervalosDisponiveis(schedules, dataSelecionada, duracaoServico);

  // Filtra os horários que já estão marcados
  return verificarHorariosMarcados(intervalos, agendamentos, dataSelecionada);
}

// Funções auxiliares para formatar hora e data
function formatarHora(date) {
  return date.toTimeString().slice(0, 5); // Retorna "HH:MM"
}

function formatarData(dataString) {
  const data = new Date(dataString); // Converte para objeto Date
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`; // Retorna no formato "YYYY-MM-DD"
}
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
    const fetchData = async () => {
      const anoSelecionado = value.getFullYear();
      
      try {
        // // Fetch de feriados
        const holidaysResponse = await axios.get(`https://brasilapi.com.br/api/feriados/v1/${anoSelecionado}`);
        setHolidays(holidaysResponse?.data);
  
        // Fetch de agendamentos
        const appointmentsResponse = await axios.get(`${backUrl}/appointments/${data.worker.id}`);
        const formatedAppointments = camelcaseKeys(appointmentsResponse.data);
        console.log('agendamentos: ',formatedAppointments);
        
        setAgendamentos(formatedAppointments);

        // Fetch de folgas
        const availabilityResponse = await axios.get(`${backUrl}/availability/${data.worker.id}`);
        const formatedAvailability = camelcaseKeys(availabilityResponse.data);
        console.log(formatedAvailability);
        
        setDaysoff(formatedAvailability);
        
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  };

  }, [value]); // Essa função será chamada sempre que a data 'value' mudar
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Gera os horários após o carregamento dos agendamentos e feriados
      if (value && agendamentos && holidays && daysoff) {
        setHorarios(gerarHorarios());
      }
  }
  }, [value, agendamentos, holidays, daysoff]);

  if (loading) return <div><Loading /></div>;
    if (error) return <div>Error: {error.message}</div>;

  return (
    <div id='schedule-container'>
        <Modal />
        <p id='schedule-text' style={{textAlign: 'center'}}>Escolha um dia e um horário disponível:</p>
        <Calendar onChange={onChange} value={value} id='calendar'/>
          <ul id='period'>
            <li className={period === 'manhã' ? 'selectedP' : null} onClick={() => setPeriod('manhã')}>Manhã</li>
            <li className={period === 'tarde' ? 'selectedP' : null} onClick={() => setPeriod('tarde')}>Tarde</li>
          </ul>
        <div id='schedules-box'>
            {
              filtraPeriodo()
                ?.map((hora, index) => {
                  return (
                    <div className={selected === hora ? 'selected' : null} onClick={() => selectTime(hora)} id='schedules-times' key={index}>
                        <p>{hora.inicio} - {hora.fim}</p>
                    </div>
                )
            })}
        </div>
        {
          filtraPeriodo()?.length < 1 ? 
          <p style={{textAlign: 'center'}}>Nenhum horário disponível no período da {period}.</p>
          : null
        }
        <div id='schedule-btn'>
          <button id='sche-btn' onClick={() => confirm()} disabled={(horarios?.length < 1 || selected === null) ? true : false} style={{width: '200px', padding: '10px', border: '1px solid black', backgroundColor: 'white', margin: '50px auto', cursor: 'pointer'}}>Confirmar</button>
        </div>

    </div>
  )
}
