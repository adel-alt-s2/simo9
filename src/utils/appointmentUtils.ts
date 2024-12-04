export function getAppointmentTitle(appointment: any): string {
  // Gestion des pauses déjeuner
  if (appointment.isLunchBreak || appointment.type === 'PAUSE_DEJEUNER') {
    return 'PAUSE_DEJEUNER';
  }

  // Gestion des consultations cliniques
  if (appointment.isClinicalConsultation || appointment.type === 'CONSULTATION_CLINIQUE') {
    return `CONSULTATION_CLINIQUE${appointment.clinicName ? ` - ${appointment.clinicName}` : ''}`;
  }

  // Gestion des patients existants
  if (appointment.patientId && appointment.patient) {
    return appointment.patient;
  }

  // Gestion des nouveaux patients
  if (appointment.nom && appointment.prenom) {
    return `${appointment.nom} ${appointment.prenom}`;
  }

  // Gestion des types spécifiques
  if (appointment.type) {
    return appointment.type.toUpperCase();
  }

  // Si un nom de patient est défini, l'utiliser
  if (appointment.patient) {
    return appointment.patient;
  }

  // Si un titre est défini, l'utiliser
  if (appointment.title) {
    return appointment.title;
  }

  // Si c'est une pause déjeuner (vérification supplémentaire)
  if (appointment.type?.toLowerCase().includes('pause') || 
      appointment.title?.toLowerCase().includes('pause')) {
    return 'PAUSE_DEJEUNER';
  }

  // Si c'est une consultation clinique (vérification supplémentaire)
  if (appointment.type?.toLowerCase().includes('clinique') || 
      appointment.title?.toLowerCase().includes('clinique')) {
    return 'CONSULTATION_CLINIQUE';
  }

  // Par défaut, retourner une chaîne vide au lieu de "Pause Déjeuner"
  return '';
}

export function getAppointmentColor(appointment: any): string {
  // Pauses déjeuner
  if (appointment.isLunchBreak || 
      appointment.type === 'PAUSE_DEJEUNER' || 
      appointment.type?.toLowerCase().includes('pause')) {
    return 'bg-gray-500 text-white';
  }

  // Consultations cliniques
  if (appointment.isClinicalConsultation || 
      appointment.type === 'CONSULTATION_CLINIQUE' || 
      appointment.type?.toLowerCase().includes('clinique')) {
    return 'bg-purple-500 text-white';
  }

  // Rendez-vous annulés
  if (appointment.isCanceled || appointment.status === 'annulé') {
    return 'bg-red-500 text-white';
  }

  // Nouveaux patients
  if (appointment.isNewPatient) {
    return 'bg-green-500 text-white';
  }

  // Délégués
  if (appointment.isDelegue) {
    return 'bg-yellow-500 text-white';
  }

  // Gratuités
  if (appointment.isGratuite) {
    return 'bg-gray-500 text-white';
  }

  // Couleur par défaut
  return 'bg-blue-500 text-white';
}

export function getAppointmentHoverColor(appointment: any): string {
  // Pauses déjeuner
  if (appointment.isLunchBreak || 
      appointment.type === 'PAUSE_DEJEUNER' || 
      appointment.type?.toLowerCase().includes('pause')) {
    return 'hover:bg-gray-600';
  }

  // Consultations cliniques
  if (appointment.isClinicalConsultation || 
      appointment.type === 'CONSULTATION_CLINIQUE' || 
      appointment.type?.toLowerCase().includes('clinique')) {
    return 'hover:bg-purple-600';
  }

  // Rendez-vous annulés
  if (appointment.isCanceled || appointment.status === 'annulé') {
    return 'hover:bg-red-600';
  }

  // Nouveaux patients
  if (appointment.isNewPatient) {
    return 'hover:bg-green-600';
  }

  // Délégués
  if (appointment.isDelegue) {
    return 'hover:bg-yellow-600';
  }

  // Gratuités
  if (appointment.isGratuite) {
    return 'hover:bg-gray-600';
  }

  // Couleur par défaut au survol
  return 'hover:bg-blue-600';
}

export function isSpecialAppointment(appointment: any): boolean {
  return (
    appointment.isLunchBreak || 
    appointment.type === 'PAUSE_DEJEUNER' ||
    appointment.isClinicalConsultation || 
    appointment.type === 'CONSULTATION_CLINIQUE' ||
    appointment.type?.toLowerCase().includes('pause') ||
    appointment.type?.toLowerCase().includes('clinique')
  );
}