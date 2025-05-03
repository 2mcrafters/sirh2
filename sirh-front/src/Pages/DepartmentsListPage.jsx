import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDepartments, deleteDepartments } from '../Redux/Slices/departementSlice';
import { Icon } from '@iconify/react/dist/iconify.js';
import Swal from 'sweetalert2';

const DepartmentsListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: departments, status: loading, error } = useSelector((state) => state.departments);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');


  const roles = useSelector((state) => state.auth.roles || []);
  const isEmployee = roles.includes('EMPLOYE');  // Vérifie si le rôle est "EMPLOYE"
   

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = e.target.value === 'all' ? departments.length : parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };



  const handleExportDepartements = () => {
    api.get('http://localhost:8000/api/export-departements', {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'departements.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      console.error('Erreur lors de l’exportation des départements :', error);
    });
  };



  const handleImportDepartments = async (e) => {
    const file = e.target.files[0];  // Récupérer le fichier sélectionné
  
    if (!file) {
      Swal.fire(
        'Erreur!',
        'Aucun fichier sélectionné.',
        'error'
      );
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file); 
  
    try {
     
      const response = await api.post('http://localhost:8000/api/import-departements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }
      });
  
      Swal.fire(
        'Succès!',
        'Les départements ont été importés avec succès.',
        'success'
      );
  
     
      dispatch(fetchDepartments());
    } catch (error) {
      Swal.fire(
        'Erreur!',
        'Une erreur est survenue lors de l\'importation des départements.',
        'error'
      );
    }
  };
  

  const handleEdit = (id) => {
    navigate(`/departments/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action ne peut pas être annulée!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteDepartments([id])).unwrap();
        Swal.fire(
          'Supprimé!',
          'Le département a été supprimé avec succès.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Erreur!',
          'Une erreur est survenue lors de la suppression.',
          'error'
        );
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDepartments.length === 0) {
      Swal.fire(
        'Attention!',
        'Veuillez sélectionner au moins un département à supprimer.',
        'warning'
      );
      return;
    }

    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Vous êtes sur le point de supprimer ${selectedDepartments.length} département(s). Cette action ne peut pas être annulée!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteDepartments(selectedDepartments)).unwrap();
        setSelectedDepartments([]);
        Swal.fire(
          'Supprimé!',
          'Les départements ont été supprimés avec succès.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Erreur!',
          'Une erreur est survenue lors de la suppression.',
          'error'
        );
      }
    }
  };

  const toggleDepartmentSelection = (id) => {
    setSelectedDepartments(prev => 
      prev.includes(id) 
        ? prev.filter(deptId => deptId !== id)
        : [...prev, id]
    );
  };

  if (loading === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <div className="d-flex align-items-center">
                <Icon icon="mdi:alert-circle" className="me-2" />
                <div>
                  <h5 className="alert-heading">Erreur de chargement</h5>
                  <p className="mb-0">Une erreur est survenue lors du chargement des départements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card basic-data-table">
      {/* Header */}
      <div className="card-header d-flex flex-column flex-md-row gap-2 justify-content-between align-items-start align-items-md-center">
        <h5 className="card-title mb-0">Départements</h5>

        <div className="d-flex flex-wrap gap-2">
        {!isEmployee && (
          <Link to="/creer-departement" className="btn btn-primary d-flex align-items-center">
            <Icon icon="mdi:plus" />
            <span className="d-none d-md-inline ms-1">Ajouter</span>
          </Link>
        )}
         {!isEmployee && (
          <button 
            className="btn btn-danger d-flex align-items-center"
            onClick={handleBulkDelete}
            disabled={selectedDepartments.length === 0}
          >
            <Icon icon="mdi:trash" />
            <span className="d-none d-md-inline ms-1">Supprimer</span>
          </button>
         )}

{!isEmployee && (
          <button className="btn btn-outline-secondary d-flex align-items-center" 
          onClick={handleExportDepartements}>
            <Icon icon="mdi:download" />
            <span className="d-none d-md-inline ms-1">Export</span>
          </button>
)}

         
        {!isEmployee && (
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => document.getElementById('fileInput').click()}  
          >
            <Icon icon="mdi:upload" />
            <span className="d-none d-md-inline ms-1">Import</span>
          </button>
        )}
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            accept=".xlsx, .xls, .csv"  
            onChange={handleImportDepartments}  
          />
        


          <button
            className="btn btn-outline-secondary d-inline d-md-none"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Icon icon="mdi:tune" />
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Filters */}
        <div className={`filters-container mb-4 ${filtersOpen ? 'd-block' : 'd-none'} d-md-block`}>
          <div className="row g-3">
            <div className="col-6 col-sm-4 col-md-3 col-lg-2">
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedDepartments.length === departments.length}
                    onChange={() => {
                      if (selectedDepartments.length === departments.length) {
                        setSelectedDepartments([]);
                      } else {
                        setSelectedDepartments(departments.map(d => d.id));
                      }
                    }}
                  />
                </th>
                <th>Nom</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((department) => (
                <tr key={department.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedDepartments.includes(department.id)}
                      onChange={() => toggleDepartmentSelection(department.id)}
                    />
                  </td>
                  <td>{department.nom}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(department.id)}
                        title="Modifier"
                      >
                        <Icon icon="mdi:pencil" />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(department.id)}
                        title="Supprimer"
                      >
                        <Icon icon="mdi:delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex align-items-center gap-2">
            <span>Afficher</span>
            <select className="form-select form-select-sm w-auto" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="all">Tous</option>
            </select>
            <span>entrées</span>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Icon icon="mdi:chevron-left" />
            </button>

            {getPageNumbers().map((number) => (
              <button
                key={number}
                className={`btn btn-sm ${currentPage === number ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsListPage; 