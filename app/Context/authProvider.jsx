'use client';

import { useMemo, useState } from 'react';
import AuthContext from './authContext';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [option, setOption] = useState(false);
    const [info, setInfo] = useState();
    const [data, setData] = useState();

  
  
    function authenticator() {
        const token =  typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if(token) {
            try {
                // Decodifica o token
                const decodedToken = jwtDecode(token);
            
                // Acessa informações do token
                const exp = decodedToken.exp;
            
                // Verifica se o token está expirado
                const isExpired = Date.now() >= exp * 1000; // exp é o timestamp em segundos
            
                if (isExpired) {
                alert('Sessão expirada.');
                localStorage.removeItem("authToken");
                router.push(`/login`) 
                } else {
                    setUser({
                        id: decodedToken.id,
                        role: decodedToken.role,
                    })

                }
            } catch (error) {
                console.log('Erro ao decodificar o token:', error);
            }
        }
    }
  
      useMemo(() => {
        authenticator();
      },[]);
  
    const login = (userData) => {
      setUser(userData);
    };
  
    const logout = () => {
      localStorage.removeItem("authToken");
      router.push(`/`) 
    };
  
    AuthProvider.propTypes = {
      children: PropTypes.node,
    }.isRequired;
  
    return (
      <AuthContext.Provider 
      value={{ user, info , setInfo, option, setOption, data, setData, logout }}>
        {children}
      </AuthContext.Provider>
    );
  
  };