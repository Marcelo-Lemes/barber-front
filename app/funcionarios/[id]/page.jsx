'use client';

import { useContext, useEffect, useState } from 'react';
import './id.css';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import Menu from '@/app/components/menu/menu';
import { MdModeEdit } from 'react-icons/md';
import { RiDeleteBin5Fill } from "react-icons/ri";
import Earnings from '@/app/components/earnings/earnings';
import WsModal from '@/app/components/wsModal/wsModal';
import EditWorker from '@/app/components/editWorker/editWorker';
import CreateAvailabilityForm from '@/app/components/createAvailability/createAvailability';
import AuthContext from '@/app/Context/authContext';
import DeleteWorker from '@/app/components/deleteWorker/deleteWorker';
import Loading from '@/app/components/loading/loading';

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export default function WorkerProfile() {
  const [worker, setWorker] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [showWsModal, setShowWsModal] = useState(false);
  const [deletar, setDeletar] = useState(false)
  const {user} = useContext(AuthContext);

  const { id } = useParams();
  const router = useRouter();
  const backUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchMonthlyEarnings = async () => {
    try {
      const response = await axios.get(
        `${backUrl}/revenue/${id}/${selectedMonth}/${selectedYear}`
      );
      const formattedEarnings = camelcaseKeys(response.data);
      setMonthlyEarnings(formattedEarnings.totalRevenue || 0);
    } catch (error) {
      setError(error);
    }
  };

  const validation = () => {
    setLoading(true);
    if(user.id > 0) {
      setLoading(false);
    } else {
      window.location.href = '/'

    }
  }
  
  useEffect(() => {
      validation()
  }, [])

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const response = await axios.get(`${backUrl}/users/${id}`);
        const formattedWorker = camelcaseKeys(response.data);
        setWorker(formattedWorker);

        const schedulesResponse = await axios.get(
          `${backUrl}/schedules/${id}`
        );
        const formattedSchedules = camelcaseKeys(schedulesResponse.data);
        setSchedules(formattedSchedules);

        await fetchMonthlyEarnings();
      } catch (error) {
        setError(error);
        router.push('/funcionarios');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [id, router, edit, showModal, showWsModal]);

  useEffect(() => {
    fetchMonthlyEarnings();
  }, [selectedMonth, selectedYear]);

  if (loading) return <div><Loading /></div>;
  if (error) return <p>Erro ao carregar dados.</p>;

  return (
    <div id="worker-profile-page">
      <Menu />
      <div className="profile-container" >
        <div id='teste' style={{display: 'flex'}}>
          <div className="profile-header">
            <img src={worker?.img} alt={worker?.name} onError={(e) => (e.target.src = "https://img.freepik.com/vetores-premium/pictograma-de-uma-pessoa_764382-14126.jpg?semt=ais_hybrid")} />
            <h1>{worker?.name}</h1>
            <button className="edit-btn" onClick={() => setEdit(true)}>
              Editar conta
              <MdModeEdit className='btn-icons' />
            </button>
            <button className="delete-btn" onClick={() => setDeletar(true)}>
              Excluir conta
              <RiDeleteBin5Fill className='btn-icons' />
            </button>
          </div>

          <div className="profile-schedule">
            <h2>Horários de Trabalho</h2>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Manhã</th>
                  <th>Tarde</th>
                </tr>
              </thead>
              <tbody>
                {WEEK_DAYS.map(day => {
                  const schedule = schedules.find(s => s.dayOfWeek === day);
                  const noWork = !schedule || (!schedule.morning && !schedule.afternoon);

                  if (schedule && !noWork) {
                    return (
                      <tr className='days' key={day}>
                        <td>{schedule.dayOfWeek}</td>
                        <td>{schedule.morning || 'Sem expediente'}</td>
                        <td>{schedule.afternoon || 'Sem expediente'}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={day} className="not-working days">
                      <td>{day}</td>
                      <td colSpan="2">Não trabalha</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>
              <button className="mark-off-btn" onClick={() => setShowWsModal(true)}>Editar horários</button>
              <button className="mark-off-btn" onClick={() => setShowModal(true)}>Marcar Folga</button>
            </div>
          </div>
        </div>
      
        <div className="profile-stats">
          <h2>Ganhos Mensais</h2>
          <div className="earnings-filter">
            <label>
              Mês:
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Ano:
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div >
            <Earnings userId={id} month={selectedMonth} year={selectedYear} />
            <p>
              <strong>Total:</strong> R$ {Number(monthlyEarnings).toFixed(2)}
            </p>
          </div>

          </div>

        {/* Modal de Horários */}
        {showWsModal && (<WsModal showModal={setShowWsModal} />)}

        {/* Modal de editar dados*/}
        {edit && (<EditWorker edit={setEdit}/>)}

        {/* Model de deletar worker */}

        {deletar && (<DeleteWorker deletar={setDeletar}/>)}
          
        {/* Modal de Folga */}
        {showModal && (
          <div className="modal-overlay">
            <CreateAvailabilityForm modal={setShowModal}/>
          </div>
        )}
      </div>
    </div>
  );
}
