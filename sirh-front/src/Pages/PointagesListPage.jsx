import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPointages, deletePointages, updatePointage, createPointage } from '../Redux/Slices/pointageSlice';
import { fetchUsers } from '../Redux/Slices/userSlice';
import { fetchAbsenceRequests } from '../Redux/Slices/absenceRequestSlice';
import { Icon } from '@iconify/react/dist/iconify.js';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PointagesListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: pointages, status: loading, error } = useSelector((state) => state.pointages);
  const { items: users } = useSelector((state) => state.users);
  const { items: absenceRequests } = useSelector((state) => state.absenceRequests);
  const [selectedPointages, setSelectedPointages] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    date: '',
    user: '',
    status: '',
  });
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [editablePointages, setEditablePointages] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    dispatch(fetchPointages());
    dispatch(fetchUsers());
    dispatch(fetchAbsenceRequests());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0) {
      const initialPointages = {};
      users.forEach(user => {
        const existingPointage = pointages.find(p => 
          p.user_id === user.id && 
          new Date(p.date).toISOString().split('T')[0] === selectedDate
        );
        
        initialPointages[user.id] = {
          id: existingPointage?.id || null,
          user_id: user.id,
          date: selectedDate,
          heureEntree: existingPointage?.heureEntree || '',
          heureSortie: existingPointage?.heureSortie || '',
          statutJour: existingPointage?.statutJour || '',
          overtimeHours: existingPointage?.overtimeHours || 0
        };
      });
      setEditablePointages(initialPointages);
    }
  }, [users, pointages, selectedDate]);

  // Filter pointages based on filters
  const filteredPointages = pointages.filter(pointage => {
    const pointageDate = new Date(pointage.date);
    const filterDate = filters.date ? new Date(filters.date) : null;
    
    return (
      (!filters.date || pointageDate.toDateString() === filterDate.toDateString()) &&
      (!filters.user || pointage.user_id === parseInt(filters.user)) &&
      (!filters.status || pointage.statutJour === filters.status)
    );
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPointages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPointages.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = e.target.value === 'all' ? pointages.length : parseInt(e.target.value);
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

  const handleEdit = (id) => {
    navigate(`/pointages/${id}/edit`);
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
        await dispatch(deletePointages([id])).unwrap();
        Swal.fire(
          'Supprimé!',
          'Le pointage a été supprimé avec succès.',
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
    if (selectedPointages.length === 0) {
      Swal.fire(
        'Attention!',
        'Veuillez sélectionner au moins un pointage à supprimer.',
        'warning'
      );
      return;
    }

    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Vous êtes sur le point de supprimer ${selectedPointages.length} pointage(s). Cette action ne peut pas être annulée!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deletePointages(selectedPointages)).unwrap();
        setSelectedPointages([]);
        Swal.fire(
          'Supprimé!',
          'Les pointages ont été supprimés avec succès.',
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

  const togglePointageSelection = (id) => {
    setSelectedPointages(prev => 
      prev.includes(id) 
        ? prev.filter(pointageId => pointageId !== id)
        : [...prev, id]
    );
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredPointages.map(pointage => {
      const user = users.find(u => u.id === pointage.user_id);
      return {
        'Employé': user ? `${user.name} ${user.prenom}` : 'Inconnu',
        'Date': new Date(pointage.date).toLocaleDateString(),
        'Heure d\'entrée': pointage.heureEntree || '-',
        'Heure de sortie': pointage.heureSortie || '-',
        'Statut': getStatusLabel(pointage.statutJour),
        'Heures supplémentaires': pointage.overtimeHours || '0'
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pointages');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, 'pointages.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Liste des Pointages', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableColumn = ['Employé', 'Date', 'Heure d\'entrée', 'Heure de sortie', 'Statut', 'Heures supplémentaires'];
    const tableRows = filteredPointages.map(pointage => {
      const user = users.find(u => u.id === pointage.user_id);
      return [
        user ? `${user.name} ${user.prenom}` : 'Inconnu',
        new Date(pointage.date).toLocaleDateString(),
        pointage.heureEntree || '-',
        pointage.heureSortie || '-',
        getStatusLabel(pointage.statutJour),
        pointage.overtimeHours || '0'
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 30 }
    });

    doc.save('pointages.pdf');
  };

  // Import from Excel
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Transform the data to match your API format
      const transformedData = jsonData.map(row => ({
        user_id: findUserIdByName(row['Employé']),
        date: row['Date'],
        heureEntree: row['Heure d\'entrée'],
        heureSortie: row['Heure de sortie'],
        statutJour: getStatusValue(row['Statut']),
        overtimeHours: row['Heures supplémentaires']
      }));

      // Dispatch the create action for each pointage
      transformedData.forEach(pointage => {
        dispatch(createPointage(pointage));
      });

      Swal.fire(
        'Succès!',
        'Les pointages ont été importés avec succès.',
        'success'
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const findUserIdByName = (fullName) => {
    const [name, prenom] = fullName.split(' ');
    const user = users.find(u => u.name === name && u.prenom === prenom);
    return user ? user.id : null;
  };

  const getStatusValue = (label) => {
    switch (label) {
      case 'Présent': return 'present';
      case 'Absent': return 'absent';
      case 'Retard': return 'retard';
      default: return 'present';
    }
  };

  const handleFieldChange = (userId, field, value) => {
    setEditablePointages(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const handleSavePointage = async (userId) => {
    const pointage = editablePointages[userId];
    try {
      const pointageData = {
        user_id: userId,
        date: selectedDate,
        heureEntree: pointage.statutJour === 'absent' ? null : pointage.heureEntree,
        heureSortie: pointage.statutJour === 'absent' ? null : pointage.heureSortie,
        statutJour: pointage.statutJour,
        overtimeHours: pointage.statutJour === 'absent' ? 0 : (pointage.overtimeHours || 0)
      };

      const existingPointage = pointages.find(p => 
        p.user_id === userId && 
        new Date(p.date).toISOString().split('T')[0] === selectedDate
      );

      if (existingPointage) {
        const updateData = [{
          id: existingPointage.id,
          ...pointageData
        }];
        await dispatch(updatePointage(updateData[0])).unwrap();
      } else {
        await dispatch(createPointage(pointageData)).unwrap();
      }

      await dispatch(fetchPointages()).unwrap();

      Swal.fire(
        'Succès!',
        'Le pointage a été enregistré avec succès.',
        'success'
      );
    } catch (error) {
      console.error('Error saving pointage:', error);
      Swal.fire(
        'Erreur!',
        'Une erreur est survenue lors de l\'enregistrement du pointage.',
        'error'
      );
    }
  };

  const handleSaveAll = async () => {
    try {
      const updates = Object.values(editablePointages)
        .filter(pointage => {
          // Get the original pointage if it exists
          const originalPointage = pointages.find(p => 
            p.user_id === pointage.user_id && 
            new Date(p.date).toISOString().split('T')[0] === selectedDate
          );

          // If no original pointage exists, save it
          if (!originalPointage) return true;

          // If any field has changed, save it
          return (
            originalPointage.statutJour !== pointage.statutJour ||
            originalPointage.heureEntree !== pointage.heureEntree ||
            originalPointage.heureSortie !== pointage.heureSortie ||
            originalPointage.overtimeHours !== pointage.overtimeHours
          );
        })
        .map(pointage => {
          const pointageData = {
            id: pointage.id,
            user_id: pointage.user_id,
            date: selectedDate,
            heureEntree: pointage.statutJour === 'absent' ? null : pointage.heureEntree,
            heureSortie: pointage.statutJour === 'absent' ? null : pointage.heureSortie,
            statutJour: pointage.statutJour,
            overtimeHours: pointage.statutJour === 'absent' ? 0 : pointage.overtimeHours
          };
          return pointageData;
        });

      if (updates.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: 'Aucun pointage à sauvegarder',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      const existingPointages = updates.filter(pointage => pointage.id);
      
      if (existingPointages.length > 0) {
        await dispatch(updatePointage(existingPointages)).unwrap();
      }

      const newPointages = updates.filter(pointage => !pointage.id);
      if (newPointages.length > 0) {
        await Promise.all(newPointages.map(pointage => 
          dispatch(createPointage(pointage)).unwrap()
        ));
      }

      await dispatch(fetchPointages()).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Les pointages ont été sauvegardés avec succès',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error saving all pointages:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de la sauvegarde des pointages',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  // Update this function to check absence requests
  const isUserOnLeave = (userId) => {
    const selectedDateObj = new Date(selectedDate);
    console.log('Checking absence requests for user:', userId, 'on date:', selectedDate);
    console.log('All absence requests:', absenceRequests);
    
    const isOnLeave = absenceRequests.some(request => {
      const startDate = new Date(request.dateDebut);
      const endDate = new Date(request.dateFin);
      console.log('Checking request:', {
        request,
        startDate,
        endDate,
        selectedDateObj,
        isInRange: selectedDateObj >= startDate && selectedDateObj <= endDate,
        isTypeValid: request.type === 'Congé' || request.type === 'maladie',
        isStatusValid: request.statut === 'validé'
      });
      
      return request.user_id === userId && 
             request.statut === 'validé' && // Only consider validated requests
             (request.type === 'Congé' || request.type === 'maladie') && // Check for leave or sickness
             selectedDateObj >= startDate && 
             selectedDateObj <= endDate;
    });
    
    console.log('Is user on leave:', isOnLeave);
    return isOnLeave;
  };

  // Helper function to get the leave type and status
  const getLeaveInfo = (userId) => {
    const selectedDateObj = new Date(selectedDate);
    console.log('Getting leave info for user:', userId, 'on date:', selectedDate);
    
    const request = absenceRequests.find(request => {
      const startDate = new Date(request.dateDebut);
      const endDate = new Date(request.dateFin);
      return request.user_id === userId && 
             request.statut === 'validé' &&
             (request.type === 'Congé' || request.type === 'maladie') &&
             selectedDateObj >= startDate && 
             selectedDateObj <= endDate;
    });

    console.log('Found leave request:', request);
    if (request) {
      return {
        type: request.type,
        startDate: request.dateDebut,
        endDate: request.dateFin
      };
    }
    return null;
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
                  <p className="mb-0">Une erreur est survenue lors du chargement des pointages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Pointages</h5>
        <div className="d-flex align-items-center gap-3">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSaveAll}>
            <Icon icon="mdi:content-save-all" className="me-1" />
            Sauvegarder tout
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Statut</th>
                <th>Heure d'entrée</th>
                <th>Heure de sortie</th>
                <th>Heures supplémentaires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const pointage = editablePointages[user.id] || {};
                const isOnLeave = isUserOnLeave(user.id);
                const leaveInfo = getLeaveInfo(user.id);
                
                return (
                  <tr key={user.id}>
                    <td>
                      {user.name} {user.prenom}
                      {isOnLeave && leaveInfo && (
                        <span className={`badge ms-2 ${
                          leaveInfo.type === 'Congé' ? 'bg-info' : 'bg-warning'
                        }`}>
                          {leaveInfo.type === 'Congé' ? 'En congé' : 'Malade'}
                          <small className="ms-1">
                            ({new Date(leaveInfo.startDate).toLocaleDateString()} - {new Date(leaveInfo.endDate).toLocaleDateString()})
                          </small>
                        </span>
                      )}
                    </td>
                    <td>
                      <select
                        className={`form-select ${
                          pointage.statutJour === 'present' ? 'text-success' :
                          pointage.statutJour === 'absent' ? 'text-danger' :
                          pointage.statutJour === 'retard' ? 'text-warning' : ''
                        }`}
                        value={pointage.statutJour || ''}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          handleFieldChange(user.id, 'statutJour', newStatus);
                          if (newStatus === 'absent') {
                            handleFieldChange(user.id, 'heureEntree', '');
                            handleFieldChange(user.id, 'heureSortie', '');
                          }
                        }}
                        disabled={isOnLeave}
                      >
                        <option value="">Sélectionner un statut</option>
                        <option value="present" className="text-success">Présent</option>
                        <option value="absent" className="text-danger">Absent</option>
                        <option value="retard" className="text-warning">Retard</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="time"
                        className="form-control"
                        value={pointage.heureEntree || ''}
                        onChange={(e) => handleFieldChange(user.id, 'heureEntree', e.target.value)}
                        disabled={pointage.statutJour === 'absent' || isOnLeave}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        className="form-control"
                        value={pointage.heureSortie || ''}
                        onChange={(e) => handleFieldChange(user.id, 'heureSortie', e.target.value)}
                        disabled={pointage.statutJour === 'absent' || isOnLeave}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={pointage.overtimeHours || 0}
                        onChange={(e) => handleFieldChange(user.id, 'overtimeHours', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                        disabled={pointage.statutJour === 'absent' || isOnLeave}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSavePointage(user.id)}
                        disabled={isOnLeave}
                      >
                        <Icon icon="mdi:content-save" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'present':
      return 'Présent';
    case 'absent':
      return 'Absent';
    case 'retard':
      return 'Retard';
    default:
      return status;
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'present':
      return 'success';
    case 'absent':
      return 'danger';
    case 'retard':
      return 'warning';
    default:
      return 'secondary';
  }
};

export default PointagesListPage; 