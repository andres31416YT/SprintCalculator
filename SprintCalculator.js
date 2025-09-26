import React, { useState, useMemo } from 'react';
import { Calculator, Users, Clock, Target, DollarSign } from 'lucide-react';

const ScrumCalculator = () => {
  const [params, setParams] = useState({
    horasPorPunto: 4,
    diasSprint: 14,
    diasPorSemana: 5,
    numeroPersonas: 5,
    puntosProyecto: 100,
    horasTrabajoporDia: 6,
    costoHoraPorPersona: 25
  });

  const calculations = useMemo(() => {
    const {
      horasPorPunto,
      diasSprint,
      diasPorSemana,
      numeroPersonas,
      puntosProyecto,
      horasTrabajoporDia,
      costoHoraPorPersona
    } = params;

    // Días de trabajo por sprint
    const diasTrabajoPorSprint = Math.floor((diasSprint / 7) * diasPorSemana);
    
    // Capacidad total de horas por sprint
    const horasTotalesPorSprint = diasTrabajoPorSprint * numeroPersonas * horasTrabajoporDia;
    
    // Considerando factor de eficiencia (80% del tiempo efectivo en desarrollo)
    const factorEficiencia = 0.8;
    const horasEfectivasPorSprint = horasTotalesPorSprint * factorEficiencia;
    
    // Capacidad en puntos por sprint
    const capacidadPuntosPorSprint = Math.floor(horasEfectivasPorSprint / horasPorPunto);
    
    // Velocidad del equipo (similar a capacidad en este caso)
    const velocidadEquipo = capacidadPuntosPorSprint;
    
    // Número de sprints necesarios
    const numeroSprints = Math.ceil(puntosProyecto / velocidadEquipo);
    
    // Duración total del proyecto en días
    const duracionProyectoDias = numeroSprints * diasSprint;
    const duracionProyectoSemanas = Math.ceil(duracionProyectoDias / 7);
    const duracionProyectoMeses = Math.ceil(duracionProyectoSemanas / 4);
    
    // Costo total del proyecto
    const horasTotalesProyecto = puntosProyecto * horasPorPunto;
    const costoTotal = horasTotalesProyecto * costoHoraPorPersona;

    return {
      horasPorPunto,
      diasTrabajoPorSprint,
      horasTotalesPorSprint,
      horasEfectivasPorSprint,
      capacidadPuntosPorSprint,
      velocidadEquipo,
      numeroSprints,
      duracionProyectoDias,
      duracionProyectoSemanas,
      duracionProyectoMeses,
      horasTotalesProyecto,
      costoTotal
    };
  }, [params]);

  const handleInputChange = (field, value) => {
    setParams(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const InputField = ({ label, field, value, unit, step = 1, min = 0 }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          step={step}
          min={min}
        />
        {unit && <span className="ml-2 text-gray-500 text-sm">{unit}</span>}
      </div>
    </div>
  );

  const ResultCard = ({ icon: Icon, title, value, description, color = "blue" }) => (
    <div className={`bg-white rounded-lg border-l-4 border-${color}-500 p-4 shadow-sm`}>
      <div className="flex items-center mb-2">
        <Icon className={`h-5 w-5 text-${color}-600 mr-2`} />
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      <div className={`text-2xl font-bold text-${color}-600 mb-1`}>{value}</div>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calculadora de Proyecto Scrum
        </h1>
        <p className="text-gray-600">
          Configura los parámetros de tu proyecto y obtén estimaciones automáticas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Parámetros */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Parámetros del Proyecto
          </h2>

          <InputField
            label="Tiempo por punto de historia (horas)"
            field="horasPorPunto"
            value={params.horasPorPunto}
            unit="horas"
            step={0.5}
          />

          <InputField
            label="Duración del sprint"
            field="diasSprint"
            value={params.diasSprint}
            unit="días"
          />

          <InputField
            label="Días de trabajo por semana"
            field="diasPorSemana"
            value={params.diasPorSemana}
            unit="días"
            min={1}
          />

          <InputField
            label="Número de personas en el equipo"
            field="numeroPersonas"
            value={params.numeroPersonas}
            unit="personas"
            min={1}
          />

          <InputField
            label="Horas de trabajo por día"
            field="horasTrabajoporDia"
            value={params.horasTrabajoporDia}
            unit="horas/día"
            step={0.5}
          />

          <InputField
            label="Total de puntos de historia del proyecto"
            field="puntosProyecto"
            value={params.puntosProyecto}
            unit="puntos"
          />

          <InputField
            label="Costo por hora por persona (USD)"
            field="costoHoraPorPersona"
            value={params.costoHoraPorPersona}
            unit="USD/hora"
            step={0.5}
          />
        </div>

        {/* Panel de Resultados */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Resultados del Cálculo
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <ResultCard
                icon={Clock}
                title="Tiempo por punto de historia"
                value={`${calculations.horasPorPunto} horas`}
                description="Tiempo estimado para completar 1 punto"
                color="blue"
              />

              <ResultCard
                icon={Clock}
                title="Duración del sprint"
                value={`${params.diasSprint} días`}
                description={`${calculations.diasTrabajoPorSprint} días laborables`}
                color="green"
              />

              <ResultCard
                icon={Users}
                title="Días de trabajo por semana"
                value={`${params.diasPorSemana} días`}
                description="Días laborables por semana"
                color="purple"
              />

              <ResultCard
                icon={Users}
                title="Tamaño del equipo"
                value={`${params.numeroPersonas} personas`}
                description="Miembros del equipo de desarrollo"
                color="indigo"
              />

              <ResultCard
                icon={Target}
                title="Total puntos del proyecto"
                value={`${params.puntosProyecto} puntos`}
                description="Complejidad total estimada"
                color="red"
              />

              <ResultCard
                icon={Target}
                title="Capacidad por sprint"
                value={`${calculations.capacidadPuntosPorSprint} puntos`}
                description={`${calculations.horasEfectivasPorSprint} horas efectivas`}
                color="yellow"
              />

              <ResultCard
                icon={Target}
                title="Velocidad del equipo"
                value={`${calculations.velocidadEquipo} puntos/sprint`}
                description="Puntos completados por sprint"
                color="pink"
              />

              <ResultCard
                icon={Calculator}
                title="Sprints necesarios"
                value={`${calculations.numeroSprints} sprints`}
                description="Total de iteraciones requeridas"
                color="teal"
              />

              <ResultCard
                icon={Clock}
                title="Duración del proyecto"
                value={`${calculations.duracionProyectoMeses} meses`}
                description={`${calculations.duracionProyectoSemanas} semanas (${calculations.duracionProyectoDias} días)`}
                color="orange"
              />

              <ResultCard
                icon={DollarSign}
                title="Costo total del proyecto"
                value={`$${calculations.costoTotal.toLocaleString()}`}
                description={`${calculations.horasTotalesProyecto} horas totales`}
                color="emerald"
              />
            </div>
          </div>

          {/* Resumen Ejecutivo */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">📋 Resumen Ejecutivo</h3>
            <div className="space-y-2 text-sm">
              <p>• El proyecto requiere <strong>{calculations.numeroSprints} sprints</strong> de {params.diasSprint} días cada uno</p>
              <p>• Duración total estimada: <strong>{calculations.duracionProyectoMeses} meses</strong></p>
              <p>• Capacidad del equipo: <strong>{calculations.capacidadPuntosPorSprint} puntos por sprint</strong></p>
              <p>• Costo total estimado: <strong>${calculations.costoTotal.toLocaleString()}</strong></p>
              <p>• Factor de eficiencia aplicado: <strong>80%</strong> (tiempo efectivo en desarrollo)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-yellow-800 font-medium mb-2">💡 Consideraciones importantes:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Los cálculos incluyen un factor de eficiencia del 80% para tiempo efectivo de desarrollo</li>
          <li>• Las estimaciones pueden variar según la complejidad real de las historias</li>
          <li>• Es recomendable revisar y ajustar las estimaciones después de los primeros sprints</li>
          <li>• Los costos no incluyen gastos adicionales como infraestructura, herramientas, etc.</li>
        </ul>
      </div>
    </div>
  );
};

export default ScrumCalculator;