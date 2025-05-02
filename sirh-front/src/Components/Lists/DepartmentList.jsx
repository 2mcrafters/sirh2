import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react/dist/iconify.js';
import { fetchDepartements, deleteDepartements } from '../../Redux/Slices/departementSlice';
import TableDataLayer from '../TableDataLayer';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { items: departments = [], status = 'idle' } = useSelector(state => state.departement || {});
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    nom: true,
    actions: true
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartements());
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
      key: 'nom',
      label: 'Nom du département',
      visible: visibleColumns.nom
    },
    {
      key: 'actions',
      label: 'Actions',
      visible: visibleColumns.actions,
      render: (item) => (
        <div>
          <Link
            to={`/departments/view/${item.id}`}
            className='w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center'
          >
            <Icon icon='iconamoon:eye-light' />
          </Link>
          <Link
            to={`/departments/edit/${item.id}`}
            className='w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
          >
            <Icon icon='lucide:edit' />
          </Link>
          <button
            onClick={() => {
              setItemToDelete(item.id);
              setShowDeleteModal(true);
            }}
            className='w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center border-0'
          >
            <Icon icon='mingcute:delete-2-line' />
          </button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    window.location.href = '/departments/add';
  };

  const handleDelete = async (id) => {
    try {
      if (Array.isArray(id)) {
        // Multiple delete
        if (id.length === 0) {
          toast.warning('Veuillez sélectionner au moins un département à supprimer');
          return;
        }
        await dispatch(deleteDepartements(id)).unwrap();
        toast.success('Départements supprimés avec succès');
        setSelectedItems([]);
      } else {
        // Single delete
        await dispatch(deleteDepartements([id])).unwrap();
        toast.success('Département supprimé avec succès');
      }
      dispatch(fetchDepartements());
    } catch (error) {
      console.error('Error deleting department(s):', error);
      toast.error('Erreur lors de la suppression des départements');
    }
  };

  const handleDeleteClick = () => {
    if (selectedItems.length > 0) {
      setItemToDelete(selectedItems);
      setShowDeleteModal(true);
    } else {
      toast.warning('Veuillez sélectionner au moins un département à supprimer');
    }
  };

  const handleConfirmDelete = async () => {
    await handleDelete(itemToDelete);
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleExport = () => {
    console.log('Export departments');
  };

  const handleImport = () => {
    console.log('Import departments');
  };

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  return (
    <>
      <TableDataLayer
        title="Liste des départements"
        data={departments}
        columns={columns}
        onAdd={handleAdd}
        onDelete={handleDeleteClick}
        onExport={handleExport}
        onImport={handleImport}
        filters={[]}
        searchPlaceholder="Rechercher un département..."
        onToggleColumn={toggleColumnVisibility}
        visibleColumns={visibleColumns}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Array.isArray(itemToDelete) ? (
            <p>Êtes-vous sûr de vouloir supprimer les {itemToDelete.length} départements sélectionnés ?</p>
          ) : (
            <p>Êtes-vous sûr de vouloir supprimer ce département ?</p>
          )}
          <p className="text-danger">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DepartmentList; 