// Modelos del dominio según docs/specs.md y docs/erd.md
import type { UserRole } from './permissions';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cedula: string;
  region?: string;
  centroSalud?: string;
  permissions: string[];
}

export interface HealthCenter {
  id: number;
  code: string;
  name: string;
  type: 'ambulatorio' | 'hospital' | 'cdi' | 'clinica_popular' | 'punto_vacunacion_movil';
  address: string;
  sector: string;
  state: string;
  municipality: string;
  parish: string;
  status: 'activo' | 'inactivo' | 'mantenimiento';
  phone?: string;
  email?: string;
}

export interface Recipient {
  id: number;
  identification_number: string;
  name: string;
  last_name: string;
  birthDate: string;
  gender: 'M' | 'F';
  state: string;
  municipality: string;
  parish: string;
  sector: string;
  phone?: string;
  parentName?: string;
  parentRelationship?: string;
}

export interface Vaccine {
  id: number;
  name: string;
  type: string;
  totalRequiredDoses: number;
  targetGroup: string;
  description: string;
}

export interface VaccineBatch {
  id: number;
  vaccineId: number;
  vaccineName: string;
  batchNumber: string;
  centerId: number;
  centerName: string;
  availableDoses: number;
  expirationDate: string;
}

export interface ImmunizationRecord {
  id: number;
  recipientId: number;
  recipientName: string;
  recipientCedula: string;
  vaccineId: number;
  vaccineName: string;
  doseNumber: number;
  doseType: string;
  batchNumber: string;
  centerId: number;
  centerName: string;
  administeredBy: string;
  dateTime: string;
}

export interface MedicalCertificate {
  id: number;
  code: string; // Hash único verificable
  recipientId: number;
  recipientName: string;
  recipientCedula: string;
  doseCount: number;
  centerName: string;
  issuedAt: string;
  status: 'valido' | 'revocado';
}

export interface MedicalExam {
  id: number;
  recipientId: number;
  recipientCedula: string;
  data: string; // Diagnóstico previo
  status: 'apto' | 'no_apto';
  doctorName: string;
  date: string;
}

