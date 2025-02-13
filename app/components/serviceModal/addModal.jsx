import axios from 'axios';
import './serviceModal.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function AddModal({setShowModal}) {
  const [error, setError] = useState()
  const [service, setService] =  useState({
    name: '',
    price: '',
    time: '',
  })


  const backUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('authToken');
  
    const cancel = (e) => {
        e.preventDefault();
        setShowModal(false);
    }

    AddModal.propTypes = {
        setShowModal: PropTypes.func,
    }.isRequired;
    
    const handleAddService = async (e) => {
      e.preventDefault()
    
      try {
          // Fazendo a requisição POST para a API com as credenciais
          await axios.post(`${backUrl}/services`, {
              ...service
          },
          {
            headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
            }
          });

          setShowModal(false);
          
      } catch (error) {
          if (error.response) {

              if (error.response.status === 500) {
                  setError('Dados inválidos.');
              }

              else if (error.response.status === 401) {
                  setError('Você não tem permissão para isso.');
              }

              else {
                  setError('Erro ao fazer registrar produto.');
              }

          } else {
              console.error('Erro:', error);
              setError('Erro na conexão.');
              console.log(error);
              
          } 
        }
    };

  return (
    <div className="modal-overlay">
    <div className="add-modal">
      <h2 id='add-service-modal-title'>Novo Serviço:</h2>
      {/* <p>Selecione o dia da semana para folga:</p> */}
      <form id='add-worker-form'>
        <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Nome: </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={service.name ? service.name : ''}
              onChange={(e) => setService({...service, name: e.target.value })}
            />
          
        </div>
        <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Preço:</label>
            <input
              type="number"
              className="form-control"
              min="0"
              step="1"
              id="exampleInputEmail1"
              value={service.price ? service.price : ''}
              onChange={(e) => setService({...service, price: e.target.value })}
            />
 
        </div>
        <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Duração:</label>
            <input
              type="number"
              className="form-control"
              min="0"
              step="30"
              id="exampleInputPassword1"
              value={service.time ?  service.time : ''}
              onChange={(e) => setService({...service, time: e.target.value })}
            />

        </div>
        <div id='button-box'>
            <button onClick={(e) => handleAddService(e)} className="btn btn-outline-success">Adiconar</button>
            <button onClick={(e) => cancel(e)} className="btn btn-outline-danger">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
  )
}
