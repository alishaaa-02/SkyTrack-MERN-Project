import React, { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import Header from './components/Header';
import Home from './components/Home';
import Registration from './components/Registration';
import TrainingPrograms from './components/TrainingPrograms';
import Gallery from './components/Gallery';
import Trainees from './components/Trainees';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Popup from './components/Popup';
import {
  fieldOrder,
  emptyForm,
  validateField,
  validateMedicalFile
} from './utils/validation';

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  const [trainees, setTrainees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [popup, setPopup] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('skytrack-theme') === 'dark'
  );
  const [errors, setErrors] = useState({});
  const [existingCertificate, setExistingCertificate] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileRef = useRef(null);

  const showPopup = (title, text, type = 'error') =>
    setPopup({ title, text, type });

  const closePopup = () => setPopup(null);

  const toggleTheme = () =>
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('skytrack-theme', next ? 'dark' : 'light');
      return next;
    });

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  const load = async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/api/trainees`);
      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.message || 'Unable to load trainees.');
      }

      setTrainees(d);
    } catch (e) {
      showPopup(
        'Unable to load trainees',
        e.message || 'Please try again.'
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      trainees.filter((t) =>
        [t.name, t.email, t.program, t.phone]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [trainees, search]
  );

  const validateInline = (field) => {
    const error = validateField(field, form, !!editing);

    setErrors((prev) => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  const change = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const fileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setForm((prev) => ({
        ...prev,
        medicalCertificate: null
      }));

      setPreviewUrl('');

      setErrors((prev) => ({
        ...prev,
        medicalCertificate: ''
      }));

      return;
    }

    const fileError = validateMedicalFile(file);

    if (fileError) {
      if (fileRef.current) {
        fileRef.current.value = '';
      }

      setForm((prev) => ({
        ...prev,
        medicalCertificate: null
      }));

      setPreviewUrl('');

      setErrors((prev) => ({
        ...prev,
        medicalCertificate: fileError
      }));

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    setForm((prev) => ({
      ...prev,
      medicalCertificate: file
    }));

    setErrors((prev) => ({
      ...prev,
      medicalCertificate: ''
    }));
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl('');

    setForm((prev) => ({
      ...prev,
      medicalCertificate: null
    }));

    setErrors((prev) => ({
      ...prev,
      medicalCertificate: ''
    }));

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const nextErrors = {};

    fieldOrder.forEach((field) => {
      const error = validateField(field, form, !!editing);

      if (error) {
        nextErrors[field] = error;
      }
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = fieldOrder.find(
        (field) => nextErrors[field]
      );

      const element = firstInvalid
        ? document.querySelector(`[name="${firstInvalid}"]`)
        : null;

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      element?.focus({
        preventScroll: true
      });

      return;
    }

    try {
      const data = new FormData();

      ['name', 'email', 'phone', 'program', 'experience', 'address'].forEach(
        (k) => {
          data.append(k, form[k].trim());
        }
      );

      if (form.medicalCertificate) {
        data.append(
          'medicalCertificate',
          form.medicalCertificate
        );
      }

      const url = editing
        ? `${API_BASE_URL}/api/trainees/${editing}`
        : `${API_BASE_URL}/api/trainees`;

      const r = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        body: data
      });

      const contentType = r.headers.get('content-type') || '';

      let response = {};

      if (contentType.includes('application/json')) {
        response = await r.json();
      } else {
        const raw = await r.text();

        response = {
          message:
            raw?.trim() ||
            `Server returned HTTP ${r.status}.`
        };
      }

      if (!r.ok) {
        const message =
          response.message ||
          response.error ||
          `Unable to ${editing ? 'update' : 'register'} trainee.`;

        const fieldMap = {
          'Full Name': 'name',
          Email: 'email',
          'Phone Number': 'phone',
          'Training Program': 'program',
          'Experience Level': 'experience',
          'Medical Certificate': 'medicalCertificate',
          Address: 'address'
        };

        const field = response.field
          ? fieldMap[response.field] || response.field
          : null;

        if (field && fieldOrder.includes(field)) {
          setErrors((prev) => ({
            ...prev,
            [field]: message
          }));

          document
            .querySelector(`[name="${field}"]`)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });

          return;
        }

        if (r.status >= 400 && r.status < 500) {
          showPopup('Registration error', message);
          return;
        }

        showPopup('Server error', message);
        return;
      }

      showPopup(
        editing
          ? 'Trainee updated'
          : 'Registration successful',
        editing
          ? 'Trainee details were updated successfully.'
          : 'Trainee was registered successfully.',
        'success'
      );

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl('');
      setForm({ ...emptyForm });
      setEditing(null);
      setExistingCertificate(null);
      setErrors({});

      if (fileRef.current) {
        fileRef.current.value = '';
      }

      await load();
    } catch (e) {
      showPopup(
        'Server connection error',
        'Unable to connect to the backend. Please try again.'
      );
    }
  };

  const edit = (t) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl('');

    setForm({
      name: t.name || '',
      email: t.email || '',
      phone: t.phone || '',
      program: t.program || '',
      experience: t.experience || '',
      address: t.address || '',
      medicalCertificate: null
    });

    setExistingCertificate(t.medicalCertificate || null);
    setErrors({});
    setEditing(t._id);

    if (fileRef.current) {
      fileRef.current.value = '';
    }

    location.hash = 'registration';
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this trainee?')) {
      return;
    }

    try {
      const r = await fetch(
        `${API_BASE_URL}/api/trainees/${id}`,
        {
          method: 'DELETE'
        }
      );

      const d = await r.json();

      if (!r.ok) {
        throw new Error(
          d.message || 'Unable to delete trainee.'
        );
      }

      await load();

      showPopup(
        'Trainee deleted',
        d.message || 'Trainee deleted successfully.',
        'success'
      );
    } catch (e) {
      showPopup(
        'Delete failed',
        e.message || 'Unable to delete trainee.'
      );
    }
  };

  const reset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl('');
    setForm({ ...emptyForm });
    setEditing(null);
    setExistingCertificate(null);
    setErrors({});

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <>
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <main>
        <Home />

        <Registration
          editing={editing}
          form={form}
          errors={errors}
          fileRef={fileRef}
          previewUrl={previewUrl}
          existingCertificate={existingCertificate}
          change={change}
          fileChange={fileChange}
          removeSelectedFile={removeSelectedFile}
          submit={submit}
          validateInline={validateInline}
          reset={reset}
        />

        <TrainingPrograms />

        <Gallery />

        <Trainees
          filtered={filtered}
          search={search}
          setSearch={setSearch}
          edit={edit}
          remove={remove}
        />

        <Contact />
      </main>

      <Footer />

      <Popup
        popup={popup}
        closePopup={closePopup}
      />
    </>
  );
}

export default App; 