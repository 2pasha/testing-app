import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  const handleSelection = (type) => {
    setUserType(type);
    navigate('/login');
  }

  return (
    <div className="message container is-max-tablet">
      <div className="message-header">
        <h1 className="title has-text-centered">Оберіть тип користувача</h1>
      </div>
      <div className="message-body">
        <div className="buttons is-flex is-justify-content-center">
          <button
            onClick={() => handleSelection('teacher')}
            className="button is-primary is-medium"
          >
            <span className="icon">
              <i className="fas fa-chalkboard-teacher"></i>
            </span>
            <span>Вчитель</span>
          </button>
          <button
            onClick={() => handleSelection('student')}
            className="button is-info is-medium"
          >
            <span className="icon">
              <i className="fas fa-user-graduate"></i>
            </span>
            <span>Учень</span>
          </button>
        </div>
      </div>
    </div>
  );
};
