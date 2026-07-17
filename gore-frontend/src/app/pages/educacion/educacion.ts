import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { EducacionService } from '../../services/educacion';
import { CrearEducacionDTO } from '../../models/crear-educacion.dto';

@Component({
  selector: 'app-educacion',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './educacion.html',
  styleUrl: './educacion.css',
})
export class Educacion {
  private fb = inject(FormBuilder);
  private educacionService = inject(EducacionService);

  mensajeGuardado = '';
  codModularMensaje = '';

  minDate = this.getTodayString();

  cerrarMensaje(): void {
    this.mensajeGuardado = '';
  }

  form = this.fb.group({
    //==============================
    // INFORMACIÓN GENERAL
    //==============================

    cod_modular: ['', [Validators.required, Validators.pattern(/^\d{1,8}$/)]],

    nombre_ie: [''],

    nivel: [''],

    provincia: [''],

    distrito: [''],

    coord_lat: [0],

    coord_long: [0],

    total_estudiantes: [0],

    //==============================
    // PROYECTO DE INFRAESTRUCTURA
    //==============================

    id_proyecto: [0],

    estado_proyecto: [''],

    tipo_obra: [''],

    unidad_ejecutora: [''],

    avance_fisico: [0, [Validators.min(0), Validators.max(100)]],

    avance_financiero: [0, [Validators.min(0), Validators.max(100)]],

    monto_total: [0],

    monto_devengado: [0],

    //==============================
    // EQUIPAMIENTO
    //==============================

    mobiliario_optimo_porc: [0, [Validators.min(0), Validators.max(100)]],

    computadoras_total: [0],

    tiene_internet: [''],

    tiene_laboratorio: [''],

    //==============================
    // RECURSOS HUMANOS
    //==============================

    docentes_requeridos: [0],

    docentes_asignados: [0],

    personal_administrativo: [0],

    //==============================
    // CONDICIONES BÁSICAS
    //==============================

    servicio_agua: [''],

    servicio_desague: [''],

    servicio_electricidad: [''],

    estado_critico_infra: [''],

    //==============================
    // FECHA
    //==============================

    fecha_corte: ['', Validators.required],
  });

  // initialize reactive cross-field validations
  private _init = this.setupValidators();

  private setupValidators(): void {
    // docentes asignados <= docentes requeridos
    this.form.get('docentes_requeridos')?.valueChanges.subscribe(() => this.checkDocentes());
    this.form.get('docentes_asignados')?.valueChanges.subscribe(() => this.checkDocentes());

    // fecha debe ser mayor a hoy
    this.form.get('fecha_corte')?.valueChanges.subscribe(() => this.checkFecha());
  }

  private checkDocentes(): void {
    const req = Number(this.form.get('docentes_requeridos')?.value) || 0;
    const asig = Number(this.form.get('docentes_asignados')?.value) || 0;
    const control = this.form.get('docentes_asignados');
    if (asig > req) {
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

  buscarInstitucion(): void {
    this.codModularMensaje = '';
    const id = Number(this.form.get('cod_modular')?.value);

    if (!id) return;

    this.educacionService
      .obtenerReporteCompleto(id)

      .subscribe({
        next: (resp) => {
          if (!resp.success || !resp.data || !resp.data.institucion) {
            this.codModularMensaje = 'Institución no existe, se registrará nueva institución.';
            this.limpiarDatosInstitucion();
            const control = this.form.get('cod_modular');
            const val = control?.value;
            if (control && /^\d{1,8}$/.test(String(val))) {
              control.setErrors(null);
            }
            return;
          }

          this.codModularMensaje = '';

          const data = resp.data;
          const ie = data.institucion;
          const eq = data.equipamiento;
          const rh = data.recursos_humanos;
          const cb = data.condiciones_basicas;
          const pr = data.proyecto;

          const patchValues: Record<string, any> = {};

          // Institución
          if (ie) {
            patchValues['nombre_ie'] = ie.nombre_ie || '';
            patchValues['nivel'] = ie.nivel || '';
            patchValues['provincia'] = ie.provincia || '';
            patchValues['distrito'] = ie.distrito || '';
            patchValues['coord_lat'] = Number(ie.coord_lat) || 0;
            patchValues['coord_long'] = Number(ie.coord_long) || 0;
            patchValues['total_estudiantes'] = ie.total_estudiantes || 0;
          }

          // Equipamiento
          if (eq) {
            patchValues['mobiliario_optimo_porc'] = Number(eq.mobiliario_optimo_porc) || 0;
            patchValues['computadoras_total'] = eq.computadoras_total ?? 0;
            patchValues['tiene_internet'] = eq.tiene_internet ? 'SI' : '';
            patchValues['tiene_laboratorio'] = eq.tiene_laboratorio ? 'SI' : '';
          }

          // Recursos Humanos
          if (rh) {
            patchValues['docentes_requeridos'] = rh.docentes_requeridos ?? 0;
            patchValues['docentes_asignados'] = rh.docentes_asignados ?? 0;
            patchValues['personal_administrativo'] = rh.personal_administrativo ?? 0;
          }

          // Condiciones Básicas
          if (cb) {
            patchValues['servicio_agua'] = cb.servicio_agua ? 'SI' : '';
            patchValues['servicio_desague'] = cb.servicio_desague ? 'SI' : '';
            patchValues['servicio_electricidad'] = cb.servicio_electricidad ? 'SI' : '';
            patchValues['estado_critico_infra'] = cb.estado_critico_infra ? 'SI' : '';
          }

          // Proyecto de Infraestructura
          if (pr) {
            patchValues['id_proyecto'] = pr.id_proyecto ?? 0;
            patchValues['estado_proyecto'] = pr.estado_proyecto || '';
            patchValues['tipo_obra'] = pr.tipo_obra || '';
            patchValues['unidad_ejecutora'] = pr.unidad_ejecutora || '';
            patchValues['avance_fisico'] = Number(pr.avance_fisico) || 0;
            patchValues['avance_financiero'] = Number(pr.avance_financiero) || 0;
            patchValues['monto_total'] = Number(pr.monto_total) || 0;
            patchValues['monto_devengado'] = Number(pr.monto_devengado) || 0;
          }

          this.form.patchValue(patchValues);
        },

        error: (err) => {
          console.error(err);
          if (err?.status === 404) {
            this.codModularMensaje = 'Institución no existe, se registrará nueva institución.';
            this.limpiarDatosInstitucion();
            const control404 = this.form.get('cod_modular');
            const v404 = control404?.value;
            if (control404 && /^\d{1,8}$/.test(String(v404))) {
              control404.setErrors(null);
            }
            return;
          }
          this.codModularMensaje = 'Error al consultar la institución.';
        },
      });
  }

  handleIdInput(): void {
    this.codModularMensaje = '';
    const control = this.form.get('cod_modular');
    const val = control?.value;
    if (control && /^\d{1,8}$/.test(String(val))) {
      control.setErrors(null);
    }
  }

  private validarCamposObligatorios(): { valido: boolean; camposFaltantes: string[] } {
    const camposFaltantes: string[] = [];

    // Validar Institución - TODOS deben estar llenos
    const camposInstitucion = [
      'cod_modular',
      'nombre_ie',
      'nivel',
      'provincia',
      'distrito',
    ];
    for (const campo of camposInstitucion) {
      const control = this.form.get(campo);
      const value = control?.value;
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        camposFaltantes.push(campo);
        control?.markAsTouched();
        control?.setErrors({ required: true });
      }
    }

    // Validar Proyecto - estado_proyecto debe tener selección
    const estProyecto = this.form.get('estado_proyecto');
    if (!estProyecto?.value || estProyecto.value.trim() === '') {
      camposFaltantes.push('estado_proyecto');
      estProyecto?.markAsTouched();
      estProyecto?.setErrors({ required: true });
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

    const dto: CrearEducacionDTO = {
      cod_modular: Number(rawValues.cod_modular),
      nombre_ie: rawValues.nombre_ie || '',
      nivel: rawValues.nivel || '',
      provincia: rawValues.provincia || '',
      distrito: rawValues.distrito || '',
      coord_lat: Number(rawValues.coord_lat),
      coord_long: Number(rawValues.coord_long),
      total_estudiantes: Number(rawValues.total_estudiantes),
      id_proyecto: Number(rawValues.id_proyecto),
      estado_proyecto: rawValues.estado_proyecto || '',
      tipo_obra: rawValues.tipo_obra || '',
      unidad_ejecutora: rawValues.unidad_ejecutora || '',
      avance_fisico: Number(rawValues.avance_fisico),
      avance_financiero: Number(rawValues.avance_financiero),
      monto_total: Number(rawValues.monto_total),
      monto_devengado: Number(rawValues.monto_devengado),
      mobiliario_optimo_porc: Number(rawValues.mobiliario_optimo_porc),
      computadoras_total: Number(rawValues.computadoras_total),
      tiene_internet: this.parseBoolean(rawValues.tiene_internet),
      tiene_laboratorio: this.parseBoolean(rawValues.tiene_laboratorio),
      docentes_requeridos: Number(rawValues.docentes_requeridos),
      docentes_asignados: Number(rawValues.docentes_asignados),
      personal_administrativo: Number(rawValues.personal_administrativo),
      servicio_agua: this.parseBoolean(rawValues.servicio_agua),
      servicio_desague: this.parseBoolean(rawValues.servicio_desague),
      servicio_electricidad: this.parseBoolean(rawValues.servicio_electricidad),
      estado_critico_infra: this.parseBoolean(rawValues.estado_critico_infra),
      fecha_corte: fechaCorte,
    };

    this.mensajeGuardado = '';

    this.educacionService.guardarReporteEducacion(dto).subscribe({
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

  private limpiarDatosInstitucion(): void {
    this.form.patchValue({
      nombre_ie: '',
      nivel: '',
      provincia: '',
      distrito: '',
      coord_lat: 0,
      coord_long: 0,
      total_estudiantes: 0,
    });
  }

  limpiarFormulario(): void {

    this.form.reset({

      cod_modular: '',

      nombre_ie: '',

      nivel: '',

      provincia: '',

      distrito: '',

      coord_lat: 0,

      coord_long: 0,

      total_estudiantes: 0,

      id_proyecto: 0,

      estado_proyecto: '',

      tipo_obra: '',

      unidad_ejecutora: '',

      avance_fisico: 0,

      avance_financiero: 0,

      monto_total: 0,

      monto_devengado: 0,

      mobiliario_optimo_porc: 0,

      computadoras_total: 0,

      tiene_internet: '',

      tiene_laboratorio: '',

      docentes_requeridos: 0,

      docentes_asignados: 0,

      personal_administrativo: 0,

      servicio_agua: '',

      servicio_desague: '',

      servicio_electricidad: '',

      estado_critico_infra: '',

      fecha_corte: ''

    });

  }
}