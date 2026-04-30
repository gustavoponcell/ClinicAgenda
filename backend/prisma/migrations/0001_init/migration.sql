CREATE TYPE "EmployeeRole" AS ENUM ('ADMIN', 'RECEPCIONISTA');
CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADA', 'CANCELADA', 'REAGENDADA', 'REALIZADA');
CREATE TYPE "WeekDay" AS ENUM ('DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO');
CREATE TYPE "ActorType" AS ENUM ('PATIENT', 'EMPLOYEE', 'SYSTEM');

CREATE TABLE "patients" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "senhaHash" TEXT NOT NULL,
  "cpf" TEXT NOT NULL,
  "telefone" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employees" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "senhaHash" TEXT NOT NULL,
  "cargo" "EmployeeRole" NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "professionals" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "telefone" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "specialties" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "descricao" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "professional_specialties" (
  "professionalId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "professional_specialties_pkey" PRIMARY KEY ("professionalId","specialtyId")
);

CREATE TABLE "availabilities" (
  "id" TEXT NOT NULL,
  "professionalId" TEXT NOT NULL,
  "diaSemana" "WeekDay" NOT NULL,
  "horaInicio" TEXT NOT NULL,
  "horaFim" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "professionalId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  "dataHora" TIMESTAMP(3) NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'AGENDADA',
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "schedule_blocks" (
  "id" TEXT NOT NULL,
  "professionalId" TEXT NOT NULL,
  "inicio" TIMESTAMP(3) NOT NULL,
  "fim" TIMESTAMP(3) NOT NULL,
  "motivo" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "schedule_blocks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "actorType" "ActorType" NOT NULL,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");
CREATE UNIQUE INDEX "professionals_email_key" ON "professionals"("email");
CREATE UNIQUE INDEX "specialties_nome_key" ON "specialties"("nome");
CREATE INDEX "availabilities_professionalId_diaSemana_ativo_idx" ON "availabilities"("professionalId", "diaSemana", "ativo");
CREATE INDEX "appointments_patientId_dataHora_idx" ON "appointments"("patientId", "dataHora");
CREATE INDEX "appointments_professionalId_dataHora_idx" ON "appointments"("professionalId", "dataHora");
CREATE INDEX "appointments_status_idx" ON "appointments"("status");
CREATE INDEX "schedule_blocks_professionalId_inicio_fim_idx" ON "schedule_blocks"("professionalId", "inicio", "fim");
CREATE INDEX "audit_logs_actorType_actorId_idx" ON "audit_logs"("actorType", "actorId");
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

ALTER TABLE "professional_specialties" ADD CONSTRAINT "professional_specialties_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "professional_specialties" ADD CONSTRAINT "professional_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedule_blocks" ADD CONSTRAINT "schedule_blocks_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
