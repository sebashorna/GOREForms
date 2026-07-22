export interface CrearEducacionDTO {

    // ============================
    // DIV 1 - IDENTIFICACIÓN DE LA INSTITUCIÓN EDUCATIVA
    // ============================

    cod_modular: number;

    nombre_ie: string;

    dre: string;

    ugel: string;

    nivel: string;

    gestion: string;

    provincia: string;

    distrito: string;

    centro_poblado: string;

    // ============================
    // DIV 2 - PROYECTOS DE INVERSIÓN (INVIERTE.PE)
    // ============================

    id_proyecto: number;

    estado_proyecto: string;

    avance_fisico: number;

    monto_total: number;

    // ============================
    // DIV 3 - INFRAESTRUCTURA Y EQUIPAMIENTO
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
    // DIV 4 - PERSONAL DOCENTE Y ADMINISTRATIVO
    // ============================

    total_matricula: number;

    docentes_requeridos: number;

    docentes_nombrados: number;

    docentes_contratados: number;

    personal_admin: number;

    tiene_psicologo: boolean;

    // ============================
    // DIV 5 - METADATOS
    // ============================

    fecha_corte: Date;

    nombre_usuario: string;

}
