'use client';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import api from '@/utils/axios';
import { InfractionDto } from '@/types/config';
import InfractionEditModal from './InfractionEditModal';

const InfractionsPage: React.FC = () => {
  const [infractions, setInfractions] = useState<InfractionDto[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState<InfractionDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchInfractions = async () => {
    try {
      const response = await api.get('/config/infractions');
      setInfractions(response.data || []);
    } catch (error) {
      console.error('Error fetching infractions:', error);
      dispatch(addNotification({ message: 'Error al cargar sanciones', color: 'danger' }));
    }
  };

  useEffect(() => {
    fetchInfractions();
  }, [dispatch]);

  const handleCreateClick = () => {
    setSelectedInfraction(null);
    setShowEditModal(true);
  };

  const handleEditClick = (infraction: InfractionDto) => {
    setSelectedInfraction(infraction);
    setShowEditModal(true);
  };

  const handleSubmit = async (infraction: InfractionDto) => {
    setIsLoading(true);
    if (!selectedInfraction && infractions.some(inf => inf.value === infraction.value)) {
      dispatch(addNotification({ message: 'Ya existe una sanción con ese valor', color: 'danger' }));
      setIsLoading(false);
      return;
    }
    try {
      const currentConfig = await api.get('/config/infractions');
      const updatedInfractions = selectedInfraction
        ? infractions.map(inf => inf.value === selectedInfraction.value ? infraction : inf)
        : [...infractions, infraction];

      await api.patch('/config', {
        ...currentConfig.data,
        infractions: updatedInfractions,
      });

      setInfractions(updatedInfractions);
      dispatch(addNotification({ 
        message: `Sanción ${selectedInfraction ? 'actualizada' : 'creada'} correctamente`, 
        color: 'success' 
      }));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving infraction:', error);
      dispatch(addNotification({ message: 'Error al guardar la sanción', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (value: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sanción?')) {
      try {
        const currentConfig = await api.get('/config/infractions');
        const updatedInfractions = infractions.filter(inf => inf.value !== value);

        await api.patch('/config', {
          ...currentConfig.data,
          infractions: updatedInfractions,
        });

        setInfractions(updatedInfractions);
        dispatch(addNotification({ message: 'Sanción eliminada correctamente', color: 'success' }));
      } catch (error) {
        console.error('Error deleting infraction:', error);
        dispatch(addNotification({ message: 'Error al eliminar la sanción', color: 'danger' }));
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h2>Administración de Sanciones</h2>
          <Button variant="success" onClick={handleCreateClick}>
            Crear Nueva Sanción
          </Button>
        </Col>
      </Row>
      <Row>
        {infractions.map((infraction) => (
          <Col key={infraction.value} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  {infraction.emoji} {infraction.name}
                </Card.Title>
                <Card.Text>
                  <strong>Valor:</strong> {infraction.value}<br />
                  <strong>Puntos:</strong> {infraction.points}<br />
                  <strong>Descripción:</strong> {infraction.description}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleEditClick(infraction)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(infraction.value)}>
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <InfractionEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleSubmit}
        infraction={selectedInfraction}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default InfractionsPage;
