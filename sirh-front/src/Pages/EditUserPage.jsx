import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    // Vérifier si l'utilisateur essaie d'accéder à sa propre page d'édition
    if (currentUser && currentUser.id === parseInt(id)) {
      Swal.fire({
        title: 'Action non autorisée',
        text: 'Vous ne pouvez pas modifier votre profil depuis cette page. Veuillez utiliser la page de profil.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/profile');
      });
      return;
    }
    // ...other logic for fetching user data or handling edit functionality...
  }, [id, currentUser, navigate]);

  return (
    <div>
      <h1>Modifier l'utilisateur</h1>
      {/* Formulaire ou contenu pour modifier l'utilisateur */}
    </div>
  );
};

export default EditUserPage;