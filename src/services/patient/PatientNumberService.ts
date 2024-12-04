import { Patient } from '../../types/patient';

export class PatientNumberService {
  private static STORAGE_KEY = 'patient_numbers';
  private static NUMBER_PREFIX = 'P';
  private static NUMBER_LENGTH = 4;

  public static getNextPatientNumber(): string {
    const usedNumbers = this.getUsedNumbers();
    let nextNumber = 1;

    while (usedNumbers.has(this.formatNumber(nextNumber))) {
      nextNumber++;
    }

    return this.formatNumber(nextNumber);
  }

  public static formatNumber(num: number): string {
    return `${this.NUMBER_PREFIX}${num.toString().padStart(this.NUMBER_LENGTH, '0')}`;
  }

  public static isNumberAvailable(number: string, patients: Patient[]): boolean {
    // Vérifier si le numéro est déjà utilisé par un patient existant
    const isUsedByPatient = patients.some(p => p.numeroPatient === number);
    if (isUsedByPatient) {
      return false;
    }

    // Vérifier si le numéro est réservé
    const usedNumbers = this.getUsedNumbers();
    return !usedNumbers.has(number);
  }

  public static validateNumber(number: string): boolean {
    const pattern = new RegExp(`^${this.NUMBER_PREFIX}\\d{${this.NUMBER_LENGTH}}$`);
    return pattern.test(number);
  }

  public static releaseNumber(number: string, patients: Patient[]): boolean {
    // Vérifier si le numéro est utilisé par un autre patient
    const isUsedByOther = patients.some(p => p.numeroPatient === number);
    if (!isUsedByOther) {
      const usedNumbers = this.getUsedNumbers();
      usedNumbers.delete(number);
      this.saveUsedNumbers(usedNumbers);
      return true;
    }
    return false;
  }

  public static reserveNumber(number: string): void {
    if (!this.validateNumber(number)) {
      throw new Error(`Invalid patient number format. Expected format: ${this.NUMBER_PREFIX}XXXX`);
    }
    const usedNumbers = this.getUsedNumbers();
    usedNumbers.add(number);
    this.saveUsedNumbers(usedNumbers);
  }

  public static getPatientByNumber(number: string, patients: Patient[]): Patient | undefined {
    return patients.find(p => p.numeroPatient === number);
  }

  private static getUsedNumbers(): Set<string> {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return new Set(saved ? JSON.parse(saved) : []);
  }

  private static saveUsedNumbers(numbers: Set<string>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(numbers)));
  }

  public static initializeFromExistingPatients(patients: Patient[]): void {
    const usedNumbers = new Set<string>();
    patients.forEach(patient => {
      if (patient.numeroPatient && this.validateNumber(patient.numeroPatient)) {
        usedNumbers.add(patient.numeroPatient);
      }
    });
    this.saveUsedNumbers(usedNumbers);
  }
}