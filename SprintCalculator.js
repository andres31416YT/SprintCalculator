// Calculadora de Proyecto Scrum
class ScrumCalculator {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
        this.calculate(); // Cálculo inicial
    }

    initializeElements() {
        // Inputs
        this.inputs = {
            horasPorPunto: document.getElementById('horasPorPunto'),
            diasSprint: document.getElementById('diasSprint'),
            diasPorSemana: document.getElementById('diasPorSemana'),
            numeroPersonas: document.getElementById('numeroPersonas'),
            horasTrabajoporDia: document.getElementById('horasTrabajoporDia'),
            puntosProyecto: document.getElementById('puntosProyecto'),
            costoHoraPorPersona: document.getElementById('costoHoraPorPersona')
        };

        // Elementos de resultado
        this.resultElements = {
            tiempoPorPunto: document.getElementById('tiempoPorPunto'),
            duracionSprint: document.getElementById('duracionSprint'),
            diasLaborables: document.getElementById('diasLaborables'),
            diasSemanales: document.getElementById('diasSemanales'),
            tamanoEquipo: document.getElementById('tamanoEquipo'),
            totalPuntos: document.getElementById('totalPuntos'),
            capacidadSprint: document.getElementById('capacidadSprint'),
            horasEfectivas: document.getElementById('horasEfectivas'),
            velocidadEquipo: document.getElementById('velocidadEquipo'),
            sprintsNecesarios: document.getElementById('sprintsNecesarios'),
            duracionProyecto: document.getElementById('duracionProyecto'),
            duracionDetalle: document.getElementById('duracionDetalle'),
            costoTotal: document.getElementById('costoTotal'),
            horasTotales: document.getElementById('horasTotales'),
            resumenEjecutivo: document.getElementById('resumenEjecutivo')
        };
    }

    addEventListeners() {
        // Agregar event listeners a todos los inputs
        Object.values(this.inputs).forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });
    }

    getInputValues() {
        return {
            horasPorPunto: parseFloat(this.inputs.horasPorPunto.value) || 0,
            diasSprint: parseInt(this.inputs.diasSprint.value) || 0,
            diasPorSemana: parseInt(this.inputs.diasPorSemana.value) || 0,
            numeroPersonas: parseInt(this.inputs.numeroPersonas.value) || 0,
            horasTrabajoporDia: parseFloat(this.inputs.horasTrabajoporDia.value) || 0,
            puntosProyecto: parseInt(this.inputs.puntosProyecto.value) || 0,
            costoHoraPorPersona: parseFloat(this.inputs.costoHoraPorPersona.value) || 0
        };
    }

    calculate() {
        const params = this.getInputValues();
        
        // Validar que los valores sean positivos
        if (Object.values(params).some(val => val <= 0)) {
            this.displayError();
            return;
        }

        const calculations = this.performCalculations(params);
        this.updateDisplay(params, calculations);
    }

    performCalculations(params) {
        const {
            horasPorPunto,
            diasSprint,
            diasPorSemana,
            numeroPersonas,
            horasTrabajoporDia,
            puntosProyecto,
            costoHoraPorPersona
        } = params;

        // Días de trabajo por sprint
        const diasTrabajoPorSprint = Math.floor((diasSprint / 7) * diasPorSemana);
        
        // Capacidad total de horas por sprint
        const horasTotalesPorSprint = diasTrabajoPorSprint * numeroPersonas * horasTrabajoporDia;
        
        // Factor de eficiencia (80% del tiempo efectivo en desarrollo)
        const factorEficiencia = 0.8;
        const horasEfectivasPorSprint = Math.round(horasTotalesPorSprint * factorEficiencia);
        
        // Capacidad en puntos por sprint
        const capacidadPuntosPorSprint = Math.floor(horasEfectivasPorSprint / horasPorPunto);
        
        // Velocidad del equipo (similar a capacidad)
        const velocidadEquipo = capacidadPuntosPorSprint;
        
        // Número de sprints necesarios
        const numeroSprints = Math.ceil(puntosProyecto / velocidadEquipo);
        
        // Duración total del proyecto
        const duracionProyectoDias = numeroSprints * diasSprint;
        const duracionProyectoSemanas = Math.ceil(duracionProyectoDias / 7);
        const duracionProyectoMeses = Math.ceil(duracionProyectoSemanas / 4);
        
        // Costo total del proyecto
        const horasTotalesProyecto = puntosProyecto * horasPorPunto;
        const costoTotal = horasTotalesProyecto * costoHoraPorPersona;

        return {
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
    }

    updateDisplay(params, calculations) {
        // Actualizar valores directos
        this.resultElements.tiempoPorPunto.textContent = `${params.horasPorPunto} horas`;
        this.resultElements.duracionSprint.textContent = `${params.diasSprint} días`;
        this.resultElements.diasLaborables.textContent = `${calculations.diasTrabajoPorSprint} días laborables`;
        this.resultElements.diasSemanales.textContent = `${params.diasPorSemana} días`;
        this.resultElements.tamanoEquipo.textContent = `${params.numeroPersonas} personas`;
        this.resultElements.totalPuntos.textContent = `${params.puntosProyecto} puntos`;

        // Actualizar valores calculados
        this.resultElements.capacidadSprint.textContent = `${calculations.capacidadPuntosPorSprint} puntos`;
        this.resultElements.horasEfectivas.textContent = `${calculations.horasEfectivasPorSprint} horas efectivas`;
        this.resultElements.velocidadEquipo.textContent = `${calculations.velocidadEquipo} puntos/sprint`;
        this.resultElements.sprintsNecesarios.textContent = `${calculations.numeroSprints} sprints`;
        
        // Duración del proyecto
        this.resultElements.duracionProyecto.textContent = `${calculations.duracionProyectoMeses} meses`;
        this.resultElements.duracionDetalle.textContent = 
            `${calculations.duracionProyectoSemanas} semanas (${calculations.duracionProyectoDias} días)`;
        
        // Costo
        this.resultElements.costoTotal.textContent = `$${this.formatNumber(calculations.costoTotal)}`;
        this.resultElements.horasTotales.textContent = `${calculations.horasTotalesProyecto} horas totales`;

        // Actualizar resumen ejecutivo
        this.updateExecutiveSummary(params, calculations);
    }

    updateExecutiveSummary(params, calculations) {
        const summary = `
            <p>• El proyecto requiere <strong>${calculations.numeroSprints} sprints</strong> de ${params.diasSprint} días cada uno</p>
            <p>• Duración total estimada: <strong>${calculations.duracionProyectoMeses} meses</strong></p>
            <p>• Capacidad del equipo: <strong>${calculations.capacidadPuntosPorSprint} puntos por sprint</strong></p>
            <p>• Costo total estimado: <strong>$${this.formatNumber(calculations.costoTotal)}</strong></p>
            <p>• Factor de eficiencia aplicado: <strong>80%</strong> (tiempo efectivo en desarrollo)</p>
        `;
        this.resultElements.resumenEjecutivo.innerHTML = summary;
    }

    displayError() {
        // Mostrar mensaje de error si hay valores inválidos
        Object.values(this.resultElements).forEach(element => {
            if (element && element.id !== 'resumenEjecutivo') {
                element.textContent = '--';
            }
        });
        
        if (this.resultElements.resumenEjecutivo) {
            this.resultElements.resumenEjecutivo.innerHTML = 
                '<p style="color: #fbbf24;">⚠️ Por favor, ingresa valores válidos en todos los campos.</p>';
        }
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(Math.round(number));
    }
}

// Utilidades adicionales
class ScrumUtils {
    static validatePositiveNumber(value) {
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
    }

    static addInputValidation(inputElement, validationFn) {
        inputElement.addEventListener('blur', function() {
            if (!validationFn(this.value)) {
                this.style.borderColor = '#ef4444';
                this.style.backgroundColor = '#fef2f2';
            } else {
                this.style.borderColor = '#d1d5db';
                this.style.backgroundColor = 'white';
            }
        });
    }

    static exportResults(calculator) {
        const params = calculator.getInputValues();
        const calculations = calculator.performCalculations(params);
        
        const exportData = {
            parametros: params,
            resultados: calculations,
            fechaExportacion: new Date().toISOString(),
            resumen: {
                sprints: calculations.numeroSprints,
                duracionMeses: calculations.duracionProyectoMeses,
                capacidadPorSprint: calculations.capacidadPuntosPorSprint,
                costoTotal: calculations.costoTotal
            }
        };
        
        return JSON.stringify(exportData, null, 2);
    }
}

// Funciones de utilidad para exportar datos
function exportToJSON() {
    const data = ScrumUtils.exportResults(scrumCalculator);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scrum-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToCSV() {
    const params = scrumCalculator.getInputValues();
    const calculations = scrumCalculator.performCalculations(params);
    
    const csvData = [
        ['Parámetro', 'Valor', 'Unidad'],
        ['Horas por punto', params.horasPorPunto, 'horas'],
        ['Días por sprint', params.diasSprint, 'días'],
        ['Días por semana', params.diasPorSemana, 'días'],
        ['Número de personas', params.numeroPersonas, 'personas'],
        ['Horas por día', params.horasTrabajoporDia, 'horas'],
        ['Puntos del proyecto', params.puntosProyecto, 'puntos'],
        ['Costo por hora', params.costoHoraPorPersona, 'USD'],
        [''],
        ['Resultado', 'Valor', 'Unidad'],
        ['Capacidad por sprint', calculations.capacidadPuntosPorSprint, 'puntos'],
        ['Velocidad del equipo', calculations.velocidadEquipo, 'puntos/sprint'],
        ['Sprints necesarios', calculations.numeroSprints, 'sprints'],
        ['Duración del proyecto', calculations.duracionProyectoMeses, 'meses'],
        ['Costo total', calculations.costoTotal, 'USD']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scrum-calculation-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function printResults() {
    window.print();
}

// Funciones para preset de configuraciones comunes
function loadSmallTeamPreset() {
    scrumCalculator.inputs.horasPorPunto.value = 4;
    scrumCalculator.inputs.diasSprint.value = 14;
    scrumCalculator.inputs.diasPorSemana.value = 5;
    scrumCalculator.inputs.numeroPersonas.value = 3;
    scrumCalculator.inputs.horasTrabajoporDia.value = 6;
    scrumCalculator.inputs.puntosProyecto.value = 50;
    scrumCalculator.inputs.costoHoraPorPersona.value = 20;
    scrumCalculator.calculate();
}

function loadMediumTeamPreset() {
    scrumCalculator.inputs.horasPorPunto.value = 4;
    scrumCalculator.inputs.diasSprint.value = 14;
    scrumCalculator.inputs.diasPorSemana.value = 5;
    scrumCalculator.inputs.numeroPersonas.value = 5;
    scrumCalculator.inputs.horasTrabajoporDia.value = 6;
    scrumCalculator.inputs.puntosProyecto.value = 100;
    scrumCalculator.inputs.costoHoraPorPersona.value = 25;
    scrumCalculator.calculate();
}

function loadLargeTeamPreset() {
    scrumCalculator.inputs.horasPorPunto.value = 5;
    scrumCalculator.inputs.diasSprint.value = 14;
    scrumCalculator.inputs.diasPorSemana.value = 5;
    scrumCalculator.inputs.numeroPersonas.value = 8;
    scrumCalculator.inputs.horasTrabajoporDia.value = 6;
    scrumCalculator.inputs.puntosProyecto.value = 200;
    scrumCalculator.inputs.costoHoraPorPersona.value = 30;
    scrumCalculator.calculate();
}

// Funciones de análisis adicionales
function analyzeProjectRisk() {
    const params = scrumCalculator.getInputValues();
    const calculations = scrumCalculator.performCalculations(params);
    
    let riskLevel = 'Bajo';
    let riskFactors = [];
    
    // Análisis de factores de riesgo
    if (calculations.numeroSprints > 10) {
        riskLevel = 'Alto';
        riskFactors.push('Proyecto de larga duración (>10 sprints)');
    }
    
    if (params.numeroPersonas > 7) {
        riskLevel = 'Medio';
        riskFactors.push('Equipo grande (>7 personas)');
    }
    
    if (params.puntosProyecto > 150) {
        riskLevel = 'Alto';
        riskFactors.push('Proyecto de alta complejidad (>150 puntos)');
    }
    
    if (calculations.capacidadPuntosPorSprint < 10) {
        riskLevel = 'Medio';
        riskFactors.push('Baja capacidad por sprint (<10 puntos)');
    }
    
    return {
        nivel: riskLevel,
        factores: riskFactors,
        recomendaciones: getRecommendations(riskLevel, riskFactors)
    };
}

function getRecommendations(riskLevel, factors) {
    const recommendations = [];
    
    if (riskLevel === 'Alto') {
        recommendations.push('Considere dividir el proyecto en fases más pequeñas');
        recommendations.push('Implemente revisiones de estimación más frecuentes');
        recommendations.push('Planifique buffers de tiempo adicionales');
    }
    
    if (factors.some(f => f.includes('Equipo grande'))) {
        recommendations.push('Considere dividir en equipos más pequeños');
        recommendations.push('Mejore la comunicación y coordinación');
    }
    
    if (factors.some(f => f.includes('larga duración'))) {
        recommendations.push('Realice retrospectivas de estimación cada 3 sprints');
        recommendations.push('Considere re-planificación a mitad del proyecto');
    }
    
    if (factors.some(f => f.includes('Baja capacidad'))) {
        recommendations.push('Revise las estimaciones de puntos de historia');
        recommendations.push('Optimice el factor de eficiencia del equipo');
    }
    
    return recommendations;
}

// Configuración de almacenamiento local (simulado con variables)
let savedConfigurations = {};

function saveCurrentConfiguration(name) {
    const params = scrumCalculator.getInputValues();
    savedConfigurations[name] = {
        ...params,
        fechaGuardado: new Date().toISOString(),
        nombre: name
    };
    
    // Simular guardado (en un entorno real usarías localStorage)
    console.log(`Configuración "${name}" guardada:`, savedConfigurations[name]);
    return true;
}

function loadConfiguration(name) {
    const config = savedConfigurations[name];
    if (!config) {
        alert('Configuración no encontrada');
        return false;
    }
    
    // Cargar valores en los inputs
    Object.keys(config).forEach(key => {
        if (scrumCalculator.inputs[key]) {
            scrumCalculator.inputs[key].value = config[key];
        }
    });
    
    scrumCalculator.calculate();
    return true;
}

function listSavedConfigurations() {
    return Object.keys(savedConfigurations).map(name => ({
        nombre: name,
        fecha: savedConfigurations[name].fechaGuardado
    }));
}

// Funciones de validación avanzada
function validateBusinessRules() {
    const params = scrumCalculator.getInputValues();
    const warnings = [];
    
    // Validaciones de negocio
    if (params.horasPorPunto > 8) {
        warnings.push('⚠️ Tiempo por punto muy alto (>8 horas). Considere dividir las historias.');
    }
    
    if (params.diasSprint > 28) {
        warnings.push('⚠️ Sprint muy largo (>4 semanas). Se recomienda máximo 4 semanas.');
    }
    
    if (params.horasTrabajoporDia > 8) {
        warnings.push('⚠️ Horas de trabajo muy altas (>8 horas/día). Considere el burnout del equipo.');
    }
    
    if (params.numeroPersonas > 9) {
        warnings.push('⚠️ Equipo muy grande (>9 personas). Considere dividir en equipos más pequeños.');
    }
    
    const calculations = scrumCalculator.performCalculations(params);
    if (calculations.capacidadPuntosPorSprint < 5) {
        warnings.push('⚠️ Capacidad muy baja por sprint. Revise las estimaciones.');
    }
    
    return warnings;
}

// Inicialización de la aplicación
let scrumCalculator;

document.addEventListener('DOMContentLoaded', function() {
    scrumCalculator = new ScrumCalculator();
    
    // Agregar validaciones adicionales
    Object.values(scrumCalculator.inputs).forEach(input => {
        ScrumUtils.addInputValidation(input, ScrumUtils.validatePositiveNumber);
    });
    
    // Mostrar versión y fecha de carga
    console.log('Calculadora Scrum v1.0 - Cargada:', new Date().toLocaleString());
});

// Funciones globales para uso externo
window.ScrumCalculatorAPI = {
    exportToJSON,
    exportToCSV,
    printResults,
    loadSmallTeamPreset,
    loadMediumTeamPreset,
    loadLargeTeamPreset,
    analyzeProjectRisk,
    validateBusinessRules,
    saveCurrentConfiguration,
    loadConfiguration,
    listSavedConfigurations
};