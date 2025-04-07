import React, { useState, useEffect } from 'react';
import styles from './AdminDash.module.css';

// Definición de interfaces para los tipos de datos
interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

// Interfaz actualizada para Prototype según nuestra API
interface Prototype {
  id: string;
  key: string;
  operational: boolean;
  activationCode: string;
  version: string;
  owner: string;
}

interface ThirdTableItem {
  id: string;
  title: string;
  category: string;
  date: string;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [thirdTable, setThirdTable] = useState<ThirdTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para controlar la visualización
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  const [showAllPrototypes, setShowAllPrototypes] = useState<boolean>(false);
  const [showAllThirdTable, setShowAllThirdTable] = useState<boolean>(false);

  // Función para obtener los prototipos desde la API
  const fetchPrototypes = async () => {
    try {
      const response = await fetch('/api/prototype/table-apis');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setPrototypes(data.prototypes);
    } catch (err) {
      console.error('Error fetching prototypes:', err);
      setError('Error al cargar los prototipos');
    }
  };

  // Simulación de datos para el ejemplo
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamada a nuestra API real para prototipos
        await fetchPrototypes();
        
        // Datos simulados para usuarios
        const mockUsers: User[] = [
          { id: '1', name: 'Juan', surname: 'Pérez', email: 'juan@ejemplo.com' },
          { id: '2', name: 'María', surname: 'García', email: 'maria@ejemplo.com' },
          { id: '3', name: 'Carlos', surname: 'López', email: 'carlos@ejemplo.com' },
          { id: '4', name: 'Ana', surname: 'Martínez', email: 'ana@ejemplo.com' },
        ];
        
        const mockThirdTable: ThirdTableItem[] = [
          { id: '1', title: 'Item 1', category: 'Categoría A', date: '2025-04-01' },
          { id: '2', title: 'Item 2', category: 'Categoría B', date: '2025-04-02' },
          { id: '3', title: 'Item 3', category: 'Categoría A', date: '2025-04-03' },
          { id: '4', title: 'Item 4', category: 'Categoría C', date: '2025-04-04' },
        ];
        
        setUsers(mockUsers);
        setThirdTable(mockThirdTable);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Función para dar de baja a un usuario
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Función actualizada para desactivar un prototipo mediante la API
  const handleDeactivatePrototype = async (prototypeId: string) => {
    try {
      const response = await fetch('/api/prototype/table-apis', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prototypeId,
          active: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Actualizar la lista después de desactivar
      await fetchPrototypes();
      
    } catch (err) {
      console.error('Error al desactivar el prototipo:', err);
      setError('Error al desactivar el prototipo');
    }
  };

  // Función para cambiar el estado operacional de un prototipo
  const handleToggleOperational = async (prototypeId: string, currentOperational: boolean) => {
    try {
      const response = await fetch('/api/prototype/table-apis', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prototypeId,
          operational: !currentOperational
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Actualizar la lista después de cambiar el estado
      await fetchPrototypes();
      
    } catch (err) {
      console.error('Error al cambiar estado operacional:', err);
      setError('Error al cambiar estado operacional');
    }
  };

  // Función para dar de baja un elemento de la tercera tabla
  const handleDeleteThirdItem = (itemId: string) => {
    setThirdTable(thirdTable.filter(item => item.id !== itemId));
  };

  // Función para mostrar más o menos elementos
  const toggleShowAll = (table: 'users' | 'prototypes' | 'third') => {
    if (table === 'users') setShowAllUsers(!showAllUsers);
    if (table === 'prototypes') setShowAllPrototypes(!showAllPrototypes);
    if (table === 'third') setShowAllThirdTable(!showAllThirdTable);
  };

  // Número de elementos a mostrar cuando no se muestra todo
  const previewCount = 3;

  if (loading) return <div className={styles.loadingContainer}>Cargando datos...</div>;
  if (error) return <div className={styles.errorContainer}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard Management</h1>

      {/* Tabla de Usuarios */}
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Usuarios</h2>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div>Id</div>
            <div>Nombre completo</div>
            <div>Correo</div>
            <div>Dar de baja</div>
          </div>
          
          {(showAllUsers ? users : users.slice(0, previewCount)).map((user) => (
            <div key={user.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{user.id}</div>
              <div className={styles.tableCell}>{user.name} {user.surname}</div>
              <div className={styles.tableCell}>{user.email}</div>
              <div className={styles.tableCell}>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className={styles.deleteButton}
                >
                  Dar de baja
                </button>
              </div>
            </div>
          ))}
        </div>
        {users.length > previewCount && (
          <div className={styles.viewMoreContainer}>
            <button 
              onClick={() => toggleShowAll('users')} 
              className={styles.viewMoreButton}
            >
              {showAllUsers ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        )}
      </div>

      {/* Tabla de Prototipos Actualizada */}
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Prototipos</h2>
        <div className={styles.tableContainer}>
          <div className={styles.tableProtoHeader}>
            <div>Id</div>
            <div>Key</div>
            <div>Code</div>
            <div>Versión</div>
            <div>Dueño</div>
            <div>Operacional</div>
            <div>Desactivar</div>
          </div>
          
          {(showAllPrototypes ? prototypes : prototypes.slice(0, previewCount)).map((prototype) => (
            <div key={prototype.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{prototype.id}</div>
              <div className={styles.tableCell}>{prototype.key}</div>
              <div className={styles.tableCell}>{prototype.activationCode}</div>
              <div className={styles.tableCell}>{prototype.version}</div>
              <div className={styles.tableCell}>{prototype.owner}</div>
              <div className={styles.tableCell}>
                <button 
                  onClick={() => handleToggleOperational(prototype.id, prototype.operational)}
                  className={prototype.operational ? styles.activeButton : styles.inactiveButton}
                >
                  {prototype.operational ? 'Operativo' : 'No operativo'}
                </button>
              </div>
              <div className={styles.tableCell}>
                <button 
                  onClick={() => handleDeactivatePrototype(prototype.id)}
                  className={styles.deleteButton}
                >
                  Desactivar
                </button>
              </div>
            </div>
          ))}
        </div>
        {prototypes.length > previewCount && (
          <div className={styles.viewMoreContainer}>
            <button 
              onClick={() => toggleShowAll('prototypes')} 
              className={styles.viewMoreButton}
            >
              {showAllPrototypes ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        )}
      </div>

      {/* Tercera Tabla */}
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Tercera Tabla</h2>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div>Id</div>
            <div>Título</div>
            <div>Categoría</div>
            <div>Dar de baja</div>
          </div>
          
          {(showAllThirdTable ? thirdTable : thirdTable.slice(0, previewCount)).map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{item.id}</div>
              <div className={styles.tableCell}>{item.title}</div>
              <div className={styles.tableCell}>{item.category}</div>
              <div className={styles.tableCell}>
                <button 
                  onClick={() => handleDeleteThirdItem(item.id)}
                  className={styles.deleteButton}
                >
                  Dar de baja
                </button>
              </div>
            </div>
          ))}
        </div>
        {thirdTable.length > previewCount && (
          <div className={styles.viewMoreContainer}>
            <button 
              onClick={() => toggleShowAll('third')} 
              className={styles.viewMoreButton}
            >
              {showAllThirdTable ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;