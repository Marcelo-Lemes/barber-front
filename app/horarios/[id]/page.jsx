'use client'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useEffect, useState } from 'react';
import camelcaseKeys from 'camelcase-keys';
import axios from 'axios';
import { useParams } from 'next/navigation';
import './id.css';
import Menu from "@/app/components/menu/menu";
import ScheduleList from "@/app/components/scheduleList/scheduleList";
import ResponsiveList from "@/app/components/responsiveList/responsiveList";
import ptBR from 'date-fns/locale/pt-BR';
import AuthContext from "@/app/Context/authContext";
import Loading from "@/app/components/loading/loading";

export default function Page() {
  const [schedules, setSchedules] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useContext(AuthContext);

  const { id } = useParams();
  const backUrl = process.env.NEXT_PUBLIC_API_URL;

  // Filtra agendamentos para a data selecionada
  const filtrarAgendamentosPorData = (date) => {
    if (!date) return [];
    const dataISO = date.toISOString().split('T')[0];
    return schedules?.filter(
      (appointment) => appointment.date.split('T')[0] === dataISO
    );
  };

  const agendamentosFiltrados = filtrarAgendamentosPorData(selectedDate);

    const validation = () => {
      setLoading(true);
      if(user.id > 0) {
        setLoading(false);
      } else {
        window.location.href = '/'
      }
    }
      useEffect(() => {
          validation()
      }, [])

  useEffect(() => {
    const fetchScheduleseData = async () => {
      try {
        const response = await axios.get(`${backUrl}/appointments/${id}`);
        const formatedSchedules = camelcaseKeys(response.data);
  
        // Ordena os agendamentos pelo horário de início (startTime)
        formatedSchedules.sort((a, b) => {
          const timeA = a.startTime.split(':').map(Number);  // Converte para [hora, minuto]
          const timeB = b.startTime.split(':').map(Number);  // Converte para [hora, minuto]
  
          // Comparação de hora e minuto
          if (timeA[0] === timeB[0]) {
            return timeA[1] - timeB[1];  // Ordena pelo minuto se as horas forem iguais
          }
  
          return timeA[0] - timeB[0];  // Ordena pelas horas
        });
  
        setSchedules(formatedSchedules);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchScheduleseData();
  }, []);
  
  

  if (loading) return <div><Loading /></div>;
  if (error) return <div className="error">Erro: {error.message}</div>;

  return (
    <div id="hora-id-page">
    <Menu />
    <div className="schedule-viewer">
      <h1 className="title">Visualizar Agendamentos</h1>

      {/* Seletor de Data */}
      <div className="datepicker-container">
        <label htmlFor="datepicker" className="datepicker-label">Selecione uma data:</label>
        <DatePicker
          id="datepicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Escolha uma data"
          className="datepicker"
          locale={ptBR}
        />
      </div>

      {/* Lista de Agendamentos */}
      {selectedDate ? (
        agendamentosFiltrados?.length > 0 ? 
        ( 
          <div>
            <ScheduleList agendamentos={agendamentosFiltrados} selectedDate={selectedDate} />
            <ResponsiveList agendamentos={agendamentosFiltrados} selectedDate={selectedDate} />
          </div>
        ) 
        : (
          <p className="no-appointments">Nenhum agendamento encontrado para esta data.</p>
        )
      ) : (
        <p className="select-date">Por favor, selecione uma data para visualizar os agendamentos.</p>
      )}
    </div>
    </div>
  );
}
