import { format, isSunday, isSaturday, addHours } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const useTimeSlots = (timezone: string = 'GMT') => {
  const getTimezoneOffset = (tz: string) => {
    if (tz === 'GMT') return 0;
    return parseInt(tz.replace('GMT+', ''), 10);
  };

  const convertToTimezone = (hour: number, minutes: number) => {
    const localDate = new Date();
    localDate.setHours(hour, minutes, 0, 0);
    const offset = getTimezoneOffset(timezone);
    const tzDate = addHours(localDate, offset);
    return format(tzDate, 'HH:mm');
  };

  // Créer des créneaux de 9h à 22h
  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? 0 : 30;
    return convertToTimezone(hour, minutes);
  });

  const isBreakTime = (time: string, date: Date) => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeValue = hours + minutes / 60;

    // Dimanche : toute la journée
    if (isSunday(date)) {
      return true;
    }

    // Samedi : après 13h30
    if (isSaturday(date) && timeValue >= 13.5) {
      return true;
    }

    // Tous les jours après 17h30
    if (timeValue >= 17.5) {
      return true;
    }

    return false;
  };

  const getBreakTimeReason = (time: string, date: Date) => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeValue = hours + minutes / 60;

    if (isSunday(date)) {
      return 'Fermé le dimanche';
    }

    if (isSaturday(date) && timeValue >= 13.5) {
      return 'Fermé le samedi après-midi';
    }

    if (timeValue >= 17.5) {
      return 'Fin des consultations';
    }

    return '';
  };

  const getTimeSlotLabel = (time: string, date: Date) => {
    const reason = getBreakTimeReason(time, date);
    return reason ? `${time} ${timezone} (${reason})` : `${time} ${timezone}`;
  };

  return {
    timeSlots,
    isBreakTime,
    getTimeSlotLabel,
    getBreakTimeReason,
    convertToTimezone
  };
};