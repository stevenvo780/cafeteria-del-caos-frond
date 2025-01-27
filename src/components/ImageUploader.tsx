import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (file: File | null) => void;
  onPreviewChange: (preview: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageChange,
  onPreviewChange
}) => {
  const [preview, setPreview] = useState<string>(currentImageUrl || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onPreviewChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form.Group>
      <Form.Label>Imagen</Form.Label>
      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Vista previa"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
        </div>
      )}
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="bg-dark text-light border-secondary"
      />
    </Form.Group>
  );
};

export default ImageUploader;
