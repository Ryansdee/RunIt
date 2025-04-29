import React, { useState, useEffect } from 'react';
import { Card, Avatar, Image, Tag, TabBar } from 'antd-mobile';
import { HeartOutline, UserOutline, UnorderedListOutline } from 'antd-mobile-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase'; // Assurez-vous que le chemin est correct

const userPhotos = [
  {
    id: '1',
    user: 'Sophie Lemoine',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    marathon: 'Marathon de Paris',
    date: '2025-03-15',
    photo: 'https://source.unsplash.com/featured/?marathon,running',
  },
  {
    id: '2',
    user: 'Marc Dubois',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    marathon: 'Marathon de Lyon',
    date: '2025-04-10',
    photo: 'https://source.unsplash.com/featured/?runner,road',
  },
];

const Community: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('community');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || 'Profil');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>Communauté</h2>

        {userPhotos.map((entry) => (
          <Card key={entry.id} style={styles.card}>
            <div style={styles.header}>
              <Avatar src={entry.avatar} style={styles.avatar} />
              <div>
                <div style={styles.name}>{entry.user}</div>
                <div style={styles.meta}>
                  {entry.marathon} • {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <Image
              src={entry.photo}
              width="100%"
              height={180}
              fit="cover"
              style={styles.image}
              alt={`Photo de ${entry.user}`}
            />

            <div style={styles.footer}>
              <Tag color="primary" fill="outline" style={{ fontSize: '12px' }}>
                Souvenir de course
              </Tag>
            </div>
          </Card>
        ))}
      </div>

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
          onClick={() => (window.location.href = '/community')}
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
  content: {
    flex: 1,
    paddingBottom: '60px',
    paddingTop: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center' as const,
  },
  card: {
    margin: '12px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  avatar: {
    marginRight: '12px',
  },
  name: {
    fontWeight: 'bold',
  },
  meta: {
    fontSize: '12px',
    color: '#888',
  },
  image: {
    borderRadius: '12px',
    marginTop: '8px',
  },
  footer: {
    marginTop: '10px',
    textAlign: 'right' as const,
  },
  tabBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
  },
};

export default Community;
