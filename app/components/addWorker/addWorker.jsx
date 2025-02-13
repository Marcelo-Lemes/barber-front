'use client'

import { useContext, useState } from 'react';
import './addWorker.css';
import { useParams, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import AuthContext from '@/app/Context/authContext';

export default function AddWorker({setStep}) {
    const [worker, setWorker] = useState({
        name: '',
        email: '',
        password: '',
        img: '',
        role: '',
    });
    const {setData} = useContext(AuthContext);


    const { id } = useParams();
    const router = useRouter();

    const cancel = (e) => {
        e.preventDefault()
        router.push('/funcionarios')
    }

    const confirm = (e) => {
        e.preventDefault()
        setData({worker})
        setStep(1);

    }   

    AddWorker.propTypes = {
        setStep: PropTypes.func,
    }.isRequired;
    
  return (
    <div id='add-worker-container'>
    <form id='add-worker-form'>
        <h3 id='add-work-title'>Adicionar novo funcionário:</h3>
        <div id='first-input-add' className="mb-3">
            <label htmlFor="name" className="form-label add-work-label">Nome: </label>
            <input
                type="text"
                className="form-control add-work-input"
                id="name"
                aria-describedby="emailHelp"
                value={worker.name ? worker.name : ''}
                onChange={(e) => setWorker({...worker, name: e.target.value})}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label add-work-label">Email:</label>
            <input
                type="email"
                className="form-control add-work-input"
                id="email"
                value={worker.email ? worker.email : ''}
                onChange={(e) => setWorker({...worker, email: e.target.value})}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label add-work-label">Senha:</label>
            <input
                type="password"
                className="form-control add-work-input"
                id="password"
                value={worker.password ? worker.password : ''}
                onChange={(e) => setWorker({...worker, password: e.target.value})}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="confimPassword" className="form-label add-work-label">Confirme a senha:</label>
            <input
                type="password"
                className="form-control add-work-input"
                id="confimPassword"
            />
        </div>
        <div className="mb-3">
            <label htmlFor="role" className="form-label add-work-label">Cargo:</label>
            <select name="role" onChange={(e) => setWorker({...worker, role: e.target.value})} value={worker.role ? worker.role : ''} className="form-control add-work-input" id="role">
                <option value="user">Funcionário</option>
                <option value='admin'>Administrador</option>
            </select>

        </div>
        <div className="mb-3">
            <label htmlFor="url" className="form-label add-work-label">Foto:</label>
            <input
                type="url"
                className="form-control add-work-input"
                id="url"
                value={worker.img ? worker.img : ''}
                onChange={(e) => setWorker({...worker, img: e.target.value})}
            />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div id='button-box'>
            <button onClick={(e) => confirm(e)} className="btn btn-outline-success">Continuar</button>
            <button onClick={(e) => cancel(e)} className="btn btn-outline-danger">Cancelar</button>
        </div>
    </form>
      
    </div>
  )
}
