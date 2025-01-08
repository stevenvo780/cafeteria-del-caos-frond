'use client';
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { addNotification } from '@/redux/ui';
import StaffNormativeModal from './NormativaStaffModal';
import { UserRole } from '@/utils/types';
import api from '@/utils/axios';

const NormativaStaffClient: React.FC = () => {
  const [staffNormative, setStaffNormative] = useState<string>('Cargando...');
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStaffNormative = async () => {
      try {
        const response = await api.get('/config/staff-normative');
        setStaffNormative(response.data);
      } catch (error) {
        console.error('Error fetching staff normative:', error);
        dispatch(addNotification({ 
          message: 'Error al cargar la normativa del staff', 
          color: 'danger' 
        }));
        setStaffNormative('Error al cargar la normativa del staff');
      }
    };

    fetchStaffNormative();
  }, [dispatch]);

  return (
    <>
      {userRole === UserRole.SUPER_ADMIN && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px' }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer', zIndex: 100 }}
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: staffNormative }} />

      {showEditModal && staffNormative && (
        <StaffNormativeModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentNormative={staffNormative}
          setStaffNormative={setStaffNormative}
        />
      )}
    </>
  );
};

export default NormativaStaffClient;
