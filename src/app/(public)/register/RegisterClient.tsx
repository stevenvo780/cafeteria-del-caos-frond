/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, InputGroup, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addNotification } from '@/redux/ui';
import { auth } from '@/utils/firebase';
import firebase from 'firebase/compat/app';

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  acceptPolicies: string;
}

const RegisterClient: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptPolicies: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    name: '', 
    acceptPolicies: '' 
  });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    const formErrors = { ...errors };
    let isValid = true;

    if (!validateEmail(formData.email)) {
      formErrors.email = 'Formato de correo electrónico inválido';
      isValid = false;
    }

    if (formData.password.length < 8) {
      formErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    if (!formData.name) {
      formErrors.name = 'El nombre es obligatorio';
      isValid = false;
    }

    if (!formData.acceptPolicies) {
      formErrors.acceptPolicies = 'Debes aceptar las políticas de privacidad';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      if (user) {
        await user.updateProfile({ displayName: formData.name });
        dispatch(addNotification({ 
          message: 'Registro exitoso', 
          color: 'success' 
        }));
        router.push('/login');
      }
    } catch (error: any) {
      dispatch(addNotification({ 
        message: error?.message || 'El registro ha fallado', 
        color: 'danger' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      if (result.user) {
        dispatch(addNotification({ 
          message: 'Registro con Google exitoso', 
          color: 'success' 
        }));
        router.push('/');
      }
    } catch (error: any) {
      dispatch(addNotification({ 
        message: 'Error al registrarse con Google', 
        color: 'danger' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={12}>
          <h1 className="text-center mb-4" style={{ fontFamily: "Montaga", fontSize: "4rem"}}>
            Regístrate
          </h1>
          <Card className="shadow-lg" style={{ maxWidth: '40vw', margin: '0 auto' }}>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Campos del formulario */}
                <Form.Group controlId="formBasicName">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Nombre"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* ...resto de campos del formulario... */}
                <Form.Group controlId="formBasicEmail">
                  <InputGroup>
                    <Form.Control
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <InputGroup>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Botones */}
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100" 
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Registrar'}
                </Button>

                <Button 
                  variant="secondary" 
                  className="w-100 mt-2" 
                  onClick={signInWithGoogle} 
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Registrar con Google'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterClient;
