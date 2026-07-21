export interface CrearEducacionDTO {

    // ============================
    // Identificación de la I.E.
    // ============================

    cod_modular: number;

    nombre_ie: string;

    dre: string;

    ugel: string;

    nivel: string;

    gestion: string;

    provincia: string;

    distrito: string;

    centro_poblado?: string;

    // ============================
    // Proyectos de Inversión
    // ============================

    cui_proyecto?: string;

    estado_proyecto: string;

    avance_fisico: number;

    monto_total: number;

    // ============================
    // Infraestructura y Equipamiento
    // ============================

    estado_infra: number;

    aulas_buenas: number;

    mobiliario_optimo_porc: number;

    computadoras_total: number;

    servicio_agua: boolean;

    servicio_desague: boolean;

    servicio_luz: boolean;

    tiene_internet: boolean;

    riesgo_critico: boolean;

    // ============================
    // Personal Docente y Administrativo
    // ============================

    total_matricula: number;

    docentes_requeridos: number;

    docentes_nombrados: number;

    docentes_contratados: number;

    personal_admin: number;

    tiene_psicologo: string;

    // ============================
    // Común
    // ============================

    fecha_corte: Date;

    nombre_usuario: string;

}
