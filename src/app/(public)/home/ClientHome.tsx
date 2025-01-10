'use client';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Publication, Events, Library } from '@/utils/types';
import PublicationsList from './PublicationsList';
import Sidebar from './Sidebar';
import PublicationModal from './PublicationModal';
import ShareModal from './ShareModal';
import ScrollableEvents from '@/components/ScrollableEvents';
import useHomeLogic from './useHomeLogic';
import axios from '@/utils/axios';

interface ClientHomeProps {
  initialData: {
    initialPublications: Publication[];
    events: {
      repetitive: Events[];
      unique: Events[];
    };
    latestNotes: Library[];
    guildMemberCount: number | null;
  };
}

const ClientHome: React.FC<ClientHomeProps> = ({ initialData }) => {
  const [dynamicData, setDynamicData] = useState({
    repetitiveEvents: initialData.events.repetitive,
    uniqueEvents: initialData.events.unique,
    latestNotes: initialData.latestNotes,
    guildMemberCount: initialData.guildMemberCount
  });

  const fetchDynamicData = async () => {
    try {
      const [eventsResponse, notesResponse, memberCountResponse] = await Promise.all([
        axios.get('/events/home/upcoming?limit=31'),
        axios.get('/library/home/latest?limit=3'),
        axios.get('/discord/guild/members')
      ]);

      setDynamicData({
        repetitiveEvents: eventsResponse.data.filter(event => event.repetition),
        uniqueEvents: eventsResponse.data.filter(event => !event.repetition).slice(0, 3),
        latestNotes: notesResponse.data,
        guildMemberCount: memberCountResponse.data
      });
    } catch (error) {
      console.error('Error fetching dynamic data:', error);
    }
  };

  useEffect(() => {
    // Realizar la primera actualización después de un breve delay
    const timer = setTimeout(() => {
      fetchDynamicData();
    }, 2000);

    // Configurar intervalo para actualizaciones posteriores
    const interval = setInterval(fetchDynamicData, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const {
    publications,
    showModal,
    shareModalVisible,
    editingPublication,
    selectedPublication,
    likesData,
    hasMore,
    user,
    title,
    content,
    publicationRefs,
    handleEdit,
    handleDelete,
    handleLikeToggle,
    handleShare,
    handleSubmit,
    fetchPublications,
    setShowModal,
    setShareModalVisible,
    setTitle,
    setContent,
  } = useHomeLogic(initialData.initialPublications);

  return (
    <Container className="p-0">
      <Row className="m-0">
        <Col md={12}>
          {dynamicData.repetitiveEvents.length > 0 && (
            <ScrollableEvents events={dynamicData.repetitiveEvents} />
          )}
        </Col>
      </Row>
      <Row className="m-0">
        <Col md={3}>
          <Sidebar
            initialUniqueEvents={dynamicData.uniqueEvents}
            initialLatestNotes={dynamicData.latestNotes}
            initialGuildMemberCount={dynamicData.guildMemberCount}
          />
        </Col>
        <Col md={9} style={{ marginTop: 40 }}>
          <PublicationsList
            publications={publications}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
            likesData={likesData}
            user={user}
            setShowModal={setShowModal}
            publicationRefs={publicationRefs}
            hasMore={hasMore}
            fetchPublications={fetchPublications}
          />
        </Col>
      </Row>
      <PublicationModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        editingPublication={editingPublication}
      />
      {selectedPublication && (
        <ShareModal
          show={shareModalVisible}
          onHide={() => setShareModalVisible(false)}
          publication={selectedPublication}
        />
      )}
    </Container>
  );
};

export default ClientHome;
