import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('user_id');
    
    return (
      <div>
        {username && <h1>Welcome {username}!</h1>}
        <Link to={`/profile/${id}`} className="hover:text-green-600"> Profile </Link>
        <Link to={`/profile/${id}/manageplant`} className="hover:text-green-600"> Manage Plant </Link>
      </div>
    );
  };

export default DashboardAdmin;