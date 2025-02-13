
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { ImScissors } from "react-icons/im";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { usePathname, useRouter } from 'next/navigation';

import './menu.css';


export default function Menu() {

  const pathname = usePathname();
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("authToken");
    router.push(`/`) 
  };

  const selected = {
    color: 'black',
    backgroundColor: 'white'
  }
  return (
    <div id='menu-box'>
        <img id="barber-logo" src="/barber-logo.png" alt="" />
        <ul id="menu-list">
          <li 
            onClick={() => router.push('/')}
            id="first-list-item"
            style={pathname === '/' ? selected : null}
            className="menu-list-item"
          >
            <FaHome style={{fontSize: '25px'}} className="menu-icon"/>
            <p>Inicio</p>
          </li>
          <li
            onClick={() => router.push('/funcionarios')}
            style={pathname.includes('funcionarios') ? selected : null}
            className="menu-list-item"
          >
            <FaUser className="menu-icon"/>
            <p>Perfil</p>
          </li>
          <li
            onClick={() => router.push('/horarios')}
            style={pathname.includes('horarios') ? selected : null}
            className="menu-list-item"
          >
            <FaRegCalendarAlt className="menu-icon"/>
            <p>Agendamentos</p>
          </li>
          <li
            onClick={() => router.push('/servicos')}
            style={pathname === '/servicos' ? selected : null}
            className="menu-list-item"
          >
            <ImScissors className="menu-icon"/>
            <p>Serviços</p>
          </li>
          <li onClick={() => logout()} style={{borderBottom: 'none'}} className="menu-list-item" >
            <IoMdExit style={{fontSize: '25px', marginLeft: '5.5px'}} className="menu-icon"/>
            <p>Sair</p> 
          </li>
        </ul>

        <div id="responsive-menu">
          <ul>
            <li style={pathname === '/' ? selected : null} onClick={() => router.push('/')} className="resp-menu-item">
              <FaHome className="resp-menu-icon "/>
            </li>
            <li style={pathname.includes('funcionarios') ? selected : null} onClick={() => router.push('/funcionarios')} className="resp-menu-item">
              <FaUser className="resp-menu-icon"/>
            </li>
            <li style={pathname.includes('horarios') ? selected : null} onClick={() => router.push('/horarios')} className="resp-menu-item">
              <FaRegCalendarAlt className="resp-menu-icon"/>
            </li>
            <li style={pathname === '/servicos' ? selected : null} onClick={() => router.push('/servicos')} className="resp-menu-item">
              <ImScissors className="resp-menu-icon"/>
            </li>
            <li onClick={() => logout()} className="resp-menu-item">
              <IoMdExit className="resp-menu-icon"/>
            </li>
          </ul>
        </div>
    </div>
  )
}
