import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../Redux/Slices/userSlice';
import UserForm from '../Components/forms/UserForm';
import Swal from 'sweetalert2';

const UserFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = !!id;
  const { items: users, status: loading, error } = useSelector(state => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && currentUser && parseInt(id) === currentUser.id) {
      Swal.fire({
        title: 'Accès refusé',
        text: 'Vous ne pouvez pas modifier votre profil depuis cette page. Veuillez utiliser la page de profil.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/view-profile');
      });
    }
  }, [id, currentUser, isEdit, navigate]);

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/users');
    }, 2000);
  };

  const user = isEdit ? users.find(u => u.id === parseInt(id)) : null;

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
      <div className="alert alert-danger">
        Une erreur est survenue lors du chargement des données
      </div>
    );
  }

  if (isEdit && !user) {
    return (
      <div className="alert alert-warning">
        Utilisateur non trouvé
      </div>
    );
  }

  // Si c'est l'utilisateur connecté qui essaie d'accéder à sa propre page d'édition, 
  // le useEffect ci-dessus va rediriger, donc pas besoin de rendre quoi que ce soit
  if (isEdit && currentUser && parseInt(id) === currentUser.id) {
    return null;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">{isEdit ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <UserForm
            initialValues={user || {}}
            isEdit={isEdit}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;