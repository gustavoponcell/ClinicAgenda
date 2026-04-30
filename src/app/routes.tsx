import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Agendamento from "./pages/Agendamento";
import MinhasConsultas from "./pages/MinhasConsultas";
import Reagendamento from "./pages/Reagendamento";
import Perfil from "./pages/Perfil";
import MapaPrototipo from "./pages/MapaPrototipo";
import LoginAdmin from "./pages/admin/LoginAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Agenda from "./pages/admin/Agenda";
import Profissionais from "./pages/admin/Profissionais";
import Horarios from "./pages/admin/Horarios";
import Funcionarios from "./pages/admin/Funcionarios";
import Relatorios from "./pages/admin/Relatorios";
import Historico from "./pages/admin/Historico";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/mapa-prototipo",
    Component: MapaPrototipo,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/cadastro",
    Component: Cadastro,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/agendamento",
    Component: Agendamento,
  },
  {
    path: "/minhas-consultas",
    Component: MinhasConsultas,
  },
  {
    path: "/reagendamento/:id",
    Component: Reagendamento,
  },
  {
    path: "/perfil",
    Component: Perfil,
  },
  {
    path: "/admin/login",
    Component: LoginAdmin,
  },
  {
    path: "/admin/dashboard",
    Component: DashboardAdmin,
  },
  {
    path: "/admin/agenda",
    Component: Agenda,
  },
  {
    path: "/admin/profissionais",
    Component: Profissionais,
  },
  {
    path: "/admin/horarios",
    Component: Horarios,
  },
  {
    path: "/admin/funcionarios",
    Component: Funcionarios,
  },
  {
    path: "/admin/relatorios",
    Component: Relatorios,
  },
  {
    path: "/admin/historico",
    Component: Historico,
  },
]);
