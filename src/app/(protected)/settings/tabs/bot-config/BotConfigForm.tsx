'use client';
import React, { useState, useEffect } from 'react';
import { Accordion, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { BotConfig, LibraryVisibility } from '@/types/config';
import DiscordIdInput from './components/DiscordIdInput';

interface BotConfigFormProps {
  config: BotConfig;
  onSubmit: (config: BotConfig) => Promise<void>;
  isLoading: boolean;
}

const BotConfigForm: React.FC<BotConfigFormProps> = ({
  config: initialConfig,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<BotConfig>(initialConfig);

  useEffect(() => {
    setFormData(initialConfig);
  }, [initialConfig]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (path: string[], value: any) => {
    setFormData(prev => {
      const newConfig = { ...prev };
      let current = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Recompensas por Mensajes</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad de mensajes necesarios</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.rewards.messages.amount}
                    onChange={(e) => handleChange(['rewards', 'messages', 'amount'], Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monedas por recompensa</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.rewards.messages.coins}
                    onChange={(e) => handleChange(['rewards', 'messages', 'coins'], Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <DiscordIdInput
                  label="Canales Excluidos"
                  values={formData.rewards.messages.excludedChannels}
                  onAdd={(value) =>
                    handleChange(['rewards', 'messages', 'excludedChannels'], [
                      ...formData.rewards.messages.excludedChannels,
                      value
                    ])
                  }
                  onRemove={(value) =>
                    handleChange(
                      ['rewards', 'messages', 'excludedChannels'],
                      formData.rewards.messages.excludedChannels.filter(v => v !== value)
                    )
                  }
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Canales Especiales</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad de mensajes necesarios</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.rewards.specialChannels.amount}
                    onChange={(e) => handleChange(['rewards', 'specialChannels', 'amount'], Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monedas por recompensa</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.rewards.specialChannels.coins}
                    onChange={(e) => handleChange(['rewards', 'specialChannels', 'coins'], Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <DiscordIdInput
                  label="Canales Especiales"
                  values={formData.rewards.specialChannels.channels}
                  onAdd={(value) =>
                    handleChange(['rewards', 'specialChannels', 'channels'], [
                      ...formData.rewards.specialChannels.channels,
                      value
                    ])
                  }
                  onRemove={(value) =>
                    handleChange(
                      ['rewards', 'specialChannels', 'channels'],
                      formData.rewards.specialChannels.channels.filter(v => v !== value)
                    )
                  }
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Tiempo en Canales de Voz</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Minutos necesarios</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.rewards.voiceTime.minutes}
                    onChange={(e) => handleChange(['rewards', 'voiceTime', 'minutes'], Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monedas por recompensa</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.rewards.voiceTime.coins}
                    onChange={(e) => handleChange(['rewards', 'voiceTime', 'coins'], Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <DiscordIdInput
                  label="Canales de Voz Excluidos"
                  values={formData.rewards.voiceTime.excludedChannels}
                  onAdd={(value) =>
                    handleChange(['rewards','voiceTime','excludedChannels'], [
                      ...formData.rewards.voiceTime.excludedChannels,
                      value
                    ])
                  }
                  onRemove={(value) =>
                    handleChange(
                      ['rewards','voiceTime','excludedChannels'],
                      formData.rewards.voiceTime.excludedChannels.filter(v => v !== value)
                    )
                  }
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Recompensas por Foros</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3">
              <Form.Label>Monedas por publicación</Form.Label>
              <Form.Control
                type="number"
                value={formData.rewards.forums.coins}
                onChange={(e) => handleChange(['rewards', 'forums', 'coins'], Number(e.target.value))}
                min="1"
              />
            </Form.Group>
            <DiscordIdInput
              label="Foros Permitidos"
              values={formData.rewards.forums.allowedForums}
              onAdd={(value) =>
                handleChange(['rewards','forums','allowedForums'], [
                  ...formData.rewards.forums.allowedForums,
                  value
                ])
              }
              onRemove={(value) =>
                handleChange(
                  ['rewards','forums','allowedForums'],
                  formData.rewards.forums.allowedForums.filter(v => v !== value)
                )
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Canal de Notificaciones</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3">
              <Form.Label>Canal de Recompensas</Form.Label>
              <Form.Control
                type="text"
                value={formData.channels.rewardChannelId}
                onChange={(e) => handleChange(['channels', 'rewardChannelId'], e.target.value)}
                placeholder="ID del canal de recompensas"
              />
              <Form.Text className="text-muted">
                Este es el canal donde el bot enviará las notificaciones de recompensas
              </Form.Text>
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Mensajes del Bot</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3">
              <Form.Label>Mensaje de Recompensa</Form.Label>
              <Form.Control
                type="text"
                value={formData.messages.recompensa}
                onChange={(e) => handleChange(['messages', 'recompensa'], e.target.value)}
                placeholder="Ejemplo: {user} ¡Has ganado {coins} monedas!"
              />
              <Form.Text className="text-muted">
                Variables: {'{user}'}, {'{coins}'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mensaje de Error</Form.Label>
              <Form.Control
                type="text"
                value={formData.messages.error}
                onChange={(e) => handleChange(['messages', 'error'], e.target.value)}
                placeholder="Ejemplo: {user} ¡Ha ocurrido un error!"
              />
              <Form.Text className="text-muted">
                Variables: {'{user}'}
              </Form.Text>
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>Configuración de Biblioteca</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3">
              <Form.Label>Carpeta por Defecto</Form.Label>
              <Form.Control
                type="text"
                value={formData.library.defaultFolder}
                onChange={(e) => handleChange(['library', 'defaultFolder'], e.target.value)}
                placeholder="Ejemplo: Foros"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Visibilidad por Defecto</Form.Label>
              <Form.Control
                as="select"
                value={formData.library.defaultVisibility}
                onChange={(e) => handleChange(['library', 'defaultVisibility'], e.target.value)}
              >
                <option value={LibraryVisibility.GENERAL}>General</option>
                <option value={LibraryVisibility.USERS}>Usuarios</option>
                <option value={LibraryVisibility.ADMIN}>Admin</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Configuración de Foros</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Check
                    type="switch"
                    id="forumEnabled"
                    label="Habilitar foros"
                    checked={formData.library.forumConfig.enabled}
                    onChange={(e) => handleChange(['library', 'forumConfig', 'enabled'], e.target.checked)}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="switch"
                    id="autoCreate"
                    label="Crear automáticamente"
                    checked={formData.library.forumConfig.autoCreate}
                    onChange={(e) => handleChange(['library', 'forumConfig', 'autoCreate'], e.target.checked)}
                  />
                </Col>
              </Row>
              <Form.Control
                className="mt-2"
                type="text"
                value={formData.library.forumConfig.defaultFolder}
                onChange={(e) => handleChange(['library', 'forumConfig', 'defaultFolder'], e.target.value)}
                placeholder="Carpeta por defecto para foros"
              />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>

      </Accordion>

      <div className="d-flex justify-content-end mt-4">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default BotConfigForm;
