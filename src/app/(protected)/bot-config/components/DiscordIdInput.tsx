
import React, { useState } from 'react';
import { Form, Button, ListGroup, Row, Col } from 'react-bootstrap';

interface DiscordIdInputProps {
  values: string[];
  onAdd: (val: string) => void;
  onRemove: (val: string) => void;
  label?: string;
  placeholder?: string;
}

const DiscordIdInput: React.FC<DiscordIdInputProps> = ({
  values,
  onAdd,
  onRemove,
  label,
  placeholder = 'Ingresa un ID...'
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    onAdd(inputValue.trim());
    setInputValue('');
  };

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Row>
        <Col xs={9}>
          <Form.Control
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Col>
        <Col xs={3}>
          <Button variant="primary" onClick={handleAdd}>
            Agregar
          </Button>
        </Col>
      </Row>
      <ListGroup className="mt-2">
        {values?.map((val, idx) => (
          <ListGroup.Item key={idx}>
            {val}
            <Button
              variant="danger"
              size="sm"
              className="float-end"
              onClick={() => onRemove(val)}
            >
              Eliminar
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Form.Group>
  );
};

export default DiscordIdInput;