export function formatDateTime(value: string) {
  const date = new Date(value);
  return {
    data: date.toLocaleDateString('pt-BR'),
    horario: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function toApiDateTime(datePtBr: string, time: string) {
  const [day, month, year] = datePtBr.split('/').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return date.toISOString();
}
