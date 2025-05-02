

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { useSelector } from 'react-redux';

const ViewProfileLayer = () => {
  const { user } = useSelector((state) => state.auth);
  const [imagePreview, setImagePreview] = useState(
    user?.profile_picture || "assets/images/user-grid/user-grid-img13.png"
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };

  if (!user) {
    return <p>Utilisateur non trouvé.</p>;
  }

  return (
    <div className='row gy-4'>
      <div className='col-lg-4'>
        <div className='user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100'>
          <img
            src='assets/images/user-grid/user-grid-bg1.png'
            alt='WowDash React Vite'
            className='w-100 object-fit-cover'
          />
          <div className='pb-24 ms-16 mb-24 me-16  mt--100'>
            <div className='text-center border border-top-0 border-start-0 border-end-0'>
              <img
                src={imagePreview}
                alt='WowDash React Vite'
                className='border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover'
              />
              <h6 className='mb-0 mt-16'>{user.name} {user.prenom}</h6>
              <span className='text-secondary-light mb-16'>
                {user.email}
              </span>
            </div>
            <div className='mt-24'>
              <h6 className='text-xl mb-16'>Informations Personnelles</h6>
              <ul>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Nom Complet
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.name} {user.prenom}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Email
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.email}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Téléphone
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.tel}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Département
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.departement?.nom || user.departement_id}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Statut
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.statut}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Date de Naissance
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.date_naissance}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    RIB
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.rib}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    CIN
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.cin}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Situation Familiale
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.situationFamiliale}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Nombre d&apos;Enfants
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.nbEnfants}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Adresse
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.adresse}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Type de Contrat
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.typeContrat}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Rôle
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {user.role}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='col-lg-8'>
        <div className='card h-100'>
          <div className='card-body p-24'>
            <ul
              className='nav border-gradient-tab nav-pills mb-20 d-inline-flex'
              id='pills-tab'
              role='tablist'
            >
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center px-24 active'
                  id='pills-edit-profile-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-edit-profile'
                  type='button'
                  role='tab'
                  aria-controls='pills-edit-profile'
                  aria-selected='true'
                >
                  Modifier le Profil
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center px-24'
                  id='pills-change-passwork-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-change-passwork'
                  type='button'
                  role='tab'
                  aria-controls='pills-change-passwork'
                  aria-selected='false'
                  tabIndex={-1}
                >
                  Changer le Mot de Passe
                </button>
              </li>
            </ul>
            <div className='tab-content' id='pills-tabContent'>
              <div
                className='tab-pane fade show active'
                id='pills-edit-profile'
                role='tabpanel'
                aria-labelledby='pills-edit-profile-tab'
                tabIndex={0}
              >
                <h6 className='text-md text-primary-light mb-16'>
                  Photo de Profil
                </h6>
                {/* Upload Image Start */}
                <div className='mb-24 mt-16'>
                  <div className='avatar-upload'>
                    <div className='avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer'>
                      <input
                        type='file'
                        id='imageUpload'
                        accept='.png, .jpg, .jpeg'
                        hidden
                        onChange={readURL}
                      />
                      <label
                        htmlFor='imageUpload'
                        className='w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle'
                      >
                        <Icon
                          icon='solar:camera-outline'
                          className='icon'
                        ></Icon>
                      </label>
                    </div>
                    <div className='avatar-preview'>
                      <div
                        id='imagePreview'
                        style={{
                          backgroundImage: `url(${imagePreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Upload Image End */}
                <form action='#'>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='name'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Nom
                          <span className='text-danger-600'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control radius-8'
                          id='name'
                          placeholder='Entrez le nom'
                          defaultValue={user.name}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='prenom'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Prénom
                          <span className='text-danger-600'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control radius-8'
                          id='prenom'
                          placeholder='Entrez le prénom'
                          defaultValue={user.prenom}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='email'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Email <span className='text-danger-600'>*</span>
                        </label>
                        <input
                          type='email'
                          className='form-control radius-8'
                          id='email'
                          placeholder="Entrez l\'adresse email"
                          defaultValue={user.email}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='tel'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Téléphone
                        </label>
                        <input
                          type='tel'
                          className='form-control radius-8'
                          id='tel'
                          placeholder='Entrez le numéro de téléphone'
                          defaultValue={user.tel}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='departement_id'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Département
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='departement_id'
                          defaultValue={user.departement_id || 'Sélectionner un département'}
                        >
                          <option value='Sélectionner un département' disabled>
                            Sélectionner un département
                          </option>
                          <option value='IT'>IT</option>
                          <option value='HR'>HR</option>
                          <option value='Finance'>Finance</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='statut'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Statut
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='statut'
                          defaultValue={user.statut || 'Sélectionner un statut'}
                        >
                          <option value='Sélectionner un statut' disabled>
                            Sélectionner un statut
                          </option>
                          <option value='Actif'>Actif</option>
                          <option value='Inactif'>Inactif</option>
                          <option value='Congé'>Congé</option>
                          <option value='Malade'>Malade</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='date_naissance'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Date de Naissance
                        </label>
                        <input
                          type='date'
                          className='form-control radius-8'
                          id='date_naissance'
                          defaultValue={user.date_naissance}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='rib'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          RIB
                        </label>
                        <input
                          type='text'
                          className='form-control radius-8'
                          id='rib'
                          placeholder='Entrez le RIB'
                          defaultValue={user.rib}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='cin'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          CIN
                        </label>
                        <input
                          type='text'
                          className='form-control radius-8'
                          id='cin'
                          placeholder='Entrez le CIN'
                          defaultValue={user.cin}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='situationFamiliale'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Situation Familiale
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='situationFamiliale'
                          defaultValue={user.situationFamiliale || 'Sélectionner une situation'}
                        >
                          <option value='Sélectionner une situation' disabled>
                            Sélectionner une situation
                          </option>
                          <option value='Célibataire'>Célibataire</option>
                          <option value='Marié'>Marié</option>
                          <option value='Divorcé'>Divorcé</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='nbEnfants'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Nombre d&apos;Enfants
                        </label>
                        <input
                          type='number'
                          className='form-control radius-8'
                          id='nbEnfants'
                          placeholder="Entrez le nombre d\'enfants"
                          defaultValue={user.nbEnfants}
                        />
                      </div>
                    </div>
                    <div className='col-sm-12'>
                      <div className='mb-20'>
                        <label
                          htmlFor='adresse'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Adresse
                        </label>
                        <textarea
                          className='form-control radius-8'
                          id='adresse'
                          placeholder='Entrez l&apos;adresse'
                          defaultValue={user.adresse}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='typeContrat'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Type de Contrat
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='typeContrat'
                          defaultValue={user.typeContrat || 'Sélectionner un type de contrat'}
                        >
                          <option value='Sélectionner un type de contrat' disabled>
                            Sélectionner un type de contrat
                          </option>
                          <option value='Permanent'>Permanent</option>
                          <option value='Temporaire'>Temporaire</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='role'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Rôle
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='role'
                          defaultValue={user.role || 'Sélectionner un rôle'}
                        >
                          <option value='Sélectionner un rôle' disabled>
                            Sélectionner un rôle
                          </option>
                          <option value='Employe'>Employé</option>
                          <option value='Chef_Dep'>Chef de Département</option>
                          <option value='RH'>Ressources Humaines</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className='d-flex align-items-center justify-content-center gap-3'>
                    <button
                      type='button'
                      className='border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8'
                    >
                      Annuler
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8'
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
              <div
                className='tab-pane fade'
                id='pills-change-passwork'
                role='tabpanel'
                aria-labelledby='pills-change-passwork-tab'
                tabIndex='0'
              >
                <div className='mb-20'>
                  <label
                    htmlFor='your-password'
                    className='form-label fw-semibold text-primary-light text-sm mb-8'
                  >
                    Nouveau Mot de Passe <span className='text-danger-600'>*</span>
                  </label>
                  <div className='position-relative'>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className='form-control radius-8'
                      id='your-password'
                      placeholder='Entrez le nouveau mot de passe*'
                    />
                    <span
                      className={`toggle-password ${
                        passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>

                <div className='mb-20'>
                  <label
                    htmlFor='confirm-password'
                    className='form-label fw-semibold text-primary-light text-sm mb-8'
                  >
                    Confirmer le Mot de Passe <span className='text-danger-600'>*</span>
                  </label>
                  <div className='position-relative'>
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className='form-control radius-8'
                      id='confirm-password'
                      placeholder='Confirmez le mot de passe*'
                    />
                    <span
                      className={`toggle-password ${
                        confirmPasswordVisible
                          ? "ri-eye-off-line"
                          : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={toggleConfirmPasswordVisibility}
                    ></span>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-center gap-3 mt-24'>
                  <button
                    type='button'
                    className='border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8'
                  >
                    Annuler
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8'
                  >
                    Mettre à jour le Mot de Passe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileLayer;