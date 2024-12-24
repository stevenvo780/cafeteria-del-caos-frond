import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Form, Spinner, InputGroup, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/ui';
import api from '../../utils/axios';
import { FaSearch, FaCoins, FaStar, FaExclamationTriangle, FaMinusCircle } from 'react-icons/fa';

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

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
  email: string;
  name: string | null;
  role: UserRole;
  roles: DiscordRole[];
  points: number;
  coins: number;
  discordData: any;
}

interface EditingUser {
  points: string;
  coins: string;
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
  const [editingUsers, setEditingUsers] = useState<{ [key: string]: EditingUser }>({});
  const [savingChanges, setSavingChanges] = useState<{ [key: string]: boolean }>({});
  const [hasChanges, setHasChanges] = useState<{ [key: string]: boolean }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRolesModal, setShowRolesModal] = useState(false);

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
      const response = await api.get('/discord-users', { params });
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

  const handleValueChange = (userId: string, field: keyof EditingUser, value: string) => {
    setEditingUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
    setHasChanges(prev => ({ ...prev, [userId]: true }));
  };

  const handleSaveChanges = async (user: User) => {
    setSavingChanges(prev => ({ ...prev, [user.id]: true }));
    try {
      const changes = editingUsers[user.id];
      await api.patch(`/discord-users/${user.id}`, {
        points: parseInt(changes.points),
        coins: parseInt(changes.coins)
      });
      
      setUsers(prev => prev.map(u =>
        u.id === user.id ? {
          ...u,
          points: parseInt(changes.points),
          coins: parseInt(changes.coins)
        } : u
      ));
      
      setHasChanges(prev => ({ ...prev, [user.id]: false }));
      dispatch(addNotification({ 
        message: 'Puntos y monedas actualizados correctamente', 
        color: 'success' 
      }));
    } catch (error) {
      dispatch(addNotification({ 
        message: 'Error al actualizar puntos y monedas', 
        color: 'danger' 
      }));
    } finally {
      setSavingChanges(prev => ({ ...prev, [user.id]: false }));
    }
  };

  useEffect(() => {
    const newEditingUsers: { [key: string]: EditingUser } = {};
    users.forEach(user => {
      newEditingUsers[user.id] = {
        points: user.points.toString(),
        coins: user.coins.toString()
      };
    });
    setEditingUsers(newEditingUsers);
  }, [users]);

  const handleShowRoles = (user: User) => {
    setSelectedUser(user);
    setShowRolesModal(true);
  };

  const RolesModal = () => (
    <Modal show={showRolesModal} onHide={() => setShowRolesModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Roles de {selectedUser?.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="roles-grid">
          {selectedUser?.roles.map((role) => (
            <span
              key={role.id}
              className="role-tag"
              style={{
                backgroundColor: `#${role.color.toString(16).padStart(6, '0')}`,
                color: role.color > 0x7FFFFF ? '#000' : '#fff',
              }}
            >
              {role.name}
            </span>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );

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

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row xs={1} md={3} lg={4} className="g-3">
          {sortedUsers.map((user) => (
            <Col key={user.id}>
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center py-2">
                  <div className="text-truncate me-2 h6 mb-0">{user.username}</div>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleShowRoles(user)}
                    className="px-2 py-1"
                  >
                    Roles {user.roles.length}
                  </Button>
                </Card.Header>
                <Card.Body className="p-3">
                  <div className="mb-3">
                    <div className="mb-2">
                      <label className="form-label d-flex align-items-center mb-1">
                        <FaMinusCircle className="text-danger me-2" />
                        <span className="fw-bold small">Penalización</span>
                      </label>
                      <Form.Control
                        type="number"
                        value={editingUsers[user.id]?.points}
                        onChange={(e) => handleValueChange(user.id, 'points', e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="form-label d-flex align-items-center mb-1">
                        <FaCoins className="text-warning me-2" />
                        <span className="fw-bold small">Monedas</span>
                      </label>
                      <Form.Control
                        type="number"
                        value={editingUsers[user.id]?.coins}
                        onChange={(e) => handleValueChange(user.id, 'coins', e.target.value)}
                        size="sm"
                      />
                    </div>
                  </div>
                  {savingChanges[user.id] ? (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    <Button
                      variant={hasChanges[user.id] ? "primary" : "outline-secondary"}
                      disabled={!hasChanges[user.id]}
                      onClick={() => handleSaveChanges(user)}
                      className="w-100"
                      size="sm"
                    >
                      {hasChanges[user.id] ? "Guardar" : "Sin cambios"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <RolesModal />

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

export default UserListPage;
