'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';

interface CustomURLUploaderProps {
  show: boolean;
  onClose: () => void;
  onInsertURL: (linkHtml: string) => void;
}

interface URLPreview {
  title?: string;
  description?: string;
  image?: string;
}

const CustomURLUploader: React.FC<CustomURLUploaderProps> = ({ show, onClose, onInsertURL }) => {
  const [url, setURL] = useState('');
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<URLPreview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url.trim()) return;
      setLoading(true);
      try {
        // Aquí puedes integrar un servicio de metadata como unfurl.io o similar
        // Este es un ejemplo básico
        const response = await fetch(`/api/url-preview?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        setPreview(data);
        setTitle(data.title || '');
      } catch (error) {
        console.error('Error fetching preview:', error);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchPreview, 500);
    return () => clearTimeout(timer);
  }, [url]);

  const handleInsert = () => {
    if (url.trim()) {
      const linkHtml = `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">${title || url.trim()}</a>`;
      onInsertURL(linkHtml);
      setURL('');
      setTitle('');
      setPreview(null);
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Insertar Link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="url"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="https://..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Texto del enlace</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del enlace"
            />
          </Form.Group>
          {loading && <p>Cargando preview...</p>}
          {preview && (
            <Card className="mt-3">
              {preview.image && (
                <Card.Img variant="top" src={preview.image} alt="Preview" />
              )}
              <Card.Body>
                <Card.Title>{preview.title}</Card.Title>
                {preview.description && (
                  <Card.Text>{preview.description}</Card.Text>
                )}
              </Card.Body>
            </Card>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleInsert}>Insertar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomURLUploader;