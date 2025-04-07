import React, { useState, useEffect } from 'react';
import styles from './AdminDash.module.css';
import { AdminPreview } from '@/app/api/db/entities/user/admin/preview';
import { CustomerEntry } from '@/app/api/db/entities/user/customer/entry';
import { PrototypeEntry } from '@/app/api/db/entities/prototype/entry';
import { AdminEntry } from '@/app/api/db/entities/user/admin/entry';
import DashboardHeader from '@/components/dashboard-header/dashboard-header';

export const AdminDashboard: React.FC<{ data: AdminPreview }> = ({ data }) => {
  useEffect(() => {
    console.log(data);
  });

  const [customers, setCustomers] = useState<CustomerEntry[]>(data.customers);
  const [prototypes, setPrototypes] = useState<PrototypeEntry[]>(data.prototypes);
  const [admins, setAdmins] = useState<AdminEntry[]>(data.admins);

  const [error, setError] = useState<string | null>(null);

  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  const [showAllPrototypes, setShowAllPrototypes] = useState<boolean>(false);
  const [showAllThirdTable, setShowAllThirdTable] = useState<boolean>(false);

  const handleDeleteUser = (userId: string) => {
    setCustomers(customers.filter(user => user.id !== userId));
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
      
    } catch (err) {
      console.error('Error al cambiar estado operacional:', err);
      setError('Error al cambiar estado operacional');
    }
  };

  // Función para dar de baja un elemento de la tercera tabla
  const handleDeleteThirdItem = (itemId: string) => {
    setAdmins(admins.filter(item => item.id !== itemId));
  };

  // Función para mostrar más o menos elementos
  const toggleShowAll = (table: 'users' | 'prototypes' | 'third') => {
    if (table === 'users') setShowAllUsers(!showAllUsers);
    if (table === 'prototypes') setShowAllPrototypes(!showAllPrototypes);
    if (table === 'third') setShowAllThirdTable(!showAllThirdTable);
  };

  if (error) return <div className={styles.errorContainer}>{error}</div>;

  return (
    <div className={styles.container}>
      <DashboardHeader 
        data={data}
        />

      <h1 className={styles.title}>Management Dashboard</h1>

      <main className={styles.tablesWrapper}>

        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Usuarios</h2>
          <div className={styles.tableSuperContainer} style={{
              height: `${10 * customers.length + 8}vh`
            }}>
            <div className={styles.tableContainer} >
              <div className={styles.tableHeader} style={{
                    gridTemplateColumns: `repeat(4, 1fr)`
                  }}>
                <div>Id</div>
                <div>Nombre completo</div>
                <div>Correo</div>
                <div>Dar de baja</div>
              </div>
              {customers.map((customer) => (
                <div key={customer.id} className={styles.tableRow} style={{
                  gridTemplateColumns: `repeat(4, 1fr)`
                }}>
                  <div className={styles.tableCell}>{customer.id}</div>
                  <div className={styles.tableCell}>{customer.name} {customer.surname}</div>
                  <div className={styles.tableCell}>{customer.email}</div>
                  <div className={styles.tableCell}>
                    <button 
                      onClick={() => handleDeleteUser(customer.id)}
                      className={styles.deleteButton}
                    >
                      Dar de baja
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Prototipos</h2>
          <div className={styles.tableSuperContainer} style={{
              height: `${10 * customers.length + 8}vh`
            }}>
              <div className={styles.tableContainer}>
                <div className={styles.tableProtoHeader} style={{
                    gridTemplateColumns: `repeat(7, 1fr)`
                  }}>
                  <div>Id</div>
                  <div>API Key</div>
                  <div>Código de Activación</div>
                  <div>Versión</div>
                  <div>Dueño</div>
                  <div>Operacional</div>
                  <div>Desactivar</div>
                </div>
                {prototypes.map((prototype) => (
                  <div key={prototype.id} className={styles.tableRow} style={{
                    gridTemplateColumns: `repeat(7, 1fr)`
                  }}>
                    <div className={styles.tableCell}>{prototype.id}</div>
                    <div className={styles.tableCell}>{prototype.key.slice(0, 16) + "..."}</div>
                    <div className={styles.tableCell}>{prototype.activationCode}</div>
                    <div className={styles.tableCell}>{prototype.version}</div>
                    <div className={styles.tableCell}>{prototype.owner? `${prototype.owner.name} ${prototype.owner.surname}`: ""}</div>
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
            </div>
          </div>

        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Administradores Invitados</h2>
          <div className={styles.tableSuperContainer}>
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader} style={{
                    gridTemplateColumns: `repeat(4, 1fr)`
                  }}>
                <div>Id</div>
                <div>Título</div>
                <div>Categoría</div>
                <div>Dar de baja</div>
              </div>
              
              {admins.map((admin) => (
                <div key={admin.id} className={styles.tableRow} style={{
                  gridTemplateColumns: `repeat(4, 1fr)`
                }}>
                  <div className={styles.tableCell}>{admin.id}</div>
                  <div className={styles.tableCell}>{admin.name}</div>
                  <div className={styles.tableCell}>{admin.permissions}</div>
                  <div className={styles.tableCell}>
                    <button 
                      onClick={() => handleDeleteThirdItem(admin.id)}
                      className={styles.deleteButton}
                    >
                      Dar de baja
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;