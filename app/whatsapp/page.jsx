'use client';
import React, { useContext, useEffect, useState } from 'react'
import WhatsAppAuth from '../components/whatsApi/whatsapp'
import AuthContext from '../Context/authContext';

export default function page() {
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

  const validation = () => {
    setLoading(true);
    if(user.role === 'admin') {
      setLoading(false);

    } else {
      window.location.href = '/'
    }
  }

    useEffect(() => {
        validation()
    }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
        <WhatsAppAuth />
    </div>
  )
}
