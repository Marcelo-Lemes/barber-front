'use client'
import AddWorker from '@/app/components/addWorker/addWorker'
import Menu from '@/app/components/menu/menu'
import './adicionar.css';
import { useContext, useEffect, useState } from 'react';
import WorkScheduleForm from '@/app/components/workSchedules/workSchedules';
import AuthContext from '@/app/Context/authContext';
import Loading from '@/app/components/loading/loading';

export default function page() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

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

  if (loading) return <div><Loading /></div>;
  return (
    <div id='func-add-page'>
      <div id='func-add-box'>
          <Menu />
          {step === 0 ? <AddWorker setStep={setStep}/> : <WorkScheduleForm />}
      </div>
    </div>
    )
}
