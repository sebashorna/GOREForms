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
    // DIV 1 - IDENTIFICACIÓN DE LA INSTITUCIÓN EDUCATIVA
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
    // DIV 2 - PROYECTOS DE INVERSIÓN (INVIERTE.PE)
    //==============================

    cui_proyecto: [''],

    estado_proyecto: [''],

    avance_fisico: [0, [Validators.min(0), Validators.max(100)]],

    monto_total: [0],

    //==============================
    // DIV 3 - INFRAESTRUCTURA Y EQUIPAMIENTO
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
    // DIV 4 - PERSONAL DOCENTE Y ADMINISTRATIVO
    //==============================

    total_matricula: [0],

    docentes_requeridos: [0],

    docentes_nombrados: [0],

    docentes_contratados: [0],

    personal_admin: [0],

    tiene_psicologo: [''],

    //==============================
    // DIV 5 - METADATOS
    //==============================

    fecha_corte: ['', Validators.required],
  });

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
            patchValues['centro_poblado'] = ie.centro_poblado || '';
          }

          // Equipamiento
          if (eq) {
            patchValues['estado_infra'] = Number(eq.estado_infra) || 0;
            patchValues['aulas_buenas'] = Number(eq.aulas_buenas) || 0;
            patchValues['mobiliario_optimo_porc'] = Number(eq.mobiliario_optimo_porc) || 0;
            patchValues['computadoras_total'] = eq.computadoras_total ?? 0;
            patchValues['servicio_agua'] = eq.servicio_agua || false;
            patchValues['servicio_desague'] = eq.servicio_desague || false;
            patchValues['servicio_luz'] = eq.servicio_luz || false;
            patchValues['tiene_internet'] = eq.tiene_internet || false;
            patchValues['riesgo_critico'] = eq.riesgo_critico || false;
          }

          // Recursos Humanos
          if (rh) {
            patchValues['total_matricula'] = rh.total_matricula ?? 0;
            patchValues['docentes_requeridos'] = rh.docentes_requeridos ?? 0;
            patchValues['docentes_nombrados'] = rh.docentes_nombrados ?? 0;
            patchValues['docentes_contratados'] = rh.docentes_contratados ?? 0;
            patchValues['personal_admin'] = rh.personal_administrativo ?? 0;
            patchValues['tiene_psicologo'] = rh.tiene_psicologo ? 'SI' : '';
          }

          // Condiciones Básicas (ya incluidas en equipamiento)

          // Proyecto de Infraestructura
          if (pr) {
            patchValues['cui_proyecto'] = pr.cui_proyecto || '';
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
      estado_proyecto: rawValues.estado_proyecto || '',
      avance_fisico: Number(rawValues.avance_fisico),
      monto_total: Number(rawValues.monto_total),
      estado_infra: Number(rawValues.estado_infra),
      aulas_buenas: Number(rawValues.aulas_buenas),
      mobiliario_optimo_porc: Number(rawValues.mobiliario_optimo_porc),
      computadoras_total: Number(rawValues.computadoras_total),
      servicio_agua: rawValues.servicio_agua || false,
      servicio_desague: rawValues.servicio_desague || false,
      servicio_luz: rawValues.servicio_luz || false,
      tiene_internet: rawValues.tiene_internet || false,
      riesgo_critico: rawValues.riesgo_critico || false,
      total_matricula: Number(rawValues.total_matricula),
      docentes_requeridos: Number(rawValues.docentes_requeridos),
      docentes_nombrados: Number(rawValues.docentes_nombrados),
      docentes_contratados: Number(rawValues.docentes_contratados),
      personal_admin: Number(rawValues.personal_admin),
      tiene_psicologo: rawValues.tiene_psicologo === 'SI',
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
      centro_poblado: '',
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
      estado_proyecto: '',
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
      tiene_psicologo: '',
      fecha_corte: '',
    });
  }
}