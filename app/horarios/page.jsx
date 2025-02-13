'use client';
import { useContext, useEffect, useState } from 'react';
import './horarios.css';
import Workers from '../components/workers/workers';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import Menu from '../components/menu/menu';
import AuthContext from '../Context/authContext';
import Loading from '../components/loading/loading';


export default function page() {
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);
    const {user} = useContext(AuthContext);


    const pathname = usePathname();

      const validation = () => {
        setLoading(true);
        if(user.id > 0) {
          if (user.role === 'admin') {
            setLoading(false);
        } else {
            window.location.href = `/horarios/${user.id}`
        }
        } else {
          window.location.href = '/'
    
        }
      }
    
        useEffect(() => {
            validation()
        }, [])

        if (loading) return <div><Loading /></div>;

  return (
    <div id='hora-page'>
        <h1 id='hora-title' style={{textAlign: 'center'}}>Agendamentos</h1>
        <Menu />
        { <Workers /> === undefined ?
            <div>
                <p>Nenhum funcionário registrado.</p> :
                <div style={{textAlign: 'center'}}>
                    <Link href="/funcionarios/adicionar">
                        <button type="button" className="btn btn-outline-dark"> Adicionar funcionário</button>
                    </Link>
                </div>
            </div>
            :
            <div>
                <Workers url={pathname}/> 
            </div>
        }
    </div>
  )
}
