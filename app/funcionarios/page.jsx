'use client';
import './funcionarios.css';
import Workers from '../components/workers/workers';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { FaPlus } from "react-icons/fa";
import Menu from '../components/menu/menu';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../Context/authContext';
import Loading from '../components/loading/loading';


export default function page() {
    const [loading, setLoading] = useState(true);
    const {user} = useContext(AuthContext);
    
    const pathname = usePathname();

    const validation = () => {
      setLoading(true);
      if(user.id > 0) {
        if (user.role === 'admin') {
            setLoading(false);
        } else {
            window.location.href = `/funcionarios/${user.id}`
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
    <div id='funcionario-page'>
        <Menu />
        <h1 id='func-title' style={{textAlign: 'center'}}>Profissionais</h1>
        { <Workers /> === undefined ?
        
            <div>
                <p>Nenhum funcionário registrado.</p> :
                <div style={{textAlign: 'center'}}>
                    <Link href="/funcionarios/adicionar">
                    <button
                        id='func-button-add'
                        className="btn btn-primary"
                    >
                        <FaPlus style={{fontSize: '12px'}} /> Adicionar
                    </button>
                    </Link>
                </div>
            </div>
            :
            <div id='func-box'>
                <Workers url={pathname}/> 
                <div style={{textAlign: 'center'}}>
                    <Link href="/funcionarios/adicionar">
                    <button
                        id='func-button-add'
                        className="btn btn-primary"
                    >
                        <FaPlus style={{fontSize: '12px'}} /> Adicionar
                    </button>
                    </Link>
                </div>
            </div>
        }
    </div>
  )
}
