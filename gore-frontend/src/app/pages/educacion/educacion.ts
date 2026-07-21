import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { EducacionService } from '../../services/educacion';
import { AuthService } from '../../services/auth.service';
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
  private authService = inject(AuthService);

  mensajeGuardado = '';
  codModularMensaje = '';

  minDate = this.getTodayString();

  cerrarMensaje(): void {
    this.mensajeGuardado = '';
  }

  form = this.fb.group({
    //==============================
    // IDENTIFICACIÓN DE LA I.E.
    //==============================

    cod_modular: ['', [Validators.required, Validators.pattern(/^\d{1,8}$/)]],

    nombre_ie: [''],

    dre: ['LAMBAYEQUE'],

    ugel: ['CHICLAYO'],

    nivel: [''],

    gestion: ['Pública de gestión directa'],

    provincia: [''],

    distrito: [''],

    centro_poblado: [''],

    //==============================
    // PROYECTOS DE INVERSIÓN
    //==============================

    cui_proyecto: [''],

    estado_proyecto: ['Sin Proyecto'],

    avance_fisico: [0, [Validators.min(0), Validators.max(100)]],

    monto_total: [0],

    //==============================
    // INFRAESTRUCTURA Y EQUIPAMIENTO
    //==============================

    estado_infra: [0],

    aulas_buenas: [0],

    mobiliario_optimo_porc: [0, [Validators.min(0), Validators.max(100)]],

    computadoras_total: [0],

    servicio_agua: [false],

    servicio_desague: [false],

    servicio_luz: [false],

    tiene_internet: [false],

    riesgo_critico: [false],

    //==============================
    // PERSONAL DOCENTE Y ADMINISTRATIVO
    //==============================

    total_matricula: [0],

    docentes_requeridos: [0],

    docentes_nombrados: [0],

    docentes_contratados: [0],

    personal_admin: [0],

    tiene_psicologo: ['NO'],

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
    this.form.get('docentes_nombrados')?.valueChanges.subscribe(() => this.checkDocentes());
    this.form.get('docentes_contratados')?.valueChanges.subscribe(() => this.checkDocentes());

    // fecha debe ser mayor a hoy
    this.form.get('fecha_corte')?.valueChanges.subscribe(() => this.checkFecha());
  }

  private checkDocentes(): void {
    const req = Number(this.form.get('docentes_requeridos')?.value) || 0;
    const nombrados = Number(this.form.get('docentes_nombrados')?.value) || 0;
    const contratados = Number(this.form.get('docentes_contratados')?.value) || 0;
    const totalAsignados = nombrados + contratados;
    const control = this.form.get('docentes_requeridos');
    if (totalAsignados > req && req > 0) {
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
            patchValues['total_matricula'] = ie.total_estudiantes || 0;
          }

          // Equipamiento
          if (eq) {
            patchValues['mobiliario_optimo_porc'] = Number(eq.mobiliario_optimo_porc) || 0;
            patchValues['computadoras_total'] = eq.computadoras_total ?? 0;
            patchValues['tiene_internet'] = eq.tiene_internet ? true : false;
          }

          // Recursos Humanos
          if (rh) {
            patchValues['docentes_requeridos'] = rh.docentes_requeridos ?? 0;
            patchValues['docentes_asignados'] = rh.docentes_asignados ?? 0;
            patchValues['personal_administrativo'] = rh.personal_administrativo ?? 0;
          }

          // Condiciones Básicas
          if (cb) {
            patchValues['servicio_agua'] = cb.servicio_agua ? true : false;
            patchValues['servicio_desague'] = cb.servicio_desague ? true : false;
            patchValues['servicio_electricidad'] = cb.servicio_electricidad ? true : false;
            patchValues['estado_critico_infra'] = cb.estado_critico_infra ? true : false;
          }

          // Proyecto de Infraestructura
          if (pr) {
            patchValues['estado_proyecto'] = pr.estado_proyecto || '';
            patchValues['avance_fisico'] = Number(pr.avance_fisico) || 0;
            patchValues['monto_total'] = Number(pr.monto_total) || 0;
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
      dre: rawValues.dre || 'LAMBAYEQUE',
      ugel: rawValues.ugel || 'CHICLAYO',
      nivel: rawValues.nivel || '',
      gestion: rawValues.gestion || 'Pública de gestión directa',
      provincia: rawValues.provincia || '',
      distrito: rawValues.distrito || '',
      centro_poblado: rawValues.centro_poblado || '',
      cui_proyecto: rawValues.cui_proyecto || '',
      estado_proyecto: rawValues.estado_proyecto || 'Sin Proyecto',
      avance_fisico: Number(rawValues.avance_fisico),
      monto_total: Number(rawValues.monto_total),
      estado_infra: Number(rawValues.estado_infra),
      aulas_buenas: Number(rawValues.aulas_buenas),
      mobiliario_optimo_porc: Number(rawValues.mobiliario_optimo_porc),
      computadoras_total: Number(rawValues.computadoras_total),
      servicio_agua: !!rawValues.servicio_agua,
      servicio_desague: !!rawValues.servicio_desague,
      servicio_luz: !!rawValues.servicio_luz,
      tiene_internet: !!rawValues.tiene_internet,
      riesgo_critico: !!rawValues.riesgo_critico,
      total_matricula: Number(rawValues.total_matricula),
      docentes_requeridos: Number(rawValues.docentes_requeridos),
      docentes_nombrados: Number(rawValues.docentes_nombrados),
      docentes_contratados: Number(rawValues.docentes_contratados),
      personal_admin: Number(rawValues.personal_admin),
      tiene_psicologo: rawValues.tiene_psicologo || 'NO',
      fecha_corte: fechaCorte,
      nombre_usuario: this.authService.obtenerUsuario()?.usuario || '',
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
    return value === true || value === 'true' || value === 'SI' || value === 'Si' || value === 'YES' || value === 'yes';
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
      total_matricula: 0,
    });
  }

  limpiarFormulario(): void {
    this.form.reset({
      cod_modular: '',
      nombre_ie: '',
      dre: 'LAMBAYEQUE',
      ugel: 'CHICLAYO',
      nivel: '',
      gestion: 'Pública de gestión directa',
      provincia: '',
      distrito: '',
      centro_poblado: '',
      cui_proyecto: '',
      estado_proyecto: 'Sin Proyecto',
      avance_fisico: 0,
      monto_total: 0,
      estado_infra: 0,
      aulas_buenas: 0,
      mobiliario_optimo_porc: 0,
      computadoras_total: 0,
      servicio_agua: false,
      servicio_desague: false,
      servicio_luz: false,
      tiene_internet: false,
      riesgo_critico: false,
      total_matricula: 0,
      docentes_requeridos: 0,
      docentes_nombrados: 0,
      docentes_contratados: 0,
      personal_admin: 0,
      tiene_psicologo: 'NO',
      fecha_corte: ''
    });
  }
}