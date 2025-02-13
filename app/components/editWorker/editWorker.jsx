import React, { useEffect, useState } from 'react';
import './editWorker.css'
import PropTypes from 'prop-types';
import { useParams } from 'next/navigation';
import camelcaseKeys from 'camelcase-keys';
import axios from 'axios';

export default function EditWorker({edit}) {
    const [worker, setWorker] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const backUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('authToken');

    const handleEditWorker = async (e) => {
        e.preventDefault();

        try {
           await axios.put(`${backUrl}/users/${id}`,
            worker,
            {
              headers: { 'Authorization': `Bearer ${token}` } // Caso precise autenticação
            }
           );
           edit(false);
    
        } catch (error) {
            setError(error);

        } finally {
            setLoading(false);
            
        }

    }

    useEffect(() => {
        const fetchWorkersData = async () => {
          
          try {
            const response = await axios.get(`${backUrl}/users/${id}`);
    
            const formatedWorkers = camelcaseKeys(response.data)
            setWorker(formatedWorkers);
            console.log(formatedWorkers);
            
    
            } catch (error) {
              setError(error);
    
            } finally {
              setLoading(false);
              
            }
          };
      
          fetchWorkersData();
        }, []);
    
    EditWorker.propTypes = {
        edit: PropTypes.func,
    }.isRequired;

  return (
    <div className="modal-overlay">
        <div className="edit-worker-modal">
            <div id='add-worker-container'>
                <form id='add-worker-form'>
                    <h3 id='add-work-title'>Editando dados:</h3>
                    <div id='first-input-add' className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label add-work-label">Nome: </label>
                        <input
                            type="text"
                            className="form-control add-work-input"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            value={worker.name ? worker.name : ''}
                            maxLength='150'
                            onChange={(e) => setWorker({...worker, name: e.target.value})}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label add-work-label">Email:</label>
                        <input
                            type="email"
                            className="form-control add-work-input"
                            id="exampleInputEmail1"
                            value={worker.email ? worker.email : ''}
                            maxLength='150'
                            onChange={(e) => setWorker({...worker, email: e.target.value})}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label add-work-label">Foto:</label>
                        <input
                            type="url"
                            className="form-control add-work-input"
                            id="exampleInputPassword1"
                            value={worker.img ? worker.img : ''}
                            maxLength='200'
                            onChange={(e) => setWorker({...worker, img: e.target.value})}
                        />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>

                    <div id='button-box'>
                        <button onClick={(e) => handleEditWorker(e)} className="btn btn-outline-success">Confirmar</button>
                        <button onClick={(e) => edit(false)} className="btn btn-outline-danger">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
