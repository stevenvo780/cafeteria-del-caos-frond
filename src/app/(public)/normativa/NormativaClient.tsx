'use client';
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { addNotification } from '@/redux/ui';
import NormativaModal from './NormativaModal';
import { UserRole } from '@/utils/types';
import api from '@/utils/axios';

const NormativaClient: React.FC = () => {
  const [generalNormative, setGeneralNormative] = useState<string>('Cargando...');
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNormative = async () => {
      try {
        const response = await api.get('/config/general-normative');
        setGeneralNormative(response.data);
      } catch (error) {
        console.error('Error fetching normative:', error);
        dispatch(addNotification({ 
          message: 'Error al cargar la normativa', 
          color: 'danger' 
        }));
        setGeneralNormative('Error al cargar la normativa');
      }
    };

    fetchNormative();
  }, [dispatch]);

  return (
    <>
      {(userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px' }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer', zIndex: 100 }}
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: generalNormative }} />

      {showEditModal && generalNormative && (
        <NormativaModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentNormative={generalNormative}
          setGeneralNormative={setGeneralNormative}
        />
      )}
    </>
  );
};

export default NormativaClient;
