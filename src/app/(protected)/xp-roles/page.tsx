'use client';
import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import api from '@/utils/axios';
import { XpRole } from '@/types/config';
import XpRoleEditModal from './XpRoleEditModal';

const XpRolesPage: React.FC = () => {
  const [xpRoles, setXpRoles] = useState<XpRole[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<XpRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchXpRoles = async () => {
    try {
      const response = await api.get('/config/xp-roles');
      setXpRoles(response.data || []);
    } catch (error) {
      console.error('Error fetching XP roles:', error);
      dispatch(addNotification({ message: 'Error al cargar roles de XP', color: 'danger' }));
    }
  };

  useEffect(() => {
    fetchXpRoles();
  }, []);

  const handleCreateClick = () => {
    setSelectedRole(null);
    setShowEditModal(true);
  };

  const handleEditClick = (role: XpRole) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleSubmit = async (role: XpRole) => {
    setIsLoading(true);
    try {
      const config = await api.get('/config/xp-roles');
      const updatedRoles = selectedRole
        ? xpRoles.map(r => r.roleId === selectedRole.roleId ? role : r)
        : [...xpRoles, role];

      // Ordenar roles por XP requerido
      updatedRoles.sort((a, b) => a.requiredXp - b.requiredXp);

      await api.patch('/config', {
        ...config.data,
        xpRoles: updatedRoles,
      });

      setXpRoles(updatedRoles);
      dispatch(addNotification({
        message: `Rol de XP ${selectedRole ? 'actualizado' : 'creado'} correctamente`,
        color: 'success'
      }));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving XP role:', error);
      dispatch(addNotification({ message: 'Error al guardar el rol de XP', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (roleId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol de XP?')) {
      try {
        const config = await api.get('/config/xp-roles');
        const updatedRoles = xpRoles.filter(role => role.roleId !== roleId);

        await api.patch('/config', {
          ...config.data,
          xpRoles: updatedRoles,
        });

        setXpRoles(updatedRoles);
        dispatch(addNotification({ message: 'Rol de XP eliminado correctamente', color: 'success' }));
      } catch (error) {
        console.error('Error deleting XP role:', error);
        dispatch(addNotification({ message: 'Error al eliminar el rol de XP', color: 'danger' }));
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Roles de XP</h2>
        <Button variant="success" onClick={handleCreateClick}>
          Crear Nuevo Rol
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID del Rol</th>
            <th>Nombre</th>
            <th>XP Requerido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {xpRoles.map((role) => (
            <tr key={role.roleId}>
              <td>{role.roleId}</td>
              <td>{role.name}</td>
              <td>{role.requiredXp}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleEditClick(role)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteClick(role.roleId)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <XpRoleEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleSubmit}
        role={selectedRole}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default XpRolesPage;
