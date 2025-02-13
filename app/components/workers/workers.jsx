
import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import AuthContext from "@/app/Context/authContext";
import camelcaseKeys from "camelcase-keys";
import { useRouter } from 'next/navigation';
import './workers.css';
import Loading from "../loading/loading";

export default function Workers({setOption, url, title = false}) {
  
  const [workers, setWorkers] = useState(null);
  const [schedules, setSchedules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {data, setData} = useContext(AuthContext);

  const router = useRouter();
  const backUrl = process.env.NEXT_PUBLIC_API_URL;
  

  const selectWorker = async (worker) => {
    const workSchedules = schedules?.filter((item) => String(item.userId) === String(worker.id));
  
    if (typeof window !== 'undefined') {
      if (setOption) {
        setOption(2);
        setData({
          worker,
          workSchedules
        });
      } else {
        router.push(url + '/' + worker.id);
        setData({
          worker,
          workSchedules
        });
      }
    }
  };
  

  useEffect(() => {
    const fetchWorkersData = async () => {
      
      try {
        const response = await axios.get(`${backUrl}/users`);

        const formatedWorkers = camelcaseKeys(response.data);
        console.log(backUrl);
        
        setWorkers(formatedWorkers);
        console.log(formatedWorkers);

        // Fetch de expediente
        const schedulesResponse = await axios.get(`${backUrl}/schedules`);
        const formatedSchedules = camelcaseKeys(schedulesResponse.data);
        setSchedules(formatedSchedules);
        console.log(formatedSchedules);
        

        } catch (error) {
          setError(error);

        } finally {
          setLoading(false);
          
        }
      };
  
      fetchWorkersData();
    }, []);

    if (loading) return <div><Loading /></div>;
    if (error) return <div>Error: {error.message}</div>;

    Workers.propTypes = {
      setOption: PropTypes.func,
      title: PropTypes.bool
    }.isRequired;

  return (
    <div id="workers-box" >
      {
        title ? <p id="worker-title" style={{textAlign: 'center'}}>{workers ? 'Selecione o profissional que deseja marcar horário:' : 'Nenhum barbeiro disponivel.'}</p> : null
      }
      
      <div className="workers-card-box" >
        {workers.length > 0 ?
           workers
            ?.map((worker, index) => {
            return (
            <div  onClick={() => selectWorker(worker)} id="workers-card" key={index}>
                <img style={{transition: '0.4s'}}
                src={worker.img} alt="icon" onError={(e) => (e.target.src = "https://img.freepik.com/vetores-premium/pictograma-de-uma-pessoa_764382-14126.jpg?semt=ais_hybrid")}
                />
                <div>
                  <p style={{fontSize: '16px'}}>{worker.name}</p>
                </div>
            </div> )
           }) 
       : 'Nenhum funcionário cadastrado.'}
       </div>
      </div>
  )
}
