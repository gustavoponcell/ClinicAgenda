import bcrypt from 'bcryptjs';
import { AppointmentStatus, EmployeeRole, PrismaClient, WeekDay } from '@prisma/client';

const prisma = new PrismaClient();

function nextDateAt(daysFromNow: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  const senhaHash = await bcrypt.hash('12345678', 10);

  const specialties = await Promise.all(
    [
      'Cardiologia',
      'Dermatologia',
      'Ginecologia',
      'Ortopedia',
      'Pediatria',
      'Psiquiatria',
    ].map((nome) =>
      prisma.specialty.upsert({
        where: { nome },
        update: {},
        create: {
          nome,
          descricao: `Consultas de ${nome.toLowerCase()} no ClinicAgenda.`,
        },
      }),
    ),
  );

  const specialtyByName = Object.fromEntries(specialties.map((item) => [item.nome, item]));

  const admin = await prisma.employee.upsert({
    where: { email: 'admin@clinica.com' },
    update: { senhaHash, cargo: EmployeeRole.ADMIN, ativo: true },
    create: {
      nome: 'Dr. Roberto Silva',
      email: 'admin@clinica.com',
      senhaHash,
      cargo: EmployeeRole.ADMIN,
    },
  });

  await prisma.employee.upsert({
    where: { email: 'recepcao@clinica.com' },
    update: { senhaHash, cargo: EmployeeRole.RECEPCIONISTA, ativo: true },
    create: {
      nome: 'Juliana Santos',
      email: 'recepcao@clinica.com',
      senhaHash,
      cargo: EmployeeRole.RECEPCIONISTA,
    },
  });

  const professionalInputs = [
    {
      nome: 'Dr. João Santos',
      email: 'joao.santos@clinica.com',
      telefone: '(11) 98765-4321',
      specialties: ['Cardiologia'],
    },
    {
      nome: 'Dra. Ana Paula Costa',
      email: 'ana.costa@clinica.com',
      telefone: '(11) 98765-4322',
      specialties: ['Cardiologia', 'Ginecologia'],
    },
    {
      nome: 'Dra. Mariana Lima',
      email: 'mariana.lima@clinica.com',
      telefone: '(11) 98765-4323',
      specialties: ['Dermatologia'],
    },
    {
      nome: 'Dr. Pedro Oliveira',
      email: 'pedro.oliveira@clinica.com',
      telefone: '(11) 98765-4324',
      specialties: ['Ortopedia'],
    },
    {
      nome: 'Dra. Camila Rocha',
      email: 'camila.rocha@clinica.com',
      telefone: '(11) 98765-4325',
      specialties: ['Pediatria'],
    },
    {
      nome: 'Dra. Beatriz Mendes',
      email: 'beatriz.mendes@clinica.com',
      telefone: '(11) 98765-4326',
      specialties: ['Psiquiatria'],
    },
  ];

  const professionals = [];

  for (const item of professionalInputs) {
    const professional = await prisma.professional.upsert({
      where: { email: item.email },
      update: {
        nome: item.nome,
        telefone: item.telefone,
        ativo: true,
      },
      create: {
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
      },
    });

    await prisma.professionalSpecialty.deleteMany({
      where: { professionalId: professional.id },
    });

    await prisma.professionalSpecialty.createMany({
      data: item.specialties.map((specialtyName) => ({
        professionalId: professional.id,
        specialtyId: specialtyByName[specialtyName].id,
      })),
      skipDuplicates: true,
    });

    await prisma.availability.deleteMany({
      where: { professionalId: professional.id },
    });

    await prisma.availability.createMany({
      data: [WeekDay.SEGUNDA, WeekDay.TERCA, WeekDay.QUARTA, WeekDay.QUINTA, WeekDay.SEXTA].map(
        (diaSemana) => ({
          professionalId: professional.id,
          diaSemana,
          horaInicio: '08:00',
          horaFim: '18:00',
          ativo: true,
        }),
      ),
    });

    professionals.push(professional);
  }

  const maria = await prisma.patient.upsert({
    where: { email: 'maria@email.com' },
    update: { senhaHash },
    create: {
      nome: 'Maria Silva',
      email: 'maria@email.com',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      senhaHash,
    },
  });

  const jose = await prisma.patient.upsert({
    where: { email: 'jose@email.com' },
    update: { senhaHash },
    create: {
      nome: 'José Oliveira',
      email: 'jose@email.com',
      cpf: '987.654.321-00',
      telefone: '(11) 98888-8888',
      senhaHash,
    },
  });

  const joao = professionals.find((item) => item.email === 'joao.santos@clinica.com')!;
  const mariana = professionals.find((item) => item.email === 'mariana.lima@clinica.com')!;

  await prisma.appointment.deleteMany({
    where: {
      professionalId: joao.id,
      dataHora: nextDateAt(2, 9),
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: maria.id,
      professionalId: joao.id,
      specialtyId: specialtyByName.Cardiologia.id,
      dataHora: nextDateAt(2, 9),
      status: AppointmentStatus.AGENDADA,
      observacoes: 'Consulta inicial de rotina.',
    },
  });

  await prisma.appointment.deleteMany({
    where: {
      professionalId: mariana.id,
      dataHora: nextDateAt(3, 11),
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: jose.id,
      professionalId: mariana.id,
      specialtyId: specialtyByName.Dermatologia.id,
      dataHora: nextDateAt(3, 11),
      status: AppointmentStatus.REAGENDADA,
      observacoes: 'Paciente solicitou alteração de horário.',
    },
  });

  await prisma.scheduleBlock.create({
    data: {
      professionalId: joao.id,
      inicio: nextDateAt(10, 8),
      fim: nextDateAt(10, 18),
      motivo: 'Congresso médico',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorType: 'EMPLOYEE',
      actorId: admin.id,
      action: 'SEED_DATABASE',
      entity: 'System',
      entityId: 'seed',
      metadata: {
        description: 'Carga inicial do ClinicAgenda',
      },
    },
  });

  console.log('Seed do ClinicAgenda concluído com sucesso.');
  console.log('Admin: admin@clinica.com / 12345678');
  console.log('Recepção: recepcao@clinica.com / 12345678');
  console.log('Paciente: maria@email.com / 12345678');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
