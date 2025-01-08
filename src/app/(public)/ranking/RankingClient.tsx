/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Spinner, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import api from '@/utils/axios';

interface User {
  id: string;
  username: string;
  points: number;
  coins: number;
  experience: number;
}

interface SortConfig {
  key: 'points' | 'coins' | 'experience' | null;
  direction: 'asc' | 'desc';
}

const RankingClient: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'experience', 
    direction: 'desc' 
  });
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const offset = (page - 1) * limit;
        const params = {
          limit,
          offset,
          search: searchTerm.trim() || undefined,
          sortBy: sortConfig.key || 'experience',
          sortOrder: sortConfig.direction.toUpperCase(),
        };

        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v != null)
        );

        const response = await api.get('/discord-users', { params: cleanParams });
        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
          setTotalUsers(response.data.total || 0);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchTerm, sortConfig]);

  const handleSort = (key: 'points' | 'coins' | 'experience') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return '#FFD700';
      case 1: return '#C0C0C0';
      case 2: return '#CD7F32';
      default: return '#FFFFFF';
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {['points', 'coins', 'experience'].map((type) => (
            <Button
              key={type}
              variant={sortConfig.key === type ? 'primary' : 'outline-primary'}
              onClick={() => handleSort(type as 'points' | 'coins' | 'experience')}
              className="me-2"
            >
              Ordenar por {type === 'points' ? 'Puntos' : type === 'coins' ? 'Monedas' : 'Experiencia'}
              {sortConfig.key === type && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </Button>
          ))}
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Castigos</th>
              <th>Monedas</th>
              <th>Experiencia</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} style={{ border: `2px solid ${getMedalColor(index)}` }}>
                <td>{((page - 1) * limit) + index + 1}</td>
                <td>{user.username}</td>
                <td>{user.points}</td>
                <td>{user.coins}</td>
                <td>{user.experience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <span>Total: {totalUsers} usuarios</span>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <span className="mx-2">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline-primary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default RankingClient;
