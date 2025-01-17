/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Spinner, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import api from '@/utils/axios';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { format } from 'date-fns';
import { UserDiscord } from '@/types/config';

interface KardexEntry {
  id: number;
  userDiscord: UserDiscord;
  operation: 'IN' | 'OUT';
  amount: number;
  balance: number;
  reference: string;
  createdAt: string;
}

interface SortConfig {
  key: 'createdAt' | 'amount' | 'balance' | null;
  direction: 'ASC' | 'DESC';
}

const KardexPage: React.FC = () => {
  const [entries, setEntries] = useState<KardexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'DESC' });
  const [page, setPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const limit = 20;
  const dispatch = useDispatch();

  const fetchKardex = async () => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      const params = {
        offset,
        limit,
        search: searchTerm || undefined,
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
        sortBy: sortConfig.key || undefined,
        sortOrder: sortConfig.direction
      };

      const response = await api.get('/kardex/search/page', { 
        params: Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v != null)
        )
      });
      
      if (response.data?.items) {
        setEntries(response.data.items);
        setTotalEntries(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching kardex:', error);
      setEntries([]);
      setTotalEntries(0);
      dispatch(addNotification({ 
        message: 'Error al cargar el kardex', 
        color: 'danger' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKardex();
  }, [page, sortConfig]);

  const handleSort = (key: 'createdAt' | 'amount' | 'balance') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchKardex();
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return <FaSort />;
    return sortConfig.direction === 'ASC' ? <FaSortUp /> : <FaSortDown />;
  };

  const totalPages = Math.ceil(totalEntries / limit);

  return (
    <Container fluid className="mt-4">
      <Form onSubmit={handleSearch}>
        <Row className="mb-4 g-3">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar por referencia"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Fecha desde"
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Fecha hasta"
            />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              Filtrar
            </Button>
          </Col>
        </Row>
      </Form>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario ID</th>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                  Fecha {getSortIcon('createdAt')}
                </th>
                <th>Operación</th>
                <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                  Monto {getSortIcon('amount')}
                </th>
                <th onClick={() => handleSort('balance')} style={{ cursor: 'pointer' }}>
                  Balance {getSortIcon('balance')}
                </th>
                <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
              {entries?.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.userDiscord.id}</td>
                  <td>{format(new Date(entry.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                  <td>
                    <span className={entry.operation === 'IN' ? 'text-success' : 'text-danger'}>
                      {entry.operation === 'IN' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td>{entry.amount}</td>
                  <td>{entry.balance}</td>
                  <td>{entry.reference}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <span>Total: {totalEntries} registros</span>
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
        </>
      )}
    </Container>
  );
};

export default KardexPage;
