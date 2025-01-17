'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { XpRole } from '@/types/config';

interface XpRoleEditModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (role: XpRole) => Promise<void>;
  role: XpRole | null;
  isLoading: boolean;
}

const XpRoleEditModal: React.FC<XpRoleEditModalProps> = ({
  show,
  onHide,
  onSubmit,
  role,
  isLoading,
}) => {
  const [formData, setFormData] = useState<XpRole>({
    roleId: '',
    name: '',
    requiredXp: 0,
  });

  useEffect(() => {
    if (role) {
      setFormData(role);
    } else {
      setFormData({
        roleId: '',
        name: '',
        requiredXp: 0,
      });
    }
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'requiredXp' ? parseInt(value) || 0 : value,
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
            {role ? 'Editar Rol de XP' : 'Crear Nuevo Rol de XP'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>ID del Rol de Discord</Form.Label>
            <Form.Control
              type="text"
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre del Rol</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>XP Requerido</Form.Label>
            <Form.Control
              type="number"
              name="requiredXp"
              value={formData.requiredXp}
              onChange={handleChange}
              required
              min="0"
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
            ) : role ? (
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

export default XpRoleEditModal;
