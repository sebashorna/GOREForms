import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SaludService } from '../../services/salud';
import { CrearSaludDTO } from '../../models/crear-salud.dto';

@Component({
  selector: 'app-salud',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './salud.html',
  styleUrl: './salud.css',
})
export class Salud {
  private fb = inject(FormBuilder);
  private saludService = inject(SaludService);

  mensajeGuardado = '';
  idRenaesMensaje = '';

  form = this.fb.group({
    //==============================
    // INFORMACIÓN GENERAL
    //==============================

    id_renaes: ['', [Validators.required, Validators.pattern(/^\d{1,8}$/)]],

    nombre_eess: [''],

    categoria: [''],

    red_salud: [''],

    microred: [''],

    provincia: [''],

    distrito: [''],

    tipo: [''],

    coord_lat: [0],

    coord_long: [0],

    poblacion_asignada: [0],

    //==============================
    // PROYECTO DE INVERSIÓN
    //==============================

    id_proyecto: [0],

    estado_inversion: [''],

    avance_fisico: [0, [Validators.min(0), Validators.max(100)]],

    avance_financiero: [0, [Validators.min(0), Validators.max(100)]],

    avance_equipamiento: [0, [Validators.min(0), Validators.max(100)]],

    monto_total: [0],

    monto_devengado: [0],

    unidad_ejecutora: [''],

    //==============================
    // EQUIPAMIENTO
    //==============================

    camas_uci_tot: [0],

    camas_uci_disp: [0],

    camas_hospitalarias: [0],

    equipo_rayos_x: [false],

    planta_oxigeno: [false],

    estado_infra: [1, [Validators.min(1), Validators.max(5)]],

    ventiladores: [0],

    monitores: [0],

    ecografo: [false],

    tomografo: [false],

    operativo: [0],

    inoperativo: [0],

    //==============================
    // RECURSOS HUMANOS
    //==============================

    med_prog: [0],

    med_exist: [0],

    turno_24h: [false],

    enfermeras: [0],

    tecnicos: [0],

    pediatra: [0],

    gineco_obstetra: [0],

    anestesiologo: [0],

    cirujano_general: [0],

    intensivista: [0],

    internista: [0],

    cardiologo: [0],

    traumatologo: [0],

    otros_especialistas: [0],

    //==============================
    // EPIDEMIOLOGÍA
    //==============================

    anho_epi: [new Date().getFullYear()],

    semana_epi: [1, [Validators.min(1), Validators.max(53)]],

    casos_dengue: [0],

    casos_anemia: [0],

    mort_materna: [0],

    casos_desnutricion: [0],

    iras_edas: [0],

    mortalidad_neonatal: [0],

    //==============================
    // SERVICIOS
    //==============================

    emergencia: [false],

    uci: [false],

    centro_quirurgico: [false],

    partos: [false],

    consultas_diarias_prom: [0],

    camas_ocupadas: [0],

    //==============================
    // CONDICIONES BÁSICAS
    //==============================

    agua: [false],

    desague: [false],

    electricidad: [false],

    oxigeno: [false],

    internet: [false],

    //==============================
    // FECHA
    //==============================

    fecha_corte: ['', Validators.required],
  });

  buscarEstablecimiento(): void {
    this.idRenaesMensaje = '';
    const id = Number(this.form.get('id_renaes')?.value);

    if (!id) return;

    this.saludService
      .obtenerEstablecimiento(id)

      .subscribe({
        next: (resp) => {
          if (!resp.success || !resp.data) {
            this.idRenaesMensaje = 'Establecimiento no existe, se registrará nuevo establecimiento.';
            this.limpiarDatosEstablecimiento();
            const control = this.form.get('id_renaes');
            const val = control?.value;
            if (control && /^\d{1,8}$/.test(String(val))) {
              control.setErrors(null);
            }
            return;
          }

          this.idRenaesMensaje = '';
          this.form.patchValue({
            nombre_eess: resp.data.nombre_eess,

            categoria: resp.data.categoria,

            red_salud: resp.data.red_salud,

            microred: resp.data.microred,

            provincia: resp.data.provincia,

            distrito: resp.data.distrito,

            tipo: resp.data.tipo,

            coord_lat: Number(resp.data.coord_lat),

            coord_long: Number(resp.data.coord_long),

            poblacion_asignada: resp.data.poblacion_asignada,
          });
        },

        error: (err) => {
          console.error(err);
          if (err?.status === 404) {
            this.idRenaesMensaje = 'Establecimiento no existe, se registrará nuevo establecimiento.';
            this.limpiarDatosEstablecimiento();
            const control404 = this.form.get('id_renaes');
            const v404 = control404?.value;
            if (control404 && /^\d{1,8}$/.test(String(v404))) {
              control404.setErrors(null);
            }
            return;
          }
          this.idRenaesMensaje = 'Error al consultar el establecimiento.';
        },
      });
  }

  handleIdInput(): void {
    this.idRenaesMensaje = '';
    const control = this.form.get('id_renaes');
    const val = control?.value;
    if (control && /^\d{1,8}$/.test(String(val))) {
      control.setErrors(null);
    }
  }

  guardarReporte(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeGuardado = 'Complete los campos obligatorios antes de guardar.';
      return;
    }

    const rawValues = this.form.getRawValue();

    const fechaCorte = this.parseDate(rawValues.fecha_corte) || new Date();

    const dto: CrearSaludDTO = {
      id_renaes: Number(rawValues.id_renaes),
      nombre_eess: rawValues.nombre_eess || '',
      categoria: rawValues.categoria || '',
      red_salud: rawValues.red_salud || '',
      microred: rawValues.microred || '',
      provincia: rawValues.provincia || '',
      distrito: rawValues.distrito || '',
      tipo: rawValues.tipo || '',
      coord_lat: Number(rawValues.coord_lat),
      coord_long: Number(rawValues.coord_long),
      poblacion_asignada: Number(rawValues.poblacion_asignada),
      id_proyecto: Number(rawValues.id_proyecto),
      estado_inversion: rawValues.estado_inversion || '',
      avance_fisico: Number(rawValues.avance_fisico),
      avance_financiero: Number(rawValues.avance_financiero),
      monto_total: Number(rawValues.monto_total),
      monto_devengado: Number(rawValues.monto_devengado),
      unidad_ejecutora: rawValues.unidad_ejecutora || '',
      camas_uci_tot: Number(rawValues.camas_uci_tot),
      camas_uci_disp: Number(rawValues.camas_uci_disp),
      camas_hospitalarias: Number(rawValues.camas_hospitalarias),
      avance_equipamiento: Number(rawValues.avance_equipamiento),
      equipo_rayos_x: this.parseBoolean(rawValues.equipo_rayos_x),
      planta_oxigeno: this.parseBoolean(rawValues.planta_oxigeno),
      estado_infra: Number(rawValues.estado_infra),
      ventiladores: Number(rawValues.ventiladores),
      monitores: Number(rawValues.monitores),
      ecografo: this.parseBoolean(rawValues.ecografo),
      tomografo: this.parseBoolean(rawValues.tomografo),
      operativo: Number(rawValues.operativo),
      inoperativo: Number(rawValues.inoperativo),
      med_prog: Number(rawValues.med_prog),
      med_exist: Number(rawValues.med_exist),
      turno_24h: this.parseBoolean(rawValues.turno_24h),
      enfermeras: Number(rawValues.enfermeras),
      tecnicos: Number(rawValues.tecnicos),
      pediatra: Number(rawValues.pediatra),
      gineco_obstetra: Number(rawValues.gineco_obstetra),
      anestesiologo: Number(rawValues.anestesiologo),
      cirujano_general: Number(rawValues.cirujano_general),
      intensivista: Number(rawValues.intensivista),
      internista: Number(rawValues.internista),
      cardiologo: Number(rawValues.cardiologo),
      traumatologo: Number(rawValues.traumatologo),
      otros_especialistas: Number(rawValues.otros_especialistas),
      anho_epi: Number(rawValues.anho_epi),
      semana_epi: Number(rawValues.semana_epi),
      casos_dengue: Number(rawValues.casos_dengue),
      casos_anemia: Number(rawValues.casos_anemia),
      mort_materna: Number(rawValues.mort_materna),
      casos_desnutricion: Number(rawValues.casos_desnutricion || 0),
      iras_edas: Number(rawValues.iras_edas || 0),
      mortalidad_neonatal: Number(rawValues.mortalidad_neonatal || 0),
      emergencia: this.parseBoolean(rawValues.emergencia),
      uci: this.parseBoolean(rawValues.uci),
      centro_quirurgico: this.parseBoolean(rawValues.centro_quirurgico),
      partos: this.parseBoolean(rawValues.partos),
      consultas_diarias_prom: Number(rawValues.consultas_diarias_prom),
      camas_ocupadas: Number(rawValues.camas_ocupadas),
      agua: this.parseBoolean(rawValues.agua),
      desague: this.parseBoolean(rawValues.desague),
      electricidad: this.parseBoolean(rawValues.electricidad),
      oxigeno: this.parseBoolean(rawValues.oxigeno),
      internet: this.parseBoolean(rawValues.internet),
      fecha_corte: fechaCorte,
    };

    this.mensajeGuardado = '';

    this.saludService.guardarReporteSalud(dto).subscribe({
      next: (resp) => {
        this.mensajeGuardado = 'Reporte registrado correctamente.';
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error(err);
        this.mensajeGuardado = 'Error al registrar el reporte.';
      },
    });
  }

  private parseBoolean(value: unknown): boolean {
    return (
      value === true ||
      value === 'true' ||
      value === 'SI' ||
      value === 'Si' ||
      value === 'YES' ||
      value === 'yes'
    );
  }

  private parseDate(value: unknown): Date | null {
    if (!value && value !== 0) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    const s = String(value).trim();
    // DD/MM/YYYY
    const dmy = /^([0-3]?\d)\/([0-1]?\d)\/(\d{4})$/;
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
    let m;
    if ((m = s.match(dmy))) {
      const day = Number(m[1]);
      const month = Number(m[2]) - 1;
      const year = Number(m[3]);
      const dt = new Date(year, month, day);
      return isNaN(dt.getTime()) ? null : dt;
    }
    if ((m = s.match(ymd))) {
      const year = Number(m[1]);
      const month = Number(m[2]) - 1;
      const day = Number(m[3]);
      const dt = new Date(year, month, day);
      return isNaN(dt.getTime()) ? null : dt;
    }
    const dt = new Date(s);
    return isNaN(dt.getTime()) ? null : dt;
  }

  private limpiarDatosEstablecimiento(): void {
    this.form.patchValue({
      nombre_eess: '',
      categoria: '',
      red_salud: '',
      microred: '',
      provincia: '',
      distrito: '',
      tipo: '',
      coord_lat: 0,
      coord_long: 0,
      poblacion_asignada: 0,
    });
  }

  limpiarFormulario(): void {

    this.form.reset({

      id_renaes: '',

      nombre_eess: '',

      categoria: '',

      red_salud: '',

      microred: '',

      provincia: '',

      distrito: '',

      tipo: '',

      coord_lat: 0,

      coord_long: 0,

      poblacion_asignada: 0,

      id_proyecto: 0,

      estado_inversion: '',

      avance_fisico: 0,

      avance_financiero: 0,

      monto_total: 0,

      monto_devengado: 0,

      unidad_ejecutora: '',

      camas_uci_tot: 0,

      camas_uci_disp: 0,

      camas_hospitalarias: 0,

      equipo_rayos_x: false,

      planta_oxigeno: false,

      estado_infra: 1,

      ventiladores: 0,

      monitores: 0,

      ecografo: false,

      tomografo: false,

      operativo: 0,

      inoperativo: 0,

      med_prog: 0,

      med_exist: 0,

      turno_24h: false,

      enfermeras: 0,

      tecnicos: 0,

      pediatra: 0,

      gineco_obstetra: 0,

      anestesiologo: 0,

      cirujano_general: 0,

      intensivista: 0,

      internista: 0,

      cardiologo: 0,

      traumatologo: 0,

      otros_especialistas: 0,

      anho_epi: new Date().getFullYear(),

      semana_epi: 1,

      casos_dengue: 0,

      casos_anemia: 0,

      mort_materna: 0,

      casos_desnutricion: 0,

      iras_edas: 0,

      mortalidad_neonatal: 0,

      emergencia: false,

      uci: false,

      centro_quirurgico: false,

      partos: false,

      consultas_diarias_prom: 0,

      camas_ocupadas: 0,

      agua: false,

      desague: false,

      electricidad: false,

      oxigeno: false,

      internet: false,

      fecha_corte: ''

    });

  }
}
