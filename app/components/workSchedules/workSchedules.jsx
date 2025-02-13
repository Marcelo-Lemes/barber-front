import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './workSchedules.css';
import PropTypes from 'prop-types';
import AuthContext from '@/app/Context/authContext';
import axios from 'axios';

const WorkScheduleForm = ({modal}) => {
  const {data} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState([
    {
      dayOfWeek: 'Segunda',
      startMorning: '07:00',
      endMorning: '12:00',
      startAfternoon: '13:00',
      endAfternoon: '17:00',
      active: false,
    },
    {
      dayOfWeek: 'Terça',
      startMorning: '07:00',
      endMorning: '12:00',
      startAfternoon: '13:00',
      endAfternoon: '17:00',
      active: false,
    },
    {
      dayOfWeek: 'Quarta',
      startMorning: '07:00',
      endMorning: '12:00',
      startAfternoon: '13:00',
      endAfternoon: '17:00',
      active: false,
    },
    {
      dayOfWeek: 'Quinta',
      startMorning: '07:00',
      endMorning: '12:00',
      startAfternoon: '13:00',
      endAfternoon: '17:00',
      active: false,
    },
    {
      dayOfWeek: 'Sexta',
      startMorning: '07:00',
      endMorning: '12:00',
      startAfternoon: '13:00',
      endAfternoon: '17:00',
      active: false,
    },
    {
      dayOfWeek: 'Sábado',
      startMorning: '07:00',
      endMorning: '12:00',
      startAfternoon: '13:00',
      endAfternoon: '17:00',
      active: false,
    },
  ]);

  const backUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('authToken');

  const { id } = useParams();
  
  const router = useRouter();

  const cancel = () => {
    if(modal !== undefined) {
      modal(false)
    } else {  
      router.push('/funcionarios');
    } 
  }

  const handleCheckboxChange = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].active = !newSchedule[index].active;
    setSchedule(newSchedule);
  };

  const changeDayFormat = (day) => {
    switch (day) {
      case 'Segunda':
        return 'Seg'

      case 'Terça':
        return 'Ter'

      case 'Quarta':
        return 'Qua'

      case 'Quinta':
        return 'Qui'

      case 'Sexta':
        return 'Sex'

      case 'Sábado':
        return 'Sab'
    
      default:
        break;
    }
  }

  const handleTimeChange = (e, index, period) => {
    const newSchedule = [...schedule];
    newSchedule[index][period] = e.target.value;
    setSchedule(newSchedule);
  };


  const handleSchedule = async (e) => {
    e.preventDefault();

      try {
        await axios.delete(
          `${backUrl}/schedules/update/${id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` } // Caso precise autenticação
          }
        );

      // Gera os horários para envio (depois que o ID está disponível)
      const dataToSubmit = schedule
        ?.filter((day) => day.active)
        .map(({ dayOfWeek, startMorning, endMorning, startAfternoon, endAfternoon }) => ({
          userId: id,
          dayOfWeek: changeDayFormat(dayOfWeek),
          morning: `${startMorning} - ${endMorning}`,
          afternoon: `${startAfternoon} - ${endAfternoon}`,
        }));

        console.log(dataToSubmit);
  
      // Enviar os horários para a API
      for (const day of dataToSubmit) {
        await axios.post(
          `${backUrl}/schedules`,
          day,
          {
            headers: { 'Authorization': `Bearer ${token}` } // Caso precise autenticação
          }
        );
      }

      modal(false)
    } catch (error) {
      // Tratar erros
      if (error.response) {
        if (error.response.status === 500) {
          setError('Dados inválidos.');
        } else if (error.response.status === 401) {
          setError('Você não tem permissão para isso.');
        } else {
          setError('Erro ao criar usuário.');
        }
      } else {
        console.error('Erro:', error);
        setError('Erro na conexão.');
      }
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      
      // Primeiro, cria o usuário
      const userResponse = await axios.post(
        `${backUrl}/users`,
        { ...data?.worker },
        {
          headers: { 'Authorization': `Bearer ${token}` } // Caso precise autenticação
        }
      );
  
      // Captura o ID do usuário criado

      
      const userId = userResponse?.data?.user.id;
  
      // Gera os horários para envio (depois que o ID está disponível)
      const dataToSubmit = schedule
        ?.filter((day) => day.active)
        .map(({ dayOfWeek, startMorning, endMorning, startAfternoon, endAfternoon }) => ({
          userId, // Usa o ID do usuário criado
          dayOfWeek: changeDayFormat(dayOfWeek),
          morning: `${startMorning} - ${endMorning}`,
          afternoon: `${startAfternoon} - ${endAfternoon}`,
        }));

        console.log(dataToSubmit);
  
      // Enviar os horários para a API
      for (const day of dataToSubmit) {
        await axios.post(
          `${backUrl}/schedules`,
          day,
          {
            headers: { 'Authorization': `Bearer ${token}` } // Caso precise autenticação
          }
        );
      }
  
      router.push('/funcionarios')
    } catch (error) {
      // Tratar erros
      if (error.response) {
        if (error.response.status === 500) {
          setError('Dados inválidos.');
        } else if (error.response.status === 401) {
          setError('Você não tem permissão para isso.');
        } else {
          setError('Erro ao criar usuário.');
        }
      } else {
        console.error('Erro:', error);
        setError('Erro na conexão.');
      }
    }
  };

  useEffect(() => {
    console.log(id);
    
  },[])
  
  WorkScheduleForm.propTypes = {
    modal: PropTypes.func,
  }.isRequired;

  return (
    <div id='work-schedules-container' className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Ajustar Horários de Trabalho
      </h2>
      <form id='work-schedules-box' className="space-y-4">
        {schedule.map((day, index) => (
          <div
            id='week-container'
            key={index}
            className={`p-3 rounded-lg border ${
              day.active
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={day.active}
                  onChange={() => handleCheckboxChange(index)}
                />
                <span className="text-sm font-medium text-gray-700">{day.dayOfWeek}</span>
              </label>
            </div>
            {day?.active && (

              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Antes do almoço
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={day.startMorning ? day.startMorning : '07:00'}
                      onChange={(e) => handleTimeChange(e, index, 'startMorning')}
                    />
                    <span className="text-gray-500 text-sm">até</span>
                    <input
                      type="time"
                      className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={day.endMorning ? day.endMorning : '12:00'}
                      onChange={(e) => handleTimeChange(e, index, 'endMorning')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Depois do almoço
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={day.startAfternoon ? day.startAfternoon : '13:00'}
                      onChange={(e) => handleTimeChange(e, index, 'startAfternoon')}
                    />
                    <span className="text-gray-500 text-sm">até</span>
                    <input
                      type="time"
                      className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={day.endAfternoon ? day.endAfternoon : '17:00'}
                      onChange={(e) => handleTimeChange(e, index, 'endAfternoon')}
                    />
                  </div>
                </div>
              </div>
            )}
  
          </div>
        ))}
      </form>
        <div id='ws-btn-box'>
          <button
            className="ws-btn"
            onClick={(e) => id !== undefined ? handleSchedule(e) : handleSubmit(e)}
          >
            Confirmar
          </button>
          <button
            className="ws-btn"
            onClick={() => cancel()}
          >
            Cancelar
          </button>
        </div>
    </div>
  );
};

export default WorkScheduleForm;
