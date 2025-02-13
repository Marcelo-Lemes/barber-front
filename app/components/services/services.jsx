"use client";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import PropTypes from 'prop-types';
import './services.css';
import AuthContext from '@/app/Context/authContext';
import Loading from '../loading/loading';

export default function Services({setOption}) {

  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {data, setData} = useContext(AuthContext);

  const backUrl = process.env.NEXT_PUBLIC_API_URL;

  const selectService = (service) => {
    setOption(3);
    setData({
      ...data,
      service,
    })
  }

  useEffect(() => {
    console.log(data);
    const fetchServiceData = async () => {
      
      try {
        const response = await axios.get(`${backUrl}/services`);

        const formatedServices = camelcaseKeys(response.data)
        setServices(formatedServices);
        console.log(formatedServices);
        

        } catch (error) {
          setError(error);

        } finally {
          setLoading(false);
          
        }
      };
  
      fetchServiceData();
    }, []);

    if (loading) return <div><Loading /></div>;
    if (error) return <div>Error: {error.message}</div>;

    Services.propTypes = {
      setOption: PropTypes.func,
    }.isRequired;

  return (
    <div id="service-box">
    <p id="service-message">{services ? 'Escolha o tipo de serviço:' : 'Nenhum serviço disponível'}</p>
    <div id="service-list">
      {services?.map((service, index) => (
        <div onClick={() => selectService(service)} className="service-card" key={index}>
          <p className="service-name">{service?.name}</p>
          <div className="service-details">
            <p>Preço: R${service?.price}</p>
            <p>Duração: {service?.time}min</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}
