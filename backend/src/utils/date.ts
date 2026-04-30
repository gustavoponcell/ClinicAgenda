import { WeekDay } from '@prisma/client';

const weekDays: WeekDay[] = [
  WeekDay.DOMINGO,
  WeekDay.SEGUNDA,
  WeekDay.TERCA,
  WeekDay.QUARTA,
  WeekDay.QUINTA,
  WeekDay.SEXTA,
  WeekDay.SABADO,
];

export function toWeekDay(date: Date) {
  return weekDays[date.getDay()];
}

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getTimeHHmm(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && startB < endA;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}
