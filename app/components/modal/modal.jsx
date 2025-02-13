import { useContext, useEffect, useState } from "react";
import AuthContext from "@/app/Context/authContext";
import { RxCross1 } from "react-icons/rx";
import './modal.css';
import axios from "axios";
import Aprove from "../confirmation/aprove";
import Reject from "../confirmation/reject";

export default function Modal() {
  const [client, setClient] = useState({});
  const [confirmation, setConfirmation] = useState(0);
  const [erro, setError] = useState('');
  const { data, option, setOption } = useContext(AuthContext);

  const backUrl = process.env.NEXT_PUBLIC_API_URL;

  const formatarDataBonita = (data) => {
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
  };

  const response = () => {
    switch (confirmation) {
        case 0:
            return null;
        case 1:
            return (<Aprove />);    
        case 2:
            return (<Reject />);
        default:
            return null;
    }
  }

  function formatPhoneNumber(phone) {
    // Garante que o número é uma string
    const phoneStr = String(phone);
  
    // Remove todos os caracteres não numéricos
    let digits = phoneStr.replace(/\D/g, '');
  
    // Adiciona o código do país '55' se não estiver presente
    if (!digits.startsWith('55')) {
      digits = `55${digits}`;
    }
  
    // Remove o código do país temporariamente para facilitar a manipulação
    let localNumber = digits.slice(2);
  
    // Adiciona o DDD '35' se o número não tiver um DDD
    if (localNumber.length <= 9) {
      localNumber = `35${localNumber}`;
    }
  
    // Ajusta números com um '9' adicional
    if (localNumber.length === 11 && localNumber[2] === '9' && localNumber[3] === '9') {
      // Remove o segundo '9' no caso de duplicidade
      localNumber = localNumber.slice(0, 2) + localNumber.slice(3);
    }
  
    // Reanexa o código do país
    return `55${localNumber}`;
  }
  

  const handleAddAppointment = async () => {
    
    try {
        // Fazendo a requisição POST para a API com as credenciais
        await axios.post(`${backUrl}/appointments`, {
            userId: data.worker.id,
            serviceId: data.service.id,
            date: data.date,
            status: 'pendente',
            start: data.schedules.inicio,
            end: data.schedules.fim,
            clientName: client?.name,
            clientPhone: formatPhoneNumber(client?.phone),
            
        });

        setConfirmation(1)
        
    } catch (error) {
        setConfirmation(2)
        if (error.response) {

            if (error.response.status === 500) {
                setError('Dados inválidos.');
            }

            else if (error.response.status === 401) {
                setError('Você não tem permissão para isso.');
            }

            else {
                setError('Erro ao fazer agendamento.');
            }

        } else {
            console.error('Erro:', error);
            setError('Erro na conexão.');
            console.log(erro);
            
        }
        
    }
};

  return (
    <div id="modal-container" style={!option ? {display: 'none'} : null}>
    <div id="modal-box">
        {response() !== null ? response() : (
            <div id="modal-card">
                <h2>Confirmação de Agendamento</h2>

                <div id="input-box">
                    <div className="form__group field">
                        <input
                            type="text"
                            className="form__field"
                            placeholder="Nome"
                            name="name"
                            id="name"
                            maxLength={30}
                            value={client.name || ''}
                            onChange={(e) => setClient({...client, name: e.target.value})}
                            required
                        />
                        <label htmlFor="name" className="form__label">Nome</label>

                    </div>
                    <div className="form__group field">
                        <input
                            type="tel"
                            className="form__field"
                            placeholder="Celular"
                            name="phone"
                            id="phone"
                            pattern="/^-?\d+\.?\d*$/" 
                            maxLength={13}
                            value={client.phone || ''}
                            onChange={(e) => setClient({...client, phone: e.target.value})}
                            required
                        />
                        <label htmlFor="phone" className="form__label">Celular</label>

                    </div>
                   
                    <p id="confirm-text">
                        Agendar {data?.service.name} para o dia {formatarDataBonita(data?.date)} no horário das {data?.schedules?.inicio} - {data?.schedules?.fim} com {data?.worker.name}?
                    </p>

                </div>
                <div id="modal-btn-box">
                    <button disabled={client?.name?.length > 3 && client?.phone?.length >= 8 ? false : true} className="modal-button confirm" onClick={() => handleAddAppointment()}>Agendar</button>
                    <button className="modal-button cancel" onClick={() => setOption(null)}>Cancelar</button>
                </div>
            </div>
        )}
        <RxCross1 id="modal-cross-icon" onClick={() => setOption(0)} />
    </div>
</div>

  )
}
