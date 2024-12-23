import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Spinner, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/ui';
import axios from '../../utils/axios';
import { FaSearch, FaSort } from 'react-icons/fa';

interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

interface User {
  id: string;
  username: string;
  nickname: string | null;
  roles: DiscordRole[];
  penaltyPoints: number;
  discordData: any;
}

interface SortConfig {
  key: keyof User | null;
  direction: 'asc' | 'desc';
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPoints, setMinPoints] = useState<string>('');
  const [maxPoints, setMaxPoints] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;
  const dispatch = useDispatch();
  const [editingPoints, setEditingPoints] = useState<{ [key: string]: string }>({});
  const [savingPoints, setSavingPoints] = useState<{ [key: string]: boolean }>({});

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      const params = {
        limit,
        offset,
        search: searchTerm || undefined,
        minPoints: minPoints ? Number(minPoints) : undefined,
        maxPoints: maxPoints ? Number(maxPoints) : undefined,
      };
      console.log(params);
      const response = await axios.get('/discord-users', { params });
      console.log(response);
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total || 0);
      } else {
        setUsers([]);
        setTotalUsers(0);
        dispatch(addNotification({ message: 'Formato de respuesta inválido', color: 'warning' }));
      }
    } catch (error) {
      setUsers([]);
      setTotalUsers(0);
      dispatch(addNotification({ message: 'Error al cargar usuarios', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, minPoints, maxPoints]);

  const handleSort = (key: keyof User) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedUsers = React.useMemo(() => {
    if (!Array.isArray(users)) return [];
    
    return [...users].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (valueA === null) return 1;
      if (valueB === null) return -1;
      if (valueA === valueB) return 0;
      
      return valueA > valueB ? direction : -direction;
    });
  }, [users, sortConfig]);

  console.log(sortedUsers);

  const handlePointsChange = (userId: string, value: string) => {
    setEditingPoints(prev => ({ ...prev, [userId]: value }));
  };

  const handlePointsBlur = async (user: User) => {
    const newPoints = editingPoints[user.id];
    if (newPoints === undefined || newPoints === user.penaltyPoints.toString()) {
      return;
    }

    setSavingPoints(prev => ({ ...prev, [user.id]: true }));
    try {
      await axios.patch(`/user/${user.id}/points`, { points: parseInt(newPoints) });
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, penaltyPoints: parseInt(newPoints) } : u
      ));
      dispatch(addNotification({ message: 'Puntos actualizados correctamente', color: 'success' }));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al actualizar los puntos', color: 'danger' }));
      setEditingPoints(prev => ({ ...prev, [user.id]: user.penaltyPoints.toString() }));
    } finally {
      setSavingPoints(prev => ({ ...prev, [user.id]: false }));
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
              placeholder="Buscar por nombre o email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Row>
            <Col>
              <Form.Control
                type="number"
                placeholder="Puntos mínimos"
                value={minPoints}
                onChange={(e) => setMinPoints(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Puntos máximos"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {['ID', 'Usuario', 'Apodo', 'Roles', 'Puntos'].map((header, index) => {
              
              return (
                <th 
                  key={index} 
                  onClick={() => header && handleSort(header as keyof User)}
                  style={{ cursor: header ? 'pointer' : 'default' }}
                >
                  {header} {sortConfig.key === header && header && (
                    <FaSort />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center">
                <Spinner animation="border" />
              </td>
            </tr>
          ) : sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.nickname || 'Sin apodo'}</td>
                <td>{user.roles.map(role => role.name).join(', ')}</td>
                <td>
                  {savingPoints[user.id] ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Form.Control
                      type="number"
                      value={editingPoints[user.id] ?? user.penaltyPoints}
                      onChange={(e) => handlePointsChange(user.id, e.target.value)}
                      onBlur={() => handlePointsBlur(user)}
                      style={{ width: '80px' }}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
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

export default UserListPage;
