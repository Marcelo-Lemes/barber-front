import { useState, useEffect } from 'react';
import axios from 'axios';
import './whatsapp.css';
import Menu from '../menu/menu';
import Loading from '../loading/loading';


const WhatsAppAuth = () => {
    const [authenticated, setAuthenticated] = useState(null); // Status de autenticação
    const [qrCode, setQrCode] = useState(null); // QR Code
    const [loading, setLoading] = useState(true); // Status de carregamento

    const backUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backUrl}/whatsapp/status`, {
                    headers: {
                    'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
                  }
                }); // Verifica o status
                setAuthenticated(response.data.authenticated);

                if (!response.data.authenticated) {
                    const qrResponse = await axios.get(`${backUrl}/whatsapp/qrcode`, {
                        headers: {
                        'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
                      }
                    }); // Pede o QR Code
                    setQrCode(qrResponse.data.qrCode);
                    console.log(qrResponse.data.qrCode);
                    
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error);
            } finally {
                setLoading(false);
                
            }
        };

        fetchStatus();
    }, []);

    const handleRemoveNumber = async () => {
        try {
            await axios.post(`${backUrl}/whatsapp/remove-number`, {
                headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
              }
            });
            setAuthenticated(false);
            setQrCode(null);
        } catch (error) {
            console.error('Erro ao desvincular número:', error);
        }
    };

    return (
        <div className="whatsapp-auth-container">
            {loading && <Loading />}

            <Menu />
            {!loading && (
                <div className="auth-content">
                    {authenticated ? (
                        <div className="success-message">
                            <p>📲 Número autenticado com sucesso!</p>
                            <button className="action-button" onClick={handleRemoveNumber}>
                                Desvincular número
                            </button>
                        </div>
                    ) : (
                        <div className="qr-code-section">
                            <p>📷 Escaneie o QR Code para autenticar:</p>
                            {qrCode ? (
                                <img
                                    className="qr-code"
                                    src={`${qrCode}`}
                                    alt="QR Code para autenticação"
                                />
                            ) : (
                                <p className="loading">Gerando QR Code...</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WhatsAppAuth;
