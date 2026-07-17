export interface CrearEducacionDTO {

    // ============================
    // Información General
    // ============================

    cod_modular: number;

    nombre_ie: string;

    nivel: string;

    provincia: string;

    distrito: string;

    coord_lat: number;

    coord_long: number;

    total_estudiantes: number;

    // ============================
    // Proyectos
    // ============================

    id_proyecto: number;

    estado_proyecto: string;

    tipo_obra: string;

    unidad_ejecutora: string;

    avance_fisico: number;

    avance_financiero: number;

    monto_total: number;

    monto_devengado: number;

    // ============================
    // Equipamiento
    // ============================

    mobiliario_optimo_porc: number;

    computadoras_total: number;

    tiene_internet: boolean;

    tiene_laboratorio: boolean;

    // ============================
    // Recursos Humanos
    // ============================

    docentes_requeridos: number;

    docentes_asignados: number;

    personal_administrativo: number;

    // ============================
    // Condiciones Básicas
    // ============================

    servicio_agua: boolean;

    servicio_desague: boolean;

    servicio_electricidad: boolean;

    estado_critico_infra: boolean;

    // ============================
    // Común
    // ============================

    fecha_corte: Date;

}