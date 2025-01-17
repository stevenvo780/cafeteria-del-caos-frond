'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { InfractionDto } from '@/types/config';

interface InfractionEditModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (infraction: InfractionDto) => Promise<void>;
  infraction: InfractionDto | null;
  isLoading: boolean;
}

const InfractionEditModal: React.FC<InfractionEditModalProps> = ({
  show,
  onHide,
  onSubmit,
  infraction,
  isLoading,
}) => {
  const [formData, setFormData] = useState<InfractionDto>({
    name: '',
    value: '',
    points: 0,
    emoji: '',
    description: '',
  });

  useEffect(() => {
    if (infraction) {
      setFormData(infraction);
    } else {
      setFormData({
        name: '',
        value: '',
        points: 0,
        emoji: '',
        description: '',
      });
    }
  }, [infraction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {infraction ? 'Editar Sanción' : 'Crear Nueva Sanción'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valor (Identificador único)</Form.Label>
            <Form.Control
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              disabled={!!infraction}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Puntos</Form.Label>
            <Form.Control
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Emoji</Form.Label>
            <Form.Control
              type="text"
              name="emoji"
              value={formData.emoji}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : infraction ? (
              'Actualizar'
            ) : (
              'Crear'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InfractionEditModal;
