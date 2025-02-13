import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import AuthContext from '@/app/Context/authContext';
import { useParams, useRouter } from 'next/navigation';
import './deleteWorker.css';
import axios from 'axios';

export default function DeleteWorker({deletar}) {
    const [error, setError] = useState('');
    const {user} = useContext(AuthContext);
    const { id } = useParams();
    const router = useRouter();
    const backUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('authToken');

    const handleDelete = async () => {
        try {
            await axios.delete(`${backUrl}/users/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
              }
            });

            
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
                
            }
            
        } finally {
            router.push('/funcionarios'); 
        }
    }

    DeleteWorker.propTypes = {
        deletar: PropTypes.func,
    }.isRequired;
  return (
    <div className="modal-overlay">
        <div id='delete-worker-container'>
            <div>
                <h3 className='delete-title'>Deseja realmente excluir a conta?</h3>
                    <div id='delete-btn-box'>
                        <button onClick={() => handleDelete()} id='delete-yes-btn'>Sim</button>
                        <button onClick={() => deletar(false)} id='delete-no-btn'>Não</button>
                    </div> 
            </div>
    
        </div>
    </div>
  )
}
