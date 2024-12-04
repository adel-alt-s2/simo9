import { Patient } from '../types/patient';
import { Appointment } from '../components/calendar/types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function getUniquePatients(patients: Patient[]): Patient[] {
  const patientMap = new Map();

  patients.forEach(patient => {
    const fullName = `${patient.nom.toLowerCase()} ${patient.prenom.toLowerCase()}`;
    
    if (!patientMap.has(fullName)) {
      patientMap.set(fullName, patient);
    } else {
      const existingPatient = patientMap.get(fullName);
      if (parseInt(patient.numeroPatient.slice(1)) < parseInt(existingPatient.numeroPatient.slice(1))) {
        patientMap.set(fullName, patient);
      }
    }
  });

  return Array.from(patientMap.values());
}

export function enrichPatientWithAppointments(
  patient: Patient, 
  appointments: Appointment[]
): Patient & {
  nombreConsultations: number;
  derniereConsultation?: string;
  prochainRdv?: string;
} {
  const patientAppointments = appointments.filter(apt => 
    apt.patientId === patient.id || 
    (apt.nom?.toLowerCase() === patient.nom.toLowerCase() && 
     apt.prenom?.toLowerCase() === patient.prenom.toLowerCase())
  );

  const validatedAppointments = patientAppointments.filter(apt => apt.status === 'Validé');
  
  const sortedAppointments = [...patientAppointments].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  
  const lastAppointment = sortedAppointments[0];
  const now = new Date();
  const nextAppointment = sortedAppointments.find(
    apt => new Date(apt.time) > now
  );

  return {
    ...patient,
    nombreConsultations: validatedAppointments.length,
    derniereConsultation: lastAppointment ? 
      format(parseISO(lastAppointment.time), 'dd/MM/yyyy', { locale: fr }) : 
      undefined,
    prochainRdv: nextAppointment ? 
      format(parseISO(nextAppointment.time), 'dd/MM/yyyy HH:mm', { locale: fr }) : 
      undefined
  };
}