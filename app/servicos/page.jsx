"use client";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '../components/menu/menu';
import camelcaseKeys from 'camelcase-keys';
import { FaPlus } from "react-icons/fa";
import { RxCross1 } from 'react-icons/rx';
import { MdModeEdit } from 'react-icons/md';
import AuthContext from '../Context/authContext';
import AddModal from '../components/serviceModal/addModal';
import EditModal from '../components/serviceModal/editModal';
import './servicos.css';
import Loading from '../components/loading/loading';


export default function Services() {

  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const {setData, user} = useContext(AuthContext);

  const backUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem('authToken') : null;


  const editService = async (service) => {
    setData(service)
    setEdit(true)
  }

  const validation = () => {
    setLoading(true);
    if(user.id > 0) {
      setLoading(false);
    } else {
      window.location.href = '/'

    }
  }

  const deleteService = async (id) => {
    try {
        await axios.delete(`${backUrl}/services/${id}`, {
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
        
    }
  }

  const addService = () => {
    setShowModal(true);
    console.log('ok');
    
  }

  useEffect(() => {
    const fetchServiceData = async () => {
      
      try {
        const response = await axios.get(`${backUrl}/services`);

        const formatedServices = camelcaseKeys(response.data)
        setServices(formatedServices);
        

        } catch (error) {
          setError(error);

        } finally {
          setLoading(false);
          
        }
      };
  
      fetchServiceData();
    }, [services]);

    useEffect(() => {
      validation();
    },[])

    if (loading) return <div><Loading /></div>;
    if (error) return <div>Error: {error.message}</div>;


  return (
    <div id='serv-page'>
      <Menu />
      <div id='service-box'>
        <div id='serv-title-box' style={{display: 'flex'}}>
          <h1 id='serv-title' >Serviços</h1>
          <button
              id='serv-button-add'
              className="btn btn-primary"
              onClick={() => addService()}
          >
              <FaPlus style={{fontSize: '12px'}} /> Adicionar 
          </button>
        </div>
          {
            services ?
              <table id="service-table" >
                <thead >
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Serviço</th>
                    <th scope="col">Duração</th>
                    <th scope="col">Preço</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  { services
                    .map((item, index) => {
                        return (
                        <tr id='service-table-tr' key={index}>
                            <th scope="row">
                                <span> {(index + 1)} </span>
                            </th>
                            <td style={{width: '30vw'}}>{item.name}</td>
                            <td style={{width: 'fit-content'}}>{item.time} min</td>
                            <td style={{width: 'fit-content'}}>{item.price}</td>
                            <td style={{width: 'fit-content'}}>
                                <div style={{display: 'flex', marginLeft: 'auto', marginRight: '0', width: 'fit-content'}}>
                                    <MdModeEdit id="serv-edit-icon" onClick={() => editService(item)} className="d-address-icons"/>
                                    <RxCross1 id="serv-cross-icon" onClick={() => deleteService(item.id)} className="d-address-icons"/>
                                </div>
                            </td>
                        </tr>
                        )
                    })
                  }
                </tbody>
              </table>        
            :
            <span>Houve algum erro ao carregar serviços.</span>
          }
           {/* Adicionar novo serviço */}
        {showModal ? <AddModal setShowModal={setShowModal}/> : null}
        {edit ? <EditModal setShowModal={setEdit}/> : null}
      </div>
    </div>
  )
}
