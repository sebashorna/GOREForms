export interface CrearSaludDTO {

    // ============================
    // Información General
    // ============================

    id_renaes: number;

    nombre_eess: string;

    categoria: string;

    red_salud: string;

    microred: string;

    provincia: string;

    distrito: string;

    tipo: string;

    poblacion_asignada: number;

    coord_lat: number;

    coord_long: number;

    id_proyecto: number;

    // ============================
    // Proyectos
    // ============================

    estado_inversion: string;

    avance_fisico: number;

    avance_financiero: number;

    monto_total: number;

    monto_devengado: number;

    unidad_ejecutora: string;

    // ============================
    // Equipamiento
    // ============================

    camas_uci_tot: number;

    camas_uci_disp: number;

    camas_hospitalarias: number;

    equipo_rayos_x: boolean;

    planta_oxigeno: boolean;

    estado_infra: number;

    ventiladores: number;

    monitores: number;

    ecografo: boolean;

    tomografo: boolean;

    operativo: number;

    inoperativo: number;

    // ============================
    // Recursos Humanos
    // ============================

    med_prog: number;

    med_exist: number;

    brecha_med: number;

    turno_24h: boolean;

    enfermeras: number;

    tecnicos: number;

    pediatra: number;

    gineco_obstetra: number;

    anestesiologo: number;

    cirujano_general: number;

    intensivista: number;

    internista: number;

    cardiologo: number;

    traumatologo: number;

    otros_especialistas: number;

    // ============================
    // Epidemiología
    // ============================

    anho_epi: number;

    semana_epi: number;

    casos_dengue: number;

    casos_anemia: number;

    mort_materna: number;

    casos_desnutricion: number;

    iras_edas: number;

    mortalidad_neonatal: number;

    // ============================
    // Servicios
    // ============================

    emergencia: boolean;

    uci: boolean;

    centro_quirurgico: boolean;

    partos: boolean;

    consultas_diarias_prom: number;

    camas_ocupadas: number;

    // ============================
    // Condiciones Básicas
    // ============================

    agua: boolean;

    desague: boolean;

    electricidad: boolean;

    oxigeno: boolean;

    internet: boolean;

    // ============================
    // Común
    // ============================

    fecha_corte: Date;

    nombre_usuario: string;

}
