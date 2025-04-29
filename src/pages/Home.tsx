import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Badge, 
  Skeleton, 
  PullToRefresh, 
  SearchBar, 
  Tag, 
  TabBar 
} from 'antd-mobile';
import { CalendarOutline, EnvironmentOutline, HeartOutline, RightOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import { Link } from 'react-router-dom'; // Import de Link pour la navigation
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase'; // Chemin de ton fichier firebase.ts




// Importer les données du marathon
import marathonsData from './liste.json';

const Home: React.FC = () => {

  interface Marathon {
    id: string;
    name: string;
    location: string;
    date: string | null;
    website: string | null;
    description: string | null;
    charity: {
      isCharityEvent: boolean | null;
      organization: string | null;
    };
    distances: string[];
    registrationPrice: number | null;
  }

  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [filteredMarathons, setFilteredMarathons] = useState<Marathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState('home'); // Gestion de l'onglet actif
  const [userName, setUserName] = useState<string | null>(null);


  const loadMarathons = async () => {
    return new Promise<void>((resolve) => {
      setLoading(true);
      if (Array.isArray(marathonsData)) {
        const sortedMarathons = [...marathonsData].sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
        setMarathons(sortedMarathons);
        setFilteredMarathons(sortedMarathons);
        setError(null);
      } else {
        setError('Erreur de chargement des données');
      }
      setLoading(false);
      resolve();
    });
  };

  useEffect(() => {
    loadMarathons();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || 'Profil');
      }
    });
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    if (searchValue.trim() === '') {
      setFilteredMarathons(marathons);
    } else {
      const filtered = marathons.filter(marathon =>
        marathon.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        marathon.location.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredMarathons(filtered);
    }
  }, [searchValue, marathons]);

  return (
    <div style={styles.container}>
      {/* Contenu principal */}
      <div style={styles.mainContent}>
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Rechercher un marathon..."
          style={styles.searchBar}
        />

        <PullToRefresh onRefresh={loadMarathons}>
          {loading ? (
            <Skeleton animated />
          ) : (
            <List style={styles.listContainer}>
              {filteredMarathons.map((marathon: any) => (
                <Link to={`/marathon/${marathon.id}`} key={marathon.id}>
                  <Card style={styles.card}>
                    <div style={styles.cardContent}>
                      <div style={styles.cardDetails}>
                        <h3 style={styles.cardTitle}>
                          {marathon.name}
                          {marathon.date && new Date(marathon.date) > new Date() && (
                            <Badge content="À venir" style={styles.upcomingBadge} />
                          )}
                        </h3>
                        <div style={styles.infoRow}>
                          <EnvironmentOutline style={styles.icon} />
                          <span>{marathon.location}</span>
                        </div>
                        <div style={styles.infoRow}>
                          <CalendarOutline style={styles.icon} />
                          <span>{new Date(marathon.date).toLocaleDateString() || 'Date non disponible'}</span>
                        </div>
                        {marathon.charity?.isCharityEvent && (
                          <div style={styles.infoRow}>
                            <Tag color="primary" style={styles.charityTag}>Caritatif</Tag>
                          </div>
                        )}
                      </div>
                      <RightOutline style={styles.arrowIcon} />
                    </div>
                  </Card>
                </Link>
              ))}
            </List>
          )}
        </PullToRefresh>

        {error && <div style={styles.errorMessage}>{error}</div>}
      </div>

      <TabBar
        activeKey={activeTab}
        onChange={setActiveTab}
        style={styles.tabBar}
      >
        <TabBar.Item
          title="Accueil"
          key="home"
          icon={<UnorderedListOutline />}
          onClick={() => window.location.href = '/home'}
        />
        <TabBar.Item
        title="Communauté"
        key="community"
        icon={<HeartOutline />}
        onClick={() => window.location.href = '/community'}
        />
        <TabBar.Item
          title={userName || 'Profil'}
          key="profile"
          icon={<UserOutline />}
          onClick={() => window.location.href = '/profile'}
        />
      </TabBar>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f7f8fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100vw',
  },
  mainContent: {
    flex: 1,
    paddingBottom: '56px', // Ajout d'un padding pour laisser de l'espace au TabBar
  },
  searchBar: {
    margin: '10px',
    borderRadius: '20px',
  },
  listContainer: {
    padding: '0 10px',
  },
  card: {
    borderRadius: '12px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    color: '#666',
  },
  icon: {
    marginRight: '8px',
    color: '#007bff',
  },
  upcomingBadge: {
    marginLeft: '10px',
    backgroundColor: '#52c41a',
  },
  charityTag: {
    marginTop: '5px',
  },
  arrowIcon: {
    color: '#cccccc',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center' as const,
    marginTop: '20px',
  },
  tabBar: {
    position: 'fixed' as const,
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: 10,
    backgroundColor: '#f7f8fa',
  },
};

export default Home;
