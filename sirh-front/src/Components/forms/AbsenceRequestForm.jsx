import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAbsenceRequest, updateAbsenceRequest } from '../../Redux/Slices/absenceRequestSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const AbsenceRequestForm = ({ initialValues = {}, isEdit = false, onSuccess }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.absenceRequests);
  const { user, isLoading: authLoading } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isEdit && !user) {
      Swal.fire('Erreur', 'Vous devez être connecté pour créer une demande d\'absence', 'error');
    }
  }, [user, isEdit]);

  const validationSchema = Yup.object({
    type: Yup.string()
      .required('Le type d\'absence est requis')
      .oneOf(['Congé', 'maladie', 'autre'], 'Type d\'absence invalide'),
    dateDebut: Yup.date().required('La date de début est requise'),
    dateFin: Yup.date()
      .required('La date de fin est requise')
      .min(Yup.ref('dateDebut'), 'La date de fin doit être postérieure à la date de début'),
    motif: Yup.string().nullable(),
    justification: Yup.mixed()
      .nullable()
      .test('fileSize', 'Le fichier est trop volumineux (max 2MB)', value => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 2048 * 1024;
      })
      .test('fileType', 'Format de fichier non supporté (jpg, jpeg, png, pdf uniquement)', value => {
        if (!value || typeof value === 'string') return true;
        return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
      })
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      if (isEdit) {
        // For update
        formData.append('id', initialValues.id);
        formData.append('user_id', values.user_id);
        formData.append('type', values.type);
        formData.append('dateDebut', values.dateDebut);
        formData.append('dateFin', values.dateFin);
        formData.append('motif', values.motif || '');
        formData.append('statut', values.statut || initialValues.statut || 'en_attente');
        
        if (values.justification instanceof File) {
          formData.append('justification', values.justification);
        } else if (values.justification) {
          formData.append('justification', '');
        }
      } else {
        // For create
        if (!user) {
          throw new Error('Utilisateur non authentifié');
        }
        formData.append('user_id', user.id);
        formData.append('type', values.type);
        formData.append('dateDebut', values.dateDebut);
        formData.append('dateFin', values.dateFin);
        formData.append('motif', values.motif || '');
        formData.append('statut', 'en_attente');
        
        if (values.justification instanceof File) {
          formData.append('justification', values.justification);
        }
      }

      const response = await dispatch(
        isEdit ? updateAbsenceRequest(formData) : createAbsenceRequest(formData)
      ).unwrap();

      if (response && response.error) {
        throw new Error(response.error);
      }

      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Une erreur est survenue lors de la mise à jour de la demande d\'absence.';
      
      if (error.error && error.error.justification) {
        errorMessage = error.error.justification.join(' ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire('Erreur!', errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <Formik
          initialValues={{
            type: 'Congé',
            dateDebut: '',
            dateFin: '',
            motif: '',
            justification: null,
            ...initialValues
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              {!isEdit && user && (
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Employé</label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${user.name} ${user.prenom}`}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type d'absence</label>
                    <Field
                      as="select"
                      name="type"
                      id="type"
                      className="form-select"
                    >
                      <option value="Congé">Congé</option>
                      <option value="maladie">Maladie</option>
                      <option value="autre">Autre</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="dateDebut" className="form-label">Date de début</label>
                    <Field
                      type="date"
                      name="dateDebut"
                      id="dateDebut"
                      className="form-control"
                    />
                    <ErrorMessage name="dateDebut" component="div" className="text-danger" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="dateFin" className="form-label">Date de fin</label>
                    <Field
                      type="date"
                      name="dateFin"
                      id="dateFin"
                      className="form-control"
                    />
                    <ErrorMessage name="dateFin" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <label htmlFor="motif" className="form-label">Motif</label>
                    <Field
                      as="textarea"
                      name="motif"
                      id="motif"
                      className="form-control"
                      rows="3"
                    />
                    <ErrorMessage name="motif" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <label htmlFor="justification" className="form-label">Justification</label>
                    <input
                      type="file"
                      name="justification"
                      id="justification"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          setFieldValue("justification", file);
                        } else {
                          setFieldValue("justification", null);
                        }
                      }}
                    />
                    {values.justification && (
                      <div className="mt-2">
                        <small className="text-muted">
                          Fichier sélectionné: {values.justification.name || values.justification}
                        </small>
                      </div>
                    )}
                    <ErrorMessage name="justification" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              {isEdit && (
                <div className="mb-3">
                  <label htmlFor="statut" className="form-label">Statut</label>
                  <Field
                    as="select"
                    name="statut"
                    id="statut"
                    className="form-select"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="validé">Validé</option>
                    <option value="rejeté">Rejeté</option>
                  </Field>
                  <ErrorMessage name="statut" component="div" className="text-danger" />
                </div>
              )}

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || status === 'loading' || (!isEdit && authLoading)}
                >
                  {isSubmitting || status === 'loading' ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : null}
                  {isEdit ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AbsenceRequestForm;