import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Tag } from 'antd-mobile';
import { CalendarOutline, EnvironmentOutline, HeartOutline } from 'antd-mobile-icons';
import marathonsData from './liste.json';

const MarathonDetails: React.FC = () => {
  const { id } = useParams();
  const marathon = marathonsData.find((m: any) => m.id === id);

  if (!marathon) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Désolé, marathon non trouvé.</p>
      </div>
    );
  }

  const { name, location, date, charity, description, website, distances, registrationPrice } = marathon;

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <h1 style={styles.title}>{name}</h1>

        <div style={styles.detail}>
          <EnvironmentOutline style={styles.icon} />
          <span>{location}</span>
        </div>

        <div style={styles.detail}>
          <CalendarOutline style={styles.icon} />
          <span>{date ? new Date(date).toLocaleDateString() : 'Date non disponible'}</span>
        </div>

        {charity?.isCharityEvent && (
          <div style={styles.detail}>
            <HeartOutline style={styles.icon} />
            <Tag color="primary">{charity.organization}</Tag>
          </div>
        )}

        <div style={styles.detail}>
          <strong>Distances :</strong>&nbsp;{distances.join(', ')}
        </div>

        {registrationPrice && (
          <div style={styles.detail}>
            <strong>Prix d'inscription :</strong>&nbsp;{registrationPrice}
          </div>
        )}

        <div style={{ ...styles.detail, marginTop: '12px' }}>
          <strong>Description :</strong>
          <p style={styles.description}>{description || 'Pas de description disponible.'}</p>
        </div>

        {website && (
          <Button
            color="primary"
            fill="solid"
            block
            style={styles.button}
            onClick={(e) => { e.preventDefault(); window.open(website, '_blank'); }}
          >
            Voir le site officiel
          </Button>
        )}
      </Card>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '16px',
    backgroundColor: '#f7f8fa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center' as const,
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    marginBottom: '10px',
    color: '#444',
  },
  icon: {
    marginRight: '8px',
    color: '#1677ff',
  },
  description: {
    marginTop: '6px',
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  button: {
    marginTop: '24px',
    borderRadius: '24px',
    fontWeight: 'bold',
  },
  error: {
    fontSize: '16px',
    color: 'red',
    textAlign: 'center' as const,
  },
};

export default MarathonDetails;
