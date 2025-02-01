'use client';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import Image from 'next/image';

import { Library, Like, UserRole } from '@/utils/types';
import { getRoleInSpanish } from '@/utils/roleTranslation';
import ActionButtons from '@/components/ActionButtons';

import LibraryList from './LibraryList';
import LibraryFormModal from './LibraryFormModal';
import ShareNoteModal from './ShareNoteModal';
import LibraryHeader from './LibraryHeader';

import { useLibraryLogic } from './useLibraryLogic';

interface ClientLibraryProps {
  initialData: {
    initialNote: Library | null;
    libraries: Library[];
    totalItems: number;
    likesData: Record<number, {
      likes: number;
      dislikes: number;
      userLike: Like | null;
    }>;
  };
}

const ClientLibrary: React.FC<ClientLibraryProps> = ({ initialData }) => {
  const {
    libraries,
    currentNote,
    showModal,
    editingLibrary,
    searchQuery,
    likesData,
    shareModalVisible,
    selectedLibrary,
    currentPage,
    totalItems,
    availableParents,
    userRole,
    itemsPerPage,
    setShowModal,
    setSearchQuery,
    handleNoteClick,
    handleGoBack,
    handleCreateOrUpdate,
    handleEdit,
    handleDelete,
    handleSearch,
    handlePageChange,
    handleLikeToggle,
    handleShare,
    setShareModalVisible,
    setEditingLibrary,
    fetchAvailableParents
  } = useLibraryLogic(initialData);

  const permissionsEditable =
    userRole === UserRole.ADMIN ||
    userRole === UserRole.SUPER_ADMIN ||
    userRole === UserRole.EDITOR;

  return (
    <>
      <Container>
        <LibraryHeader
          currentNote={currentNote}
          onGoBack={handleGoBack}
          onEdit={() => currentNote && handleEdit(currentNote)}
          onDelete={() => currentNote && handleDelete(currentNote)}
          onCreate={() => {
            setEditingLibrary(null);
            fetchAvailableParents();
            setShowModal(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          permissionsEditable={permissionsEditable}
        />
        {currentNote && <br />}

        <Row className={currentNote ? 'library-detail-container' : ''}>
          {currentNote && (
            <>
              {/* Detalle de nota con columnas según presencia de imagen */}
              <Row className="mb-4 align-items-center">
                {currentNote.imageUrl ? (
                  <>
                    <Col md={6}>
                      <h4>{currentNote.title}</h4>
                      {currentNote.author && (
                        <p className="text-muted">
                          {`${currentNote.author.name} - ${getRoleInSpanish(currentNote.author.role)}`}
                        </p>
                      )}
                    </Col>
                    <Col md={6}>
                      <Image
                        src={currentNote.imageUrl}
                        alt={currentNote.title}
                        width={400}
                        height={200}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }}
                      />
                    </Col>
                  </>
                ) : (
                  <Col md={12}>
                    <h4>{currentNote.title}</h4>
                    {currentNote.author && (
                      <p className="text-muted">
                        {`${currentNote.author.name} - ${getRoleInSpanish(currentNote.author.role)}`}
                      </p>
                    )
                    }</Col>
                )}
              </Row>
              <Row>
                <Col md={12}>
                  <div dangerouslySetInnerHTML={{ __html: currentNote.description }} />
                </Col>
              </Row>
              {/* Botones de acción debajo del detalle */}
              <Row className="mb-4">
                <Col className="text-center">
                  <ActionButtons
                    userLike={likesData[currentNote.id]?.userLike}
                    likesCount={likesData[currentNote.id]?.likes || 0}
                    dislikesCount={likesData[currentNote.id]?.dislikes || 0}
                    onLikeToggle={(isLike) => handleLikeToggle(currentNote.id, isLike)}
                    onShare={() => handleShare(currentNote)}
                  />
                </Col>
              </Row>
            </>
          )}
        </Row>

        {currentNote && <br />}

        {/* Muestra la lista de librerías o subnotas */}
        {!currentNote ? (
          <LibraryList
            libraries={libraries}
            onNavigate={handleNoteClick}
            likesData={likesData}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
          />
        ) : currentNote.children && currentNote.children.length > 0 ? (
          <LibraryList
            libraries={currentNote.children}
            onNavigate={handleNoteClick}
            likesData={likesData}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
          />
        ) : (
          <p className="text-center text-muted">No hay subnotas.</p>
        )}

        <Pagination>
          {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => handlePageChange(idx + 1)}
              style={{ cursor: 'pointer', margin: '0 5px' }}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Container>

      {/* Solo si el usuario tiene permisos */}
      {permissionsEditable && (
        <LibraryFormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSubmit={handleCreateOrUpdate}
          editingLibrary={editingLibrary}
          availableParents={availableParents}
          currentNote={currentNote}
        />
      )}

      {/* Modal de compartir */}
      {selectedLibrary && (
        <ShareNoteModal
          show={shareModalVisible}
          onHide={() => setShareModalVisible(false)}
          note={selectedLibrary}
        />
      )}
    </>
  );
};

export default ClientLibrary;
