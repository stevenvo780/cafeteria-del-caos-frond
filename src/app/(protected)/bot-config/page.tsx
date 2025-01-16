'use client';
import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import api from '@/utils/axios';
import BotConfigForm from './BotConfigForm';
import { BotConfig } from '@/types/config';

const BotConfigPage: React.FC = () => {
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchConfig = async () => {
    try {
      const response = await api.get('/config/firebase');
      setConfig(response.data);
    } catch (error) {
      console.error('Error fetching config:', error);
      dispatch(addNotification({ 
        message: 'Error al cargar la configuración', 
        color: 'danger' 
      }));
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSubmit = async (updatedConfig: BotConfig) => {
    setIsLoading(true);
    try {
      await api.patch('/config/firebase', updatedConfig);
      setConfig(updatedConfig);
      dispatch(addNotification({ 
        message: 'Configuración actualizada correctamente', 
        color: 'success' 
      }));
    } catch (error) {
      console.error('Error updating config:', error);
      dispatch(addNotification({ 
        message: 'Error al actualizar la configuración', 
        color: 'danger' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!config) return <Spinner animation="border" />;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Configuración del Bot</h2>
      <BotConfigForm 
        config={config}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default BotConfigPage;
