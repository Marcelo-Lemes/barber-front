'use client';
import React, { useContext, useEffect, useState } from "react";
import "./login.css";
import AuthContext from "../Context/authContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    
    const backUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        user.id > 0 ? window.location.href = `/funcionarios/${user.id}` : null;
    })

    const handleLogin = async (e) => {
        e.preventDefault(); // Evitar o reload da página

        try {
            // Fazendo a requisição POST para a API com as credenciais
            const response = await axios.post(`${backUrl}/login`, {
                email,
                password
            });

            // Supondo que a API devolva o token no campo 'token'
            const token = response.data.token;

            const decoded = jwtDecode(token)

            // Armazenando o token no localStorage
            localStorage.setItem('authToken', token);


            // Redirecionar para a página principal ou dashboard
            window.location.href = `/funcionarios/${decoded.id}`;
            
        } catch (error) {
            if (error.response) {
                // Erro 404: Usuário não encontrado
                if (error.response.status === 404) {
                    setError('Email ou Senha incorreta.');
                }
                // Erro 401: Senha incorreta
                else if (error.response.status === 401) {
                    setError('Email ou Senha incorreta.');
                }
                // Outros erros
                else {
                    setError('Erro ao fazer login.');
                }
            } else {
                console.log('Erro:', error);
                setError('Erro na conexão.');
            }
            
        }
    };


  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side - Sign In */}
        <div className="login-left">
          <h2 style={{textAlign: 'center'}}>Login</h2>

          <form onSubmit={(e) => handleLogin(e)}>
          {error ? <p id='error-text'>{error}</p> : null}
            <label htmlFor="username">Email</label>
            <input
                type="text"
                id="username"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Senha</label>
            <input
                type="password"
                id="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="sign-in-button">
              Entrar
            </button>
          </form>
        </div>

        {/* Right Side - Welcome */}
        <div className="login-right">
          <img id="login-barber-logo" src="/barber-logo.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;