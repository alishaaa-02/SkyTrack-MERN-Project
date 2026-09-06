import { programs } from '../data/programs';

export const emptyForm = { name:'', email:'', phone:'', program:'', experience:'', address:'', medicalCertificate:null };
export const allowedTypes = ['application/pdf','image/jpeg','image/png'];
export const allowedExtensions = ['.pdf','.jpg','.jpeg','.png'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const fieldOrder = ['name','email','phone','program','experience','medicalCertificate','address'];

export function validateMedicalFile(file) {
  if (!file) return 'Please select a medical certificate.';
  const dot = file.name.lastIndexOf('.');
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : '';
  if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(ext)) {
    return 'Medical Certificate must be a PDF, JPG, JPEG, or PNG file.';
  }
  if (file.size === 0) return 'The selected Medical Certificate is empty. Please choose another file.';
  if (file.size > MAX_FILE_SIZE) return 'Medical Certificate must not exceed 5 MB.';
  return '';
}

export function validateField(field, form, editing) {
  const value = typeof form[field] === 'string' ? form[field].trim() : form[field];
  if (field === 'name') {
    if (!value) return 'Full Name is required.';
    if (value.length < 2 || value.length > 50) return 'Full Name must be 2–50 characters.';
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value)) return 'Full Name may contain only letters, spaces, apostrophes, periods and hyphens.';
  }
  if (field === 'email') {
    if (!value) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter a valid email address.';
  }
  if (field === 'phone') {
    if (!value) return 'Phone Number is required.';
    if (!/^[6-9]\d{9}$/.test(value)) return 'Enter a valid 10-digit Indian mobile number starting with 6–9.';
  }
  if (field === 'program' && (!value || !programs.some(p => p.title === value))) return 'Please select a valid training program.';
  if (field === 'experience' && (!value || !['Beginner','Intermediate','Advanced'].includes(value))) return 'Please select a valid experience level.';
  if (field === 'address') {
    if (!value) return 'Address is required.';
    if (value.length < 10 || value.length > 300) return 'Address must be 10–300 characters.';
  }
  if (field === 'medicalCertificate') {
    const file = form.medicalCertificate;
    if (!editing && !file) return 'Medical Certificate is required.';
    if (file) return validateMedicalFile(file);
  }
  return '';
}
