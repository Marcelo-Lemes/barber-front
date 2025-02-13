import React from 'react'
import PropTypes from 'prop-types';

export default function ResponsiveList({agendamentos, selectedDate}) {
    // Formata a data para exibição
    const formatarDataBonita = (data) => {
        const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(data).toLocaleDateString('pt-BR', opcoes);
    };
    ResponsiveList.propTypes = {
        agendamentos: PropTypes.array,
        selectedDate: PropTypes.string,
    }.isRequired;

  return (
    <div id='reposive-list-box' className="schedule-list">
            <h2 className="responsive-list schedule-list-title">Agendamentos para {formatarDataBonita(selectedDate)}:</h2>
            {agendamentos?.map((appointment) => (
                <div className="schedule-card" key={appointment.id}>
                <div className="schedule-header">
                    <h3 className="client-name">
                        <i className="fas fa-user"></i> {appointment.clientName}
                    </h3>
                    <span className={`status ${appointment.status.toLowerCase()}`}>
                        <i className="fas fa-circle"></i>
                    </span>
                </div>
            
                <div className="schedule-details">
                    <div className="details-row">
                        <p><strong><i className="fas fa-clock"></i> </strong> {appointment.startTime} - {appointment.endTime}</p>
                        <p><strong><i className="fas fa-phone-alt"></i> </strong> {appointment.clientPhone}</p>
                    </div>
                    <div className="details-row">
                        <p><strong><i className="fas fa-clipboard"></i> </strong> {appointment.serviceName}</p>
                        <p><strong><i className="fas fa-dollar-sign"></i> </strong> R$ {appointment.servicePrice}</p>
                    </div>
                </div>
            </div>     
            ))}
          </div>
    
  )
}
