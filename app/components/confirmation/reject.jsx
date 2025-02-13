import { RxCrossCircled } from "react-icons/rx";
import PropTypes from 'prop-types';
import './confirmation.css';
import AuthContext from "@/app/Context/authContext";
import { useContext } from "react";



export default function Reject() {

  const { setOption } = useContext(AuthContext);

  return (
    <div id="reject-container">
      <div id="reject-box" >
        <h2 id="reject-title">Ocorreu algum erro!</h2>
        <RxCrossCircled id="reject-icon" style={{width: '80', height: '115px'}}/>
        <div>
          <button onClick={() => {setOption(null)}} className="modal-button confirm" style={{width: '150px'}}>Voltar</button>
        </div>
      </div>
    </div>
  )
}
