import PropTypes from 'prop-types';
import WorkScheduleForm from '../workSchedules/workSchedules';
import './wsModal.css';

export default function WsModal({showModal}) {

    WsModal.propTypes = {
        showModal: PropTypes.func,
    }.isRequired;
  return (
    <div className="modal-overlay">
        <div className="ws-modal">
            <WorkScheduleForm modal={showModal} />
        </div>
    </div>
  )
}
