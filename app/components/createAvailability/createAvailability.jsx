// components/CreateAvailabilityForm.js
import { display, margin, minWidth, textAlign, width } from '@mui/system';
import { useState } from 'react';
import './createAvailability.css';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function CreateAvailability ({modal}) {
  const [formData, setFormData] = useState({
    type: 'day', // 'day' para único dia, 'period' para período
    date: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { id } = useParams();
  const backUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('authToken');

  const cancel = (e) => {
    e.preventDefault();

    modal(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
        console.log(formData);

        const folga = formData.type === 'day' ?
        {
            userId: id,
            date: formData.date,
            reason: formData.reason
        } :
        {
            userId: id,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.reason
        }
        
        await axios.post(`${backUrl}/availability`, 
            folga,
            {
              headers: { 'Authorization': `Bearer ${token}` } // Caso precise autenticação
            }
           );
           modal(false);
      setMessage(`Folga foi criada com ID: ${response.id}`);
    } catch (error) {
      setMessage(`Erro ao criar folga: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id='availab-container'>
    <form id='availab-form' onSubmit={handleSubmit}>
      <h2 id='availab-title'>Marcar Folga</h2>
      
      <div className='availab-label-box'>
        <label className='availab-label' >
          Tempo:
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className='availab-input'
          >
            <option value="day">Único Dia</option>
            <option value="period">Período</option>
          </select>
        </label>
      </div>
      {formData.type === 'day' && (
        <div className='availab-label-box' >
          <label className='availab-label' >
            Data:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className='availab-input'
            />
          </label>
        </div>
      )}
      {formData.type === 'period' && (
        <>
          <div className='availab-label-box' >
            <label className='availab-label' >
              Início:
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className='availab-input'
              />
            </label>
          </div>
          <div className='availab-label-box'>
            <label className='availab-label'>
              Fim:
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className='availab-input'
              />
            </label>
          </div>
        </>
      )}
      <div className='availab-label-box' >
        <label className='availab-label' >
          Motivo:
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className='availab-input'
          />
        </label>
      </div>
      <div style={{display: 'flex'}}>
        <button className='availab-btn' onClick={(e) => handleSubmit(e)} type="submit" disabled={loading} >
            {loading ? 'Salvando...' : 'Marcar Folga'}
        </button>
        <button className='availab-btn' onClick={(e) => cancel(e)}  >
            Cancelar
        </button>
      </div>
      {message && <p id='availab-text'>{message}</p>}
    </form>
    </div>
  );
};


