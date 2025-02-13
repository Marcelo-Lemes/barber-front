import React from 'react'
import PropTypes from 'prop-types';

export default function ScheduleList({agendamentos, selectedDate}) {
    // Formata a data para exibição
    const formatarDataBonita = (data) => {
        const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(data).toLocaleDateString('pt-BR', opcoes);
    };


    
    ScheduleList.propTypes = {
        agendamentos: PropTypes.array,
        selectedDate: PropTypes.string,
    }.isRequired;

  return (
    <div id='schedule-list-box' className="schedule-list">
            <h2 className="schedule-list-title">Agendamentos para {formatarDataBonita(selectedDate)}:</h2>
            {agendamentos?.map((appointment) => (
                <div className="schedule-card" key={appointment.id}>
                <div className="schedule-header">
                    <h3 className="client-name">
                        <i className="fas fa-user"></i> {appointment.clientName}
                    </h3>
                    <span className={`status ${appointment.status.toLowerCase()}`}>
                        <i className="fas fa-circle"></i> {appointment.status}
                    </span>
                </div>
            
                <div className="schedule-details">
                    <div className="details-row">
                        <p><strong><i className="fas fa-clock"></i> Horário:</strong> {appointment.startTime} - {appointment.endTime}</p>
                        <p><strong><i className="fas fa-phone-alt"></i> Telefone:</strong> {appointment.clientPhone}</p>
                    </div>
                    <div className="details-row">
                        <p><strong><i className="fas fa-clipboard"></i> Serviço:</strong> {appointment.serviceName}</p>
                        <p><strong><i className="fas fa-dollar-sign"></i> Preço:</strong> {appointment.servicePrice}</p>
                    </div>
                </div>
            </div>     
            ))}
          </div>
    
  )
}
