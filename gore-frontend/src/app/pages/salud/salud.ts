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

  minDate = this.getTodayString();

  cerrarMensaje(): void {
    this.mensajeGuardado = '';
  }

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

    equipo_rayos_x: [''],

    planta_oxigeno: [''],

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

    turno_24h: [''],

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

  // initialize reactive cross-field validations
  private _init = this.setupValidators();

  private setupValidators(): void {
    // camas UCI: disponibles <= totales
    this.form.get('camas_uci_tot')?.valueChanges.subscribe(() => this.checkCamas());
    this.form.get('camas_uci_disp')?.valueChanges.subscribe(() => this.checkCamas());

    // médicos en servicio <= médicos programados
    this.form.get('med_prog')?.valueChanges.subscribe(() => this.checkMedicos());
    this.form.get('med_exist')?.valueChanges.subscribe(() => this.checkMedicos());

    // fecha debe ser mayor a hoy
    this.form.get('fecha_corte')?.valueChanges.subscribe(() => this.checkFecha());
  }

  private checkCamas(): void {
    const tot = Number(this.form.get('camas_uci_tot')?.value) || 0;
    const disp = Number(this.form.get('camas_uci_disp')?.value) || 0;
    const control = this.form.get('camas_uci_disp');
    if (disp > tot) {
      control?.setErrors({ maxExceeded: true });
    } else {
      // remove specific error while preserving others
      if (control?.hasError('maxExceeded')) {
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        const errors = control.errors;
        if (errors) {
          delete errors['maxExceeded'];
          if (Object.keys(errors).length === 0) control.setErrors(null);
          else control.setErrors(errors);
        }
      }
    }
  }

  private checkMedicos(): void {
    const prog = Number(this.form.get('med_prog')?.value) || 0;
    const exist = Number(this.form.get('med_exist')?.value) || 0;
    const control = this.form.get('med_exist');
    if (exist > prog) {
      control?.setErrors({ maxExceeded: true });
    } else {
      if (control?.hasError('maxExceeded')) {
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        const errors = control.errors;
        if (errors) {
          delete errors['maxExceeded'];
          if (Object.keys(errors).length === 0) control.setErrors(null);
          else control.setErrors(errors);
        }
      }
    }
  }

  private checkFecha(): void {
    const raw = this.form.get('fecha_corte')?.value;
    const parsed = this.parseDate(raw);
    const control = this.form.get('fecha_corte');
    if (!parsed) {
      control?.setErrors({ invalidDate: true });
      return;
    }
    const today = new Date();
    // zero time for comparison
    today.setHours(0, 0, 0, 0);
    const d = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    if (d <= today) {
      control?.setErrors({ invalidDate: true });
    } else {
      if (control?.hasError('invalidDate')) {
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        const errors = control.errors;
        if (errors) {
          delete errors['invalidDate'];
          if (Object.keys(errors).length === 0) control.setErrors(null);
          else control.setErrors(errors);
        }
      }
    }
  }

  buscarEstablecimiento(): void {
    this.idRenaesMensaje = '';
    const id = Number(this.form.get('id_renaes')?.value);

    if (!id) return;

    this.saludService
      .obtenerReporteCompleto(id)

      .subscribe({
        next: (resp) => {
          if (!resp.success || !resp.data || !resp.data.establecimiento) {
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

          const data = resp.data;
          const e = data.establecimiento;
          const eq = data.equipamiento;
          const rh = data.recursos_humanos;
          const ep = data.epidemiologia;
          const sv = data.servicios;
          const cb = data.condiciones_basicas;
          const pr = data.proyecto;

          const patchValues: Record<string, any> = {};

          // Establecimiento
          if (e) {
            patchValues['nombre_eess'] = e.nombre_eess || '';
            patchValues['categoria'] = e.categoria || '';
            patchValues['red_salud'] = e.red_salud || '';
            patchValues['microred'] = e.microred || '';
            patchValues['provincia'] = e.provincia || '';
            patchValues['distrito'] = e.distrito || '';
            patchValues['tipo'] = e.tipo || '';
            patchValues['coord_lat'] = Number(e.coord_lat) || 0;
            patchValues['coord_long'] = Number(e.coord_long) || 0;
            patchValues['poblacion_asignada'] = e.poblacion_asignada || 0;
          }

          // Equipamiento
          if (eq) {
            patchValues['camas_uci_tot'] = eq.camas_uci_tot ?? 0;
            patchValues['camas_uci_disp'] = eq.camas_uci_disp ?? 0;
            patchValues['camas_hospitalarias'] = eq.camas_hospitalarias ?? 0;
            patchValues['equipo_rayos_x'] = eq.equipo_rayos_x ? 'SI' : '';
            patchValues['planta_oxigeno'] = eq.planta_oxigeno ? 'SI' : '';
            patchValues['estado_infra'] = eq.estado_infra ?? 1;
            patchValues['ventiladores'] = eq.ventiladores ?? 0;
            patchValues['monitores'] = eq.monitores ?? 0;
            patchValues['ecografo'] = !!eq.ecografo;
            patchValues['tomografo'] = !!eq.tomografo;
            patchValues['operativo'] = Number(eq.operativo) || 0;
            patchValues['inoperativo'] = Number(eq.inoperativo) || 0;
          }

          // Recursos Humanos
          if (rh) {
            patchValues['med_prog'] = rh.med_prog ?? 0;
            patchValues['med_exist'] = rh.med_exist ?? 0;
            patchValues['turno_24h'] = rh.turno_24h ? 'SI' : '';
            patchValues['enfermeras'] = rh.enfermeras ?? 0;
            patchValues['tecnicos'] = rh.tecnicos ?? 0;
            patchValues['pediatra'] = rh.pediatra ?? 0;
            patchValues['gineco_obstetra'] = rh.gineco_obstetra ?? 0;
            patchValues['anestesiologo'] = rh.anestesiologo ?? 0;
            patchValues['cirujano_general'] = rh.cirujano_general ?? 0;
            patchValues['intensivista'] = rh.intensivista ?? 0;
            patchValues['internista'] = rh.internista ?? 0;
            patchValues['cardiologo'] = rh.cardiologo ?? 0;
            patchValues['traumatologo'] = rh.traumatologo ?? 0;
            patchValues['otros_especialistas'] = rh.otros_especialistas ?? 0;
          }

          // Epidemiología
          if (ep) {
            patchValues['anho_epi'] = ep.anho_epi ?? new Date().getFullYear();
            patchValues['semana_epi'] = ep.semana_epi ?? 1;
            patchValues['casos_dengue'] = ep.casos_dengue ?? 0;
            patchValues['casos_anemia'] = ep.casos_anemia ?? 0;
            patchValues['mort_materna'] = ep.mort_materna ?? 0;
            patchValues['casos_desnutricion'] = ep.casos_desnutricion ?? 0;
            patchValues['iras_edas'] = ep.iras_edas ?? 0;
            patchValues['mortalidad_neonatal'] = ep.mortalidad_neonatal ?? 0;
          }

          // Servicios
          if (sv) {
            patchValues['emergencia'] = !!sv.emergencia;
            patchValues['uci'] = !!sv.uci;
            patchValues['centro_quirurgico'] = !!sv.centro_quirurgico;
            patchValues['partos'] = !!sv.partos;
            patchValues['consultas_diarias_prom'] = Number(sv.consultas_diarias_prom) || 0;
            patchValues['camas_ocupadas'] = sv.camas_ocupadas ?? 0;
          }

          // Condiciones Básicas
          if (cb) {
            patchValues['agua'] = !!cb.agua;
            patchValues['desague'] = !!cb.desague;
            patchValues['electricidad'] = !!cb.electricidad;
            patchValues['oxigeno'] = !!cb.oxigeno;
            patchValues['internet'] = !!cb.internet;
          }

          // Proyecto de Inversión
          if (pr) {
            patchValues['id_proyecto'] = pr.id_proyecto ?? 0;
            patchValues['estado_inversion'] = pr.estado_inversion || '';
            patchValues['avance_fisico'] = Number(pr.avance_fisico) || 0;
            patchValues['avance_financiero'] = Number(pr.avance_financiero) || 0;
            patchValues['monto_total'] = Number(pr.monto_total) || 0;
            patchValues['monto_devengado'] = Number(pr.monto_devengado) || 0;
            patchValues['unidad_ejecutora'] = pr.unidad_ejecutora || '';
          }

          this.form.patchValue(patchValues);
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

  private validarCamposObligatorios(): { valido: boolean; camposFaltantes: string[] } {
    const camposFaltantes: string[] = [];

    // Validar Establecimientos - TODOS deben estar llenos
    const camposEstablecimiento = [
      'id_renaes',
      'nombre_eess',
      'categoria',
      'red_salud',
      'provincia',
      'distrito',
      'tipo',
    ];
    for (const campo of camposEstablecimiento) {
      const control = this.form.get(campo);
      const value = control?.value;
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        camposFaltantes.push(campo);
        control?.markAsTouched();
        control?.setErrors({ required: true });
      }
    }

    // Validar Gestión de Inversiones - estado_inversion debe tener selección
    const estInversion = this.form.get('estado_inversion');
    if (!estInversion?.value || estInversion.value.trim() === '') {
      camposFaltantes.push('estado_inversion');
      estInversion?.markAsTouched();
      estInversion?.setErrors({ required: true });
    }

    // Validar fecha_corte
    const fechaCorte = this.form.get('fecha_corte');
    if (!fechaCorte?.value || fechaCorte.value.trim() === '') {
      camposFaltantes.push('fecha_corte');
      fechaCorte?.markAsTouched();
      fechaCorte?.setErrors({ required: true });
    }

    return {
      valido: camposFaltantes.length === 0,
      camposFaltantes,
    };
  }

  guardarReporte(): void {
    const validacion = this.validarCamposObligatorios();

    if (!validacion.valido) {
      this.mensajeGuardado = 'Falta completar campos';
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
        setTimeout(() => {
          this.mensajeGuardado = '';
        }, 5000);
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

  private getTodayString(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

      equipo_rayos_x: '',

      planta_oxigeno: '',

      estado_infra: 1,

      ventiladores: 0,

      monitores: 0,

      ecografo: false,

      tomografo: false,

      operativo: 0,

      inoperativo: 0,

      med_prog: 0,

      med_exist: 0,

      turno_24h: '',

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
