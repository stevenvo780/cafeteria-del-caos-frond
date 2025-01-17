'use client';
import React, { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import XpRolesTab from './tabs/xp-roles';
import InfractionsTab from './tabs/infractions';
import BotConfigTab from './tabs/bot-config';
import TemplateTab from './tabs/template';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('xp-roles');

  return (
    <Container className="mt-5">
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'xp-roles')}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="xp-roles">Roles XP</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="infractions">Infracciones</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bot">Bot</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="template">Templates</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="xp-roles">
            <XpRolesTab />
          </Tab.Pane>
          <Tab.Pane eventKey="infractions">
            <InfractionsTab />
          </Tab.Pane>
          <Tab.Pane eventKey="bot">
            <BotConfigTab />
          </Tab.Pane>
          <Tab.Pane eventKey="template">
            <TemplateTab />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default SettingsPage;
