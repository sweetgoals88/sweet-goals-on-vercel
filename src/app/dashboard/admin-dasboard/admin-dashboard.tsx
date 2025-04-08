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

  // Función para dar de baja un elemento de la tercera tabla
  const handleDeleteThirdItem = (itemId: string) => {
    setAdmins(admins.filter(item => item.id !== itemId));
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
                </div>
                {prototypes.map((prototype) => (
                  <div key={prototype.id} className={styles.tableRow} style={{
                    gridTemplateColumns: `repeat(6, 1fr)`
                  }}>
                    <div className={styles.tableCell}>{prototype.id}</div>
                    <div className={styles.tableCell}>{prototype.key.slice(0, 16) + "..."}</div>
                    <div className={styles.tableCell}>{prototype.activationCode}</div>
                    <div className={styles.tableCell}>{prototype.version}</div>
                    <div className={styles.tableCell}>{prototype.owner? `${prototype.owner.name} ${prototype.owner.surname}`: ""}</div>
                    <div className={styles.tableCell}>
                      {prototype.operational ? 'Operativo' : 'No operativo'}
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