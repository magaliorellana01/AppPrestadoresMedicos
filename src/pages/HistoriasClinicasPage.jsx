import React from "react";
import { useNavigate } from "react-router-dom";
import HistoriasClinicasList from "../components/HistoriasClinicasList";

export default function HistoriasClinicasPage() {
  const nav = useNavigate();
  return (
    <HistoriasClinicasList
      titulo="Historias Clínicas"
      descripcion="Listado de titulares y familiares"
      onSelect={(p) => nav(`/historias/${p.id}`)}
    />
  );
}
