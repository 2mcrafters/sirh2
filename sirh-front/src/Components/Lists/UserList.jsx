import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react/dist/iconify.js';
import { fetchUsers } from '../../Redux/Slices/userSlice';
import TableDataLayer from '../TableDataLayer';
import { Link } from 'react-router-dom';

const UserList = () => {
  const dispatch = useDispatch();
  const { items: users = [], status = 'idle' } = useSelector(state => state.users || {});
  
  // Debug logs


  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    email: true,
    role: true,
    departement: true,
    actions: true
  });
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (item) => (
        <div className='form-check style-check d-flex align-items-center'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={selectedItems.includes(item.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, item.id]);
              } else {
                setSelectedItems(selectedItems.filter(id => id !== item.id));
              }
            }}
          />
          <label className='form-check-label'>{item.id.toString().padStart(2, '0')}</label>
        </div>
      ),
      visible: visibleColumns.id
    },
    {
      key: 'name',
      label: 'Nom',
      visible: visibleColumns.name,
      render: (item) => item.name || 'N/A'
    },
    {
      key: 'email',
      label: 'Email',
      visible: visibleColumns.email,
      render: (item) => item.email || 'N/A'
    },
    {
      key: 'role',
      label: 'Rôle',
      visible: visibleColumns.role,
      render: (item) => (
        <span className={`px-24 py-4 rounded-pill fw-medium text-sm ${
          item.role === 'RH' 
            ? 'bg-primary-focus text-primary-main' 
            : item.role === 'CHEF_DEP' 
              ? 'bg-success-focus text-success-main'
              : 'bg-info-focus text-info-main'
        }`}>
          {item.role || 'N/A'}
        </span>
      )
    },
    {
      key: 'departement',
      label: 'Département',
      visible: visibleColumns.departement,
      render: (item) => item.departement?.nom || 'Non assigné'
    },
    {
      key: 'actions',
      label: 'Actions',
      visible: visibleColumns.actions,
      render: (item) => (
        <div>
          <Link
            to={`/users/view/${item.id}`}
            className='w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center'
          >
            <Icon icon='iconamoon:eye-light' />
          </Link>
          <Link
            to={`/users/edit/${item.id}`}
            className='w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
          >
            <Icon icon='lucide:edit' />
          </Link>
          <button
            onClick={() => handleDelete(item.id)}
            className='w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center border-0'
          >
            <Icon icon='mingcute:delete-2-line' />
          </button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    window.location.href = '/users/add';
  };

  const handleDelete = (id) => {
  };

  const handleExport = () => {
  };

  const handleImport = () => {
  };

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };


  return (
    <TableDataLayer
      title="Liste des utilisateurs"
      data={users}
      columns={columns}
      onAdd={handleAdd}
      onDelete={() => handleDelete(selectedItems)}
      onExport={handleExport}
      onImport={handleImport}
      filters={[]}
      searchPlaceholder="Rechercher un utilisateur..."
      onToggleColumn={toggleColumnVisibility}
      visibleColumns={visibleColumns}
    />
  );
};

export default UserList; 