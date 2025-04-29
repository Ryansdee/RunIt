import React, { useState, useEffect } from 'react';
import { Avatar, List, Tag, TabBar } from 'antd-mobile';
import { HeartOutline, MailOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase'; // ✅ chemin vers votre config Firebase
import marathonsData from './liste.json';

const Profile: React.FC = () => {
  const [marathons, setMarathons] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
const [userName, setUserName] = useState<string | null>(null);


  const loadMarathons = () => {
    if (Array.isArray(marathonsData)) {
      const sorted = [...marathonsData].sort(
        (a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime()
      );
      setMarathons(sorted);
    }
  };

  useEffect(() => {
    loadMarathons();

    // Écouteur d’état utilisateur Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserName(user.displayName || 'Profil');
        }
      });
      return () => unsubscribe();
    }, []);

  const completedMarathons = marathons.length;
  const charityMarathons = marathons.filter(m => m.charity?.isCharityEvent).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Avatar
          src={user?.photoURL || 'https://via.placeholder.com/40'}
          style={styles.avatar}
        />
        <div>
          <div style={styles.name}>{user?.displayName || 'Utilisateur anonyme'}</div>
          <div style={styles.email}>
            <MailOutline style={styles.icon} /> {user?.email || 'Email inconnu'}
          </div>
        </div>
      </div>

      <List header="Mes marathons" style={styles.list}>
        <List.Item prefix={<HeartOutline />}>
          {completedMarathons} marathons complétés
        </List.Item>
        <List.Item description={<Tag color="primary">{charityMarathons}</Tag>}>
          Marathons caritatifs
        </List.Item>
      </List>

      <TabBar activeKey={activeTab} onChange={setActiveTab} style={styles.tabBar}>
        <TabBar.Item
          title="Accueil"
          key="home"
          icon={<UnorderedListOutline />}
          onClick={() => (window.location.href = '/home')}
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
    paddingBottom: '60px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    margin: '16px',
  },
  avatar: {
    marginRight: '16px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  email: {
    color: '#888',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '6px',
  },
  list: {
    margin: '16px',
  },
  tabBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
  },
};

export default Profile;
