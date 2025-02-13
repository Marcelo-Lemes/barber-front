import { useContext, useEffect, useState } from 'react';
import './serviceModal.css';
import PropTypes from 'prop-types';
import AuthContext from '@/app/Context/authContext';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export default function EditModal({setShowModal}) {
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {data} = useContext(AuthContext);

    const backUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('authToken');

    const cancel = (e) => {
        e.preventDefault();
        setShowModal(false);
    }

    const editService = async (e) => {
      e.preventDefault();
      try {
          await axios.put(`${backUrl}/services/${data?.id}`, {
            ...selected,
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
                setError('Erro ao fazer editar serviço.');
            }
  
        } else {
            console.error('Erro:', error);
            setError('Erro na conexão.');
            
        }   
      }

    }

    useEffect(() => {
        const fetchServiceData = async () => {
          
          try {
            const response = await axios.get(`${backUrl}/services`);
    
            const formatedServices = camelcaseKeys(response.data)
            const teste = await formatedServices?.find((serv) => serv.id == Number(data?.id));
            setSelected(teste);

    
            } catch (error) {
              setError(error);
    
            } finally {
              setLoading(false);

            }
          };
      
          fetchServiceData();
        }, []);

    EditModal.propTypes = {
        setShowModal: PropTypes.func,
    }.isRequired;

  return (
    <div className="modal-overlay">
    <div className="add-modal">
      <h2 id='add-service-modal-title'>Editando Serviço:</h2>
      {/* <p>Selecione o dia da semana para folga:</p> */}
      <form id='add-worker-form'>
        <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Nome: </label>
            <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={selected?.name ? selected?.name : ''}
                onChange={(e) => setSelected({...selected, name: e.target.value})}
            />

        </div>
        <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Preço:</label>
            <input
                type="number"
                className="form-control"
                id="exampleInputEmail1"
                value={selected?.price ? selected?.price : ''}
                onChange={(e) => setSelected({...selected, price: e.target.value})}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Duração:</label>
            <input
                type="number"
                className="form-control"
                id="exampleInputPassword1"
                value={selected?.time ? selected?.time : ''}
                onChange={(e) => setSelected({...selected, time: e.target.value})}
            />
        </div>
        <div id='button-box'>
            <button onClick={(e) => editService(e)} className="btn btn-outline-success">Confirmar</button>
            <button onClick={(e) => cancel(e)} className="btn btn-outline-danger">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
  )
}
