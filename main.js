import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/main.js");var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/main.ts
import { bootstrapApplication } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_platform-browser.js?v=e10ab860";

// src/app/app.config.ts
import { provideBrowserGlobalErrorListeners } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { provideRouter } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";
import { provideHttpClient } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common_http.js?v=e10ab860";

// src/app/pages/login/login.ts
import { Component } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { FormsModule } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";
import * as i02 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";

// src/app/services/auth.service.ts
var auth_service_exports = {};
__export(auth_service_exports, {
  AuthService: () => AuthService
});
import { Injectable } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { BehaviorSubject, of, throwError } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/rxjs.js?v=e10ab860";
import { tap, catchError, map } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/rxjs_operators.js?v=e10ab860";
import * as i0 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i1 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common_http.js?v=e10ab860";
var AuthService = class _AuthService {
  http;
  apiUrl = "http://192.168.2.194:3000/api/auth";
  usuarioSubject = new BehaviorSubject(null);
  usuario$ = this.usuarioSubject.asObservable();
  constructor(http) {
    this.http = http;
    this.cargarUsuario();
  }
  login(usuario, password, recordar = false) {
    return this.http.post(`${this.apiUrl}/login`, { usuario, password, recordar }).pipe(
      map((response) => response.data),
      // Extraer el data del wrapper { success, data, message }
      tap((response) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
          if (recordar) {
            localStorage.setItem("usuario_recordado", usuario);
          } else {
            localStorage.removeItem("usuario_recordado");
          }
          this.usuarioSubject.next(response.usuario);
        } else if (response.requiere_2fa) {
          this.usuarioSubject.next(response.usuario);
        }
      }),
      catchError((error) => {
        console.error("Error login:", error);
        let message = "Error al iniciar sesi\xF3n";
        if (error.error?.message) {
          message = error.error.message;
        } else if (typeof error.error === "string") {
          try {
            const parsed = JSON.parse(error.error);
            message = parsed.message || message;
          } catch {
            message = error.error || message;
          }
        } else if (error.message) {
          message = error.message;
        }
        return throwError(() => new Error(message));
      })
    );
  }
  verify2FA(id_usuario, codigo) {
    return this.http.post(`${this.apiUrl}/verify-2fa`, { id_usuario, codigo }).pipe(map((response) => response.data), tap((response) => {
      if (response.token) {
        localStorage.setItem("token", response.token);
        this.usuarioSubject.next(response.usuario);
      }
    }), catchError((error) => {
      console.error("Error 2FA:", error);
      let message = "C\xF3digo 2FA inv\xE1lido";
      if (error.error?.message) {
        message = error.error.message;
      } else if (typeof error.error === "string") {
        try {
          const parsed = JSON.parse(error.error);
          message = parsed.message || message;
        } catch {
          message = error.error || message;
        }
      } else if (error.message) {
        message = error.message;
      }
      return throwError(() => new Error(message));
    }));
  }
  logout() {
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario_recordado");
    this.usuarioSubject.next(null);
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe();
    }
    return of(null);
  }
  obtenerUsuarioActual() {
    const token = localStorage.getItem("token");
    if (!token) {
      return throwError(() => new Error("No autenticado"));
    }
    return this.http.get(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(map((response) => response.data), tap((usuario) => this.usuarioSubject.next(usuario)), catchError(() => {
      localStorage.removeItem("token");
      this.usuarioSubject.next(null);
      return throwError(() => new Error("Token inv\xE1lido"));
    }));
  }
  estaAutenticado() {
    const token = localStorage.getItem("token");
    if (!token)
      return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1e3;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }
  obtenerUsuario() {
    return this.usuarioSubject.value;
  }
  obtenerUsuarioRecordado() {
    return localStorage.getItem("usuario_recordado");
  }
  cargarUsuario() {
    const token = localStorage.getItem("token");
    if (token && this.estaAutenticado()) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        this.usuarioSubject.next({
          id_usuario: payload.id_usuario,
          usuario: payload.usuario,
          correo: "",
          rol: payload.rol
        });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }
  getToken() {
    return localStorage.getItem("token");
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)(i0.\u0275\u0275inject(i1.HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: i1.HttpClient }], null);
})();

// src/app/pages/login/login.ts
import * as i2 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";
import * as i3 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";
function Login_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "div", 4);
    i02.\u0275\u0275text(1);
    i02.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function Login_Conditional_10_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "div", 8);
    i02.\u0275\u0275text(1);
    i02.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext(2);
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.usuarioError, " ");
  }
}
function Login_Conditional_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "div", 8);
    i02.\u0275\u0275text(1);
    i02.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext(2);
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.passwordError, " ");
  }
}
function Login_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = i02.\u0275\u0275getCurrentView();
    i02.\u0275\u0275elementStart(0, "div", 5)(1, "label", 6);
    i02.\u0275\u0275text(2, " Usuario ");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(3, "input", 7);
    i02.\u0275\u0275twoWayListener("ngModelChange", function Login_Conditional_10_Template_input_ngModelChange_3_listener($event) {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      i02.\u0275\u0275twoWayBindingSet(ctx_r0.usuario, $event) || (ctx_r0.usuario = $event);
      return i02.\u0275\u0275resetView($event);
    });
    i02.\u0275\u0275listener("input", function Login_Conditional_10_Template_input_input_3_listener() {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r0.limpiarErrorUsuario());
    });
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275controlCreate();
    i02.\u0275\u0275conditionalCreate(4, Login_Conditional_10_Conditional_4_Template, 2, 1, "div", 8);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(5, "div", 9)(6, "label", 6);
    i02.\u0275\u0275text(7, " Contrase\xF1a ");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(8, "input", 10);
    i02.\u0275\u0275twoWayListener("ngModelChange", function Login_Conditional_10_Template_input_ngModelChange_8_listener($event) {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      i02.\u0275\u0275twoWayBindingSet(ctx_r0.password, $event) || (ctx_r0.password = $event);
      return i02.\u0275\u0275resetView($event);
    });
    i02.\u0275\u0275listener("input", function Login_Conditional_10_Template_input_input_8_listener() {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r0.limpiarErrorPassword());
    });
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275controlCreate();
    i02.\u0275\u0275conditionalCreate(9, Login_Conditional_10_Conditional_9_Template, 2, 1, "div", 8);
    i02.\u0275\u0275elementStart(10, "button", 11);
    i02.\u0275\u0275listener("click", function Login_Conditional_10_Template_button_click_10_listener() {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r0.togglePassword());
    });
    i02.\u0275\u0275text(11);
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(12, "div", 12)(13, "input", 13);
    i02.\u0275\u0275twoWayListener("ngModelChange", function Login_Conditional_10_Template_input_ngModelChange_13_listener($event) {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      i02.\u0275\u0275twoWayBindingSet(ctx_r0.recordar, $event) || (ctx_r0.recordar = $event);
      return i02.\u0275\u0275resetView($event);
    });
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275controlCreate();
    i02.\u0275\u0275elementStart(14, "label", 14);
    i02.\u0275\u0275text(15, " Recordarme ");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(16, "button", 15);
    i02.\u0275\u0275listener("click", function Login_Conditional_10_Template_button_click_16_listener() {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r0.ingresar());
    });
    i02.\u0275\u0275text(17);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(18, "div", 16)(19, "a", 17);
    i02.\u0275\u0275listener("click", function Login_Conditional_10_Template_a_click_19_listener($event) {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      ctx_r0.olvidastePassword();
      return i02.\u0275\u0275resetView($event.preventDefault());
    });
    i02.\u0275\u0275text(20, " \xBFOlvidaste tu contrase\xF1a? ");
    i02.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance(3);
    i02.\u0275\u0275classProp("is-invalid", ctx_r0.usuarioInvalido);
    i02.\u0275\u0275twoWayProperty("ngModel", ctx_r0.usuario);
    i02.\u0275\u0275control();
    i02.\u0275\u0275advance();
    i02.\u0275\u0275conditional(ctx_r0.usuarioError ? 4 : -1);
    i02.\u0275\u0275advance(4);
    i02.\u0275\u0275classProp("is-invalid", ctx_r0.passwordInvalido);
    i02.\u0275\u0275property("type", ctx_r0.mostrarPassword ? "text" : "password");
    i02.\u0275\u0275twoWayProperty("ngModel", ctx_r0.password);
    i02.\u0275\u0275control();
    i02.\u0275\u0275advance();
    i02.\u0275\u0275conditional(ctx_r0.passwordError ? 9 : -1);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.mostrarPassword ? "\u{1F441}\uFE0F" : "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F", " ");
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275twoWayProperty("ngModel", ctx_r0.recordar);
    i02.\u0275\u0275control();
    i02.\u0275\u0275advance(3);
    i02.\u0275\u0275property("disabled", ctx_r0.cargando);
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.cargando ? "Cargando..." : "Ingresar", " ");
  }
}
function Login_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = i02.\u0275\u0275getCurrentView();
    i02.\u0275\u0275elementStart(0, "div", 18)(1, "button", 19);
    i02.\u0275\u0275listener("click", function Login_Conditional_11_Template_button_click_1_listener() {
      i02.\u0275\u0275restoreView(_r3);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r0.volverALogin());
    });
    i02.\u0275\u0275text(2, " \u2190 Volver ");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(3, "div", 20)(4, "strong");
    i02.\u0275\u0275text(5, "Verificaci\xF3n de dos factores");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275element(6, "br");
    i02.\u0275\u0275text(7, " Ingrese el c\xF3digo enviado a su dispositivo. ");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(8, "div", 5)(9, "label", 6);
    i02.\u0275\u0275text(10, " C\xF3digo de verificaci\xF3n ");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(11, "input", 21);
    i02.\u0275\u0275twoWayListener("ngModelChange", function Login_Conditional_11_Template_input_ngModelChange_11_listener($event) {
      i02.\u0275\u0275restoreView(_r3);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      i02.\u0275\u0275twoWayBindingSet(ctx_r0.codigo2FA, $event) || (ctx_r0.codigo2FA = $event);
      return i02.\u0275\u0275resetView($event);
    });
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275controlCreate();
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(12, "button", 15);
    i02.\u0275\u0275listener("click", function Login_Conditional_11_Template_button_click_12_listener() {
      i02.\u0275\u0275restoreView(_r3);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r0.verificar2FA());
    });
    i02.\u0275\u0275text(13);
    i02.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance(11);
    i02.\u0275\u0275twoWayProperty("ngModel", ctx_r0.codigo2FA);
    i02.\u0275\u0275control();
    i02.\u0275\u0275advance();
    i02.\u0275\u0275property("disabled", ctx_r0.cargando);
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.cargando ? "Verificando..." : "Verificar", " ");
  }
}
var Login = class _Login {
  authService;
  router;
  cdr;
  usuario = "";
  password = "";
  mostrarPassword = false;
  recordar = false;
  cargando = false;
  error = "";
  // Validaciones
  usuarioInvalido = false;
  passwordInvalido = false;
  usuarioError = "";
  passwordError = "";
  // 2FA
  mostrar2FA = false;
  codigo2FA = "";
  idUsuario2FA = null;
  constructor(authService, router, cdr) {
    this.authService = authService;
    this.router = router;
    this.cdr = cdr;
  }
  ngOnInit() {
    const usuarioRecordado = this.authService.obtenerUsuarioRecordado();
    if (usuarioRecordado) {
      this.usuario = usuarioRecordado;
      this.recordar = true;
    }
    if (this.authService.estaAutenticado()) {
      this.router.navigate(["/dashboard"]);
    }
  }
  ingresar() {
    this.error = "";
    this.usuarioInvalido = false;
    this.passwordInvalido = false;
    this.usuarioError = "";
    this.passwordError = "";
    let valido = true;
    if (!this.usuario || this.usuario.trim() === "") {
      this.usuarioInvalido = true;
      this.usuarioError = "El usuario es obligatorio";
      valido = false;
    }
    if (!this.password || this.password.trim() === "") {
      this.passwordInvalido = true;
      this.passwordError = "La contrase\xF1a es obligatoria";
      valido = false;
    }
    if (!valido) {
      return;
    }
    this.cargando = true;
    this.authService.login(this.usuario, this.password, this.recordar).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.requiere_2fa) {
          this.mostrar2FA = true;
          this.idUsuario2FA = response.id_usuario || null;
          this.cdr.detectChanges();
        } else {
          this.router.navigate(["/dashboard"]);
        }
      },
      error: (error) => {
        this.cargando = false;
        this.error = error.message || "Error al iniciar sesi\xF3n";
        this.cdr.detectChanges();
      }
    });
  }
  verificar2FA() {
    this.error = "";
    this.cargando = true;
    if (!this.idUsuario2FA || !this.codigo2FA) {
      this.error = "Ingrese el c\xF3digo de verificaci\xF3n";
      this.cargando = false;
      return;
    }
    this.authService.verify2FA(this.idUsuario2FA, this.codigo2FA).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(["/dashboard"]);
      },
      error: (error) => {
        this.cargando = false;
        this.error = error.message || "C\xF3digo 2FA inv\xE1lido";
        this.cdr.detectChanges();
      }
    });
  }
  volverALogin() {
    this.mostrar2FA = false;
    this.codigo2FA = "";
    this.error = "";
    this.cargando = false;
  }
  limpiarErrorUsuario() {
    this.usuarioInvalido = false;
    this.usuarioError = "";
  }
  limpiarErrorPassword() {
    this.passwordInvalido = false;
    this.passwordError = "";
  }
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  olvidastePassword() {
    alert("Contacte al administrador del sistema para recuperar su contrase\xF1a.");
  }
  static \u0275fac = function Login_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Login)(i02.\u0275\u0275directiveInject(AuthService), i02.\u0275\u0275directiveInject(i2.Router), i02.\u0275\u0275directiveInject(i02.ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ i02.\u0275\u0275defineComponent({ type: _Login, selectors: [["app-login"]], decls: 14, vars: 3, consts: [[1, "login-container"], [1, "login-card"], ["src", "images/logo-gore.jpeg", "alt", "Gobierno Regional de Lambayeque", 1, "logo"], [1, "linea"], ["role", "alert", 1, "alert", "alert-danger"], [1, "mb-3"], [1, "form-label"], ["type", "text", "placeholder", "Ingrese su usuario", "name", "usuario", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "invalid-feedback"], [1, "mb-3", "position-relative"], ["placeholder", "Ingrese su contrase\xF1a", "name", "password", 1, "form-control", 3, "ngModelChange", "input", "type", "ngModel"], ["type", "button", 1, "btn-toggle-password", 3, "click"], [1, "mb-3", "form-check"], ["type", "checkbox", "id", "recordar", "name", "recordar", 1, "form-check-input", 3, "ngModelChange", "ngModel"], ["for", "recordar", 1, "form-check-label"], ["type", "button", 1, "btn", "btn-login", "w-100", 3, "click", "disabled"], [1, "mt-3", "text-center"], ["href", "#", 3, "click"], [1, "btn-volver-container"], ["type", "button", 1, "btn-volver", 3, "click"], ["role", "alert", 1, "alert", "alert-info"], ["type", "text", "placeholder", "Ingrese el c\xF3digo de 6 d\xEDgitos", "maxlength", "6", "name", "codigo2FA", 1, "form-control", 3, "ngModelChange", "ngModel"]], template: function Login_Template(rf, ctx) {
    if (rf & 1) {
      i02.\u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      i02.\u0275\u0275element(2, "img", 2);
      i02.\u0275\u0275elementStart(3, "h2");
      i02.\u0275\u0275text(4, "Gobierno Regional de Lambayeque");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(5, "p");
      i02.\u0275\u0275text(6, "Sistema de Seguimiento de Proyectos");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275element(7, "div", 3);
      i02.\u0275\u0275conditionalCreate(8, Login_Conditional_8_Template, 2, 1, "div", 4);
      i02.\u0275\u0275elementStart(9, "form");
      i02.\u0275\u0275conditionalCreate(10, Login_Conditional_10_Template, 21, 13);
      i02.\u0275\u0275conditionalCreate(11, Login_Conditional_11_Template, 14, 3);
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(12, "small");
      i02.\u0275\u0275text(13, " \xA9 Gobierno Regional de Lambayeque ");
      i02.\u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      i02.\u0275\u0275advance(8);
      i02.\u0275\u0275conditional(ctx.error ? 8 : -1);
      i02.\u0275\u0275advance(2);
      i02.\u0275\u0275conditional(!ctx.mostrar2FA ? 10 : -1);
      i02.\u0275\u0275advance();
      i02.\u0275\u0275conditional(ctx.mostrar2FA ? 11 : -1);
    }
  }, dependencies: [FormsModule, i3.\u0275NgNoValidate, i3.NgSelectOption, i3.\u0275NgSelectMultipleOption, i3.DefaultValueAccessor, i3.NumberValueAccessor, i3.RangeValueAccessor, i3.CheckboxControlValueAccessor, i3.SelectControlValueAccessor, i3.SelectMultipleControlValueAccessor, i3.RadioControlValueAccessor, i3.NgControlStatus, i3.NgControlStatusGroup, i3.RequiredValidator, i3.MinLengthValidator, i3.MaxLengthValidator, i3.PatternValidator, i3.CheckboxRequiredValidator, i3.EmailValidator, i3.MinValidator, i3.MaxValidator, i3.NgModel, i3.NgModelGroup, i3.NgForm], styles: ["\n.login-container[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 30px;\n  background:\n    linear-gradient(\n      180deg,\n      #F8F9FB 0%,\n      #EEF2F7 100%);\n}\n.login-card[_ngcontent-%COMP%] {\n  width: 430px;\n  background: #FFFFFF;\n  padding: 45px;\n  border-radius: 20px;\n  box-shadow: 0 15px 40px rgba(0, 0, 0, .08);\n  text-align: center;\n}\n.logo[_ngcontent-%COMP%] {\n  width: 105px;\n  margin-bottom: 20px;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.login-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #571414;\n  font-weight: 700;\n  font-size: 2rem;\n  margin-bottom: 8px;\n}\n.login-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 1.05rem;\n  margin-bottom: 18px;\n}\n.linea[_ngcontent-%COMP%] {\n  width: 90px;\n  height: 4px;\n  background: #E68F1B;\n  margin: 20px auto 35px;\n  border-radius: 20px;\n}\nform[_ngcontent-%COMP%] {\n  margin-top: 10px;\n}\n.form-label[_ngcontent-%COMP%] {\n  display: block;\n  text-align: left;\n  color: #555;\n  font-weight: 600;\n  margin-bottom: 8px;\n}\n.form-control[_ngcontent-%COMP%] {\n  height: 52px;\n  border-radius: 12px;\n  border: 1px solid #D8D8D8;\n  background: #FAFAFA;\n  padding: 0 50px 0 16px;\n  font-size: 15px;\n  box-shadow: none;\n  transition: all .25s ease;\n  width: 100%;\n}\n.form-control[_ngcontent-%COMP%]::placeholder {\n  color: #A0A0A0;\n}\n.form-control[_ngcontent-%COMP%]:focus {\n  background: #FFFFFF;\n  border-color: #571414;\n  box-shadow: 0 0 0 .2rem rgba(87, 20, 20, .15);\n}\n.form-control.is-invalid[_ngcontent-%COMP%] {\n  border-color: #dc3545;\n  background: #fff5f5;\n}\n.form-control.is-invalid[_ngcontent-%COMP%]:focus {\n  border-color: #dc3545;\n  box-shadow: 0 0 0 .2rem rgba(220, 53, 69, .15);\n}\n.invalid-feedback[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  margin-top: 5px;\n  font-size: .85rem;\n  color: #dc3545;\n  text-align: left;\n  font-weight: 500;\n}\n.btn-login[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 52px;\n  margin-top: 10px;\n  border: none;\n  border-radius: 12px;\n  background: #571414;\n  color: #FFFFFF;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all .25s ease;\n}\n.btn-login[_ngcontent-%COMP%]:hover {\n  background: #451010;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(87, 20, 20, .25);\n}\n.btn-login[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\nsmall[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 30px;\n  color: #888;\n  font-size: .9rem;\n}\n.btn-toggle-password[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 15px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: none;\n  border: none;\n  font-size: 1.2rem;\n  cursor: pointer;\n  padding: 5px;\n  opacity: 0.6;\n  transition: opacity .2s;\n  z-index: 10;\n}\n.position-relative[_ngcontent-%COMP%] {\n  position: relative !important;\n}\n.btn-toggle-password[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\na[_ngcontent-%COMP%] {\n  color: #571414;\n  text-decoration: none;\n  font-weight: 600;\n  font-size: .95rem;\n}\na[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.btn-volver-container[_ngcontent-%COMP%] {\n  text-align: left;\n  margin-bottom: 10px;\n}\n.btn-volver[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #571414;\n  font-size: 0.95rem;\n  font-weight: 600;\n  cursor: pointer;\n  padding: 5px 0;\n  transition: opacity 0.2s;\n}\n.btn-volver[_ngcontent-%COMP%]:hover {\n  opacity: 0.7;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  font-size: .95rem;\n}\n.alert-danger[_ngcontent-%COMP%] {\n  background: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n}\n.alert-info[_ngcontent-%COMP%] {\n  background: #d1ecf1;\n  color: #0c5460;\n  border: 1px solid #bee5eb;\n}\n/*# sourceMappingURL=login.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(Login, [{
    type: Component,
    args: [{ selector: "app-login", imports: [FormsModule], template: `<div class="login-container">

    <div class="login-card">

        <img
            src="images/logo-gore.jpeg"
            alt="Gobierno Regional de Lambayeque"
            class="logo">

        <h2>Gobierno Regional de Lambayeque</h2>

        <p>Sistema de Seguimiento de Proyectos</p>

        <div class="linea"></div>

        <!-- Error message -->
        @if(error){
            <div class="alert alert-danger" role="alert">
                {{ error }}
            </div>
        }

        <form>

            <!-- Formulario de Login -->
            @if(!mostrar2FA){

                <div class="mb-3">

                    <label class="form-label">

                        Usuario

                    </label>

                    <input
                        type="text"
                        class="form-control"
                        [class.is-invalid]="usuarioInvalido"
                        placeholder="Ingrese su usuario"
                        [(ngModel)]="usuario"
                        name="usuario"
                        (input)="limpiarErrorUsuario()">

                    @if(usuarioError){
                        <div class="invalid-feedback">
                            {{ usuarioError }}
                        </div>
                    }

                </div>

                <div class="mb-3 position-relative">

                    <label class="form-label">

                        Contrase\xF1a

                    </label>

                    <input
                        [type]="mostrarPassword ? 'text' : 'password'"
                        class="form-control"
                        [class.is-invalid]="passwordInvalido"
                        placeholder="Ingrese su contrase\xF1a"
                        [(ngModel)]="password"
                        name="password"
                        (input)="limpiarErrorPassword()">

                    @if(passwordError){
                        <div class="invalid-feedback">
                            {{ passwordError }}
                        </div>
                    }

                    <button
                        type="button"
                        class="btn-toggle-password"
                        (click)="togglePassword()">

                        {{ mostrarPassword ? '\u{1F441}\uFE0F' : '\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F' }}

                    </button>

                </div>

                <div class="mb-3 form-check">

                    <input
                        type="checkbox"
                        class="form-check-input"
                        id="recordar"
                        [(ngModel)]="recordar"
                        name="recordar">

                    <label class="form-check-label" for="recordar">

                        Recordarme

                    </label>

                </div>

                <button
                    class="btn btn-login w-100"
                    type="button"
                    (click)="ingresar()"
                    [disabled]="cargando">

                    {{ cargando ? 'Cargando...' : 'Ingresar' }}

                </button>

                <div class="mt-3 text-center">

                    <a href="#" (click)="olvidastePassword(); $event.preventDefault()">

                        \xBFOlvidaste tu contrase\xF1a?

                    </a>

                </div>

            }

            <!-- Formulario 2FA -->
            @if(mostrar2FA){

                <div class="btn-volver-container">
                    <button type="button" class="btn-volver" (click)="volverALogin()">
                        \u2190 Volver
                    </button>
                </div>

                <div class="alert alert-info" role="alert">

                    <strong>Verificaci\xF3n de dos factores</strong><br>

                    Ingrese el c\xF3digo enviado a su dispositivo.

                </div>

                <div class="mb-3">

                    <label class="form-label">

                        C\xF3digo de verificaci\xF3n

                    </label>

                    <input
                        type="text"
                        class="form-control"
                        placeholder="Ingrese el c\xF3digo de 6 d\xEDgitos"
                        maxlength="6"
                        [(ngModel)]="codigo2FA"
                        name="codigo2FA">

                </div>

                <button
                    class="btn btn-login w-100"
                    type="button"
                    (click)="verificar2FA()"
                    [disabled]="cargando">

                    {{ cargando ? 'Verificando...' : 'Verificar' }}

                </button>

            }

        </form>

        <small>

            \xA9 Gobierno Regional de Lambayeque

        </small>

    </div>

</div>`, styles: ["/* src/app/pages/login/login.css */\n.login-container {\n  min-height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 30px;\n  background:\n    linear-gradient(\n      180deg,\n      #F8F9FB 0%,\n      #EEF2F7 100%);\n}\n.login-card {\n  width: 430px;\n  background: #FFFFFF;\n  padding: 45px;\n  border-radius: 20px;\n  box-shadow: 0 15px 40px rgba(0, 0, 0, .08);\n  text-align: center;\n}\n.logo {\n  width: 105px;\n  margin-bottom: 20px;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.login-card h2 {\n  color: #571414;\n  font-weight: 700;\n  font-size: 2rem;\n  margin-bottom: 8px;\n}\n.login-card p {\n  color: #666;\n  font-size: 1.05rem;\n  margin-bottom: 18px;\n}\n.linea {\n  width: 90px;\n  height: 4px;\n  background: #E68F1B;\n  margin: 20px auto 35px;\n  border-radius: 20px;\n}\nform {\n  margin-top: 10px;\n}\n.form-label {\n  display: block;\n  text-align: left;\n  color: #555;\n  font-weight: 600;\n  margin-bottom: 8px;\n}\n.form-control {\n  height: 52px;\n  border-radius: 12px;\n  border: 1px solid #D8D8D8;\n  background: #FAFAFA;\n  padding: 0 50px 0 16px;\n  font-size: 15px;\n  box-shadow: none;\n  transition: all .25s ease;\n  width: 100%;\n}\n.form-control::placeholder {\n  color: #A0A0A0;\n}\n.form-control:focus {\n  background: #FFFFFF;\n  border-color: #571414;\n  box-shadow: 0 0 0 .2rem rgba(87, 20, 20, .15);\n}\n.form-control.is-invalid {\n  border-color: #dc3545;\n  background: #fff5f5;\n}\n.form-control.is-invalid:focus {\n  border-color: #dc3545;\n  box-shadow: 0 0 0 .2rem rgba(220, 53, 69, .15);\n}\n.invalid-feedback {\n  display: block;\n  width: 100%;\n  margin-top: 5px;\n  font-size: .85rem;\n  color: #dc3545;\n  text-align: left;\n  font-weight: 500;\n}\n.btn-login {\n  width: 100%;\n  height: 52px;\n  margin-top: 10px;\n  border: none;\n  border-radius: 12px;\n  background: #571414;\n  color: #FFFFFF;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all .25s ease;\n}\n.btn-login:hover {\n  background: #451010;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(87, 20, 20, .25);\n}\n.btn-login:active {\n  transform: translateY(0);\n}\nsmall {\n  display: block;\n  margin-top: 30px;\n  color: #888;\n  font-size: .9rem;\n}\n.btn-toggle-password {\n  position: absolute;\n  right: 15px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: none;\n  border: none;\n  font-size: 1.2rem;\n  cursor: pointer;\n  padding: 5px;\n  opacity: 0.6;\n  transition: opacity .2s;\n  z-index: 10;\n}\n.position-relative {\n  position: relative !important;\n}\n.btn-toggle-password:hover {\n  opacity: 1;\n}\na {\n  color: #571414;\n  text-decoration: none;\n  font-weight: 600;\n  font-size: .95rem;\n}\na:hover {\n  text-decoration: underline;\n}\n.btn-volver-container {\n  text-align: left;\n  margin-bottom: 10px;\n}\n.btn-volver {\n  background: none;\n  border: none;\n  color: #571414;\n  font-size: 0.95rem;\n  font-weight: 600;\n  cursor: pointer;\n  padding: 5px 0;\n  transition: opacity 0.2s;\n}\n.btn-volver:hover {\n  opacity: 0.7;\n}\n.alert {\n  padding: 12px 16px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  font-size: .95rem;\n}\n.alert-danger {\n  background: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n}\n.alert-info {\n  background: #d1ecf1;\n  color: #0c5460;\n  border: 1px solid #bee5eb;\n}\n/*# sourceMappingURL=login.css.map */\n"] }]
  }], () => [{ type: AuthService }, { type: i2.Router }, { type: i02.ChangeDetectorRef }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassDebugInfo(Login, { className: "Login", filePath: "src/app/pages/login/login.ts", lineNumber: 12 });
})();
(() => {
  const id = "src%2Fapp%2Fpages%2Flogin%2Flogin.ts%40Login";
  function Login_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i02.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i02.\u0275\u0275replaceMetadata(Login, m.default, [i02, i3, auth_service_exports, i2], [FormsModule, Component], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && Login_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && Login_HmrLoad(d.timestamp)));
})();

// src/app/pages/dashboard/dashboard.ts
import { Component as Component2, inject as inject2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";

// src/app/services/dashboard.ts
import { Injectable as Injectable2, inject } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { HttpClient as HttpClient2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common_http.js?v=e10ab860";
import * as i03 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
var DashboardService = class _DashboardService {
  http = inject(HttpClient2);
  api = "http://192.168.2.194:3000/api/dashboard";
  obtenerResumen() {
    return this.http.get(`${this.api}/resumen`);
  }
  static \u0275fac = function DashboardService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardService)();
  };
  static \u0275prov = /* @__PURE__ */ i03.\u0275\u0275defineInjectable({ token: _DashboardService, factory: _DashboardService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(DashboardService, [{
    type: Injectable2,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/pages/dashboard/dashboard.ts
import * as i04 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
var Dashboard = class _Dashboard {
  dashboardService = inject2(DashboardService);
  totalProyectos = 0;
  ultimoRegistro = "-";
  ngOnInit() {
    this.dashboardService.obtenerResumen().subscribe({
      next: (resp) => {
        if (resp.success && resp.data) {
          this.totalProyectos = resp.data.totalProyectos || 0;
          const fecha = resp.data.ultimoRegistro?.fecha_registro_sistema;
          if (fecha) {
            this.ultimoRegistro = this.formatearFecha(new Date(fecha));
          }
        }
      },
      error: (err) => {
        console.error("Error al obtener resumen del dashboard:", err);
      }
    });
  }
  formatearFecha(fecha) {
    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const yyyy = fecha.getFullYear();
    const hh = String(fecha.getHours()).padStart(2, "0");
    const min = String(fecha.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
  static \u0275fac = function Dashboard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Dashboard)();
  };
  static \u0275cmp = /* @__PURE__ */ i04.\u0275\u0275defineComponent({ type: _Dashboard, selectors: [["app-dashboard"]], decls: 16, vars: 2, consts: [[1, "cards"], [1, "card"]], template: function Dashboard_Template(rf, ctx) {
    if (rf & 1) {
      i04.\u0275\u0275domElementStart(0, "h2");
      i04.\u0275\u0275text(1, " Bienvenido ");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(2, "p");
      i04.\u0275\u0275text(3, " Sistema de Seguimiento de Proyectos del Gobierno Regional de Lambayeque. ");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElement(4, "br");
      i04.\u0275\u0275domElementStart(5, "div", 0)(6, "div", 1)(7, "h4");
      i04.\u0275\u0275text(8, "Total Proyectos");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(9, "h1");
      i04.\u0275\u0275text(10);
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(11, "div", 1)(12, "h4");
      i04.\u0275\u0275text(13, "\xDAltimo Registro");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(14, "h1");
      i04.\u0275\u0275text(15);
      i04.\u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      i04.\u0275\u0275advance(10);
      i04.\u0275\u0275textInterpolate(ctx.totalProyectos);
      i04.\u0275\u0275advance(5);
      i04.\u0275\u0275textInterpolate(ctx.ultimoRegistro);
    }
  }, styles: ["\n.cards[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 25px;\n}\n.card[_ngcontent-%COMP%] {\n  width: 260px;\n  background: white;\n  padding: 25px;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, .08);\n  border-left: 6px solid #E68F1B;\n}\n.card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #571414;\n  margin-top: 20px;\n}\nmain[_ngcontent-%COMP%] {\n  padding: 35px;\n}\n/*# sourceMappingURL=dashboard.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassMetadata(Dashboard, [{
    type: Component2,
    args: [{ selector: "app-dashboard", imports: [], template: '<h2>\n\n    Bienvenido\n\n</h2>\n\n<p>\n\n    Sistema de Seguimiento de Proyectos del Gobierno Regional de Lambayeque.\n\n</p>\n\n<br>\n\n<div class="cards">\n\n    <div class="card">\n\n        <h4>Total Proyectos</h4>\n\n        <h1>{{ totalProyectos }}</h1>\n\n    </div>\n\n    <div class="card">\n\n        <h4>\xDAltimo Registro</h4>\n\n        <h1>{{ ultimoRegistro }}</h1>\n\n    </div>\n\n</div>', styles: ["/* src/app/pages/dashboard/dashboard.css */\n.cards {\n  display: flex;\n  gap: 25px;\n}\n.card {\n  width: 260px;\n  background: white;\n  padding: 25px;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, .08);\n  border-left: 6px solid #E68F1B;\n}\n.card h1 {\n  color: #571414;\n  margin-top: 20px;\n}\nmain {\n  padding: 35px;\n}\n/*# sourceMappingURL=dashboard.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassDebugInfo(Dashboard, { className: "Dashboard", filePath: "src/app/pages/dashboard/dashboard.ts", lineNumber: 10 });
})();
(() => {
  const id = "src%2Fapp%2Fpages%2Fdashboard%2Fdashboard.ts%40Dashboard";
  function Dashboard_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i04.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i04.\u0275\u0275replaceMetadata(Dashboard, m.default, [i04], [Component2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && Dashboard_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && Dashboard_HmrLoad(d.timestamp)));
})();

// src/app/shared/layout/main-layout/main-layout.ts
import { Component as Component5 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { RouterOutlet } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";

// src/app/shared/layout/navbar/navbar.ts
import { Component as Component3 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i05 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i22 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";
function Navbar_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275domElementStart(0, "div", 8)(1, "button", 9);
    i05.\u0275\u0275domListener("click", function Navbar_Conditional_16_Template_button_click_1_listener() {
      i05.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i05.\u0275\u0275nextContext();
      return i05.\u0275\u0275resetView(ctx_r1.cerrarSesion());
    });
    i05.\u0275\u0275text(2, " \u{1F6AA} Cerrar sesi\xF3n ");
    i05.\u0275\u0275domElementEnd()();
  }
}
var Navbar = class _Navbar {
  authService;
  router;
  menuAbierto = false;
  usuario = null;
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  ngOnInit() {
    this.usuario = this.authService.obtenerUsuario();
  }
  cerrarSesion() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(["/login"]);
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
  }
  static \u0275fac = function Navbar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Navbar)(i05.\u0275\u0275directiveInject(AuthService), i05.\u0275\u0275directiveInject(i22.Router));
  };
  static \u0275cmp = /* @__PURE__ */ i05.\u0275\u0275defineComponent({ type: _Navbar, selectors: [["app-navbar"]], decls: 17, vars: 3, consts: [[1, "navbar"], [1, "logo"], ["src", "images/logo-gore.jpeg", "alt", "Logo"], [1, "titulo"], [1, "user-menu"], [1, "user-button", 3, "click"], [1, "avatar"], [1, "flecha"], [1, "dropdown"], [1, "dropdown-item", 3, "click"]], template: function Navbar_Template(rf, ctx) {
    if (rf & 1) {
      i05.\u0275\u0275domElementStart(0, "nav", 0)(1, "div", 1);
      i05.\u0275\u0275domElement(2, "img", 2);
      i05.\u0275\u0275domElementStart(3, "div", 3)(4, "h4");
      i05.\u0275\u0275text(5, "Gobierno Regional de Lambayeque");
      i05.\u0275\u0275domElementEnd();
      i05.\u0275\u0275domElementStart(6, "small");
      i05.\u0275\u0275text(7, "Sistema de Seguimiento");
      i05.\u0275\u0275domElementEnd()()();
      i05.\u0275\u0275domElementStart(8, "div", 4)(9, "button", 5);
      i05.\u0275\u0275domListener("click", function Navbar_Template_button_click_9_listener() {
        return ctx.menuAbierto = !ctx.menuAbierto;
      });
      i05.\u0275\u0275domElementStart(10, "span", 6);
      i05.\u0275\u0275text(11);
      i05.\u0275\u0275domElementEnd();
      i05.\u0275\u0275domElementStart(12, "span");
      i05.\u0275\u0275text(13);
      i05.\u0275\u0275domElementEnd();
      i05.\u0275\u0275domElementStart(14, "span", 7);
      i05.\u0275\u0275text(15, " \u25BC ");
      i05.\u0275\u0275domElementEnd()();
      i05.\u0275\u0275conditionalCreate(16, Navbar_Conditional_16_Template, 3, 0, "div", 8);
      i05.\u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      i05.\u0275\u0275advance(11);
      i05.\u0275\u0275textInterpolate1(" ", ctx.usuario?.usuario?.charAt(0).toUpperCase() || "U", " ");
      i05.\u0275\u0275advance(2);
      i05.\u0275\u0275textInterpolate1(" ", ctx.usuario?.usuario || "Usuario", " ");
      i05.\u0275\u0275advance(3);
      i05.\u0275\u0275conditional(ctx.menuAbierto ? 16 : -1);
    }
  }, styles: ["\n.navbar[_ngcontent-%COMP%] {\n  height: 75px;\n  background: #571414;\n  color: #FFFFFF;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 30px;\n  box-shadow: 0 3px 10px rgba(0, 0, 0, .15);\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n}\n.logo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 6px;\n  object-fit: cover;\n}\n.logo[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.9rem;\n  font-weight: 700;\n}\n.logo[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 2px;\n  font-size: .9rem;\n  opacity: .85;\n}\n.user-menu[_ngcontent-%COMP%] {\n  position: relative;\n}\n.user-button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background: none;\n  border: none;\n  color: white;\n  cursor: pointer;\n  padding: 8px 12px;\n  border-radius: 10px;\n  transition: .2s;\n}\n.user-button[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, .08);\n}\n.avatar[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  border-radius: 50%;\n  background: #E68F1B;\n  color: #571414;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-weight: 700;\n  font-size: 16px;\n}\n.flecha[_ngcontent-%COMP%] {\n  font-size: 11px;\n  opacity: .8;\n}\n.dropdown[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 55px;\n  right: 0;\n  min-width: 190px;\n  background: #FFFFFF;\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, .18);\n  animation: _ngcontent-%COMP%_fadeDown .18s ease;\n}\n.dropdown-item[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 14px 18px;\n  background: #FFFFFF;\n  border: none;\n  text-align: left;\n  font-size: 14px;\n  color: #333;\n  cursor: pointer;\n  transition: .2s;\n}\n.dropdown-item[_ngcontent-%COMP%]:hover {\n  background: #F7F7F7;\n}\n@keyframes _ngcontent-%COMP%_fadeDown {\n  from {\n    opacity: 0;\n    transform: translateY(-8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=navbar.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassMetadata(Navbar, [{
    type: Component3,
    args: [{ selector: "app-navbar", imports: [], template: `<nav class="navbar">

    <div class="logo">

        <img
            src="images/logo-gore.jpeg"
            alt="Logo">

        <div class="titulo">

            <h4>Gobierno Regional de Lambayeque</h4>

            <small>Sistema de Seguimiento</small>

        </div>

    </div>

    <div class="user-menu">

        <button
            class="user-button"
            (click)="menuAbierto = !menuAbierto">

            <span class="avatar">

                {{ usuario?.usuario?.charAt(0).toUpperCase() || 'U' }}

            </span>

            <span>

                {{ usuario?.usuario || 'Usuario' }}

            </span>

            <span class="flecha">

                \u25BC

            </span>

        </button>

        @if(menuAbierto){

            <div class="dropdown">

                <button
                    class="dropdown-item"
                    (click)="cerrarSesion()">

                    \u{1F6AA} Cerrar sesi\xF3n

                </button>

            </div>

        }

    </div>

</nav>`, styles: ["/* src/app/shared/layout/navbar/navbar.css */\n.navbar {\n  height: 75px;\n  background: #571414;\n  color: #FFFFFF;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 30px;\n  box-shadow: 0 3px 10px rgba(0, 0, 0, .15);\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n}\n.logo {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n.logo img {\n  width: 48px;\n  height: 48px;\n  border-radius: 6px;\n  object-fit: cover;\n}\n.logo h4 {\n  margin: 0;\n  font-size: 1.9rem;\n  font-weight: 700;\n}\n.logo small {\n  display: block;\n  margin-top: 2px;\n  font-size: .9rem;\n  opacity: .85;\n}\n.user-menu {\n  position: relative;\n}\n.user-button {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background: none;\n  border: none;\n  color: white;\n  cursor: pointer;\n  padding: 8px 12px;\n  border-radius: 10px;\n  transition: .2s;\n}\n.user-button:hover {\n  background: rgba(255, 255, 255, .08);\n}\n.avatar {\n  width: 38px;\n  height: 38px;\n  border-radius: 50%;\n  background: #E68F1B;\n  color: #571414;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-weight: 700;\n  font-size: 16px;\n}\n.flecha {\n  font-size: 11px;\n  opacity: .8;\n}\n.dropdown {\n  position: absolute;\n  top: 55px;\n  right: 0;\n  min-width: 190px;\n  background: #FFFFFF;\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, .18);\n  animation: fadeDown .18s ease;\n}\n.dropdown-item {\n  width: 100%;\n  padding: 14px 18px;\n  background: #FFFFFF;\n  border: none;\n  text-align: left;\n  font-size: 14px;\n  color: #333;\n  cursor: pointer;\n  transition: .2s;\n}\n.dropdown-item:hover {\n  background: #F7F7F7;\n}\n@keyframes fadeDown {\n  from {\n    opacity: 0;\n    transform: translateY(-8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=navbar.css.map */\n"] }]
  }], () => [{ type: AuthService }, { type: i22.Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassDebugInfo(Navbar, { className: "Navbar", filePath: "src/app/shared/layout/navbar/navbar.ts", lineNumber: 11 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Flayout%2Fnavbar%2Fnavbar.ts%40Navbar";
  function Navbar_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i05.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i05.\u0275\u0275replaceMetadata(Navbar, m.default, [i05, auth_service_exports, i22], [Component3], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && Navbar_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && Navbar_HmrLoad(d.timestamp)));
})();

// src/app/shared/layout/sidebar/sidebar.ts
import { Component as Component4 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { RouterLink } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";
import * as i06 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
function Sidebar_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "a", 3);
    i06.\u0275\u0275text(1, " \u{1F3E5} Salud ");
    i06.\u0275\u0275elementEnd();
  }
}
function Sidebar_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "a", 4);
    i06.\u0275\u0275text(1, " \u{1F3EB} Educaci\xF3n ");
    i06.\u0275\u0275elementEnd();
  }
}
function Sidebar_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "a", 5);
    i06.\u0275\u0275text(1, " \u{1F4DC} Historial ");
    i06.\u0275\u0275elementEnd();
  }
}
var Sidebar = class _Sidebar {
  authService;
  usuario = null;
  modulosVisibles = [];
  constructor(authService) {
    this.authService = authService;
    this.usuario = this.authService.obtenerUsuario();
    this.actualizarModulosVisibles();
  }
  actualizarModulosVisibles() {
    const rol = this.usuario?.rol || "HISTORIAL";
    const rolesPermitidos = {
      "ADMIN": ["dashboard", "salud", "educacion", "historial"],
      "SALUD": ["dashboard", "salud", "historial"],
      "EDUCACION": ["dashboard", "educacion", "historial"],
      "HISTORIAL": ["dashboard", "historial"]
    };
    this.modulosVisibles = rolesPermitidos[rol] || ["dashboard", "historial"];
  }
  tieneAcceso(modulo) {
    return this.modulosVisibles.includes(modulo);
  }
  static \u0275fac = function Sidebar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Sidebar)(i06.\u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ i06.\u0275\u0275defineComponent({ type: _Sidebar, selectors: [["app-sidebar"]], decls: 9, vars: 3, consts: [[1, "sidebar"], [1, "titulo"], ["routerLink", "/dashboard", "routerLinkActive", "active"], ["routerLink", "/salud"], ["routerLink", "/educacion"], ["routerLink", "/historial"]], template: function Sidebar_Template(rf, ctx) {
    if (rf & 1) {
      i06.\u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      i06.\u0275\u0275text(2, " PANEL ");
      i06.\u0275\u0275elementEnd();
      i06.\u0275\u0275elementStart(3, "nav")(4, "a", 2);
      i06.\u0275\u0275text(5, " \u{1F4CA} Dashboard ");
      i06.\u0275\u0275elementEnd();
      i06.\u0275\u0275conditionalCreate(6, Sidebar_Conditional_6_Template, 2, 0, "a", 3);
      i06.\u0275\u0275conditionalCreate(7, Sidebar_Conditional_7_Template, 2, 0, "a", 4);
      i06.\u0275\u0275conditionalCreate(8, Sidebar_Conditional_8_Template, 2, 0, "a", 5);
      i06.\u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      i06.\u0275\u0275advance(6);
      i06.\u0275\u0275conditional(ctx.tieneAcceso("salud") ? 6 : -1);
      i06.\u0275\u0275advance();
      i06.\u0275\u0275conditional(ctx.tieneAcceso("educacion") ? 7 : -1);
      i06.\u0275\u0275advance();
      i06.\u0275\u0275conditional(ctx.tieneAcceso("historial") ? 8 : -1);
    }
  }, dependencies: [RouterLink], styles: ["\n.sidebar[_ngcontent-%COMP%] {\n  width: 250px;\n  background: #FFFFFF;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 3px 0 10px rgba(0, 0, 0, .08);\n  position: fixed;\n  top: 75px;\n  left: 0;\n  bottom: 0;\n  overflow-y: auto;\n  z-index: 999;\n}\n.titulo[_ngcontent-%COMP%] {\n  padding: 25px;\n  font-size: 14px;\n  font-weight: 700;\n  color: #571414;\n  border-bottom: 2px solid #E68F1B;\n}\nnav[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\nnav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  padding: 18px 25px;\n  text-decoration: none;\n  color: #333;\n  font-weight: 500;\n  transition: .25s;\n}\nnav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background: #E68F1B;\n  color: white;\n}\n.active[_ngcontent-%COMP%] {\n  background: #571414;\n  color: white !important;\n}\n/*# sourceMappingURL=sidebar.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i06.\u0275setClassMetadata(Sidebar, [{
    type: Component4,
    args: [{ selector: "app-sidebar", imports: [RouterLink], template: `<div class="sidebar">

    <div class="titulo">

        PANEL

    </div>

    <nav>

        <a
            routerLink="/dashboard"
            routerLinkActive="active">

            \u{1F4CA} Dashboard

        </a>

        @if(tieneAcceso('salud')){

            <a routerLink="/salud">

                \u{1F3E5} Salud

            </a>

        }

        @if(tieneAcceso('educacion')){

            <a routerLink="/educacion">

                \u{1F3EB} Educaci\xF3n

            </a>

        }

        @if(tieneAcceso('historial')){

            <a routerLink="/historial">

                \u{1F4DC} Historial

            </a>

        }

    </nav>
</div>`, styles: ["/* src/app/shared/layout/sidebar/sidebar.css */\n.sidebar {\n  width: 250px;\n  background: #FFFFFF;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 3px 0 10px rgba(0, 0, 0, .08);\n  position: fixed;\n  top: 75px;\n  left: 0;\n  bottom: 0;\n  overflow-y: auto;\n  z-index: 999;\n}\n.titulo {\n  padding: 25px;\n  font-size: 14px;\n  font-weight: 700;\n  color: #571414;\n  border-bottom: 2px solid #E68F1B;\n}\nnav {\n  display: flex;\n  flex-direction: column;\n}\nnav a {\n  padding: 18px 25px;\n  text-decoration: none;\n  color: #333;\n  font-weight: 500;\n  transition: .25s;\n}\nnav a:hover {\n  background: #E68F1B;\n  color: white;\n}\n.active {\n  background: #571414;\n  color: white !important;\n}\n/*# sourceMappingURL=sidebar.css.map */\n"] }]
  }], () => [{ type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i06.\u0275setClassDebugInfo(Sidebar, { className: "Sidebar", filePath: "src/app/shared/layout/sidebar/sidebar.ts", lineNumber: 11 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Flayout%2Fsidebar%2Fsidebar.ts%40Sidebar";
  function Sidebar_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i06.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i06.\u0275\u0275replaceMetadata(Sidebar, m.default, [i06, auth_service_exports], [RouterLink, Component4], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && Sidebar_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && Sidebar_HmrLoad(d.timestamp)));
})();

// src/app/shared/layout/main-layout/main-layout.ts
import * as i07 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i12 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";
var MainLayout = class _MainLayout {
  router;
  menuAbierto = false;
  constructor(router) {
    this.router = router;
  }
  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }
  static \u0275fac = function MainLayout_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MainLayout)(i07.\u0275\u0275directiveInject(i12.Router));
  };
  static \u0275cmp = /* @__PURE__ */ i07.\u0275\u0275defineComponent({ type: _MainLayout, selectors: [["app-main-layout"]], decls: 5, vars: 0, consts: [[1, "layout"]], template: function MainLayout_Template(rf, ctx) {
    if (rf & 1) {
      i07.\u0275\u0275element(0, "app-navbar");
      i07.\u0275\u0275elementStart(1, "div", 0);
      i07.\u0275\u0275element(2, "app-sidebar");
      i07.\u0275\u0275elementStart(3, "main");
      i07.\u0275\u0275element(4, "router-outlet");
      i07.\u0275\u0275elementEnd()();
    }
  }, dependencies: [
    RouterOutlet,
    Navbar,
    Sidebar
  ], styles: ["\n.layout[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 100vh;\n  padding-top: 75px;\n  padding-left: 250px;\n}\nmain[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 40px;\n}\n/*# sourceMappingURL=main-layout.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i07.\u0275setClassMetadata(MainLayout, [{
    type: Component5,
    args: [{ selector: "app-main-layout", standalone: true, imports: [
      RouterOutlet,
      Navbar,
      Sidebar
    ], template: '<app-navbar></app-navbar>\n\n<div class="layout">\n\n    <app-sidebar></app-sidebar>\n\n    <main>\n\n        <router-outlet></router-outlet>\n\n    </main>\n\n</div>', styles: ["/* src/app/shared/layout/main-layout/main-layout.css */\n.layout {\n  display: flex;\n  min-height: 100vh;\n  padding-top: 75px;\n  padding-left: 250px;\n}\nmain {\n  flex: 1;\n  padding: 40px;\n}\n/*# sourceMappingURL=main-layout.css.map */\n"] }]
  }], () => [{ type: i12.Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i07.\u0275setClassDebugInfo(MainLayout, { className: "MainLayout", filePath: "src/app/shared/layout/main-layout/main-layout.ts", lineNumber: 18 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Flayout%2Fmain-layout%2Fmain-layout.ts%40MainLayout";
  function MainLayout_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i07.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i07.\u0275\u0275replaceMetadata(MainLayout, m.default, [i07, i12], [RouterOutlet, Navbar, Sidebar, Component5], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && MainLayout_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && MainLayout_HmrLoad(d.timestamp)));
})();

// src/app/pages/salud/salud.ts
import { Component as Component6, inject as inject4 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { NgIf } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common.js?v=e10ab860";
import { FormBuilder, ReactiveFormsModule, Validators } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";

// src/app/services/salud.ts
import { Injectable as Injectable3, inject as inject3 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { HttpClient as HttpClient3 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common_http.js?v=e10ab860";
import * as i08 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
var SaludService = class _SaludService {
  http = inject3(HttpClient3);
  api = "http://192.168.2.194:3000/api/salud";
  obtenerEstablecimiento(id) {
    return this.http.get(`${this.api}/${id}`);
  }
  obtenerReporteCompleto(id) {
    return this.http.get(`${this.api}/${id}/completo`);
  }
  guardarReporteSalud(dto) {
    return this.http.post(this.api, dto);
  }
  static \u0275fac = function SaludService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SaludService)();
  };
  static \u0275prov = /* @__PURE__ */ i08.\u0275\u0275defineInjectable({ token: _SaludService, factory: _SaludService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i08.\u0275setClassMetadata(SaludService, [{
    type: Injectable3,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/pages/salud/salud.ts
import * as i09 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i13 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";
function Salud_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i09.\u0275\u0275getCurrentView();
    i09.\u0275\u0275elementStart(0, "div", 101)(1, "span");
    i09.\u0275\u0275text(2);
    i09.\u0275\u0275elementEnd();
    i09.\u0275\u0275elementStart(3, "button", 102);
    i09.\u0275\u0275listener("click", function Salud_div_3_Template_button_click_3_listener() {
      i09.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i09.\u0275\u0275nextContext();
      return i09.\u0275\u0275resetView(ctx_r1.cerrarMensaje());
    });
    i09.\u0275\u0275text(4, "\u2715");
    i09.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = i09.\u0275\u0275nextContext();
    i09.\u0275\u0275advance(2);
    i09.\u0275\u0275textInterpolate(ctx_r1.mensajeGuardado);
  }
}
function Salud_div_14_Template(rf, ctx) {
  if (rf & 1) {
    i09.\u0275\u0275elementStart(0, "div", 103);
    i09.\u0275\u0275text(1);
    i09.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = i09.\u0275\u0275nextContext();
    i09.\u0275\u0275advance();
    i09.\u0275\u0275textInterpolate(ctx_r1.idRenaesMensaje);
  }
}
function Salud_div_104_Template(rf, ctx) {
  if (rf & 1) {
    i09.\u0275\u0275elementStart(0, "div", 104);
    i09.\u0275\u0275text(1, " Ingrese un n\xFAmero v\xE1lido entre 0 y 100. ");
    i09.\u0275\u0275elementEnd();
  }
}
function Salud_div_113_Template(rf, ctx) {
  if (rf & 1) {
    i09.\u0275\u0275elementStart(0, "div", 104);
    i09.\u0275\u0275text(1, " Ingrese un n\xFAmero v\xE1lido entre 0 y 100. ");
    i09.\u0275\u0275elementEnd();
  }
}
function Salud_div_149_Template(rf, ctx) {
  if (rf & 1) {
    i09.\u0275\u0275elementStart(0, "div", 104);
    i09.\u0275\u0275text(1, " Las camas UCI disponibles no pueden ser mayores a las camas totales. ");
    i09.\u0275\u0275elementEnd();
  }
}
function Salud_div_191_Template(rf, ctx) {
  if (rf & 1) {
    i09.\u0275\u0275elementStart(0, "div", 104);
    i09.\u0275\u0275text(1, " Los m\xE9dicos en servicio no pueden ser mayores a los m\xE9dicos programados. ");
    i09.\u0275\u0275elementEnd();
  }
}
function Salud_div_232_Template(rf, ctx) {
  if (rf & 1) {
    i09.\u0275\u0275elementStart(0, "div", 104);
    i09.\u0275\u0275text(1, " La fecha de corte debe ser mayor al d\xEDa de hoy. ");
    i09.\u0275\u0275elementEnd();
  }
}
var Salud = class _Salud {
  fb = inject4(FormBuilder);
  saludService = inject4(SaludService);
  authService = inject4(AuthService);
  mensajeGuardado = "";
  idRenaesMensaje = "";
  minDate = this.getTodayString();
  cerrarMensaje() {
    this.mensajeGuardado = "";
  }
  form = this.fb.group({
    //==============================
    // INFORMACIÓN GENERAL
    //==============================
    id_renaes: ["", [Validators.required, Validators.pattern(/^\d{1,8}$/)]],
    nombre_eess: [""],
    categoria: [""],
    red_salud: [""],
    microred: [""],
    provincia: [""],
    distrito: [""],
    tipo: [""],
    coord_lat: [0],
    coord_long: [0],
    poblacion_asignada: [0],
    //==============================
    // PROYECTO DE INVERSIÓN
    //==============================
    id_proyecto: [0],
    estado_inversion: [""],
    avance_fisico: [0, [Validators.min(0), Validators.max(100)]],
    avance_financiero: [0, [Validators.min(0), Validators.max(100)]],
    monto_total: [0],
    monto_devengado: [0],
    unidad_ejecutora: [""],
    //==============================
    // EQUIPAMIENTO
    //==============================
    camas_uci_tot: [0],
    camas_uci_disp: [0],
    camas_hospitalarias: [0],
    equipo_rayos_x: [""],
    planta_oxigeno: [""],
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
    turno_24h: [""],
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
    anho_epi: [(/* @__PURE__ */ new Date()).getFullYear()],
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
    fecha_corte: ["", Validators.required]
  });
  // initialize reactive cross-field validations
  _init = this.setupValidators();
  setupValidators() {
    this.form.get("camas_uci_tot")?.valueChanges.subscribe(() => this.checkCamas());
    this.form.get("camas_uci_disp")?.valueChanges.subscribe(() => this.checkCamas());
    this.form.get("med_prog")?.valueChanges.subscribe(() => this.checkMedicos());
    this.form.get("med_exist")?.valueChanges.subscribe(() => this.checkMedicos());
    this.form.get("fecha_corte")?.valueChanges.subscribe(() => this.checkFecha());
  }
  checkCamas() {
    const tot = Number(this.form.get("camas_uci_tot")?.value) || 0;
    const disp = Number(this.form.get("camas_uci_disp")?.value) || 0;
    const control = this.form.get("camas_uci_disp");
    if (disp > tot) {
      control?.setErrors({ maxExceeded: true });
    } else {
      if (control?.hasError("maxExceeded")) {
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        const errors = control.errors;
        if (errors) {
          delete errors["maxExceeded"];
          if (Object.keys(errors).length === 0)
            control.setErrors(null);
          else
            control.setErrors(errors);
        }
      }
    }
  }
  checkMedicos() {
    const prog = Number(this.form.get("med_prog")?.value) || 0;
    const exist = Number(this.form.get("med_exist")?.value) || 0;
    const control = this.form.get("med_exist");
    if (exist > prog) {
      control?.setErrors({ maxExceeded: true });
    } else {
      if (control?.hasError("maxExceeded")) {
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        const errors = control.errors;
        if (errors) {
          delete errors["maxExceeded"];
          if (Object.keys(errors).length === 0)
            control.setErrors(null);
          else
            control.setErrors(errors);
        }
      }
    }
  }
  checkFecha() {
    const raw = this.form.get("fecha_corte")?.value;
    const parsed = this.parseDate(raw);
    const control = this.form.get("fecha_corte");
    if (!parsed) {
      control?.setErrors({ invalidDate: true });
      return;
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    if (d <= today) {
      control?.setErrors({ invalidDate: true });
    } else {
      if (control?.hasError("invalidDate")) {
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        const errors = control.errors;
        if (errors) {
          delete errors["invalidDate"];
          if (Object.keys(errors).length === 0)
            control.setErrors(null);
          else
            control.setErrors(errors);
        }
      }
    }
  }
  buscarEstablecimiento() {
    this.idRenaesMensaje = "";
    const id = Number(this.form.get("id_renaes")?.value);
    if (!id)
      return;
    this.saludService.obtenerReporteCompleto(id).subscribe({
      next: (resp) => {
        if (!resp.success || !resp.data || !resp.data.establecimiento) {
          this.idRenaesMensaje = "Establecimiento no existe, se registrar\xE1 nuevo establecimiento.";
          this.limpiarDatosEstablecimiento();
          const control = this.form.get("id_renaes");
          const val = control?.value;
          if (control && /^\d{1,8}$/.test(String(val))) {
            control.setErrors(null);
          }
          return;
        }
        this.idRenaesMensaje = "";
        const data = resp.data;
        const e = data.establecimiento;
        const eq = data.equipamiento;
        const rh = data.recursos_humanos;
        const ep = data.epidemiologia;
        const sv = data.servicios;
        const cb = data.condiciones_basicas;
        const pr = data.proyecto;
        const patchValues = {};
        if (e) {
          patchValues["nombre_eess"] = e.nombre_eess || "";
          patchValues["categoria"] = e.categoria || "";
          patchValues["red_salud"] = e.red_salud || "";
          patchValues["microred"] = e.microred || "";
          patchValues["provincia"] = e.provincia || "";
          patchValues["distrito"] = e.distrito || "";
          patchValues["tipo"] = e.tipo || "";
          patchValues["coord_lat"] = Number(e.coord_lat) || 0;
          patchValues["coord_long"] = Number(e.coord_long) || 0;
          patchValues["poblacion_asignada"] = e.poblacion_asignada || 0;
        }
        patchValues["camas_uci_tot"] = 0;
        patchValues["camas_uci_disp"] = 0;
        patchValues["camas_hospitalarias"] = 0;
        patchValues["equipo_rayos_x"] = "";
        patchValues["planta_oxigeno"] = "";
        patchValues["estado_infra"] = 1;
        patchValues["ventiladores"] = 0;
        patchValues["monitores"] = 0;
        patchValues["ecografo"] = false;
        patchValues["tomografo"] = false;
        patchValues["operativo"] = 0;
        patchValues["inoperativo"] = 0;
        patchValues["med_prog"] = 0;
        patchValues["med_exist"] = 0;
        patchValues["turno_24h"] = "";
        patchValues["enfermeras"] = 0;
        patchValues["tecnicos"] = 0;
        patchValues["pediatra"] = 0;
        patchValues["gineco_obstetra"] = 0;
        patchValues["anestesiologo"] = 0;
        patchValues["cirujano_general"] = 0;
        patchValues["intensivista"] = 0;
        patchValues["internista"] = 0;
        patchValues["cardiologo"] = 0;
        patchValues["traumatologo"] = 0;
        patchValues["otros_especialistas"] = 0;
        patchValues["anho_epi"] = (/* @__PURE__ */ new Date()).getFullYear();
        patchValues["semana_epi"] = 1;
        patchValues["casos_dengue"] = 0;
        patchValues["casos_anemia"] = 0;
        patchValues["mort_materna"] = 0;
        patchValues["casos_desnutricion"] = 0;
        patchValues["iras_edas"] = 0;
        patchValues["mortalidad_neonatal"] = 0;
        patchValues["emergencia"] = false;
        patchValues["uci"] = false;
        patchValues["centro_quirurgico"] = false;
        patchValues["partos"] = false;
        patchValues["consultas_diarias_prom"] = 0;
        patchValues["camas_ocupadas"] = 0;
        patchValues["agua"] = false;
        patchValues["desague"] = false;
        patchValues["electricidad"] = false;
        patchValues["oxigeno"] = false;
        patchValues["internet"] = false;
        patchValues["id_proyecto"] = 0;
        patchValues["estado_inversion"] = "";
        patchValues["avance_fisico"] = 0;
        patchValues["avance_financiero"] = 0;
        patchValues["monto_total"] = 0;
        patchValues["monto_devengado"] = 0;
        patchValues["unidad_ejecutora"] = "";
        this.form.patchValue(patchValues);
      },
      error: (err) => {
        console.error(err);
        if (err?.status === 404) {
          this.idRenaesMensaje = "Establecimiento no existe, se registrar\xE1 nuevo establecimiento.";
          this.limpiarDatosEstablecimiento();
          const control404 = this.form.get("id_renaes");
          const v404 = control404?.value;
          if (control404 && /^\d{1,8}$/.test(String(v404))) {
            control404.setErrors(null);
          }
          return;
        }
        this.idRenaesMensaje = "Error al consultar el establecimiento.";
      }
    });
  }
  handleIdInput() {
    this.idRenaesMensaje = "";
    const control = this.form.get("id_renaes");
    const val = control?.value;
    if (control && /^\d{1,8}$/.test(String(val))) {
      control.setErrors(null);
    }
  }
  validarCamposObligatorios() {
    const camposFaltantes = [];
    const camposEstablecimiento = [
      "id_renaes",
      "nombre_eess",
      "categoria",
      "red_salud",
      "provincia",
      "distrito",
      "tipo"
    ];
    for (const campo of camposEstablecimiento) {
      const control = this.form.get(campo);
      const value = control?.value;
      if (!value || typeof value === "string" && value.trim() === "") {
        camposFaltantes.push(campo);
        control?.markAsTouched();
        control?.setErrors({ required: true });
      }
    }
    const estInversion = this.form.get("estado_inversion");
    if (!estInversion?.value || estInversion.value.trim() === "") {
      camposFaltantes.push("estado_inversion");
      estInversion?.markAsTouched();
      estInversion?.setErrors({ required: true });
    }
    const fechaCorte = this.form.get("fecha_corte");
    if (!fechaCorte?.value || fechaCorte.value.trim() === "") {
      camposFaltantes.push("fecha_corte");
      fechaCorte?.markAsTouched();
      fechaCorte?.setErrors({ required: true });
    }
    return {
      valido: camposFaltantes.length === 0,
      camposFaltantes
    };
  }
  guardarReporte() {
    const validacion = this.validarCamposObligatorios();
    if (!validacion.valido) {
      this.mensajeGuardado = "Falta completar campos";
      return;
    }
    const rawValues = this.form.getRawValue();
    const fechaCorte = this.parseDate(rawValues.fecha_corte) || /* @__PURE__ */ new Date();
    const dto = {
      id_renaes: Number(rawValues.id_renaes),
      nombre_eess: rawValues.nombre_eess || "",
      categoria: rawValues.categoria || "",
      red_salud: rawValues.red_salud || "",
      microred: rawValues.microred || "",
      provincia: rawValues.provincia || "",
      distrito: rawValues.distrito || "",
      tipo: rawValues.tipo || "",
      coord_lat: Number(rawValues.coord_lat),
      coord_long: Number(rawValues.coord_long),
      poblacion_asignada: Number(rawValues.poblacion_asignada),
      id_proyecto: Number(rawValues.id_proyecto),
      estado_inversion: rawValues.estado_inversion || "",
      avance_fisico: Number(rawValues.avance_fisico),
      avance_financiero: Number(rawValues.avance_financiero),
      monto_total: Number(rawValues.monto_total),
      monto_devengado: Number(rawValues.monto_devengado),
      unidad_ejecutora: rawValues.unidad_ejecutora || "",
      camas_uci_tot: Number(rawValues.camas_uci_tot),
      camas_uci_disp: Number(rawValues.camas_uci_disp),
      camas_hospitalarias: Number(rawValues.camas_hospitalarias),
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
      nombre_usuario: this.authService.obtenerUsuario()?.usuario || ""
    };
    this.mensajeGuardado = "";
    this.saludService.guardarReporteSalud(dto).subscribe({
      next: (resp) => {
        this.mensajeGuardado = "Reporte registrado correctamente.";
        setTimeout(() => {
          this.mensajeGuardado = "";
        }, 5e3);
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.message || "";
        this.mensajeGuardado = msg.includes("Proyecto ya existente") ? "Proyecto ya existente" : "Error al registrar el reporte.";
      }
    });
  }
  parseBoolean(value) {
    return value === true || value === "true" || value === "SI" || value === "Si" || value === "YES" || value === "yes";
  }
  parseDate(value) {
    if (!value && value !== 0)
      return null;
    if (value instanceof Date)
      return isNaN(value.getTime()) ? null : value;
    const s = String(value).trim();
    const dmy = /^([0-3]?\d)\/([0-1]?\d)\/(\d{4})$/;
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
    let m;
    if (m = s.match(dmy)) {
      const day = Number(m[1]);
      const month = Number(m[2]) - 1;
      const year = Number(m[3]);
      const dt2 = new Date(year, month, day);
      return isNaN(dt2.getTime()) ? null : dt2;
    }
    if (m = s.match(ymd)) {
      const year = Number(m[1]);
      const month = Number(m[2]) - 1;
      const day = Number(m[3]);
      const dt2 = new Date(year, month, day);
      return isNaN(dt2.getTime()) ? null : dt2;
    }
    const dt = new Date(s);
    return isNaN(dt.getTime()) ? null : dt;
  }
  getTodayString() {
    const d = /* @__PURE__ */ new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  limpiarDatosEstablecimiento() {
    this.form.patchValue({
      nombre_eess: "",
      categoria: "",
      red_salud: "",
      microred: "",
      provincia: "",
      distrito: "",
      tipo: "",
      coord_lat: 0,
      coord_long: 0,
      poblacion_asignada: 0
    });
  }
  limpiarFormulario() {
    this.form.reset({
      id_renaes: "",
      nombre_eess: "",
      categoria: "",
      red_salud: "",
      microred: "",
      provincia: "",
      distrito: "",
      tipo: "",
      coord_lat: 0,
      coord_long: 0,
      poblacion_asignada: 0,
      id_proyecto: 0,
      estado_inversion: "",
      avance_fisico: 0,
      avance_financiero: 0,
      monto_total: 0,
      monto_devengado: 0,
      unidad_ejecutora: "",
      camas_uci_tot: 0,
      camas_uci_disp: 0,
      camas_hospitalarias: 0,
      equipo_rayos_x: "",
      planta_oxigeno: "",
      estado_infra: 1,
      ventiladores: 0,
      monitores: 0,
      ecografo: false,
      tomografo: false,
      operativo: 0,
      inoperativo: 0,
      med_prog: 0,
      med_exist: 0,
      turno_24h: "",
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
      anho_epi: (/* @__PURE__ */ new Date()).getFullYear(),
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
      fecha_corte: ""
    });
  }
  static \u0275fac = function Salud_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Salud)();
  };
  static \u0275cmp = /* @__PURE__ */ i09.\u0275\u0275defineComponent({ type: _Salud, selectors: [["app-salud"]], decls: 240, vars: 9, consts: [[1, "page-title"], ["class", "message", 4, "ngIf"], ["id", "Salud", 1, "main-form-container", 3, "ngSubmit", "formGroup"], [1, "form-container"], [1, "section-header"], [1, "form-grid"], [1, "form-group", "full-width"], ["for", "id_renaes"], ["type", "number", "id", "id_renaes", "formControlName", "id_renaes", "min", "1", "max", "99999999", "step", "1", 3, "input", "blur"], ["class", "field-message warning", 4, "ngIf"], ["for", "nombre_eess"], ["type", "text", "id", "nombre_eess", "formControlName", "nombre_eess"], [1, "form-group"], ["for", "red"], ["id", "red_salud", "formControlName", "red_salud"], ["value", ""], ["value", "Chiclayo"], ["value", "Lambayeque"], ["value", "Ferre\xF1afe"], ["for", "microred"], ["type", "text", "id", "microred", "formControlName", "microred"], ["for", "categoria"], ["id", "categoria", "formControlName", "categoria"], ["value", "I-1"], ["value", "I-2"], ["value", "I-3"], ["value", "I-4"], ["value", "II-1"], ["value", "II-2"], ["for", "provincia"], ["type", "text", "id", "provincia", "formControlName", "provincia"], ["for", "distrito"], ["type", "text", "id", "distrito", "formControlName", "distrito"], ["for", "EESS"], ["type", "text", "id", "tipo", "formControlName", "tipo", "placeholder", "Puesto, Centro, Hospital"], ["for", "poblacion_asignada"], ["type", "number", "id", "poblacion_asignada", "formControlName", "poblacion_asignada", "min", "0", "step", "1"], ["for", "coor_latitud"], ["type", "text", "id", "coor_lat", "formControlName", "coord_lat"], ["for", "coor_longitud"], ["type", "text", "id", "coor_long", "formControlName", "coord_long"], ["for", "id_proyecto"], ["type", "text", "id", "id_proyecto", "formControlName", "id_proyecto"], ["for", "estado_inversion"], ["id", "estado_inversion", "formControlName", "estado_inversion"], ["value", "En Ejecuci\xF3n"], ["value", "Aprobado"], ["value", "Viable"], ["value", "Paralizado"], ["for", "Fisico"], ["type", "number", "id", "avance_fisico", "formControlName", "avance_fisico", "min", "0", "max", "100"], ["class", "field-message", 4, "ngIf"], ["for", "Monto"], ["type", "number", "id", "monto_total", "formControlName", "monto_total"], ["for", "Financiero"], ["type", "number", "id", "avance_financiero", "formControlName", "avance_financiero", "min", "0", "max", "100"], ["for", "MontoDev"], ["type", "number", "id", "monto_devengado", "formControlName", "monto_devengado"], ["for", "Ejecutora"], ["id", "unidad_ejecutora", "formControlName", "unidad_ejecutora"], ["value", "REGI\xD3N LAMBAYEQUE - SEDE CENTRAL"], ["value", "PROYECTO ESPECIAL OLMOS TINAJONES"], ["value", "GERENCIA REGIONAL DE SALUD LAMBAYEQUE"], ["value", "HOSPITAL REGIONAL DOCENTE LAS MERCEDES"], ["value", "HOSPITAL BEL\xC9N DE LAMBAYEQUE"], ["value", "HOSPITAL REGIONAL DE LAMBAYEQUE"], ["for", "Totales"], ["type", "number", "id", "camas_uci_tot", "formControlName", "camas_uci_tot"], ["for", "Disponibles"], ["type", "number", "id", "camas_uci_disp", "formControlName", "camas_uci_disp"], ["for", "Hospitalarias"], ["type", "number", "id", "camas_hospitalarias", "formControlName", "camas_hospitalarias"], ["for", "Rayos"], ["id", "equipo_rayos_x", "formControlName", "equipo_rayos_x"], ["value", "SI"], ["value", "NO"], ["for", "PlantaOxigeno"], ["id", "planta_oxigeno", "formControlName", "planta_oxigeno"], ["for", "Infraestructura"], ["type", "number", "id", "estado_infra", "formControlName", "estado_infra", "min", "1", "max", "5", "placeholder", "1. Malo - 5. \xD3ptimo"], ["for", "Programados"], ["type", "number", "id", "med_prog", "formControlName", "med_prog"], ["for", "Servicio"], ["type", "number", "id", "med_exist", "formControlName", "med_exist"], ["for", "Horas"], ["id", "turno_24h", "formControlName", "turno_24h"], ["for", "Semana"], ["type", "number", "id", "semana_epi", "formControlName", "semana_epi", "min", "1", "max", "53"], ["for", "Dengue"], ["type", "number", "id", "casos_dengue", "formControlName", "casos_dengue"], ["for", "Anemia"], ["type", "number", "id", "casos_anemia", "formControlName", "casos_anemia"], ["for", "Materna"], ["type", "number", "id", "mort_materna", "formControlName", "mort_materna"], ["for", "fechaCorte"], ["type", "date", "id", "fecha_corte", "formControlName", "fecha_corte"], [1, "d-flex", "justify-content-end", "gap-3", "mt-5", "mb-4"], ["type", "button", 1, "btn", "btn-limpiar", 3, "click"], [1, "bi", "bi-arrow-counterclockwise"], ["type", "submit", 1, "btn", "btn-guardar"], [1, "bi", "bi-floppy"], [1, "message"], ["type", "button", 1, "close-btn", 3, "click"], [1, "field-message", "warning"], [1, "field-message"]], template: function Salud_Template(rf, ctx) {
    if (rf & 1) {
      i09.\u0275\u0275elementStart(0, "div", 0)(1, "h1");
      i09.\u0275\u0275text(2, "Reporte de Indicadores de Salud");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275template(3, Salud_div_3_Template, 5, 1, "div", 1);
      i09.\u0275\u0275elementStart(4, "form", 2);
      i09.\u0275\u0275listener("ngSubmit", function Salud_Template_form_ngSubmit_4_listener() {
        return ctx.guardarReporte();
      });
      i09.\u0275\u0275elementStart(5, "div", 3)(6, "div", 4)(7, "h3");
      i09.\u0275\u0275text(8, "\u{1F4CB} Informaci\xF3n General");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275elementStart(9, "div", 5)(10, "div", 6)(11, "label", 7);
      i09.\u0275\u0275text(12, "ID RENAES");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(13, "input", 8);
      i09.\u0275\u0275listener("input", function Salud_Template_input_input_13_listener() {
        return ctx.handleIdInput();
      })("blur", function Salud_Template_input_blur_13_listener() {
        return ctx.buscarEstablecimiento();
      });
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275template(14, Salud_div_14_Template, 2, 1, "div", 9);
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(15, "div", 6)(16, "label", 10);
      i09.\u0275\u0275text(17, "Nombre del Establecimiento");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(18, "input", 11);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(19, "div", 12)(20, "label", 13);
      i09.\u0275\u0275text(21, "Red de Salud");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(22, "select", 14)(23, "option", 15);
      i09.\u0275\u0275text(24, "Seleccione Red");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(25, "option", 16);
      i09.\u0275\u0275text(26, "Chiclayo");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(27, "option", 17);
      i09.\u0275\u0275text(28, "Lambayeque");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(29, "option", 18);
      i09.\u0275\u0275text(30, "Ferre\xF1afe");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(31, "div", 12)(32, "label", 19);
      i09.\u0275\u0275text(33, "Microred");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(34, "input", 20);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(35, "div", 12)(36, "label", 21);
      i09.\u0275\u0275text(37, "Categor\xEDa");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(38, "select", 22)(39, "option", 15);
      i09.\u0275\u0275text(40, "Seleccione Categor\xEDa");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(41, "option", 23);
      i09.\u0275\u0275text(42, "I-1");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(43, "option", 24);
      i09.\u0275\u0275text(44, "I-2");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(45, "option", 25);
      i09.\u0275\u0275text(46, "I-3");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(47, "option", 26);
      i09.\u0275\u0275text(48, "I-4");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(49, "option", 27);
      i09.\u0275\u0275text(50, "II-1");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(51, "option", 28);
      i09.\u0275\u0275text(52, "II-2");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(53, "div", 12)(54, "label", 29);
      i09.\u0275\u0275text(55, "Provincia");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(56, "input", 30);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(57, "div", 12)(58, "label", 31);
      i09.\u0275\u0275text(59, "Distrito");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(60, "input", 32);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(61, "div", 12)(62, "label", 33);
      i09.\u0275\u0275text(63, "Tipo de EESS");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(64, "input", 34);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(65, "div", 12)(66, "label", 35);
      i09.\u0275\u0275text(67, "Poblaci\xF3n asignada");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(68, "input", 36);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(69, "div", 12)(70, "label", 37);
      i09.\u0275\u0275text(71, "Latitud");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(72, "input", 38);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(73, "div", 12)(74, "label", 39);
      i09.\u0275\u0275text(75, "Longitud");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(76, "input", 40);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd()()();
      i09.\u0275\u0275elementStart(77, "div", 3)(78, "div", 4)(79, "h3");
      i09.\u0275\u0275text(80, "\u{1F3D7}\uFE0F Gesti\xF3n de Inversiones");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275elementStart(81, "div", 5)(82, "div", 6)(83, "label", 41);
      i09.\u0275\u0275text(84, "CUI Proyecto");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(85, "input", 42);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(86, "div", 12)(87, "label", 43);
      i09.\u0275\u0275text(88, "Estado de Inversi\xF3n");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(89, "select", 44)(90, "option", 15);
      i09.\u0275\u0275text(91, "Seleccione Estado");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(92, "option", 45);
      i09.\u0275\u0275text(93, "En Ejecuci\xF3n");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(94, "option", 46);
      i09.\u0275\u0275text(95, "Aprobado");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(96, "option", 47);
      i09.\u0275\u0275text(97, "Viable");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(98, "option", 48);
      i09.\u0275\u0275text(99, "Paralizado");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(100, "div", 12)(101, "label", 49);
      i09.\u0275\u0275text(102, "Avance F\xEDsico (%)");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(103, "input", 50);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275template(104, Salud_div_104_Template, 2, 0, "div", 51);
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(105, "div", 12)(106, "label", 52);
      i09.\u0275\u0275text(107, "Monto Total (S/)");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(108, "input", 53);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(109, "div", 12)(110, "label", 54);
      i09.\u0275\u0275text(111, "Avance Financiero (%)");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(112, "input", 55);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275template(113, Salud_div_113_Template, 2, 0, "div", 51);
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(114, "div", 12)(115, "label", 56);
      i09.\u0275\u0275text(116, "Monto Devengado (S/)");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(117, "input", 57);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(118, "div", 12)(119, "label", 58);
      i09.\u0275\u0275text(120, "Unidad Ejecutora");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(121, "select", 59)(122, "option", 15);
      i09.\u0275\u0275text(123, "Seleccione Unidad Ejecutora");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(124, "option", 60);
      i09.\u0275\u0275text(125, "REGI\xD3N LAMBAYEQUE - SEDE CENTRAL");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(126, "option", 61);
      i09.\u0275\u0275text(127, "PROYECTO ESPECIAL OLMOS TINAJONES");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(128, "option", 62);
      i09.\u0275\u0275text(129, "GERENCIA REGIONAL DE SALUD LAMBAYEQUE");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(130, "option", 63);
      i09.\u0275\u0275text(131, "HOSPITAL REGIONAL DOCENTE LAS MERCEDES");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(132, "option", 64);
      i09.\u0275\u0275text(133, "HOSPITAL BEL\xC9N DE LAMBAYEQUE");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(134, "option", 65);
      i09.\u0275\u0275text(135, "HOSPITAL REGIONAL DE LAMBAYEQUE");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd()()();
      i09.\u0275\u0275elementStart(136, "div", 3)(137, "div", 4)(138, "h3");
      i09.\u0275\u0275text(139, "\u{1F3E5} Capacidad Instalada y Equipamiento");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275elementStart(140, "div", 5)(141, "div", 12)(142, "label", 66);
      i09.\u0275\u0275text(143, "Camas UCI Totales");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(144, "input", 67);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(145, "div", 12)(146, "label", 68);
      i09.\u0275\u0275text(147, "Camas UCI Disponibles");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(148, "input", 69);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275template(149, Salud_div_149_Template, 2, 0, "div", 51);
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(150, "div", 12)(151, "label", 70);
      i09.\u0275\u0275text(152, "Camas Hospitalarias");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(153, "input", 71);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(154, "div", 12)(155, "label", 72);
      i09.\u0275\u0275text(156, "\xBFTiene Rayos X?");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(157, "select", 73)(158, "option", 15);
      i09.\u0275\u0275text(159, "Seleccione");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(160, "option", 74);
      i09.\u0275\u0275text(161, "S\xED");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(162, "option", 75);
      i09.\u0275\u0275text(163, "No");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(164, "div", 12)(165, "label", 76);
      i09.\u0275\u0275text(166, "\xBFTiene Planta de Ox\xEDgeno?");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(167, "select", 77)(168, "option", 15);
      i09.\u0275\u0275text(169, "Seleccione");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(170, "option", 74);
      i09.\u0275\u0275text(171, "S\xED");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(172, "option", 75);
      i09.\u0275\u0275text(173, "No");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(174, "div", 12)(175, "label", 78);
      i09.\u0275\u0275text(176, "Estado Infraestructura (1-5)");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(177, "input", 79);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd()()();
      i09.\u0275\u0275elementStart(178, "div", 3)(179, "div", 4)(180, "h3");
      i09.\u0275\u0275text(181, "\u{1F465} Personal y Recursos Humanos");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275elementStart(182, "div", 5)(183, "div", 12)(184, "label", 80);
      i09.\u0275\u0275text(185, "M\xE9dicos Programados");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(186, "input", 81);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(187, "div", 12)(188, "label", 82);
      i09.\u0275\u0275text(189, "M\xE9dicos en Servicio (Hoy)");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(190, "input", 83);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275template(191, Salud_div_191_Template, 2, 0, "div", 51);
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(192, "div", 6)(193, "label", 84);
      i09.\u0275\u0275text(194, "\xBFAtenci\xF3n 24 Horas?");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(195, "select", 85)(196, "option", 15);
      i09.\u0275\u0275text(197, "Seleccione");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(198, "option", 74);
      i09.\u0275\u0275text(199, "S\xED");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(200, "option", 75);
      i09.\u0275\u0275text(201, "No");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd()()();
      i09.\u0275\u0275elementStart(202, "div", 3)(203, "div", 4)(204, "h3");
      i09.\u0275\u0275text(205, "\u{1F6A8} Vigilancia Epidemiol\xF3gica");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275elementStart(206, "div", 5)(207, "div", 12)(208, "label", 86);
      i09.\u0275\u0275text(209, "Semana Epidemiol\xF3gica");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(210, "input", 87);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(211, "div", 12)(212, "label", 88);
      i09.\u0275\u0275text(213, "Casos Dengue (Confirmados)");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(214, "input", 89);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(215, "div", 12)(216, "label", 90);
      i09.\u0275\u0275text(217, "Casos Anemia");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(218, "input", 91);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(219, "div", 12)(220, "label", 92);
      i09.\u0275\u0275text(221, "Mortalidad Materna");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(222, "input", 93);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275elementEnd()()();
      i09.\u0275\u0275elementStart(223, "div", 3)(224, "div", 4)(225, "h3");
      i09.\u0275\u0275text(226, "\u{1F4C5} Registro Temporal");
      i09.\u0275\u0275elementEnd()();
      i09.\u0275\u0275elementStart(227, "div", 5)(228, "div", 6)(229, "label", 94);
      i09.\u0275\u0275text(230, "Fecha de Corte de Informaci\xF3n");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275element(231, "input", 95);
      i09.\u0275\u0275controlCreate();
      i09.\u0275\u0275template(232, Salud_div_232_Template, 2, 0, "div", 51);
      i09.\u0275\u0275elementEnd()()();
      i09.\u0275\u0275elementStart(233, "div", 96)(234, "button", 97);
      i09.\u0275\u0275listener("click", function Salud_Template_button_click_234_listener() {
        return ctx.limpiarFormulario();
      });
      i09.\u0275\u0275element(235, "i", 98);
      i09.\u0275\u0275text(236, " Limpiar ");
      i09.\u0275\u0275elementEnd();
      i09.\u0275\u0275elementStart(237, "button", 99);
      i09.\u0275\u0275element(238, "i", 100);
      i09.\u0275\u0275text(239, " Guardar Reporte ");
      i09.\u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      i09.\u0275\u0275advance(3);
      i09.\u0275\u0275property("ngIf", ctx.mensajeGuardado);
      i09.\u0275\u0275advance();
      i09.\u0275\u0275property("formGroup", ctx.form);
      i09.\u0275\u0275advance(9);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance();
      i09.\u0275\u0275property("ngIf", ctx.idRenaesMensaje);
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(12);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(18);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(9);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(14);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance();
      i09.\u0275\u0275property("ngIf", ctx.form.get("avance_fisico")?.invalid && ctx.form.get("avance_fisico")?.touched);
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance();
      i09.\u0275\u0275property("ngIf", ctx.form.get("avance_financiero")?.invalid && ctx.form.get("avance_financiero")?.touched);
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(23);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance();
      i09.\u0275\u0275property("ngIf", ctx.form.get("camas_uci_disp")?.hasError("maxExceeded") && ctx.form.get("camas_uci_disp")?.touched);
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(10);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(10);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(9);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance();
      i09.\u0275\u0275property("ngIf", ctx.form.get("med_exist")?.hasError("maxExceeded") && ctx.form.get("med_exist")?.touched);
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(15);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(4);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance(9);
      i09.\u0275\u0275attribute("min", ctx.minDate);
      i09.\u0275\u0275control();
      i09.\u0275\u0275advance();
      i09.\u0275\u0275property("ngIf", ctx.form.get("fecha_corte")?.hasError("invalidDate") && ctx.form.get("fecha_corte")?.touched);
    }
  }, dependencies: [ReactiveFormsModule, i13.\u0275NgNoValidate, i13.NgSelectOption, i13.\u0275NgSelectMultipleOption, i13.DefaultValueAccessor, i13.NumberValueAccessor, i13.RangeValueAccessor, i13.CheckboxControlValueAccessor, i13.SelectControlValueAccessor, i13.SelectMultipleControlValueAccessor, i13.RadioControlValueAccessor, i13.NgControlStatus, i13.NgControlStatusGroup, i13.RequiredValidator, i13.MinLengthValidator, i13.MaxLengthValidator, i13.PatternValidator, i13.CheckboxRequiredValidator, i13.EmailValidator, i13.MinValidator, i13.MaxValidator, i13.FormControlDirective, i13.FormGroupDirective, i13.FormArrayDirective, i13.FormControlName, i13.FormGroupName, i13.FormArrayName, NgIf], styles: ["\n.main-form-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  max-width: 900px;\n  margin: 0 auto;\n  max-height: calc(100vh - 150px);\n  overflow-y: auto;\n}\n.btn-limpiar[_ngcontent-%COMP%] {\n  background: #fff;\n  color: #7A1C1C;\n  border: 2px solid #7A1C1C;\n  padding: 10px 24px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: .25s;\n}\n.btn-limpiar[_ngcontent-%COMP%]:hover {\n  background: #7A1C1C;\n  color: #fff;\n}\n.btn-guardar[_ngcontent-%COMP%] {\n  background: #198754;\n  color: #fff;\n  border: none;\n  padding: 10px 28px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: all .25s ease;\n  box-shadow: 0 4px 12px rgba(25, 135, 84, .25);\n}\n.btn-guardar[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #157347;\n  color: #fff;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 18px rgba(25, 135, 84, .35);\n}\n.btn-guardar[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: scale(.98);\n}\n.btn-guardar[_ngcontent-%COMP%]:disabled {\n  background: #c7c7c7;\n  color: #6c757d;\n  cursor: not-allowed;\n  box-shadow: none;\n  opacity: 1;\n  transform: none;\n}\n.form-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);\n  border: 1px solid #e9ecef;\n}\n.section-header[_ngcontent-%COMP%] {\n  background-color: #7A1C1C;\n  color: #ffffff;\n  padding: 14px 20px;\n}\n.section-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  padding: 20px;\n}\n.message[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  max-width: 900px;\n  margin: 0 auto 16px;\n  padding: 12px 16px;\n  border-radius: 10px;\n  border: 1px solid #7a1c1c;\n  background-color: #fff1f1;\n  color: #7a1c1c;\n  font-weight: 600;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}\n.message[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n.close-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #7a1c1c;\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.7;\n  transition: opacity 0.2s ease;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.field-message[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  color: #7a1c1c;\n  background: #fff1f1;\n  border: 1px solid #f5c2c7;\n  padding: 10px 12px;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.field-message.warning[_ngcontent-%COMP%] {\n  background: #fff9e6;\n  border-color: #ffecb3;\n  color: #8a6d00;\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: #495057;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 10px 14px;\n  font-size: 0.95rem;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  background-color: #ffffff;\n  color: #212529;\n  transition: all 0.2s ease-in-out;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #7A1C1C;\n  box-shadow: 0 0 0 3px rgba(122, 28, 28, 0.1);\n}\n.form-group[_ngcontent-%COMP%]   input[readonly][_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  color: #6c757d;\n  cursor: not-allowed;\n}\n.form-group[_ngcontent-%COMP%]   input.ng-invalid.ng-touched[_ngcontent-%COMP%], \n.form-group[_ngcontent-%COMP%]   select.ng-invalid.ng-touched[_ngcontent-%COMP%] {\n  border-color: #dc3545;\n  background-color: #fff5f5;\n  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);\n}\n.full-width[_ngcontent-%COMP%] {\n  grid-column: span 2;\n}\n@media (max-width: 768px) {\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .full-width[_ngcontent-%COMP%] {\n    grid-column: span 1;\n  }\n}\n/*# sourceMappingURL=salud.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i09.\u0275setClassMetadata(Salud, [{
    type: Component6,
    args: [{ selector: "app-salud", standalone: true, imports: [ReactiveFormsModule, NgIf], template: `<div class="page-title">\r
    <h1>Reporte de Indicadores de Salud</h1>\r
</div>\r
\r
<div class="message" *ngIf="mensajeGuardado">\r
    <span>{{ mensajeGuardado }}</span>\r
    <button type="button" class="close-btn" (click)="cerrarMensaje()">\u2715</button>\r
</div>\r
\r
<form [formGroup]="form" (ngSubmit)="guardarReporte()" class="main-form-container" id="Salud">\r
\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F4CB} Informaci\xF3n General</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group full-width">\r
                <label for="id_renaes">ID RENAES</label>\r
                <input type="number" id="id_renaes" formControlName="id_renaes" (input)="handleIdInput()" (blur)="buscarEstablecimiento()" min="1" max="99999999" step="1" />\r
                <div class="field-message warning" *ngIf="idRenaesMensaje">{{ idRenaesMensaje }}</div>\r
            </div>\r
\r
            <div class="form-group full-width">\r
                <label for="nombre_eess">Nombre del Establecimiento</label>\r
                <input type="text" id="nombre_eess" formControlName="nombre_eess" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="red">Red de Salud</label>\r
                <select id="red_salud" formControlName="red_salud">\r
                    <option value="">Seleccione Red</option>\r
                    <option value="Chiclayo">Chiclayo</option>\r
                    <option value="Lambayeque">Lambayeque</option>\r
                    <option value="Ferre\xF1afe">Ferre\xF1afe</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="microred">Microred</label>\r
                <input type="text" id="microred" formControlName="microred" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="categoria">Categor\xEDa</label>\r
                <select id="categoria" formControlName="categoria">\r
                    <option value="">Seleccione Categor\xEDa</option>\r
                    <option value="I-1">I-1</option>\r
                    <option value="I-2">I-2</option>\r
                    <option value="I-3">I-3</option>\r
                    <option value="I-4">I-4</option>\r
                    <option value="II-1">II-1</option>\r
                    <option value="II-2">II-2</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="provincia">Provincia</label>\r
                <input type="text" id="provincia" formControlName="provincia" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="distrito">Distrito</label>\r
                <input type="text" id="distrito" formControlName="distrito" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="EESS">Tipo de EESS</label>\r
                <input type="text" id="tipo" formControlName="tipo" placeholder="Puesto, Centro, Hospital" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="poblacion_asignada">Poblaci\xF3n asignada</label>\r
                <input type="number" id="poblacion_asignada" formControlName="poblacion_asignada" min="0" step="1" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="coor_latitud">Latitud</label>\r
                <input type="text" id="coor_lat" formControlName="coord_lat" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="coor_longitud">Longitud</label>\r
                <input type="text" id="coor_long" formControlName="coord_long" />\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F3D7}\uFE0F Gesti\xF3n de Inversiones</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group full-width">\r
                <label for="id_proyecto">CUI Proyecto</label>\r
                <input type="text" id="id_proyecto" formControlName="id_proyecto" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="estado_inversion">Estado de Inversi\xF3n</label>\r
                <select id="estado_inversion" formControlName="estado_inversion">\r
                    <option value="">Seleccione Estado</option>\r
                    <option value="En Ejecuci\xF3n">En Ejecuci\xF3n</option>\r
                    <option value="Aprobado">Aprobado</option>\r
                    <option value="Viable">Viable</option>\r
                    <option value="Paralizado">Paralizado</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Fisico">Avance F\xEDsico (%)</label>\r
                <input type="number" id="avance_fisico" formControlName="avance_fisico" min="0" max="100" />\r
                <div class="field-message" *ngIf="form.get('avance_fisico')?.invalid && form.get('avance_fisico')?.touched">\r
                    Ingrese un n\xFAmero v\xE1lido entre 0 y 100.\r
                </div>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Monto">Monto Total (S/)</label>\r
                <input type="number" id="monto_total" formControlName="monto_total" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Financiero">Avance Financiero (%)</label>\r
                <input type="number" id="avance_financiero" formControlName="avance_financiero" min="0" max="100" />\r
                <div class="field-message" *ngIf="form.get('avance_financiero')?.invalid && form.get('avance_financiero')?.touched">\r
                    Ingrese un n\xFAmero v\xE1lido entre 0 y 100.\r
                </div>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="MontoDev">Monto Devengado (S/)</label>\r
                <input type="number" id="monto_devengado" formControlName="monto_devengado" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Ejecutora">Unidad Ejecutora</label>\r
                <select id="unidad_ejecutora" formControlName="unidad_ejecutora">\r
                    <option value="">Seleccione Unidad Ejecutora</option>\r
                    <option value="REGI\xD3N LAMBAYEQUE - SEDE CENTRAL">REGI\xD3N LAMBAYEQUE - SEDE CENTRAL</option>\r
                    <option value="PROYECTO ESPECIAL OLMOS TINAJONES">PROYECTO ESPECIAL OLMOS TINAJONES</option>\r
                    <option value="GERENCIA REGIONAL DE SALUD LAMBAYEQUE">GERENCIA REGIONAL DE SALUD LAMBAYEQUE</option>\r
                    <option value="HOSPITAL REGIONAL DOCENTE LAS MERCEDES">HOSPITAL REGIONAL DOCENTE LAS MERCEDES</option>\r
                    <option value="HOSPITAL BEL\xC9N DE LAMBAYEQUE">HOSPITAL BEL\xC9N DE LAMBAYEQUE</option>\r
                    <option value="HOSPITAL REGIONAL DE LAMBAYEQUE">HOSPITAL REGIONAL DE LAMBAYEQUE</option>\r
                </select>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F3E5} Capacidad Instalada y Equipamiento</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group">\r
                <label for="Totales">Camas UCI Totales</label>\r
                <input type="number" id="camas_uci_tot" formControlName="camas_uci_tot" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Disponibles">Camas UCI Disponibles</label>\r
                <input type="number" id="camas_uci_disp" formControlName="camas_uci_disp" />\r
                <div class="field-message" *ngIf="form.get('camas_uci_disp')?.hasError('maxExceeded') && form.get('camas_uci_disp')?.touched">\r
                    Las camas UCI disponibles no pueden ser mayores a las camas totales.\r
                </div>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Hospitalarias">Camas Hospitalarias</label>\r
                <input type="number" id="camas_hospitalarias" formControlName="camas_hospitalarias" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Rayos">\xBFTiene Rayos X?</label>\r
                <select id="equipo_rayos_x" formControlName="equipo_rayos_x">\r
                    <option value="">Seleccione</option>\r
                    <option value="SI">S\xED</option>\r
                    <option value="NO">No</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="PlantaOxigeno">\xBFTiene Planta de Ox\xEDgeno?</label>\r
                <select id="planta_oxigeno" formControlName="planta_oxigeno">\r
                    <option value="">Seleccione</option>\r
                    <option value="SI">S\xED</option>\r
                    <option value="NO">No</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Infraestructura">Estado Infraestructura (1-5)</label>\r
                <input type="number" id="estado_infra" formControlName="estado_infra" min="1" max="5"\r
                    placeholder="1. Malo - 5. \xD3ptimo" />\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F465} Personal y Recursos Humanos</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group">\r
                <label for="Programados">M\xE9dicos Programados</label>\r
                <input type="number" id="med_prog" formControlName="med_prog"/>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Servicio">M\xE9dicos en Servicio (Hoy)</label>\r
                <input type="number" id="med_exist" formControlName="med_exist" />\r
                <div class="field-message" *ngIf="form.get('med_exist')?.hasError('maxExceeded') && form.get('med_exist')?.touched">\r
                    Los m\xE9dicos en servicio no pueden ser mayores a los m\xE9dicos programados.\r
                </div>\r
            </div>\r
\r
            <div class="form-group full-width">\r
                <label for="Horas">\xBFAtenci\xF3n 24 Horas?</label>\r
                <select id="turno_24h" formControlName="turno_24h">\r
                    <option value="">Seleccione</option>\r
                    <option value="SI">S\xED</option>\r
                    <option value="NO">No</option>\r
                </select>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F6A8} Vigilancia Epidemiol\xF3gica</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group">\r
                <label for="Semana">Semana Epidemiol\xF3gica</label>\r
                <input type="number" id="semana_epi" formControlName="semana_epi" min="1" max="53" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Dengue">Casos Dengue (Confirmados)</label>\r
                <input type="number" id="casos_dengue" formControlName="casos_dengue" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Anemia">Casos Anemia</label>\r
                <input type="number" id="casos_anemia" formControlName="casos_anemia" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="Materna">Mortalidad Materna</label>\r
                <input type="number" id="mort_materna" formControlName="mort_materna" />\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F4C5} Registro Temporal</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group full-width">\r
                <label for="fechaCorte">Fecha de Corte de Informaci\xF3n</label>\r
                <input type="date" id="fecha_corte" formControlName="fecha_corte" [attr.min]="minDate" />\r
                <div class="field-message" *ngIf="form.get('fecha_corte')?.hasError('invalidDate') && form.get('fecha_corte')?.touched">\r
                    La fecha de corte debe ser mayor al d\xEDa de hoy.\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="d-flex justify-content-end gap-3 mt-5 mb-4">\r
\r
        <button\r
            type="button"\r
            (click)="limpiarFormulario()"\r
            class="btn btn-limpiar">\r
\r
            <i class="bi bi-arrow-counterclockwise"></i>\r
            Limpiar\r
\r
        </button>\r
\r
        <button type="submit" class="btn btn-guardar">\r
            <i class="bi bi-floppy"></i>\r
            Guardar Reporte\r
\r
        </button>\r
\r
    </div>\r
\r
</form>`, styles: ["/* src/app/pages/salud/salud.css */\n.main-form-container {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  max-width: 900px;\n  margin: 0 auto;\n  max-height: calc(100vh - 150px);\n  overflow-y: auto;\n}\n.btn-limpiar {\n  background: #fff;\n  color: #7A1C1C;\n  border: 2px solid #7A1C1C;\n  padding: 10px 24px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: .25s;\n}\n.btn-limpiar:hover {\n  background: #7A1C1C;\n  color: #fff;\n}\n.btn-guardar {\n  background: #198754;\n  color: #fff;\n  border: none;\n  padding: 10px 28px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: all .25s ease;\n  box-shadow: 0 4px 12px rgba(25, 135, 84, .25);\n}\n.btn-guardar:hover:not(:disabled) {\n  background: #157347;\n  color: #fff;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 18px rgba(25, 135, 84, .35);\n}\n.btn-guardar:active:not(:disabled) {\n  transform: scale(.98);\n}\n.btn-guardar:disabled {\n  background: #c7c7c7;\n  color: #6c757d;\n  cursor: not-allowed;\n  box-shadow: none;\n  opacity: 1;\n  transform: none;\n}\n.form-container {\n  background: #ffffff;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);\n  border: 1px solid #e9ecef;\n}\n.section-header {\n  background-color: #7A1C1C;\n  color: #ffffff;\n  padding: 14px 20px;\n}\n.section-header h3 {\n  margin: 0;\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  padding: 20px;\n}\n.message {\n  display: block;\n  width: 100%;\n  max-width: 900px;\n  margin: 0 auto 16px;\n  padding: 12px 16px;\n  border-radius: 10px;\n  border: 1px solid #7a1c1c;\n  background-color: #fff1f1;\n  color: #7a1c1c;\n  font-weight: 600;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}\n.message:empty {\n  display: none;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #7a1c1c;\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.7;\n  transition: opacity 0.2s ease;\n}\n.close-btn:hover {\n  opacity: 1;\n}\n.field-message {\n  margin-top: 8px;\n  color: #7a1c1c;\n  background: #fff1f1;\n  border: 1px solid #f5c2c7;\n  padding: 10px 12px;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.field-message.warning {\n  background: #fff9e6;\n  border-color: #ffecb3;\n  color: #8a6d00;\n}\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group label {\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: #495057;\n}\n.form-group input,\n.form-group select {\n  width: 100%;\n  padding: 10px 14px;\n  font-size: 0.95rem;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  background-color: #ffffff;\n  color: #212529;\n  transition: all 0.2s ease-in-out;\n}\n.form-group input:focus,\n.form-group select:focus {\n  outline: none;\n  border-color: #7A1C1C;\n  box-shadow: 0 0 0 3px rgba(122, 28, 28, 0.1);\n}\n.form-group input[readonly] {\n  background-color: #f8f9fa;\n  color: #6c757d;\n  cursor: not-allowed;\n}\n.form-group input.ng-invalid.ng-touched,\n.form-group select.ng-invalid.ng-touched {\n  border-color: #dc3545;\n  background-color: #fff5f5;\n  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);\n}\n.full-width {\n  grid-column: span 2;\n}\n@media (max-width: 768px) {\n  .form-grid {\n    grid-template-columns: 1fr;\n  }\n  .full-width {\n    grid-column: span 1;\n  }\n}\n/*# sourceMappingURL=salud.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i09.\u0275setClassDebugInfo(Salud, { className: "Salud", filePath: "src/app/pages/salud/salud.ts", lineNumber: 16 });
})();
(() => {
  const id = "src%2Fapp%2Fpages%2Fsalud%2Fsalud.ts%40Salud";
  function Salud_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i09.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i09.\u0275\u0275replaceMetadata(Salud, m.default, [i09, i13], [ReactiveFormsModule, NgIf, Component6], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && Salud_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && Salud_HmrLoad(d.timestamp)));
})();

// src/app/pages/educacion/educacion.ts
import { Component as Component7, inject as inject6 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { NgIf as NgIf2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common.js?v=e10ab860";
import { FormBuilder as FormBuilder2, ReactiveFormsModule as ReactiveFormsModule2, Validators as Validators2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";

// src/app/services/educacion.ts
import { Injectable as Injectable4, inject as inject5 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { HttpClient as HttpClient4 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common_http.js?v=e10ab860";
import * as i010 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
var EducacionService = class _EducacionService {
  http = inject5(HttpClient4);
  api = "http://192.168.2.194:3000/api/educacion";
  obtenerInstitucion(id) {
    return this.http.get(`${this.api}/${id}`);
  }
  obtenerReporteCompleto(id) {
    return this.http.get(`${this.api}/${id}/completo`);
  }
  guardarReporteEducacion(dto) {
    return this.http.post(this.api, dto);
  }
  obtenerHistorial(filtros) {
    const params = {};
    if (filtros?.tipo)
      params.tipo = filtros.tipo;
    if (filtros?.busqueda)
      params.busqueda = filtros.busqueda;
    if (filtros?.fecha_desde)
      params.fecha_desde = filtros.fecha_desde;
    if (filtros?.fecha_hasta)
      params.fecha_hasta = filtros.fecha_hasta;
    if (filtros?.usuario)
      params.usuario = filtros.usuario;
    return this.http.get("http://192.168.2.194:3000/api/historial", { params });
  }
  static \u0275fac = function EducacionService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EducacionService)();
  };
  static \u0275prov = /* @__PURE__ */ i010.\u0275\u0275defineInjectable({ token: _EducacionService, factory: _EducacionService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i010.\u0275setClassMetadata(EducacionService, [{
    type: Injectable4,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/pages/educacion/educacion.ts
import * as i011 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i14 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";
function Educacion_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i011.\u0275\u0275getCurrentView();
    i011.\u0275\u0275elementStart(0, "div", 100)(1, "span");
    i011.\u0275\u0275text(2);
    i011.\u0275\u0275elementEnd();
    i011.\u0275\u0275elementStart(3, "button", 101);
    i011.\u0275\u0275listener("click", function Educacion_div_3_Template_button_click_3_listener() {
      i011.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i011.\u0275\u0275nextContext();
      return i011.\u0275\u0275resetView(ctx_r1.cerrarMensaje());
    });
    i011.\u0275\u0275text(4, "\u2715");
    i011.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = i011.\u0275\u0275nextContext();
    i011.\u0275\u0275advance(2);
    i011.\u0275\u0275textInterpolate(ctx_r1.mensajeGuardado);
  }
}
function Educacion_div_14_Template(rf, ctx) {
  if (rf & 1) {
    i011.\u0275\u0275elementStart(0, "div", 102);
    i011.\u0275\u0275text(1);
    i011.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = i011.\u0275\u0275nextContext();
    i011.\u0275\u0275advance();
    i011.\u0275\u0275textInterpolate(ctx_r1.codModularMensaje);
  }
}
function Educacion_div_108_Template(rf, ctx) {
  if (rf & 1) {
    i011.\u0275\u0275elementStart(0, "div", 103);
    i011.\u0275\u0275text(1, " Ingrese un n\xFAmero v\xE1lido entre 0 y 100. ");
    i011.\u0275\u0275elementEnd();
  }
}
function Educacion_div_130_Template(rf, ctx) {
  if (rf & 1) {
    i011.\u0275\u0275elementStart(0, "div", 103);
    i011.\u0275\u0275text(1, " Ingrese un n\xFAmero v\xE1lido entre 0 y 100. ");
    i011.\u0275\u0275elementEnd();
  }
}
function Educacion_div_203_Template(rf, ctx) {
  if (rf & 1) {
    i011.\u0275\u0275elementStart(0, "div", 103);
    i011.\u0275\u0275text(1, " La fecha de corte debe ser mayor al d\xEDa de hoy. ");
    i011.\u0275\u0275elementEnd();
  }
}
var Educacion = class _Educacion {
  fb = inject6(FormBuilder2);
  educacionService = inject6(EducacionService);
  authService = inject6(AuthService);
  mensajeGuardado = "";
  codModularMensaje = "";
  minDate = this.getTodayString();
  cerrarMensaje() {
    this.mensajeGuardado = "";
  }
  form = this.fb.group({
    //==============================
    // DIV 1 - IDENTIFICACIÓN DE LA INSTITUCIÓN EDUCATIVA
    //==============================
    cod_modular: ["", [Validators2.required, Validators2.pattern(/^\d{1,8}$/)]],
    nombre_ie: [""],
    dre: ["LAMBAYEQUE"],
    ugel: ["CHICLAYO"],
    nivel: [""],
    gestion: ["P\xFAblica de gesti\xF3n directa"],
    provincia: [""],
    distrito: [""],
    centro_poblado: [""],
    //==============================
    // DIV 2 - PROYECTOS DE INVERSIÓN (INVIERTE.PE)
    //==============================
    id_proyecto: [0],
    estado_proyecto: [""],
    avance_fisico: [0, [Validators2.min(0), Validators2.max(100)]],
    monto_total: [0],
    //==============================
    // DIV 3 - INFRAESTRUCTURA Y EQUIPAMIENTO
    //==============================
    estado_infra: [0],
    aulas_buenas: [0],
    mobiliario_optimo_porc: [0, [Validators2.min(0), Validators2.max(100)]],
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
    tiene_psicologo: [""],
    //==============================
    // DIV 5 - METADATOS
    //==============================
    fecha_corte: ["", Validators2.required]
  });
  buscarInstitucion() {
    this.codModularMensaje = "";
    const id = Number(this.form.get("cod_modular")?.value);
    if (!id)
      return;
    this.educacionService.obtenerReporteCompleto(id).subscribe({
      next: (resp) => {
        if (!resp.success || !resp.data || !resp.data.institucion) {
          this.codModularMensaje = "Instituci\xF3n no existe, se registrar\xE1 nueva instituci\xF3n.";
          this.limpiarDatosInstitucion();
          const control = this.form.get("cod_modular");
          const val = control?.value;
          if (control && /^\d{1,8}$/.test(String(val))) {
            control.setErrors(null);
          }
          return;
        }
        this.codModularMensaje = "";
        const data = resp.data;
        const ie = data.institucion;
        const eq = data.equipamiento;
        const rh = data.recursos_humanos;
        const cb = data.condiciones_basicas;
        const pr = data.proyecto;
        const patchValues = {};
        if (ie) {
          patchValues["nombre_ie"] = ie.nombre_ie || "";
          patchValues["dre"] = ie.dre || "LAMBAYEQUE";
          patchValues["ugel"] = ie.ugel || "CHICLAYO";
          patchValues["nivel"] = ie.nivel || "";
          patchValues["gestion"] = ie.gestion || "P\xFAblica de gesti\xF3n directa";
          patchValues["provincia"] = ie.provincia || "";
          patchValues["distrito"] = ie.distrito || "";
          patchValues["centro_poblado"] = ie.centro_poblado || "";
        }
        patchValues["estado_infra"] = 0;
        patchValues["aulas_buenas"] = 0;
        patchValues["mobiliario_optimo_porc"] = 0;
        patchValues["computadoras_total"] = 0;
        patchValues["tiene_internet"] = false;
        patchValues["servicio_agua"] = false;
        patchValues["servicio_desague"] = false;
        patchValues["servicio_luz"] = false;
        patchValues["riesgo_critico"] = false;
        patchValues["total_matricula"] = 0;
        patchValues["docentes_requeridos"] = 0;
        patchValues["docentes_nombrados"] = 0;
        patchValues["docentes_contratados"] = 0;
        patchValues["personal_admin"] = 0;
        patchValues["tiene_psicologo"] = "";
        patchValues["id_proyecto"] = 0;
        patchValues["estado_proyecto"] = "";
        patchValues["avance_fisico"] = 0;
        patchValues["monto_total"] = 0;
        this.form.patchValue(patchValues);
      },
      error: (err) => {
        console.error(err);
        if (err?.status === 404) {
          this.codModularMensaje = "Instituci\xF3n no existe, se registrar\xE1 nueva instituci\xF3n.";
          this.limpiarDatosInstitucion();
          const control404 = this.form.get("cod_modular");
          const v404 = control404?.value;
          if (control404 && /^\d{1,8}$/.test(String(v404))) {
            control404.setErrors(null);
          }
          return;
        }
        this.codModularMensaje = "Error al consultar la instituci\xF3n.";
      }
    });
  }
  handleIdInput() {
    this.codModularMensaje = "";
    const control = this.form.get("cod_modular");
    const val = control?.value;
    if (control && /^\d{1,8}$/.test(String(val))) {
      control.setErrors(null);
    }
  }
  validarCamposObligatorios() {
    const camposFaltantes = [];
    const camposInstitucion = [
      "cod_modular",
      "nombre_ie",
      "nivel",
      "provincia",
      "distrito"
    ];
    for (const campo of camposInstitucion) {
      const control = this.form.get(campo);
      const value = control?.value;
      if (!value || typeof value === "string" && value.trim() === "") {
        camposFaltantes.push(campo);
        control?.markAsTouched();
        control?.setErrors({ required: true });
      }
    }
    const estProyecto = this.form.get("estado_proyecto");
    if (!estProyecto?.value || estProyecto.value.trim() === "") {
      camposFaltantes.push("estado_proyecto");
      estProyecto?.markAsTouched();
      estProyecto?.setErrors({ required: true });
    }
    const fechaCorte = this.form.get("fecha_corte");
    if (!fechaCorte?.value || fechaCorte.value.trim() === "") {
      camposFaltantes.push("fecha_corte");
      fechaCorte?.markAsTouched();
      fechaCorte?.setErrors({ required: true });
    }
    return {
      valido: camposFaltantes.length === 0,
      camposFaltantes
    };
  }
  guardarReporte() {
    const validacion = this.validarCamposObligatorios();
    if (!validacion.valido) {
      this.mensajeGuardado = "Falta completar campos";
      return;
    }
    const rawValues = this.form.getRawValue();
    const fechaCorte = this.parseDate(rawValues.fecha_corte) || /* @__PURE__ */ new Date();
    const dto = {
      cod_modular: Number(rawValues.cod_modular),
      nombre_ie: rawValues.nombre_ie || "",
      dre: rawValues.dre || "LAMBAYEQUE",
      ugel: rawValues.ugel || "CHICLAYO",
      nivel: rawValues.nivel || "",
      gestion: rawValues.gestion || "P\xFAblica de gesti\xF3n directa",
      provincia: rawValues.provincia || "",
      distrito: rawValues.distrito || "",
      centro_poblado: rawValues.centro_poblado || "",
      id_proyecto: Number(rawValues.id_proyecto),
      estado_proyecto: rawValues.estado_proyecto || "",
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
      tiene_psicologo: rawValues.tiene_psicologo === "SI",
      fecha_corte: fechaCorte,
      nombre_usuario: this.authService.obtenerUsuario()?.usuario || ""
    };
    this.mensajeGuardado = "";
    this.educacionService.guardarReporteEducacion(dto).subscribe({
      next: (resp) => {
        this.mensajeGuardado = "Reporte registrado correctamente.";
        setTimeout(() => {
          this.mensajeGuardado = "";
        }, 5e3);
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.message || "";
        this.mensajeGuardado = msg.includes("Proyecto ya existente") ? "Proyecto ya existente" : "Error al registrar el reporte.";
      }
    });
  }
  parseBoolean(value) {
    return value === true || value === "true" || value === "SI" || value === "Si" || value === "YES" || value === "yes";
  }
  parseDate(value) {
    if (!value && value !== 0)
      return null;
    if (value instanceof Date)
      return isNaN(value.getTime()) ? null : value;
    const s = String(value).trim();
    const dmy = /^([0-3]?\d)\/([0-1]?\d)\/(\d{4})$/;
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
    let m;
    if (m = s.match(dmy)) {
      const day = Number(m[1]);
      const month = Number(m[2]) - 1;
      const year = Number(m[3]);
      const dt2 = new Date(year, month, day);
      return isNaN(dt2.getTime()) ? null : dt2;
    }
    if (m = s.match(ymd)) {
      const year = Number(m[1]);
      const month = Number(m[2]) - 1;
      const day = Number(m[3]);
      const dt2 = new Date(year, month, day);
      return isNaN(dt2.getTime()) ? null : dt2;
    }
    const dt = new Date(s);
    return isNaN(dt.getTime()) ? null : dt;
  }
  getTodayString() {
    const d = /* @__PURE__ */ new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  limpiarDatosInstitucion() {
    this.form.patchValue({
      nombre_ie: "",
      nivel: "",
      provincia: "",
      distrito: "",
      centro_poblado: ""
    });
  }
  limpiarFormulario() {
    this.form.reset({
      cod_modular: "",
      nombre_ie: "",
      dre: "LAMBAYEQUE",
      ugel: "CHICLAYO",
      nivel: "",
      gestion: "P\xFAblica de gesti\xF3n directa",
      provincia: "",
      distrito: "",
      centro_poblado: "",
      id_proyecto: 0,
      estado_proyecto: "",
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
      tiene_psicologo: "",
      fecha_corte: ""
    });
  }
  static \u0275fac = function Educacion_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Educacion)();
  };
  static \u0275cmp = /* @__PURE__ */ i011.\u0275\u0275defineComponent({ type: _Educacion, selectors: [["app-educacion"]], decls: 211, vars: 12, consts: [[1, "page-title"], ["class", "message", 4, "ngIf"], ["id", "Educacion", 1, "main-form-container", 3, "ngSubmit", "formGroup"], [1, "form-container"], [1, "section-header"], [1, "form-grid"], [1, "form-group", "full-width"], ["for", "cod_modular"], ["type", "number", "id", "cod_modular", "formControlName", "cod_modular", "min", "1", "step", "1", 3, "input", "blur"], ["class", "field-message warning", 4, "ngIf"], ["for", "nombre_ie"], ["type", "text", "id", "nombre_ie", "formControlName", "nombre_ie"], [1, "form-group"], ["for", "dre"], ["type", "text", "id", "dre", "formControlName", "dre", "value", "LAMBAYEQUE"], ["for", "ugel"], ["id", "ugel", "formControlName", "ugel"], ["value", "CHICLAYO"], ["value", "LAMBAYEQUE"], ["value", "FERRE\xD1AFE"], ["for", "nivel"], ["id", "nivel", "formControlName", "nivel"], ["value", ""], ["value", "Inicial"], ["value", "Primaria"], ["value", "Secundaria"], ["value", "Inicial - Primaria"], ["value", "Primaria - Secundaria"], ["value", "Inicial - Primaria - Secundaria"], ["value", "Superior No Universitario"], ["value", "Superior Universitario"], ["for", "gestion"], ["id", "gestion", "formControlName", "gestion"], ["value", "P\xFAblica de gesti\xF3n directa"], ["value", "P\xFAblica de gesti\xF3n privada"], ["value", "Privada"], ["for", "provincia"], ["type", "text", "id", "provincia", "formControlName", "provincia"], ["for", "distrito"], ["type", "text", "id", "distrito", "formControlName", "distrito"], ["for", "centro_poblado"], ["type", "text", "id", "centro_poblado", "formControlName", "centro_poblado"], ["for", "id_proyecto"], ["type", "number", "id", "id_proyecto", "formControlName", "id_proyecto"], ["for", "estado_proyecto"], ["id", "estado_proyecto", "formControlName", "estado_proyecto"], ["value", "En Ejecuci\xF3n"], ["value", "Aprobado"], ["value", "Viable"], ["value", "Paralizado"], ["value", "Concluido"], ["for", "avance_fisico"], ["type", "number", "id", "avance_fisico", "formControlName", "avance_fisico", "min", "0", "max", "100"], ["class", "field-message", 4, "ngIf"], ["for", "monto_total"], ["type", "number", "id", "monto_total", "formControlName", "monto_total"], ["for", "estado_infra"], ["type", "number", "id", "estado_infra", "formControlName", "estado_infra"], ["for", "aulas_buenas"], ["type", "number", "id", "aulas_buenas", "formControlName", "aulas_buenas"], ["for", "mobiliario_optimo_porc"], ["type", "number", "id", "mobiliario_optimo_porc", "formControlName", "mobiliario_optimo_porc", "min", "0", "max", "100", "step", "1"], ["for", "computadoras_total"], ["type", "number", "id", "computadoras_total", "formControlName", "computadoras_total"], [1, "checkbox-section"], [1, "checkbox-section-title"], [1, "checkbox-grid"], [1, "checkbox-group"], ["type", "checkbox", "id", "servicio_agua", "formControlName", "servicio_agua", 3, "value"], ["for", "servicio_agua"], ["type", "checkbox", "id", "servicio_desague", "formControlName", "servicio_desague", 3, "value"], ["for", "servicio_desague"], ["type", "checkbox", "id", "servicio_luz", "formControlName", "servicio_luz", 3, "value"], ["for", "servicio_luz"], ["type", "checkbox", "id", "tiene_internet", "formControlName", "tiene_internet", 3, "value"], ["for", "tiene_internet"], [1, "checkbox-group", 2, "background", "#fff5f5", "border", "1px dashed #e74c3c", "padding", "10px", "border-radius", "4px"], ["type", "checkbox", "id", "riesgo_critico", "formControlName", "riesgo_critico", 3, "value"], ["for", "riesgo_critico", 2, "color", "#e74c3c", "font-weight", "bold"], ["for", "total_matricula"], ["type", "number", "id", "total_matricula", "formControlName", "total_matricula"], ["for", "docentes_requeridos"], ["type", "number", "id", "docentes_requeridos", "formControlName", "docentes_requeridos"], ["for", "docentes_nombrados"], ["type", "number", "id", "docentes_nombrados", "formControlName", "docentes_nombrados"], ["for", "docentes_contratados"], ["type", "number", "id", "docentes_contratados", "formControlName", "docentes_contratados"], ["for", "personal_admin"], ["type", "number", "id", "personal_admin", "formControlName", "personal_admin"], ["for", "tiene_psicologo"], ["id", "tiene_psicologo", "formControlName", "tiene_psicologo"], ["value", "SI"], ["value", "NO"], ["for", "fecha_corte"], ["type", "date", "id", "fecha_corte", "formControlName", "fecha_corte"], [1, "d-flex", "justify-content-end", "gap-3", "mt-5", "mb-4"], ["type", "button", 1, "btn", "btn-limpiar", 3, "click"], [1, "bi", "bi-arrow-counterclockwise"], ["type", "submit", 1, "btn", "btn-guardar"], [1, "bi", "bi-floppy"], [1, "message"], ["type", "button", 1, "close-btn", 3, "click"], [1, "field-message", "warning"], [1, "field-message"]], template: function Educacion_Template(rf, ctx) {
    if (rf & 1) {
      i011.\u0275\u0275elementStart(0, "div", 0)(1, "h1");
      i011.\u0275\u0275text(2, "Reporte de Indicadores de Educaci\xF3n");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275template(3, Educacion_div_3_Template, 5, 1, "div", 1);
      i011.\u0275\u0275elementStart(4, "form", 2);
      i011.\u0275\u0275listener("ngSubmit", function Educacion_Template_form_ngSubmit_4_listener() {
        return ctx.guardarReporte();
      });
      i011.\u0275\u0275elementStart(5, "div", 3)(6, "div", 4)(7, "h3");
      i011.\u0275\u0275text(8, "\u{1F4CB} Identificaci\xF3n de la Instituci\xF3n Educativa");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(9, "div", 5)(10, "div", 6)(11, "label", 7);
      i011.\u0275\u0275text(12, "C\xF3digo Modular");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(13, "input", 8);
      i011.\u0275\u0275listener("input", function Educacion_Template_input_input_13_listener() {
        return ctx.handleIdInput();
      })("blur", function Educacion_Template_input_blur_13_listener() {
        return ctx.buscarInstitucion();
      });
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275template(14, Educacion_div_14_Template, 2, 1, "div", 9);
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(15, "div", 6)(16, "label", 10);
      i011.\u0275\u0275text(17, "Nombre de la I.E.");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(18, "input", 11);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(19, "div", 12)(20, "label", 13);
      i011.\u0275\u0275text(21, "DRE");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(22, "input", 14);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(23, "div", 12)(24, "label", 15);
      i011.\u0275\u0275text(25, "UGEL");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(26, "select", 16)(27, "option", 17);
      i011.\u0275\u0275text(28, "CHICLAYO");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(29, "option", 18);
      i011.\u0275\u0275text(30, "LAMBAYEQUE");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(31, "option", 19);
      i011.\u0275\u0275text(32, "FERRE\xD1AFE");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(33, "div", 12)(34, "label", 20);
      i011.\u0275\u0275text(35, "Nivel / Modalidad");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(36, "select", 21)(37, "option", 22);
      i011.\u0275\u0275text(38, "Seleccione Nivel");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(39, "option", 23);
      i011.\u0275\u0275text(40, "Inicial");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(41, "option", 24);
      i011.\u0275\u0275text(42, "Primaria");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(43, "option", 25);
      i011.\u0275\u0275text(44, "Secundaria");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(45, "option", 26);
      i011.\u0275\u0275text(46, "Inicial - Primaria");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(47, "option", 27);
      i011.\u0275\u0275text(48, "Primaria - Secundaria");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(49, "option", 28);
      i011.\u0275\u0275text(50, "Inicial - Primaria - Secundaria");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(51, "option", 29);
      i011.\u0275\u0275text(52, "Superior No Universitario");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(53, "option", 30);
      i011.\u0275\u0275text(54, "Superior Universitario");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(55, "div", 12)(56, "label", 31);
      i011.\u0275\u0275text(57, "Tipo de Gesti\xF3n");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(58, "select", 32)(59, "option", 22);
      i011.\u0275\u0275text(60, "Seleccione Gesti\xF3n");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(61, "option", 33);
      i011.\u0275\u0275text(62, "P\xFAblica de gesti\xF3n directa");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(63, "option", 34);
      i011.\u0275\u0275text(64, "P\xFAblica de gesti\xF3n privada");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(65, "option", 35);
      i011.\u0275\u0275text(66, "Privada");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(67, "div", 12)(68, "label", 36);
      i011.\u0275\u0275text(69, "Provincia");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(70, "input", 37);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(71, "div", 12)(72, "label", 38);
      i011.\u0275\u0275text(73, "Distrito");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(74, "input", 39);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(75, "div", 12)(76, "label", 40);
      i011.\u0275\u0275text(77, "Centro Poblado");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(78, "input", 41);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd()()();
      i011.\u0275\u0275elementStart(79, "div", 3)(80, "div", 4)(81, "h3");
      i011.\u0275\u0275text(82, "\u{1F3D7}\uFE0F Proyectos de Inversi\xF3n (INVIERTE.PE)");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(83, "div", 5)(84, "div", 6)(85, "label", 42);
      i011.\u0275\u0275text(86, "ID Proyecto");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(87, "input", 43);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(88, "div", 12)(89, "label", 44);
      i011.\u0275\u0275text(90, "Estado del Proyecto");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(91, "select", 45)(92, "option", 22);
      i011.\u0275\u0275text(93, "Seleccione Estado");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(94, "option", 46);
      i011.\u0275\u0275text(95, "En Ejecuci\xF3n");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(96, "option", 47);
      i011.\u0275\u0275text(97, "Aprobado");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(98, "option", 48);
      i011.\u0275\u0275text(99, "Viable");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(100, "option", 49);
      i011.\u0275\u0275text(101, "Paralizado");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(102, "option", 50);
      i011.\u0275\u0275text(103, "Concluido");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(104, "div", 12)(105, "label", 51);
      i011.\u0275\u0275text(106, "Avance F\xEDsico (%)");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(107, "input", 52);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275template(108, Educacion_div_108_Template, 2, 0, "div", 53);
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(109, "div", 12)(110, "label", 54);
      i011.\u0275\u0275text(111, "Monto Total Inversi\xF3n");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(112, "input", 55);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd()()();
      i011.\u0275\u0275elementStart(113, "div", 3)(114, "div", 4)(115, "h3");
      i011.\u0275\u0275text(116, "\u{1F3E2} Infraestructura y Equipamiento");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(117, "div", 5)(118, "div", 12)(119, "label", 56);
      i011.\u0275\u0275text(120, "Estado Infraestructura");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(121, "input", 57);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(122, "div", 12)(123, "label", 58);
      i011.\u0275\u0275text(124, "Aulas en Buen Estado");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(125, "input", 59);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(126, "div", 12)(127, "label", 60);
      i011.\u0275\u0275text(128, "Mobiliario \xD3ptimo (%)");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(129, "input", 61);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275template(130, Educacion_div_130_Template, 2, 0, "div", 53);
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(131, "div", 12)(132, "label", 62);
      i011.\u0275\u0275text(133, "Total Computadoras");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(134, "input", 63);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(135, "div", 64)(136, "label", 65);
      i011.\u0275\u0275text(137, "Servicios B\xE1sicos y Riesgos");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(138, "div", 66)(139, "div", 67);
      i011.\u0275\u0275element(140, "input", 68);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementStart(141, "label", 69);
      i011.\u0275\u0275text(142, "Servicio Agua");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(143, "div", 67);
      i011.\u0275\u0275element(144, "input", 70);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementStart(145, "label", 71);
      i011.\u0275\u0275text(146, "Servicio Desag\xFCe");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(147, "div", 67);
      i011.\u0275\u0275element(148, "input", 72);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementStart(149, "label", 73);
      i011.\u0275\u0275text(150, "Servicio Luz");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(151, "div", 67);
      i011.\u0275\u0275element(152, "input", 74);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementStart(153, "label", 75);
      i011.\u0275\u0275text(154, "Internet Operativo");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(155, "div", 76);
      i011.\u0275\u0275element(156, "input", 77);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementStart(157, "label", 78);
      i011.\u0275\u0275text(158, "Riesgo de Derrumbe");
      i011.\u0275\u0275elementEnd()()()()();
      i011.\u0275\u0275elementStart(159, "div", 3)(160, "div", 4)(161, "h3");
      i011.\u0275\u0275text(162, "\u{1F465} Personal Docente y Administrativo");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(163, "div", 5)(164, "div", 12)(165, "label", 79);
      i011.\u0275\u0275text(166, "Alumnos Matriculados");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(167, "input", 80);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(168, "div", 12)(169, "label", 81);
      i011.\u0275\u0275text(170, "Docentes Requeridos");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(171, "input", 82);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(172, "div", 12)(173, "label", 83);
      i011.\u0275\u0275text(174, "Docentes Nombrados");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(175, "input", 84);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(176, "div", 12)(177, "label", 85);
      i011.\u0275\u0275text(178, "Docentes Contratados");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(179, "input", 86);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(180, "div", 12)(181, "label", 87);
      i011.\u0275\u0275text(182, "Personal Administrativo");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(183, "input", 88);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(184, "div", 12)(185, "label", 89);
      i011.\u0275\u0275text(186, "Psic\xF3logo en la I.E.");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(187, "select", 90)(188, "option", 22);
      i011.\u0275\u0275text(189, "Seleccione");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(190, "option", 91);
      i011.\u0275\u0275text(191, "S\xED");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(192, "option", 92);
      i011.\u0275\u0275text(193, "No");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275elementEnd()()();
      i011.\u0275\u0275elementStart(194, "div", 3)(195, "div", 4)(196, "h3");
      i011.\u0275\u0275text(197, "\u{1F4C5} Metadatos");
      i011.\u0275\u0275elementEnd()();
      i011.\u0275\u0275elementStart(198, "div", 5)(199, "div", 6)(200, "label", 93);
      i011.\u0275\u0275text(201, "Fecha de Corte");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275element(202, "input", 94);
      i011.\u0275\u0275controlCreate();
      i011.\u0275\u0275template(203, Educacion_div_203_Template, 2, 0, "div", 53);
      i011.\u0275\u0275elementEnd()()();
      i011.\u0275\u0275elementStart(204, "div", 95)(205, "button", 96);
      i011.\u0275\u0275listener("click", function Educacion_Template_button_click_205_listener() {
        return ctx.limpiarFormulario();
      });
      i011.\u0275\u0275element(206, "i", 97);
      i011.\u0275\u0275text(207, " Limpiar ");
      i011.\u0275\u0275elementEnd();
      i011.\u0275\u0275elementStart(208, "button", 98);
      i011.\u0275\u0275element(209, "i", 99);
      i011.\u0275\u0275text(210, " Guardar Reporte ");
      i011.\u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      i011.\u0275\u0275advance(3);
      i011.\u0275\u0275property("ngIf", ctx.mensajeGuardado);
      i011.\u0275\u0275advance();
      i011.\u0275\u0275property("formGroup", ctx.form);
      i011.\u0275\u0275advance(9);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance();
      i011.\u0275\u0275property("ngIf", ctx.codModularMensaje);
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(10);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(22);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(12);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(9);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(16);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance();
      i011.\u0275\u0275property("ngIf", ctx.form.get("avance_fisico")?.invalid && ctx.form.get("avance_fisico")?.touched);
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(9);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance();
      i011.\u0275\u0275property("ngIf", ctx.form.get("mobiliario_optimo_porc")?.invalid && ctx.form.get("mobiliario_optimo_porc")?.touched);
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(6);
      i011.\u0275\u0275property("value", "SI");
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275property("value", "SI");
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275property("value", "SI");
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275property("value", "SI");
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275property("value", "SI");
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(11);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(4);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance(15);
      i011.\u0275\u0275attribute("min", ctx.minDate);
      i011.\u0275\u0275control();
      i011.\u0275\u0275advance();
      i011.\u0275\u0275property("ngIf", ctx.form.get("fecha_corte")?.hasError("invalidDate") && ctx.form.get("fecha_corte")?.touched);
    }
  }, dependencies: [ReactiveFormsModule2, i14.\u0275NgNoValidate, i14.NgSelectOption, i14.\u0275NgSelectMultipleOption, i14.DefaultValueAccessor, i14.NumberValueAccessor, i14.RangeValueAccessor, i14.CheckboxControlValueAccessor, i14.SelectControlValueAccessor, i14.SelectMultipleControlValueAccessor, i14.RadioControlValueAccessor, i14.NgControlStatus, i14.NgControlStatusGroup, i14.RequiredValidator, i14.MinLengthValidator, i14.MaxLengthValidator, i14.PatternValidator, i14.CheckboxRequiredValidator, i14.EmailValidator, i14.MinValidator, i14.MaxValidator, i14.FormControlDirective, i14.FormGroupDirective, i14.FormArrayDirective, i14.FormControlName, i14.FormGroupName, i14.FormArrayName, NgIf2], styles: ["\n.main-form-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  max-width: 900px;\n  margin: 0 auto;\n  max-height: calc(100vh - 150px);\n  overflow-y: auto;\n}\n.btn-limpiar[_ngcontent-%COMP%] {\n  background: #fff;\n  color: #7A1C1C;\n  border: 2px solid #7A1C1C;\n  padding: 10px 24px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: .25s;\n}\n.btn-limpiar[_ngcontent-%COMP%]:hover {\n  background: #7A1C1C;\n  color: #fff;\n}\n.btn-guardar[_ngcontent-%COMP%] {\n  background: #198754;\n  color: #fff;\n  border: none;\n  padding: 10px 28px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: all .25s ease;\n  box-shadow: 0 4px 12px rgba(25, 135, 84, .25);\n}\n.btn-guardar[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #157347;\n  color: #fff;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 18px rgba(25, 135, 84, .35);\n}\n.btn-guardar[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: scale(.98);\n}\n.btn-guardar[_ngcontent-%COMP%]:disabled {\n  background: #c7c7c7;\n  color: #6c757d;\n  cursor: not-allowed;\n  box-shadow: none;\n  opacity: 1;\n  transform: none;\n}\n.form-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);\n  border: 1px solid #e9ecef;\n}\n.section-header[_ngcontent-%COMP%] {\n  background-color: #7A1C1C;\n  color: #ffffff;\n  padding: 14px 20px;\n}\n.section-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  padding: 20px;\n}\n.message[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  max-width: 900px;\n  margin: 0 auto 16px;\n  padding: 12px 16px;\n  border-radius: 10px;\n  border: 1px solid #7a1c1c;\n  background-color: #fff1f1;\n  color: #7a1c1c;\n  font-weight: 600;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}\n.message[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n.close-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #7a1c1c;\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.7;\n  transition: opacity 0.2s ease;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.field-message[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  color: #7a1c1c;\n  background: #fff1f1;\n  border: 1px solid #f5c2c7;\n  padding: 10px 12px;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.field-message.warning[_ngcontent-%COMP%] {\n  background: #fff9e6;\n  border-color: #ffecb3;\n  color: #8a6d00;\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: #495057;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 10px 14px;\n  font-size: 0.95rem;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  background-color: #ffffff;\n  color: #212529;\n  transition: all 0.2s ease-in-out;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #7A1C1C;\n  box-shadow: 0 0 0 3px rgba(122, 28, 28, 0.1);\n}\n.form-group[_ngcontent-%COMP%]   input[readonly][_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  color: #6c757d;\n  cursor: not-allowed;\n}\n.form-group[_ngcontent-%COMP%]   input.ng-invalid.ng-touched[_ngcontent-%COMP%], \n.form-group[_ngcontent-%COMP%]   select.ng-invalid.ng-touched[_ngcontent-%COMP%] {\n  border-color: #dc3545;\n  background-color: #fff5f5;\n  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);\n}\n.full-width[_ngcontent-%COMP%] {\n  grid-column: span 2;\n}\n@media (max-width: 768px) {\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .full-width[_ngcontent-%COMP%] {\n    grid-column: span 1;\n  }\n}\n.checkbox-section[_ngcontent-%COMP%] {\n  padding: 20px;\n  margin-top: 10px;\n}\n.checkbox-section-title[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1rem;\n  font-weight: 600;\n  color: #495057;\n  margin-bottom: 16px;\n  padding-bottom: 8px;\n  border-bottom: 2px solid #7A1C1C;\n}\n.checkbox-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n  padding: 16px;\n  background-color: #f8f9fa;\n  border-radius: 8px;\n  border: 1px solid #e9ecef;\n}\n.checkbox-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 14px;\n  background-color: #ffffff;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  transition: all 0.2s ease-in-out;\n}\n.checkbox-group[_ngcontent-%COMP%]:hover {\n  border-color: #7A1C1C;\n  box-shadow: 0 2px 8px rgba(122, 28, 28, 0.08);\n}\n.checkbox-group[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n  accent-color: #7A1C1C;\n  flex-shrink: 0;\n}\n.checkbox-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 500;\n  color: #212529;\n  cursor: pointer;\n  margin: 0;\n  flex: 1;\n}\n.checkbox-group[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%]:checked    + label[_ngcontent-%COMP%] {\n  color: #7A1C1C;\n  font-weight: 600;\n}\n.checkbox-group[_ngcontent-%COMP%]:has(input[type=checkbox]:checked) {\n  background-color: #fff5f5;\n  border-color: #7A1C1C;\n}\n@media (max-width: 768px) {\n  .checkbox-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=educacion.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i011.\u0275setClassMetadata(Educacion, [{
    type: Component7,
    args: [{ selector: "app-educacion", standalone: true, imports: [ReactiveFormsModule2, NgIf2], template: `<div class="page-title">\r
    <h1>Reporte de Indicadores de Educaci\xF3n</h1>\r
</div>\r
\r
<div class="message" *ngIf="mensajeGuardado">\r
    <span>{{ mensajeGuardado }}</span>\r
    <button type="button" class="close-btn" (click)="cerrarMensaje()">\u2715</button>\r
</div>\r
\r
<form [formGroup]="form" (ngSubmit)="guardarReporte()" class="main-form-container" id="Educacion">\r
\r
    <!-- ==================================================== -->\r
    <!-- IDENTIFICACI\xD3N DE LA INSTITUCI\xD3N EDUCATIVA -->\r
    <!-- ==================================================== -->\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F4CB} Identificaci\xF3n de la Instituci\xF3n Educativa</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group full-width">\r
                <label for="cod_modular">C\xF3digo Modular</label>\r
                <input type="number" id="cod_modular" formControlName="cod_modular" (input)="handleIdInput()" (blur)="buscarInstitucion()" min="1" step="1" />\r
                <div class="field-message warning" *ngIf="codModularMensaje">{{ codModularMensaje }}</div>\r
            </div>\r
\r
            <div class="form-group full-width">\r
                <label for="nombre_ie">Nombre de la I.E.</label>\r
                <input type="text" id="nombre_ie" formControlName="nombre_ie" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="dre">DRE</label>\r
                <input type="text" id="dre" formControlName="dre" value="LAMBAYEQUE" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="ugel">UGEL</label>\r
                <select id="ugel" formControlName="ugel">\r
                    <option value="CHICLAYO">CHICLAYO</option>\r
                    <option value="LAMBAYEQUE">LAMBAYEQUE</option>\r
                    <option value="FERRE\xD1AFE">FERRE\xD1AFE</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="nivel">Nivel / Modalidad</label>\r
                <select id="nivel" formControlName="nivel">\r
                    <option value="">Seleccione Nivel</option>\r
                    <option value="Inicial">Inicial</option>\r
                    <option value="Primaria">Primaria</option>\r
                    <option value="Secundaria">Secundaria</option>\r
                    <option value="Inicial - Primaria">Inicial - Primaria</option>\r
                    <option value="Primaria - Secundaria">Primaria - Secundaria</option>\r
                    <option value="Inicial - Primaria - Secundaria">Inicial - Primaria - Secundaria</option>\r
                    <option value="Superior No Universitario">Superior No Universitario</option>\r
                    <option value="Superior Universitario">Superior Universitario</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="gestion">Tipo de Gesti\xF3n</label>\r
                <select id="gestion" formControlName="gestion">\r
                    <option value="">Seleccione Gesti\xF3n</option>\r
                    <option value="P\xFAblica de gesti\xF3n directa">P\xFAblica de gesti\xF3n directa</option>\r
                    <option value="P\xFAblica de gesti\xF3n privada">P\xFAblica de gesti\xF3n privada</option>\r
                    <option value="Privada">Privada</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="provincia">Provincia</label>\r
                <input type="text" id="provincia" formControlName="provincia" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="distrito">Distrito</label>\r
                <input type="text" id="distrito" formControlName="distrito" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="centro_poblado">Centro Poblado</label>\r
                <input type="text" id="centro_poblado" formControlName="centro_poblado" />\r
            </div>\r
        </div>\r
    </div>\r
\r
    <!-- ==================================================== -->\r
    <!-- PROYECTOS DE INVERSI\xD3N (INVIERTE.PE) -->\r
    <!-- ==================================================== -->\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F3D7}\uFE0F Proyectos de Inversi\xF3n (INVIERTE.PE)</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group full-width">\r
                <label for="id_proyecto">ID Proyecto</label>\r
                <input type="number" id="id_proyecto" formControlName="id_proyecto" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="estado_proyecto">Estado del Proyecto</label>\r
                <select id="estado_proyecto" formControlName="estado_proyecto">\r
                    <option value="">Seleccione Estado</option>\r
                    <option value="En Ejecuci\xF3n">En Ejecuci\xF3n</option>\r
                    <option value="Aprobado">Aprobado</option>\r
                    <option value="Viable">Viable</option>\r
                    <option value="Paralizado">Paralizado</option>\r
                    <option value="Concluido">Concluido</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="avance_fisico">Avance F\xEDsico (%)</label>\r
                <input type="number" id="avance_fisico" formControlName="avance_fisico" min="0" max="100" />\r
                <div class="field-message" *ngIf="form.get('avance_fisico')?.invalid && form.get('avance_fisico')?.touched">\r
                    Ingrese un n\xFAmero v\xE1lido entre 0 y 100.\r
                </div>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="monto_total">Monto Total Inversi\xF3n</label>\r
                <input type="number" id="monto_total" formControlName="monto_total" />\r
            </div>\r
        </div>\r
    </div>\r
\r
    <!-- ==================================================== -->\r
    <!-- INFRAESTRUCTURA Y EQUIPAMIENTO -->\r
    <!-- ==================================================== -->\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F3E2} Infraestructura y Equipamiento</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group">\r
                <label for="estado_infra">Estado Infraestructura</label>\r
                <input type="number" id="estado_infra" formControlName="estado_infra" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="aulas_buenas">Aulas en Buen Estado</label>\r
                <input type="number" id="aulas_buenas" formControlName="aulas_buenas" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="mobiliario_optimo_porc">Mobiliario \xD3ptimo (%)</label>\r
                <input type="number" id="mobiliario_optimo_porc" formControlName="mobiliario_optimo_porc" min="0" max="100" step="1" />\r
                <div class="field-message" *ngIf="form.get('mobiliario_optimo_porc')?.invalid && form.get('mobiliario_optimo_porc')?.touched">\r
                    Ingrese un n\xFAmero v\xE1lido entre 0 y 100.\r
                </div>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="computadoras_total">Total Computadoras</label>\r
                <input type="number" id="computadoras_total" formControlName="computadoras_total" />\r
            </div>\r
        </div>\r
\r
        <div class="checkbox-section">\r
            <label class="checkbox-section-title">Servicios B\xE1sicos y Riesgos</label>\r
            <div class="checkbox-grid">\r
                <div class="checkbox-group">\r
                    <input type="checkbox" id="servicio_agua" formControlName="servicio_agua" [value]="'SI'" />\r
                    <label for="servicio_agua">Servicio Agua</label>\r
                </div>\r
\r
                <div class="checkbox-group">\r
                    <input type="checkbox" id="servicio_desague" formControlName="servicio_desague" [value]="'SI'" />\r
                    <label for="servicio_desague">Servicio Desag\xFCe</label>\r
                </div>\r
\r
                <div class="checkbox-group">\r
                    <input type="checkbox" id="servicio_luz" formControlName="servicio_luz" [value]="'SI'" />\r
                    <label for="servicio_luz">Servicio Luz</label>\r
                </div>\r
\r
                <div class="checkbox-group">\r
                    <input type="checkbox" id="tiene_internet" formControlName="tiene_internet" [value]="'SI'" />\r
                    <label for="tiene_internet">Internet Operativo</label>\r
                </div>\r
\r
                <div class="checkbox-group" style="background: #fff5f5; border: 1px dashed #e74c3c; padding: 10px; border-radius: 4px;">\r
                    <input type="checkbox" id="riesgo_critico" formControlName="riesgo_critico" [value]="'SI'" />\r
                    <label for="riesgo_critico" style="color: #e74c3c; font-weight: bold;">Riesgo de Derrumbe</label>\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <!-- ==================================================== -->\r
    <!-- PERSONAL DOCENTE Y ADMINISTRATIVO -->\r
    <!-- ==================================================== -->\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F465} Personal Docente y Administrativo</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group">\r
                <label for="total_matricula">Alumnos Matriculados</label>\r
                <input type="number" id="total_matricula" formControlName="total_matricula" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="docentes_requeridos">Docentes Requeridos</label>\r
                <input type="number" id="docentes_requeridos" formControlName="docentes_requeridos" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="docentes_nombrados">Docentes Nombrados</label>\r
                <input type="number" id="docentes_nombrados" formControlName="docentes_nombrados" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="docentes_contratados">Docentes Contratados</label>\r
                <input type="number" id="docentes_contratados" formControlName="docentes_contratados" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="personal_admin">Personal Administrativo</label>\r
                <input type="number" id="personal_admin" formControlName="personal_admin" />\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="tiene_psicologo">Psic\xF3logo en la I.E.</label>\r
                <select id="tiene_psicologo" formControlName="tiene_psicologo">\r
                    <option value="">Seleccione</option>\r
                    <option value="SI">S\xED</option>\r
                    <option value="NO">No</option>\r
                </select>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <!-- ==================================================== -->\r
    <!-- METADATOS -->\r
    <!-- ==================================================== -->\r
    <div class="form-container">\r
        <div class="section-header">\r
            <h3>\u{1F4C5} Metadatos</h3>\r
        </div>\r
        <div class="form-grid">\r
            <div class="form-group full-width">\r
                <label for="fecha_corte">Fecha de Corte</label>\r
                <input type="date" id="fecha_corte" formControlName="fecha_corte" [attr.min]="minDate" />\r
                <div class="field-message" *ngIf="form.get('fecha_corte')?.hasError('invalidDate') && form.get('fecha_corte')?.touched">\r
                    La fecha de corte debe ser mayor al d\xEDa de hoy.\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="d-flex justify-content-end gap-3 mt-5 mb-4">\r
\r
        <button\r
            type="button"\r
            (click)="limpiarFormulario()"\r
            class="btn btn-limpiar">\r
\r
            <i class="bi bi-arrow-counterclockwise"></i>\r
            Limpiar\r
\r
        </button>\r
\r
        <button type="submit" class="btn btn-guardar">\r
            <i class="bi bi-floppy"></i>\r
            Guardar Reporte\r
\r
        </button>\r
\r
    </div>\r
\r
</form>`, styles: ["/* src/app/pages/educacion/educacion.css */\n.main-form-container {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  max-width: 900px;\n  margin: 0 auto;\n  max-height: calc(100vh - 150px);\n  overflow-y: auto;\n}\n.btn-limpiar {\n  background: #fff;\n  color: #7A1C1C;\n  border: 2px solid #7A1C1C;\n  padding: 10px 24px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: .25s;\n}\n.btn-limpiar:hover {\n  background: #7A1C1C;\n  color: #fff;\n}\n.btn-guardar {\n  background: #198754;\n  color: #fff;\n  border: none;\n  padding: 10px 28px;\n  border-radius: 10px;\n  font-weight: 600;\n  transition: all .25s ease;\n  box-shadow: 0 4px 12px rgba(25, 135, 84, .25);\n}\n.btn-guardar:hover:not(:disabled) {\n  background: #157347;\n  color: #fff;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 18px rgba(25, 135, 84, .35);\n}\n.btn-guardar:active:not(:disabled) {\n  transform: scale(.98);\n}\n.btn-guardar:disabled {\n  background: #c7c7c7;\n  color: #6c757d;\n  cursor: not-allowed;\n  box-shadow: none;\n  opacity: 1;\n  transform: none;\n}\n.form-container {\n  background: #ffffff;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);\n  border: 1px solid #e9ecef;\n}\n.section-header {\n  background-color: #7A1C1C;\n  color: #ffffff;\n  padding: 14px 20px;\n}\n.section-header h3 {\n  margin: 0;\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  padding: 20px;\n}\n.message {\n  display: block;\n  width: 100%;\n  max-width: 900px;\n  margin: 0 auto 16px;\n  padding: 12px 16px;\n  border-radius: 10px;\n  border: 1px solid #7a1c1c;\n  background-color: #fff1f1;\n  color: #7a1c1c;\n  font-weight: 600;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}\n.message:empty {\n  display: none;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #7a1c1c;\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.7;\n  transition: opacity 0.2s ease;\n}\n.close-btn:hover {\n  opacity: 1;\n}\n.field-message {\n  margin-top: 8px;\n  color: #7a1c1c;\n  background: #fff1f1;\n  border: 1px solid #f5c2c7;\n  padding: 10px 12px;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.field-message.warning {\n  background: #fff9e6;\n  border-color: #ffecb3;\n  color: #8a6d00;\n}\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group label {\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: #495057;\n}\n.form-group input,\n.form-group select {\n  width: 100%;\n  padding: 10px 14px;\n  font-size: 0.95rem;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  background-color: #ffffff;\n  color: #212529;\n  transition: all 0.2s ease-in-out;\n}\n.form-group input:focus,\n.form-group select:focus {\n  outline: none;\n  border-color: #7A1C1C;\n  box-shadow: 0 0 0 3px rgba(122, 28, 28, 0.1);\n}\n.form-group input[readonly] {\n  background-color: #f8f9fa;\n  color: #6c757d;\n  cursor: not-allowed;\n}\n.form-group input.ng-invalid.ng-touched,\n.form-group select.ng-invalid.ng-touched {\n  border-color: #dc3545;\n  background-color: #fff5f5;\n  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);\n}\n.full-width {\n  grid-column: span 2;\n}\n@media (max-width: 768px) {\n  .form-grid {\n    grid-template-columns: 1fr;\n  }\n  .full-width {\n    grid-column: span 1;\n  }\n}\n.checkbox-section {\n  padding: 20px;\n  margin-top: 10px;\n}\n.checkbox-section-title {\n  display: block;\n  font-size: 1rem;\n  font-weight: 600;\n  color: #495057;\n  margin-bottom: 16px;\n  padding-bottom: 8px;\n  border-bottom: 2px solid #7A1C1C;\n}\n.checkbox-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n  padding: 16px;\n  background-color: #f8f9fa;\n  border-radius: 8px;\n  border: 1px solid #e9ecef;\n}\n.checkbox-group {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 14px;\n  background-color: #ffffff;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  transition: all 0.2s ease-in-out;\n}\n.checkbox-group:hover {\n  border-color: #7A1C1C;\n  box-shadow: 0 2px 8px rgba(122, 28, 28, 0.08);\n}\n.checkbox-group input[type=checkbox] {\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n  accent-color: #7A1C1C;\n  flex-shrink: 0;\n}\n.checkbox-group label {\n  font-size: 0.95rem;\n  font-weight: 500;\n  color: #212529;\n  cursor: pointer;\n  margin: 0;\n  flex: 1;\n}\n.checkbox-group input[type=checkbox]:checked + label {\n  color: #7A1C1C;\n  font-weight: 600;\n}\n.checkbox-group:has(input[type=checkbox]:checked) {\n  background-color: #fff5f5;\n  border-color: #7A1C1C;\n}\n@media (max-width: 768px) {\n  .checkbox-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=educacion.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i011.\u0275setClassDebugInfo(Educacion, { className: "Educacion", filePath: "src/app/pages/educacion/educacion.ts", lineNumber: 16 });
})();
(() => {
  const id = "src%2Fapp%2Fpages%2Feducacion%2Feducacion.ts%40Educacion";
  function Educacion_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i011.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i011.\u0275\u0275replaceMetadata(Educacion, m.default, [i011, i14], [ReactiveFormsModule2, NgIf2, Component7], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && Educacion_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && Educacion_HmrLoad(d.timestamp)));
})();

// src/app/pages/historial/historial.ts
import { Component as Component8, inject as inject8, ChangeDetectorRef as ChangeDetectorRef2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { CommonModule } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common.js?v=e10ab860";
import { FormsModule as FormsModule2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";
import { DatePipe } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common.js?v=e10ab860";

// src/app/services/historial.ts
import { Injectable as Injectable5, inject as inject7 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { HttpClient as HttpClient5 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common_http.js?v=e10ab860";
import * as i012 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
var HistorialService = class _HistorialService {
  http = inject7(HttpClient5);
  api = "http://192.168.2.194:3000/api/historial";
  listar(filtros) {
    let params = {};
    if (filtros) {
      if (filtros.tipo)
        params.tipo = filtros.tipo;
      if (filtros.busqueda)
        params.busqueda = filtros.busqueda;
      if (filtros.fecha_desde)
        params.fecha_desde = filtros.fecha_desde;
      if (filtros.fecha_hasta)
        params.fecha_hasta = filtros.fecha_hasta;
      if (filtros.usuario)
        params.usuario = filtros.usuario;
    }
    return this.http.get(this.api, { params });
  }
  static \u0275fac = function HistorialService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HistorialService)();
  };
  static \u0275prov = /* @__PURE__ */ i012.\u0275\u0275defineInjectable({ token: _HistorialService, factory: _HistorialService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i012.\u0275setClassMetadata(HistorialService, [{
    type: Injectable5,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/pages/historial/historial.ts
import * as i013 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i15 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_common.js?v=e10ab860";
import * as i23 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_forms.js?v=e10ab860";
var _forTrack0 = ($index, $item) => $item.id_historial;
function Historial_div_39_Template(rf, ctx) {
  if (rf & 1) {
    i013.\u0275\u0275elementStart(0, "div", 24)(1, "span");
    i013.\u0275\u0275text(2);
    i013.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i013.\u0275\u0275nextContext();
    i013.\u0275\u0275advance(2);
    i013.\u0275\u0275textInterpolate(ctx_r0.mensaje);
  }
}
function Historial_For_56_Template(rf, ctx) {
  if (rf & 1) {
    i013.\u0275\u0275elementStart(0, "tr")(1, "td");
    i013.\u0275\u0275text(2);
    i013.\u0275\u0275elementEnd();
    i013.\u0275\u0275elementStart(3, "td");
    i013.\u0275\u0275text(4);
    i013.\u0275\u0275elementEnd();
    i013.\u0275\u0275elementStart(5, "td")(6, "span", 25);
    i013.\u0275\u0275text(7);
    i013.\u0275\u0275elementEnd()();
    i013.\u0275\u0275elementStart(8, "td");
    i013.\u0275\u0275text(9);
    i013.\u0275\u0275pipe(10, "date");
    i013.\u0275\u0275elementEnd();
    i013.\u0275\u0275elementStart(11, "td");
    i013.\u0275\u0275text(12);
    i013.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    i013.\u0275\u0275advance(2);
    i013.\u0275\u0275textInterpolate(item_r2.id_historial);
    i013.\u0275\u0275advance(2);
    i013.\u0275\u0275textInterpolate(item_r2.nombre);
    i013.\u0275\u0275advance(2);
    i013.\u0275\u0275classProp("badge-salud", item_r2.tipo === "Salud")("badge-educacion", item_r2.tipo === "Educaci\xF3n");
    i013.\u0275\u0275advance();
    i013.\u0275\u0275textInterpolate1(" ", item_r2.tipo, " ");
    i013.\u0275\u0275advance(2);
    i013.\u0275\u0275textInterpolate(i013.\u0275\u0275pipeBind2(10, 9, item_r2.fecha_modificacion, "dd/MM/yyyy HH:mm"));
    i013.\u0275\u0275advance(3);
    i013.\u0275\u0275textInterpolate(item_r2.usuario);
  }
}
function Historial_ForEmpty_57_Template(rf, ctx) {
  if (rf & 1) {
    i013.\u0275\u0275elementStart(0, "tr")(1, "td", 26);
    i013.\u0275\u0275text(2, "No se encontraron registros.");
    i013.\u0275\u0275elementEnd()();
  }
}
var Historial = class _Historial {
  historialService = inject8(HistorialService);
  cdr = inject8(ChangeDetectorRef2);
  historial = [];
  mensaje = "";
  filtros = {
    tipo: "",
    busqueda: "",
    fecha_desde: "",
    fecha_hasta: "",
    usuario: ""
  };
  constructor() {
  }
  ngOnInit() {
    this.buscar();
  }
  buscar() {
    this.mensaje = "Cargando...";
    console.log("Buscando historial con filtros:", this.filtros);
    this.historialService.listar(this.filtros).subscribe({
      next: (resp) => {
        console.log("Respuesta recibida:", resp);
        console.log("resp.data:", resp.data);
        console.log("resp.success:", resp.success);
        this.historial = resp.data || [];
        this.mensaje = resp.success ? "" : "No hay datos";
        console.log("Historial actualizado:", this.historial);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error en historial:", err);
        this.mensaje = "Error al cargar el historial.";
        this.historial = [];
      }
    });
  }
  limpiarFiltros() {
    this.filtros = {
      tipo: "",
      busqueda: "",
      fecha_desde: "",
      fecha_hasta: "",
      usuario: ""
    };
    this.buscar();
  }
  static \u0275fac = function Historial_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Historial)();
  };
  static \u0275cmp = /* @__PURE__ */ i013.\u0275\u0275defineComponent({ type: _Historial, selectors: [["app-historial"]], decls: 58, vars: 7, consts: [[1, "page-title"], [1, "filtros-container"], [1, "filtros-grid"], [1, "form-group"], ["for", "filtroTipo"], ["id", "filtroTipo", 3, "ngModelChange", "ngModel"], ["value", ""], ["value", "salud"], ["value", "educacion"], ["for", "filtroBusqueda"], ["type", "text", "id", "filtroBusqueda", "placeholder", "Nombre del establecimiento o IE", 3, "ngModelChange", "ngModel"], ["for", "filtroFechaDesde"], ["type", "date", "id", "filtroFechaDesde", 3, "ngModelChange", "ngModel"], ["for", "filtroFechaHasta"], ["type", "date", "id", "filtroFechaHasta", 3, "ngModelChange", "ngModel"], ["for", "filtroUsuario"], ["type", "text", "id", "filtroUsuario", "placeholder", "Nombre de usuario", 3, "ngModelChange", "ngModel"], [1, "form-group", "filtros-actions"], [1, "btn-group"], ["type", "button", 1, "btn", "btn-buscar", 3, "click"], ["type", "button", 1, "btn", "btn-limpiar-filtros", 3, "click"], ["class", "message", 4, "ngIf"], [1, "table-container"], [1, "table"], [1, "message"], [1, "badge"], ["colspan", "5", 1, "text-center"]], template: function Historial_Template(rf, ctx) {
    if (rf & 1) {
      i013.\u0275\u0275elementStart(0, "div", 0)(1, "h1");
      i013.\u0275\u0275text(2, "\u{1F4DC} Historial de Modificaciones");
      i013.\u0275\u0275elementEnd()();
      i013.\u0275\u0275elementStart(3, "div", 1)(4, "div", 2)(5, "div", 3)(6, "label", 4);
      i013.\u0275\u0275text(7, "Tipo");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(8, "select", 5);
      i013.\u0275\u0275twoWayListener("ngModelChange", function Historial_Template_select_ngModelChange_8_listener($event) {
        i013.\u0275\u0275twoWayBindingSet(ctx.filtros.tipo, $event) || (ctx.filtros.tipo = $event);
        return $event;
      });
      i013.\u0275\u0275elementStart(9, "option", 6);
      i013.\u0275\u0275text(10, "Todos");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(11, "option", 7);
      i013.\u0275\u0275text(12, "Salud");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(13, "option", 8);
      i013.\u0275\u0275text(14, "Educaci\xF3n");
      i013.\u0275\u0275elementEnd()();
      i013.\u0275\u0275controlCreate();
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(15, "div", 3)(16, "label", 9);
      i013.\u0275\u0275text(17, "Buscar por nombre");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(18, "input", 10);
      i013.\u0275\u0275twoWayListener("ngModelChange", function Historial_Template_input_ngModelChange_18_listener($event) {
        i013.\u0275\u0275twoWayBindingSet(ctx.filtros.busqueda, $event) || (ctx.filtros.busqueda = $event);
        return $event;
      });
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275controlCreate();
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(19, "div", 3)(20, "label", 11);
      i013.\u0275\u0275text(21, "Fecha desde");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(22, "input", 12);
      i013.\u0275\u0275twoWayListener("ngModelChange", function Historial_Template_input_ngModelChange_22_listener($event) {
        i013.\u0275\u0275twoWayBindingSet(ctx.filtros.fecha_desde, $event) || (ctx.filtros.fecha_desde = $event);
        return $event;
      });
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275controlCreate();
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(23, "div", 3)(24, "label", 13);
      i013.\u0275\u0275text(25, "Fecha hasta");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(26, "input", 14);
      i013.\u0275\u0275twoWayListener("ngModelChange", function Historial_Template_input_ngModelChange_26_listener($event) {
        i013.\u0275\u0275twoWayBindingSet(ctx.filtros.fecha_hasta, $event) || (ctx.filtros.fecha_hasta = $event);
        return $event;
      });
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275controlCreate();
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(27, "div", 3)(28, "label", 15);
      i013.\u0275\u0275text(29, "Usuario");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(30, "input", 16);
      i013.\u0275\u0275twoWayListener("ngModelChange", function Historial_Template_input_ngModelChange_30_listener($event) {
        i013.\u0275\u0275twoWayBindingSet(ctx.filtros.usuario, $event) || (ctx.filtros.usuario = $event);
        return $event;
      });
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275controlCreate();
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(31, "div", 17)(32, "label");
      i013.\u0275\u0275text(33, "\xA0");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(34, "div", 18)(35, "button", 19);
      i013.\u0275\u0275listener("click", function Historial_Template_button_click_35_listener() {
        return ctx.buscar();
      });
      i013.\u0275\u0275text(36, " \u{1F50D} Buscar ");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(37, "button", 20);
      i013.\u0275\u0275listener("click", function Historial_Template_button_click_37_listener() {
        return ctx.limpiarFiltros();
      });
      i013.\u0275\u0275text(38, " \u2715 Limpiar ");
      i013.\u0275\u0275elementEnd()()()()();
      i013.\u0275\u0275template(39, Historial_div_39_Template, 3, 1, "div", 21);
      i013.\u0275\u0275elementStart(40, "div", 22)(41, "table", 23)(42, "thead")(43, "tr")(44, "th");
      i013.\u0275\u0275text(45, "#");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(46, "th");
      i013.\u0275\u0275text(47, "Nombre");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(48, "th");
      i013.\u0275\u0275text(49, "Tipo");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(50, "th");
      i013.\u0275\u0275text(51, "Fecha de Modificaci\xF3n");
      i013.\u0275\u0275elementEnd();
      i013.\u0275\u0275elementStart(52, "th");
      i013.\u0275\u0275text(53, "Usuario");
      i013.\u0275\u0275elementEnd()()();
      i013.\u0275\u0275elementStart(54, "tbody");
      i013.\u0275\u0275repeaterCreate(55, Historial_For_56_Template, 13, 12, "tr", null, _forTrack0, false, Historial_ForEmpty_57_Template, 3, 0, "tr");
      i013.\u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      i013.\u0275\u0275advance(8);
      i013.\u0275\u0275twoWayProperty("ngModel", ctx.filtros.tipo);
      i013.\u0275\u0275control();
      i013.\u0275\u0275advance(10);
      i013.\u0275\u0275twoWayProperty("ngModel", ctx.filtros.busqueda);
      i013.\u0275\u0275control();
      i013.\u0275\u0275advance(4);
      i013.\u0275\u0275twoWayProperty("ngModel", ctx.filtros.fecha_desde);
      i013.\u0275\u0275control();
      i013.\u0275\u0275advance(4);
      i013.\u0275\u0275twoWayProperty("ngModel", ctx.filtros.fecha_hasta);
      i013.\u0275\u0275control();
      i013.\u0275\u0275advance(4);
      i013.\u0275\u0275twoWayProperty("ngModel", ctx.filtros.usuario);
      i013.\u0275\u0275control();
      i013.\u0275\u0275advance(9);
      i013.\u0275\u0275property("ngIf", ctx.mensaje);
      i013.\u0275\u0275advance(16);
      i013.\u0275\u0275repeater(ctx.historial);
    }
  }, dependencies: [CommonModule, i15.NgClass, i15.NgComponentOutlet, i15.NgForOf, i15.NgIf, i15.NgTemplateOutlet, i15.NgStyle, i15.NgSwitch, i15.NgSwitchCase, i15.NgSwitchDefault, i15.NgPlural, i15.NgPluralCase, FormsModule2, i23.\u0275NgNoValidate, i23.NgSelectOption, i23.\u0275NgSelectMultipleOption, i23.DefaultValueAccessor, i23.NumberValueAccessor, i23.RangeValueAccessor, i23.CheckboxControlValueAccessor, i23.SelectControlValueAccessor, i23.SelectMultipleControlValueAccessor, i23.RadioControlValueAccessor, i23.NgControlStatus, i23.NgControlStatusGroup, i23.RequiredValidator, i23.MinLengthValidator, i23.MaxLengthValidator, i23.PatternValidator, i23.CheckboxRequiredValidator, i23.EmailValidator, i23.MinValidator, i23.MaxValidator, i23.NgModel, i23.NgModelGroup, i23.NgForm, i15.AsyncPipe, i15.UpperCasePipe, i15.LowerCasePipe, i15.JsonPipe, i15.SlicePipe, i15.DecimalPipe, i15.PercentPipe, i15.TitleCasePipe, i15.CurrencyPipe, i15.DatePipe, i15.I18nPluralPipe, i15.I18nSelectPipe, i15.KeyValuePipe], styles: ["\n.page-title[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.page-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  color: #1f2937;\n  margin: 0;\n}\n.filtros-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  padding: 20px;\n  margin-bottom: 24px;\n}\n.filtros-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n  align-items: end;\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 500;\n  color: #374151;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  font-size: 14px;\n  outline: none;\n  transition: border-color 0.2s;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  border-color: #2563eb;\n}\n.filtros-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.btn-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.2s, transform 0.1s;\n}\n.btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.98);\n}\n.btn-buscar[_ngcontent-%COMP%] {\n  background: #2563eb;\n  color: #ffffff;\n}\n.btn-buscar[_ngcontent-%COMP%]:hover {\n  background: #1d4ed8;\n}\n.btn-limpiar-filtros[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  color: #374151;\n  border: 1px solid #d1d5db;\n}\n.btn-limpiar-filtros[_ngcontent-%COMP%]:hover {\n  background: #e5e7eb;\n}\n.message[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n  padding: 10px 14px;\n  border-radius: 6px;\n  background: #eff6ff;\n  color: #1e40af;\n  border: 1px solid #bfdbfe;\n  font-size: 14px;\n}\n.table-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 14px;\n}\n.table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background: #f9fafb;\n}\n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #374151;\n  border-bottom: 1px solid #e5e7eb;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  color: #111827;\n  border-bottom: 1px solid #f3f4f6;\n}\n.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f9fafb;\n}\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 9999px;\n  font-size: 12px;\n  font-weight: 600;\n}\n.badge-salud[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1e40af;\n}\n.badge-educacion[_ngcontent-%COMP%] {\n  background: #d1fae5;\n  color: #065f46;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #6b7280;\n}\n/*# sourceMappingURL=historial.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i013.\u0275setClassMetadata(Historial, [{
    type: Component8,
    args: [{ selector: "app-historial", standalone: true, imports: [CommonModule, FormsModule2, DatePipe], template: `<div class="page-title">
    <h1>\u{1F4DC} Historial de Modificaciones</h1>
</div>

<div class="filtros-container">
    <div class="filtros-grid">
        <div class="form-group">
            <label for="filtroTipo">Tipo</label>
            <select id="filtroTipo" [(ngModel)]="filtros.tipo">
                <option value="">Todos</option>
                <option value="salud">Salud</option>
                <option value="educacion">Educaci\xF3n</option>
            </select>
        </div>

        <div class="form-group">
            <label for="filtroBusqueda">Buscar por nombre</label>
            <input type="text" id="filtroBusqueda" [(ngModel)]="filtros.busqueda" placeholder="Nombre del establecimiento o IE" />
        </div>

        <div class="form-group">
            <label for="filtroFechaDesde">Fecha desde</label>
            <input type="date" id="filtroFechaDesde" [(ngModel)]="filtros.fecha_desde" />
        </div>

        <div class="form-group">
            <label for="filtroFechaHasta">Fecha hasta</label>
            <input type="date" id="filtroFechaHasta" [(ngModel)]="filtros.fecha_hasta" />
        </div>

        <div class="form-group">
            <label for="filtroUsuario">Usuario</label>
            <input type="text" id="filtroUsuario" [(ngModel)]="filtros.usuario" placeholder="Nombre de usuario" />
        </div>

        <div class="form-group filtros-actions">
            <label>&nbsp;</label>
            <div class="btn-group">
                <button type="button" class="btn btn-buscar" (click)="buscar()">
                    \u{1F50D} Buscar
                </button>
                <button type="button" class="btn btn-limpiar-filtros" (click)="limpiarFiltros()">
                    \u2715 Limpiar
                </button>
            </div>
        </div>
    </div>
</div>

<div class="message" *ngIf="mensaje">
    <span>{{ mensaje }}</span>
</div>

<div class="table-container">
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Fecha de Modificaci\xF3n</th>
                <th>Usuario</th>
            </tr>
        </thead>
        <tbody>
            @for (item of historial; track item.id_historial) {
                <tr>
                    <td>{{ item.id_historial }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>
                        <span class="badge" [class.badge-salud]="item.tipo === 'Salud'" [class.badge-educacion]="item.tipo === 'Educaci\xF3n'">
                            {{ item.tipo }}
                        </span>
                    </td>
                    <td>{{ item.fecha_modificacion | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>{{ item.usuario }}</td>
                </tr>
            } @empty {
                <tr>
                    <td colspan="5" class="text-center">No se encontraron registros.</td>
                </tr>
            }
        </tbody>
    </table>
</div>`, styles: ["/* src/app/pages/historial/historial.css */\n.page-title {\n  margin-bottom: 24px;\n}\n.page-title h1 {\n  font-size: 24px;\n  font-weight: 600;\n  color: #1f2937;\n  margin: 0;\n}\n.filtros-container {\n  background: #ffffff;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  padding: 20px;\n  margin-bottom: 24px;\n}\n.filtros-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n  align-items: end;\n}\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group label {\n  font-size: 13px;\n  font-weight: 500;\n  color: #374151;\n}\n.form-group input,\n.form-group select {\n  padding: 8px 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  font-size: 14px;\n  outline: none;\n  transition: border-color 0.2s;\n}\n.form-group input:focus,\n.form-group select:focus {\n  border-color: #2563eb;\n}\n.filtros-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.btn-group {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.btn {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.2s, transform 0.1s;\n}\n.btn:active {\n  transform: scale(0.98);\n}\n.btn-buscar {\n  background: #2563eb;\n  color: #ffffff;\n}\n.btn-buscar:hover {\n  background: #1d4ed8;\n}\n.btn-limpiar-filtros {\n  background: #f3f4f6;\n  color: #374151;\n  border: 1px solid #d1d5db;\n}\n.btn-limpiar-filtros:hover {\n  background: #e5e7eb;\n}\n.message {\n  margin-bottom: 16px;\n  padding: 10px 14px;\n  border-radius: 6px;\n  background: #eff6ff;\n  color: #1e40af;\n  border: 1px solid #bfdbfe;\n  font-size: 14px;\n}\n.table-container {\n  background: #ffffff;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 14px;\n}\n.table thead {\n  background: #f9fafb;\n}\n.table th {\n  text-align: left;\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #374151;\n  border-bottom: 1px solid #e5e7eb;\n}\n.table td {\n  padding: 12px 16px;\n  color: #111827;\n  border-bottom: 1px solid #f3f4f6;\n}\n.table tbody tr:last-child td {\n  border-bottom: none;\n}\n.table tbody tr:hover {\n  background: #f9fafb;\n}\n.badge {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 9999px;\n  font-size: 12px;\n  font-weight: 600;\n}\n.badge-salud {\n  background: #dbeafe;\n  color: #1e40af;\n}\n.badge-educacion {\n  background: #d1fae5;\n  color: #065f46;\n}\n.text-center {\n  text-align: center;\n  color: #6b7280;\n}\n/*# sourceMappingURL=historial.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i013.\u0275setClassDebugInfo(Historial, { className: "Historial", filePath: "src/app/pages/historial/historial.ts", lineNumber: 15 });
})();
(() => {
  const id = "src%2Fapp%2Fpages%2Fhistorial%2Fhistorial.ts%40Historial";
  function Historial_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i013.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i013.\u0275\u0275replaceMetadata(Historial, m.default, [i013, i15, i23], [CommonModule, FormsModule2, Component8, DatePipe], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && Historial_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && Historial_HmrLoad(d.timestamp)));
})();

// src/app/guards/auth.guard.ts
import { Injectable as Injectable6 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { of as of2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/rxjs.js?v=e10ab860";
import * as i014 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import * as i24 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";
var AuthGuard = class _AuthGuard {
  authService;
  router;
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  canActivate() {
    if (this.authService.estaAutenticado()) {
      return of2(true);
    }
    return of2(this.router.createUrlTree(["/login"]));
  }
  static \u0275fac = function AuthGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthGuard)(i014.\u0275\u0275inject(AuthService), i014.\u0275\u0275inject(i24.Router));
  };
  static \u0275prov = /* @__PURE__ */ i014.\u0275\u0275defineInjectable({ token: _AuthGuard, factory: _AuthGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i014.\u0275setClassMetadata(AuthGuard, [{
    type: Injectable6,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: AuthService }, { type: i24.Router }], null);
})();

// src/app/app.routes.ts
var routes = [
  // Página inicial
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  // Login
  {
    path: "login",
    component: Login
  },
  // Layout principal
  {
    path: "",
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: Dashboard
      },
      {
        path: "salud",
        component: Salud
      },
      {
        path: "educacion",
        component: Educacion
      },
      {
        path: "historial",
        component: Historial
      }
    ]
  },
  // Cualquier ruta inexistente
  {
    path: "**",
    redirectTo: "login"
  }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};

// src/app/app.ts
import { Component as Component9, signal } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
import { RouterOutlet as RouterOutlet2 } from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_router.js?v=e10ab860";
import * as i015 from "/@fs/C:/Users/LENOVO/Documents/GORE/gore-frontend/.angular/cache/22.0.7/frontend-gore/vite/deps/@angular_core.js?v=e10ab860";
var App = class _App {
  title = signal(
    "frontend-gore",
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ i015.\u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      i015.\u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet2], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i015.\u0275setClassMetadata(App, [{
    type: Component9,
    args: [{ selector: "app-root", imports: [RouterOutlet2], template: "<router-outlet />" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i015.\u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 10 });
})();
(() => {
  const id = "src%2Fapp%2Fapp.ts%40App";
  function App_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i015.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i015.\u0275\u0275replaceMetadata(App, m.default, [i015], [RouterOutlet2, Component9], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && App_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && App_HmrLoad(d.timestamp)));
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIiwic3JjL2FwcC9hcHAuY29uZmlnLnRzIiwic3JjL2FwcC9wYWdlcy9sb2dpbi9sb2dpbi50cyIsInNyYy9hcHAvcGFnZXMvbG9naW4vbG9naW4uaHRtbCIsInNyYy9hcHAvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIiwic3JjL2FwcC9wYWdlcy9kYXNoYm9hcmQvZGFzaGJvYXJkLnRzIiwic3JjL2FwcC9wYWdlcy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWwiLCJzcmMvYXBwL3NlcnZpY2VzL2Rhc2hib2FyZC50cyIsInNyYy9hcHAvc2hhcmVkL2xheW91dC9tYWluLWxheW91dC9tYWluLWxheW91dC50cyIsInNyYy9hcHAvc2hhcmVkL2xheW91dC9tYWluLWxheW91dC9tYWluLWxheW91dC5odG1sIiwic3JjL2FwcC9zaGFyZWQvbGF5b3V0L25hdmJhci9uYXZiYXIudHMiLCJzcmMvYXBwL3NoYXJlZC9sYXlvdXQvbmF2YmFyL25hdmJhci5odG1sIiwic3JjL2FwcC9zaGFyZWQvbGF5b3V0L3NpZGViYXIvc2lkZWJhci50cyIsInNyYy9hcHAvc2hhcmVkL2xheW91dC9zaWRlYmFyL3NpZGViYXIuaHRtbCIsInNyYy9hcHAvcGFnZXMvc2FsdWQvc2FsdWQudHMiLCJzcmMvYXBwL3BhZ2VzL3NhbHVkL3NhbHVkLmh0bWwiLCJzcmMvYXBwL3NlcnZpY2VzL3NhbHVkLnRzIiwic3JjL2FwcC9wYWdlcy9lZHVjYWNpb24vZWR1Y2FjaW9uLnRzIiwic3JjL2FwcC9wYWdlcy9lZHVjYWNpb24vZWR1Y2FjaW9uLmh0bWwiLCJzcmMvYXBwL3NlcnZpY2VzL2VkdWNhY2lvbi50cyIsInNyYy9hcHAvcGFnZXMvaGlzdG9yaWFsL2hpc3RvcmlhbC50cyIsInNyYy9hcHAvcGFnZXMvaGlzdG9yaWFsL2hpc3RvcmlhbC5odG1sIiwic3JjL2FwcC9zZXJ2aWNlcy9oaXN0b3JpYWwudHMiLCJzcmMvYXBwL2d1YXJkcy9hdXRoLmd1YXJkLnRzIiwic3JjL2FwcC9hcHAucm91dGVzLnRzIiwic3JjL2FwcC9hcHAudHMiLCJzcmMvYXBwL2FwcC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJvb3RzdHJhcEFwcGxpY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IGFwcENvbmZpZyB9IGZyb20gJy4vYXBwL2FwcC5jb25maWcnO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL2FwcC9hcHAnO1xyXG5cclxuYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwLCBhcHBDb25maWcpXHJcbiAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uQ29uZmlnLCBwcm92aWRlQnJvd3Nlckdsb2JhbEVycm9yTGlzdGVuZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHByb3ZpZGVSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBwcm92aWRlSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7IHJvdXRlcyB9IGZyb20gJy4vYXBwLnJvdXRlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgYXBwQ29uZmlnOiBBcHBsaWNhdGlvbkNvbmZpZyA9IHtcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHByb3ZpZGVIdHRwQ2xpZW50KCksXHJcbiAgICBwcm92aWRlQnJvd3Nlckdsb2JhbEVycm9yTGlzdGVuZXJzKCksXHJcbiAgICBwcm92aWRlUm91dGVyKHJvdXRlcylcclxuICBdXHJcbn07XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbG9naW4nLFxuICBpbXBvcnRzOiBbRm9ybXNNb2R1bGVdLFxuICB0ZW1wbGF0ZVVybDogJy4vbG9naW4uaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9sb2dpbi5jc3MnXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luIGltcGxlbWVudHMgT25Jbml0IHtcblxuICB1c3VhcmlvOiBzdHJpbmcgPSAnJztcbiAgcGFzc3dvcmQ6IHN0cmluZyA9ICcnO1xuICBtb3N0cmFyUGFzc3dvcmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcmVjb3JkYXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY2FyZ2FuZG86IGJvb2xlYW4gPSBmYWxzZTtcbiAgZXJyb3I6IHN0cmluZyA9ICcnO1xuXG4gIC8vIFZhbGlkYWNpb25lc1xuICB1c3VhcmlvSW52YWxpZG86IGJvb2xlYW4gPSBmYWxzZTtcbiAgcGFzc3dvcmRJbnZhbGlkbzogYm9vbGVhbiA9IGZhbHNlO1xuICB1c3VhcmlvRXJyb3I6IHN0cmluZyA9ICcnO1xuICBwYXNzd29yZEVycm9yOiBzdHJpbmcgPSAnJztcblxuICAvLyAyRkFcbiAgbW9zdHJhcjJGQTogYm9vbGVhbiA9IGZhbHNlO1xuICBjb2RpZ28yRkE6IHN0cmluZyA9ICcnO1xuICBpZFVzdWFyaW8yRkE6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmXG4gICkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBDYXJnYXIgdXN1YXJpbyByZWNvcmRhZG9cbiAgICBjb25zdCB1c3VhcmlvUmVjb3JkYWRvID0gdGhpcy5hdXRoU2VydmljZS5vYnRlbmVyVXN1YXJpb1JlY29yZGFkbygpO1xuICAgIGlmICh1c3VhcmlvUmVjb3JkYWRvKSB7XG4gICAgICB0aGlzLnVzdWFyaW8gPSB1c3VhcmlvUmVjb3JkYWRvO1xuICAgICAgdGhpcy5yZWNvcmRhciA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gU2kgeWEgZXN0w6EgYXV0ZW50aWNhZG8sIHJlZGlyaWdpciBhbCBkYXNoYm9hcmRcbiAgICBpZiAodGhpcy5hdXRoU2VydmljZS5lc3RhQXV0ZW50aWNhZG8oKSkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvZGFzaGJvYXJkJ10pO1xuICAgIH1cbiAgfVxuXG4gIGluZ3Jlc2FyKCk6IHZvaWQge1xuICAgIHRoaXMuZXJyb3IgPSAnJztcbiAgICB0aGlzLnVzdWFyaW9JbnZhbGlkbyA9IGZhbHNlO1xuICAgIHRoaXMucGFzc3dvcmRJbnZhbGlkbyA9IGZhbHNlO1xuICAgIHRoaXMudXN1YXJpb0Vycm9yID0gJyc7XG4gICAgdGhpcy5wYXNzd29yZEVycm9yID0gJyc7XG5cbiAgICAvLyBWYWxpZGFyIGNhbXBvcyBvYmxpZ2F0b3Jpb3NcbiAgICBsZXQgdmFsaWRvID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy51c3VhcmlvIHx8IHRoaXMudXN1YXJpby50cmltKCkgPT09ICcnKSB7XG4gICAgICB0aGlzLnVzdWFyaW9JbnZhbGlkbyA9IHRydWU7XG4gICAgICB0aGlzLnVzdWFyaW9FcnJvciA9ICdFbCB1c3VhcmlvIGVzIG9ibGlnYXRvcmlvJztcbiAgICAgIHZhbGlkbyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5wYXNzd29yZCB8fCB0aGlzLnBhc3N3b3JkLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIHRoaXMucGFzc3dvcmRJbnZhbGlkbyA9IHRydWU7XG4gICAgICB0aGlzLnBhc3N3b3JkRXJyb3IgPSAnTGEgY29udHJhc2XDsWEgZXMgb2JsaWdhdG9yaWEnO1xuICAgICAgdmFsaWRvID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF2YWxpZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNhcmdhbmRvID0gdHJ1ZTtcblxuICAgIHRoaXMuYXV0aFNlcnZpY2UubG9naW4odGhpcy51c3VhcmlvLCB0aGlzLnBhc3N3b3JkLCB0aGlzLnJlY29yZGFyKS5zdWJzY3JpYmUoe1xuICAgICAgbmV4dDogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuY2FyZ2FuZG8gPSBmYWxzZTtcblxuICAgICAgICBpZiAocmVzcG9uc2UucmVxdWllcmVfMmZhKSB7XG4gICAgICAgICAgLy8gTW9zdHJhciBmb3JtdWxhcmlvIDJGQVxuICAgICAgICAgIHRoaXMubW9zdHJhcjJGQSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pZFVzdWFyaW8yRkEgPSByZXNwb25zZS5pZF91c3VhcmlvIHx8IG51bGw7XG4gICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIExvZ2luIGV4aXRvc28sIHJlZGlyaWdpclxuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL2Rhc2hib2FyZCddKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiAoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5jYXJnYW5kbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVycm9yID0gZXJyb3IubWVzc2FnZSB8fCAnRXJyb3IgYWwgaW5pY2lhciBzZXNpw7NuJztcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmVyaWZpY2FyMkZBKCk6IHZvaWQge1xuICAgIHRoaXMuZXJyb3IgPSAnJztcbiAgICB0aGlzLmNhcmdhbmRvID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy5pZFVzdWFyaW8yRkEgfHwgIXRoaXMuY29kaWdvMkZBKSB7XG4gICAgICB0aGlzLmVycm9yID0gJ0luZ3Jlc2UgZWwgY8OzZGlnbyBkZSB2ZXJpZmljYWNpw7NuJztcbiAgICAgIHRoaXMuY2FyZ2FuZG8gPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmF1dGhTZXJ2aWNlLnZlcmlmeTJGQSh0aGlzLmlkVXN1YXJpbzJGQSwgdGhpcy5jb2RpZ28yRkEpLnN1YnNjcmliZSh7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FyZ2FuZG8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvZGFzaGJvYXJkJ10pO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiAoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5jYXJnYW5kbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVycm9yID0gZXJyb3IubWVzc2FnZSB8fCAnQ8OzZGlnbyAyRkEgaW52w6FsaWRvJztcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdm9sdmVyQUxvZ2luKCk6IHZvaWQge1xuICAgIHRoaXMubW9zdHJhcjJGQSA9IGZhbHNlO1xuICAgIHRoaXMuY29kaWdvMkZBID0gJyc7XG4gICAgdGhpcy5lcnJvciA9ICcnO1xuICAgIHRoaXMuY2FyZ2FuZG8gPSBmYWxzZTtcbiAgfVxuXG4gIGxpbXBpYXJFcnJvclVzdWFyaW8oKTogdm9pZCB7XG4gICAgdGhpcy51c3VhcmlvSW52YWxpZG8gPSBmYWxzZTtcbiAgICB0aGlzLnVzdWFyaW9FcnJvciA9ICcnO1xuICB9XG5cbiAgbGltcGlhckVycm9yUGFzc3dvcmQoKTogdm9pZCB7XG4gICAgdGhpcy5wYXNzd29yZEludmFsaWRvID0gZmFsc2U7XG4gICAgdGhpcy5wYXNzd29yZEVycm9yID0gJyc7XG4gIH1cblxuICB0b2dnbGVQYXNzd29yZCgpOiB2b2lkIHtcbiAgICB0aGlzLm1vc3RyYXJQYXNzd29yZCA9ICF0aGlzLm1vc3RyYXJQYXNzd29yZDtcbiAgfVxuXG4gIG9sdmlkYXN0ZVBhc3N3b3JkKCk6IHZvaWQge1xuICAgIGFsZXJ0KCdDb250YWN0ZSBhbCBhZG1pbmlzdHJhZG9yIGRlbCBzaXN0ZW1hIHBhcmEgcmVjdXBlcmFyIHN1IGNvbnRyYXNlw7FhLicpO1xuICB9XG5cbn0iLCI8ZGl2IGNsYXNzPVwibG9naW4tY29udGFpbmVyXCI+XG5cbiAgICA8ZGl2IGNsYXNzPVwibG9naW4tY2FyZFwiPlxuXG4gICAgICAgIDxpbWdcbiAgICAgICAgICAgIHNyYz1cImltYWdlcy9sb2dvLWdvcmUuanBlZ1wiXG4gICAgICAgICAgICBhbHQ9XCJHb2JpZXJubyBSZWdpb25hbCBkZSBMYW1iYXllcXVlXCJcbiAgICAgICAgICAgIGNsYXNzPVwibG9nb1wiPlxuXG4gICAgICAgIDxoMj5Hb2JpZXJubyBSZWdpb25hbCBkZSBMYW1iYXllcXVlPC9oMj5cblxuICAgICAgICA8cD5TaXN0ZW1hIGRlIFNlZ3VpbWllbnRvIGRlIFByb3llY3RvczwvcD5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwibGluZWFcIj48L2Rpdj5cblxuICAgICAgICA8IS0tIEVycm9yIG1lc3NhZ2UgLS0+XG4gICAgICAgIEBpZihlcnJvcil7XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgICAgICAgICAgICAge3sgZXJyb3IgfX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9XG5cbiAgICAgICAgPGZvcm0+XG5cbiAgICAgICAgICAgIDwhLS0gRm9ybXVsYXJpbyBkZSBMb2dpbiAtLT5cbiAgICAgICAgICAgIEBpZighbW9zdHJhcjJGQSl7XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxuXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgVXN1YXJpb1xuXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuaXMtaW52YWxpZF09XCJ1c3VhcmlvSW52YWxpZG9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJJbmdyZXNlIHN1IHVzdWFyaW9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJ1c3VhcmlvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJ1c3VhcmlvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChpbnB1dCk9XCJsaW1waWFyRXJyb3JVc3VhcmlvKClcIj5cblxuICAgICAgICAgICAgICAgICAgICBAaWYodXN1YXJpb0Vycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnZhbGlkLWZlZWRiYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgdXN1YXJpb0Vycm9yIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItMyBwb3NpdGlvbi1yZWxhdGl2ZVwiPlxuXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJhc2XDsWFcblxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgW3R5cGVdPVwibW9zdHJhclBhc3N3b3JkID8gJ3RleHQnIDogJ3Bhc3N3b3JkJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuaXMtaW52YWxpZF09XCJwYXNzd29yZEludmFsaWRvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSW5ncmVzZSBzdSBjb250cmFzZcOxYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoaW5wdXQpPVwibGltcGlhckVycm9yUGFzc3dvcmQoKVwiPlxuXG4gICAgICAgICAgICAgICAgICAgIEBpZihwYXNzd29yZEVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnZhbGlkLWZlZWRiYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgcGFzc3dvcmRFcnJvciB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiYnRuLXRvZ2dsZS1wYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlUGFzc3dvcmQoKVwiPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7eyBtb3N0cmFyUGFzc3dvcmQgPyAn8J+Rge+4jycgOiAn8J+Rge+4j+KAjfCfl6jvuI8nIH19XG5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zIGZvcm0tY2hlY2tcIj5cblxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJyZWNvcmRhclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cInJlY29yZGFyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJyZWNvcmRhclwiPlxuXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tY2hlY2stbGFiZWxcIiBmb3I9XCJyZWNvcmRhclwiPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWNvcmRhcm1lXG5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cblxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImJ0biBidG4tbG9naW4gdy0xMDBcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImluZ3Jlc2FyKClcIlxuICAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiY2FyZ2FuZG9cIj5cblxuICAgICAgICAgICAgICAgICAgICB7eyBjYXJnYW5kbyA/ICdDYXJnYW5kby4uLicgOiAnSW5ncmVzYXInIH19XG5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtdC0zIHRleHQtY2VudGVyXCI+XG5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiAoY2xpY2spPVwib2x2aWRhc3RlUGFzc3dvcmQoKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgwr9PbHZpZGFzdGUgdHUgY29udHJhc2XDsWE/XG5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgPCEtLSBGb3JtdWxhcmlvIDJGQSAtLT5cbiAgICAgICAgICAgIEBpZihtb3N0cmFyMkZBKXtcblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tdm9sdmVyLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi12b2x2ZXJcIiAoY2xpY2spPVwidm9sdmVyQUxvZ2luKClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKGkCBWb2x2ZXJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHJvbGU9XCJhbGVydFwiPlxuXG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+VmVyaWZpY2FjacOzbiBkZSBkb3MgZmFjdG9yZXM8L3N0cm9uZz48YnI+XG5cbiAgICAgICAgICAgICAgICAgICAgSW5ncmVzZSBlbCBjw7NkaWdvIGVudmlhZG8gYSBzdSBkaXNwb3NpdGl2by5cblxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1iLTNcIj5cblxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEPDs2RpZ28gZGUgdmVyaWZpY2FjacOzblxuXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkluZ3Jlc2UgZWwgY8OzZGlnbyBkZSA2IGTDrWdpdG9zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heGxlbmd0aD1cIjZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJjb2RpZ28yRkFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImNvZGlnbzJGQVwiPlxuXG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1sb2dpbiB3LTEwMFwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwidmVyaWZpY2FyMkZBKClcIlxuICAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiY2FyZ2FuZG9cIj5cblxuICAgICAgICAgICAgICAgICAgICB7eyBjYXJnYW5kbyA/ICdWZXJpZmljYW5kby4uLicgOiAnVmVyaWZpY2FyJyB9fVxuXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICA8L2Zvcm0+XG5cbiAgICAgICAgPHNtYWxsPlxuXG4gICAgICAgICAgICDCqSBHb2JpZXJubyBSZWdpb25hbCBkZSBMYW1iYXllcXVlXG5cbiAgICAgICAgPC9zbWFsbD5cblxuICAgIDwvZGl2PlxuXG48L2Rpdj4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwLCBjYXRjaEVycm9yLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFVzdWFyaW8ge1xyXG4gIGlkX3VzdWFyaW86IG51bWJlcjtcclxuICB1c3VhcmlvOiBzdHJpbmc7XHJcbiAgY29ycmVvOiBzdHJpbmc7XHJcbiAgcm9sOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9naW5SZXNwb25zZSB7XHJcbiAgdG9rZW46IHN0cmluZztcclxuICB1c3VhcmlvOiBVc3VhcmlvO1xyXG4gIHJlcXVpZXJlXzJmYTogYm9vbGVhbjtcclxuICBpZF91c3VhcmlvPzogbnVtYmVyO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBhcGlVcmwgPSAnaHR0cDovLzE5Mi4xNjguMi4xOTQ6MzAwMC9hcGkvYXV0aCc7XHJcbiAgcHJpdmF0ZSB1c3VhcmlvU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VXN1YXJpbyB8IG51bGw+KG51bGwpO1xyXG4gIHB1YmxpYyB1c3VhcmlvJCA9IHRoaXMudXN1YXJpb1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgdGhpcy5jYXJnYXJVc3VhcmlvKCk7XHJcbiAgfVxyXG5cclxuICBsb2dpbih1c3VhcmlvOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHJlY29yZGFyOiBib29sZWFuID0gZmFsc2UpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYXBpVXJsfS9sb2dpbmAsIHsgdXN1YXJpbywgcGFzc3dvcmQsIHJlY29yZGFyIH0pLnBpcGUoXHJcbiAgICAgIG1hcChyZXNwb25zZSA9PiByZXNwb25zZS5kYXRhKSwgLy8gRXh0cmFlciBlbCBkYXRhIGRlbCB3cmFwcGVyIHsgc3VjY2VzcywgZGF0YSwgbWVzc2FnZSB9XHJcbiAgICAgIHRhcChyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnRva2VuKSB7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCByZXNwb25zZS50b2tlbik7XHJcbiAgICAgICAgICBpZiAocmVjb3JkYXIpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzdWFyaW9fcmVjb3JkYWRvJywgdXN1YXJpbyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXN1YXJpb19yZWNvcmRhZG8nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudXN1YXJpb1N1YmplY3QubmV4dChyZXNwb25zZS51c3VhcmlvKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnJlcXVpZXJlXzJmYSkge1xyXG4gICAgICAgICAgdGhpcy51c3VhcmlvU3ViamVjdC5uZXh0KHJlc3BvbnNlLnVzdWFyaW8pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSksXHJcbiAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvZ2luOicsIGVycm9yKTtcclxuICAgICAgICBsZXQgbWVzc2FnZSA9ICdFcnJvciBhbCBpbmljaWFyIHNlc2nDs24nO1xyXG4gICAgICAgIGlmIChlcnJvci5lcnJvcj8ubWVzc2FnZSkge1xyXG4gICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmVycm9yLm1lc3NhZ2U7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyb3IuZXJyb3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGVycm9yLmVycm9yKTtcclxuICAgICAgICAgICAgbWVzc2FnZSA9IHBhcnNlZC5tZXNzYWdlIHx8IG1lc3NhZ2U7XHJcbiAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmVycm9yIHx8IG1lc3NhZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKG1lc3NhZ2UpKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICB2ZXJpZnkyRkEoaWRfdXN1YXJpbzogbnVtYmVyLCBjb2RpZ286IHN0cmluZyk6IE9ic2VydmFibGU8TG9naW5SZXNwb25zZT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5hcGlVcmx9L3ZlcmlmeS0yZmFgLCB7IGlkX3VzdWFyaW8sIGNvZGlnbyB9KS5waXBlKFxyXG4gICAgICBtYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuZGF0YSksXHJcbiAgICAgIHRhcChyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnRva2VuKSB7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCByZXNwb25zZS50b2tlbik7XHJcbiAgICAgICAgICB0aGlzLnVzdWFyaW9TdWJqZWN0Lm5leHQocmVzcG9uc2UudXN1YXJpbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSxcclxuICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgMkZBOicsIGVycm9yKTtcclxuICAgICAgICBsZXQgbWVzc2FnZSA9ICdDw7NkaWdvIDJGQSBpbnbDoWxpZG8nO1xyXG4gICAgICAgIGlmIChlcnJvci5lcnJvcj8ubWVzc2FnZSkge1xyXG4gICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmVycm9yLm1lc3NhZ2U7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyb3IuZXJyb3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGVycm9yLmVycm9yKTtcclxuICAgICAgICAgICAgbWVzc2FnZSA9IHBhcnNlZC5tZXNzYWdlIHx8IG1lc3NhZ2U7XHJcbiAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmVycm9yIHx8IG1lc3NhZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKG1lc3NhZ2UpKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBsb2dvdXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c3VhcmlvX3JlY29yZGFkbycpO1xyXG4gICAgdGhpcy51c3VhcmlvU3ViamVjdC5uZXh0KG51bGwpO1xyXG5cclxuICAgIC8vIExsYW1hZGEgYWwgYmFja2VuZCBwYXJhIGF1ZGl0b3LDrWEgKG5vIGJsb3F1ZWFudGUpXHJcbiAgICBpZiAodG9rZW4pIHtcclxuICAgICAgdGhpcy5odHRwLnBvc3QoYCR7dGhpcy5hcGlVcmx9L2xvZ291dGAsIHt9LCB7XHJcbiAgICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9XHJcbiAgICAgIH0pLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvZihudWxsKTtcclxuICB9XHJcblxyXG4gIG9idGVuZXJVc3VhcmlvQWN0dWFsKCk6IE9ic2VydmFibGU8VXN1YXJpbz4ge1xyXG4gICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYXBpVXJsfS9tZWAsIHtcclxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9XHJcbiAgICB9KS5waXBlKFxyXG4gICAgICBtYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuZGF0YSksXHJcbiAgICAgIHRhcCh1c3VhcmlvID0+IHRoaXMudXN1YXJpb1N1YmplY3QubmV4dCh1c3VhcmlvKSksXHJcbiAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgIHRoaXMudXN1YXJpb1N1YmplY3QubmV4dChudWxsKTtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoJ1Rva2VuIGludsOhbGlkbycpKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBlc3RhQXV0ZW50aWNhZG8oKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnBhcnNlKGF0b2IodG9rZW4uc3BsaXQoJy4nKVsxXSkpO1xyXG4gICAgICBjb25zdCBleHAgPSBwYXlsb2FkLmV4cCAqIDEwMDA7XHJcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIDwgZXhwO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9idGVuZXJVc3VhcmlvKCk6IFVzdWFyaW8gfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLnVzdWFyaW9TdWJqZWN0LnZhbHVlO1xyXG4gIH1cclxuXHJcbiAgb2J0ZW5lclVzdWFyaW9SZWNvcmRhZG8oKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzdWFyaW9fcmVjb3JkYWRvJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhcmdhclVzdWFyaW8oKSB7XHJcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gICAgaWYgKHRva2VuICYmIHRoaXMuZXN0YUF1dGVudGljYWRvKCkpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShhdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcclxuICAgICAgICB0aGlzLnVzdWFyaW9TdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgICAgaWRfdXN1YXJpbzogcGF5bG9hZC5pZF91c3VhcmlvLFxyXG4gICAgICAgICAgdXN1YXJpbzogcGF5bG9hZC51c3VhcmlvLFxyXG4gICAgICAgICAgY29ycmVvOiAnJyxcclxuICAgICAgICAgIHJvbDogcGF5bG9hZC5yb2xcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFRva2VuKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCwgaW5qZWN0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhc2hib2FyZFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kYXNoYm9hcmQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtZGFzaGJvYXJkJyxcbiAgaW1wb3J0czogW10sXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXNoYm9hcmQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9kYXNoYm9hcmQuY3NzJyxcbn0pXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkIGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHJpdmF0ZSBkYXNoYm9hcmRTZXJ2aWNlID0gaW5qZWN0KERhc2hib2FyZFNlcnZpY2UpO1xuXG4gIHRvdGFsUHJveWVjdG9zID0gMDtcbiAgdWx0aW1vUmVnaXN0cm8gPSAnLSc7XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kYXNoYm9hcmRTZXJ2aWNlLm9idGVuZXJSZXN1bWVuKCkuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQ6IChyZXNwKSA9PiB7XG4gICAgICAgIGlmIChyZXNwLnN1Y2Nlc3MgJiYgcmVzcC5kYXRhKSB7XG4gICAgICAgICAgdGhpcy50b3RhbFByb3llY3RvcyA9IHJlc3AuZGF0YS50b3RhbFByb3llY3RvcyB8fCAwO1xuXG4gICAgICAgICAgY29uc3QgZmVjaGEgPSByZXNwLmRhdGEudWx0aW1vUmVnaXN0cm8/LmZlY2hhX3JlZ2lzdHJvX3Npc3RlbWE7XG4gICAgICAgICAgaWYgKGZlY2hhKSB7XG4gICAgICAgICAgICB0aGlzLnVsdGltb1JlZ2lzdHJvID0gdGhpcy5mb3JtYXRlYXJGZWNoYShuZXcgRGF0ZShmZWNoYSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFsIG9idGVuZXIgcmVzdW1lbiBkZWwgZGFzaGJvYXJkOicsIGVycik7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBmb3JtYXRlYXJGZWNoYShmZWNoYTogRGF0ZSk6IHN0cmluZyB7XG4gICAgY29uc3QgZGQgPSBTdHJpbmcoZmVjaGEuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG1tID0gU3RyaW5nKGZlY2hhLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IHl5eXkgPSBmZWNoYS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGhoID0gU3RyaW5nKGZlY2hhLmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgbWluID0gU3RyaW5nKGZlY2hhLmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICByZXR1cm4gYCR7ZGR9LyR7bW19LyR7eXl5eX0gJHtoaH06JHttaW59YDtcbiAgfVxufSIsIjxoMj5cblxuICAgIEJpZW52ZW5pZG9cblxuPC9oMj5cblxuPHA+XG5cbiAgICBTaXN0ZW1hIGRlIFNlZ3VpbWllbnRvIGRlIFByb3llY3RvcyBkZWwgR29iaWVybm8gUmVnaW9uYWwgZGUgTGFtYmF5ZXF1ZS5cblxuPC9wPlxuXG48YnI+XG5cbjxkaXYgY2xhc3M9XCJjYXJkc1wiPlxuXG4gICAgPGRpdiBjbGFzcz1cImNhcmRcIj5cblxuICAgICAgICA8aDQ+VG90YWwgUHJveWVjdG9zPC9oND5cblxuICAgICAgICA8aDE+e3sgdG90YWxQcm95ZWN0b3MgfX08L2gxPlxuXG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxuXG4gICAgICAgIDxoND7Dmmx0aW1vIFJlZ2lzdHJvPC9oND5cblxuICAgICAgICA8aDE+e3sgdWx0aW1vUmVnaXN0cm8gfX08L2gxPlxuXG4gICAgPC9kaXY+XG5cbjwvZGl2PiIsImltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmRTZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSBodHRwID0gaW5qZWN0KEh0dHBDbGllbnQpO1xyXG5cclxuICBwcml2YXRlIGFwaSA9ICdodHRwOi8vMTkyLjE2OC4yLjE5NDozMDAwL2FwaS9kYXNoYm9hcmQnO1xyXG5cclxuICBvYnRlbmVyUmVzdW1lbigpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PihgJHt0aGlzLmFwaX0vcmVzdW1lbmApO1xyXG4gIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciwgUm91dGVyT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgTmF2YmFyIH0gZnJvbSAnLi4vbmF2YmFyL25hdmJhcic7XG5pbXBvcnQgeyBTaWRlYmFyIH0gZnJvbSAnLi4vc2lkZWJhci9zaWRlYmFyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW1haW4tbGF5b3V0JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW1xuICAgIFJvdXRlck91dGxldCxcbiAgICBOYXZiYXIsXG4gICAgU2lkZWJhclxuICBdLFxuICB0ZW1wbGF0ZVVybDogJy4vbWFpbi1sYXlvdXQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9tYWluLWxheW91dC5jc3MnXG59KVxuZXhwb3J0IGNsYXNzIE1haW5MYXlvdXQge1xuXG4gICAgbWVudUFiaWVydG8gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyXG4gICAgKSB7fVxuXG4gICAgY2VycmFyU2VzaW9uKCl7XG5cbiAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvbG9naW4nXSk7XG5cbiAgICB9XG5cbn0iLCI8YXBwLW5hdmJhcj48L2FwcC1uYXZiYXI+XG5cbjxkaXYgY2xhc3M9XCJsYXlvdXRcIj5cblxuICAgIDxhcHAtc2lkZWJhcj48L2FwcC1zaWRlYmFyPlxuXG4gICAgPG1haW4+XG5cbiAgICAgICAgPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PlxuXG4gICAgPC9tYWluPlxuXG48L2Rpdj4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uYXZiYXInLFxuICBpbXBvcnRzOiBbXSxcbiAgdGVtcGxhdGVVcmw6ICcuL25hdmJhci5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL25hdmJhci5jc3MnLFxufSlcbmV4cG9ydCBjbGFzcyBOYXZiYXIge1xuICBtZW51QWJpZXJ0byA9IGZhbHNlO1xuICB1c3VhcmlvOiBhbnkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMudXN1YXJpbyA9IHRoaXMuYXV0aFNlcnZpY2Uub2J0ZW5lclVzdWFyaW8oKTtcbiAgfVxuXG4gIGNlcnJhclNlc2lvbigpOiB2b2lkIHtcbiAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ291dCgpLnN1YnNjcmliZSh7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL2xvZ2luJ10pO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgIC8vIEF1bnF1ZSBmYWxsZSBlbCBsb2dvdXQgZW4gZWwgc2Vydmlkb3IsIHJlZGlyaWdpclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9sb2dpbiddKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiPG5hdiBjbGFzcz1cIm5hdmJhclwiPlxuXG4gICAgPGRpdiBjbGFzcz1cImxvZ29cIj5cblxuICAgICAgICA8aW1nXG4gICAgICAgICAgICBzcmM9XCJpbWFnZXMvbG9nby1nb3JlLmpwZWdcIlxuICAgICAgICAgICAgYWx0PVwiTG9nb1wiPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXR1bG9cIj5cblxuICAgICAgICAgICAgPGg0PkdvYmllcm5vIFJlZ2lvbmFsIGRlIExhbWJheWVxdWU8L2g0PlxuXG4gICAgICAgICAgICA8c21hbGw+U2lzdGVtYSBkZSBTZWd1aW1pZW50bzwvc21hbGw+XG5cbiAgICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJ1c2VyLW1lbnVcIj5cblxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzcz1cInVzZXItYnV0dG9uXCJcbiAgICAgICAgICAgIChjbGljayk9XCJtZW51QWJpZXJ0byA9ICFtZW51QWJpZXJ0b1wiPlxuXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImF2YXRhclwiPlxuXG4gICAgICAgICAgICAgICAge3sgdXN1YXJpbz8udXN1YXJpbz8uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgfHwgJ1UnIH19XG5cbiAgICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgICAgPHNwYW4+XG5cbiAgICAgICAgICAgICAgICB7eyB1c3VhcmlvPy51c3VhcmlvIHx8ICdVc3VhcmlvJyB9fVxuXG4gICAgICAgICAgICA8L3NwYW4+XG5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmxlY2hhXCI+XG5cbiAgICAgICAgICAgICAgICDilrxcblxuICAgICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIEBpZihtZW51QWJpZXJ0byl7XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkcm9wZG93blwiPlxuXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiY2VycmFyU2VzaW9uKClcIj5cblxuICAgICAgICAgICAgICAgICAgICDwn5qqIENlcnJhciBzZXNpw7NuXG5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgfVxuXG4gICAgPC9kaXY+XG5cbjwvbmF2PiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTGluayB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zaWRlYmFyJyxcbiAgaW1wb3J0czogWyBSb3V0ZXJMaW5rIF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9zaWRlYmFyLmh0bWwnLFxuICBzdHlsZVVybDogJy4vc2lkZWJhci5jc3MnLFxufSlcbmV4cG9ydCBjbGFzcyBTaWRlYmFyIHtcbiAgdXN1YXJpbzogYW55ID0gbnVsbDtcbiAgbW9kdWxvc1Zpc2libGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7XG4gICAgdGhpcy51c3VhcmlvID0gdGhpcy5hdXRoU2VydmljZS5vYnRlbmVyVXN1YXJpbygpO1xuICAgIHRoaXMuYWN0dWFsaXphck1vZHVsb3NWaXNpYmxlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBhY3R1YWxpemFyTW9kdWxvc1Zpc2libGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IHJvbCA9IHRoaXMudXN1YXJpbz8ucm9sIHx8ICdISVNUT1JJQUwnO1xuICAgIFxuICAgIGNvbnN0IHJvbGVzUGVybWl0aWRvczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9ID0ge1xuICAgICAgJ0FETUlOJzogWydkYXNoYm9hcmQnLCAnc2FsdWQnLCAnZWR1Y2FjaW9uJywgJ2hpc3RvcmlhbCddLFxuICAgICAgJ1NBTFVEJzogWydkYXNoYm9hcmQnLCAnc2FsdWQnLCAnaGlzdG9yaWFsJ10sXG4gICAgICAnRURVQ0FDSU9OJzogWydkYXNoYm9hcmQnLCAnZWR1Y2FjaW9uJywgJ2hpc3RvcmlhbCddLFxuICAgICAgJ0hJU1RPUklBTCc6IFsnZGFzaGJvYXJkJywgJ2hpc3RvcmlhbCddXG4gICAgfTtcblxuICAgIHRoaXMubW9kdWxvc1Zpc2libGVzID0gcm9sZXNQZXJtaXRpZG9zW3JvbF0gfHwgWydkYXNoYm9hcmQnLCAnaGlzdG9yaWFsJ107XG4gIH1cblxuICB0aWVuZUFjY2Vzbyhtb2R1bG86IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZHVsb3NWaXNpYmxlcy5pbmNsdWRlcyhtb2R1bG8pO1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwic2lkZWJhclwiPlxuXG4gICAgPGRpdiBjbGFzcz1cInRpdHVsb1wiPlxuXG4gICAgICAgIFBBTkVMXG5cbiAgICA8L2Rpdj5cblxuICAgIDxuYXY+XG5cbiAgICAgICAgPGFcbiAgICAgICAgICAgIHJvdXRlckxpbms9XCIvZGFzaGJvYXJkXCJcbiAgICAgICAgICAgIHJvdXRlckxpbmtBY3RpdmU9XCJhY3RpdmVcIj5cblxuICAgICAgICAgICAg8J+TiiBEYXNoYm9hcmRcblxuICAgICAgICA8L2E+XG5cbiAgICAgICAgQGlmKHRpZW5lQWNjZXNvKCdzYWx1ZCcpKXtcblxuICAgICAgICAgICAgPGEgcm91dGVyTGluaz1cIi9zYWx1ZFwiPlxuXG4gICAgICAgICAgICAgICAg8J+PpSBTYWx1ZFxuXG4gICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgfVxuXG4gICAgICAgIEBpZih0aWVuZUFjY2VzbygnZWR1Y2FjaW9uJykpe1xuXG4gICAgICAgICAgICA8YSByb3V0ZXJMaW5rPVwiL2VkdWNhY2lvblwiPlxuXG4gICAgICAgICAgICAgICAg8J+PqyBFZHVjYWNpw7NuXG5cbiAgICAgICAgICAgIDwvYT5cblxuICAgICAgICB9XG5cbiAgICAgICAgQGlmKHRpZW5lQWNjZXNvKCdoaXN0b3JpYWwnKSl7XG5cbiAgICAgICAgICAgIDxhIHJvdXRlckxpbms9XCIvaGlzdG9yaWFsXCI+XG5cbiAgICAgICAgICAgICAgICDwn5OcIEhpc3RvcmlhbFxuXG4gICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgfVxuXG4gICAgPC9uYXY+XG48L2Rpdj4iLCJpbXBvcnQgeyBDb21wb25lbnQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ0lmIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5pbXBvcnQgeyBTYWx1ZFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zYWx1ZCc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3JlYXJTYWx1ZERUTyB9IGZyb20gJy4uLy4uL21vZGVscy9jcmVhci1zYWx1ZC5kdG8nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtc2FsdWQnLFxyXG4gIHN0YW5kYWxvbmU6IHRydWUsXHJcbiAgaW1wb3J0czogW1JlYWN0aXZlRm9ybXNNb2R1bGUsIE5nSWZdLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9zYWx1ZC5odG1sJyxcclxuICBzdHlsZVVybDogJy4vc2FsdWQuY3NzJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIFNhbHVkIHtcclxuICBwcml2YXRlIGZiID0gaW5qZWN0KEZvcm1CdWlsZGVyKTtcclxuICBwcml2YXRlIHNhbHVkU2VydmljZSA9IGluamVjdChTYWx1ZFNlcnZpY2UpO1xyXG4gIHByaXZhdGUgYXV0aFNlcnZpY2UgPSBpbmplY3QoQXV0aFNlcnZpY2UpO1xyXG5cclxuICBtZW5zYWplR3VhcmRhZG8gPSAnJztcclxuICBpZFJlbmFlc01lbnNhamUgPSAnJztcclxuXHJcbiAgbWluRGF0ZSA9IHRoaXMuZ2V0VG9kYXlTdHJpbmcoKTtcclxuXHJcbiAgY2VycmFyTWVuc2FqZSgpOiB2b2lkIHtcclxuICAgIHRoaXMubWVuc2FqZUd1YXJkYWRvID0gJyc7XHJcbiAgfVxyXG5cclxuICBmb3JtID0gdGhpcy5mYi5ncm91cCh7XHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gSU5GT1JNQUNJw5NOIEdFTkVSQUxcclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaWRfcmVuYWVzOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLnBhdHRlcm4oL15cXGR7MSw4fSQvKV1dLFxyXG5cclxuICAgIG5vbWJyZV9lZXNzOiBbJyddLFxyXG5cclxuICAgIGNhdGVnb3JpYTogWycnXSxcclxuXHJcbiAgICByZWRfc2FsdWQ6IFsnJ10sXHJcblxyXG4gICAgbWljcm9yZWQ6IFsnJ10sXHJcblxyXG4gICAgcHJvdmluY2lhOiBbJyddLFxyXG5cclxuICAgIGRpc3RyaXRvOiBbJyddLFxyXG5cclxuICAgIHRpcG86IFsnJ10sXHJcblxyXG4gICAgY29vcmRfbGF0OiBbMF0sXHJcblxyXG4gICAgY29vcmRfbG9uZzogWzBdLFxyXG5cclxuICAgIHBvYmxhY2lvbl9hc2lnbmFkYTogWzBdLFxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBQUk9ZRUNUTyBERSBJTlZFUlNJw5NOXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGlkX3Byb3llY3RvOiBbMF0sXHJcblxyXG4gICAgZXN0YWRvX2ludmVyc2lvbjogWycnXSxcclxuXHJcbiAgICBhdmFuY2VfZmlzaWNvOiBbMCwgW1ZhbGlkYXRvcnMubWluKDApLCBWYWxpZGF0b3JzLm1heCgxMDApXV0sXHJcblxyXG4gICAgYXZhbmNlX2ZpbmFuY2llcm86IFswLCBbVmFsaWRhdG9ycy5taW4oMCksIFZhbGlkYXRvcnMubWF4KDEwMCldXSxcclxuXHJcbiAgICBtb250b190b3RhbDogWzBdLFxyXG5cclxuICAgIG1vbnRvX2RldmVuZ2FkbzogWzBdLFxyXG5cclxuICAgIHVuaWRhZF9lamVjdXRvcmE6IFsnJ10sXHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIEVRVUlQQU1JRU5UT1xyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBjYW1hc191Y2lfdG90OiBbMF0sXHJcblxyXG4gICAgY2FtYXNfdWNpX2Rpc3A6IFswXSxcclxuXHJcbiAgICBjYW1hc19ob3NwaXRhbGFyaWFzOiBbMF0sXHJcblxyXG4gICAgZXF1aXBvX3JheW9zX3g6IFsnJ10sXHJcblxyXG4gICAgcGxhbnRhX294aWdlbm86IFsnJ10sXHJcblxyXG4gICAgZXN0YWRvX2luZnJhOiBbMSwgW1ZhbGlkYXRvcnMubWluKDEpLCBWYWxpZGF0b3JzLm1heCg1KV1dLFxyXG5cclxuICAgIHZlbnRpbGFkb3JlczogWzBdLFxyXG5cclxuICAgIG1vbml0b3JlczogWzBdLFxyXG5cclxuICAgIGVjb2dyYWZvOiBbZmFsc2VdLFxyXG5cclxuICAgIHRvbW9ncmFmbzogW2ZhbHNlXSxcclxuXHJcbiAgICBvcGVyYXRpdm86IFswXSxcclxuXHJcbiAgICBpbm9wZXJhdGl2bzogWzBdLFxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBSRUNVUlNPUyBIVU1BTk9TXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIG1lZF9wcm9nOiBbMF0sXHJcblxyXG4gICAgbWVkX2V4aXN0OiBbMF0sXHJcblxyXG4gICAgdHVybm9fMjRoOiBbJyddLFxyXG5cclxuICAgIGVuZmVybWVyYXM6IFswXSxcclxuXHJcbiAgICB0ZWNuaWNvczogWzBdLFxyXG5cclxuICAgIHBlZGlhdHJhOiBbMF0sXHJcblxyXG4gICAgZ2luZWNvX29ic3RldHJhOiBbMF0sXHJcblxyXG4gICAgYW5lc3Rlc2lvbG9nbzogWzBdLFxyXG5cclxuICAgIGNpcnVqYW5vX2dlbmVyYWw6IFswXSxcclxuXHJcbiAgICBpbnRlbnNpdmlzdGE6IFswXSxcclxuXHJcbiAgICBpbnRlcm5pc3RhOiBbMF0sXHJcblxyXG4gICAgY2FyZGlvbG9nbzogWzBdLFxyXG5cclxuICAgIHRyYXVtYXRvbG9nbzogWzBdLFxyXG5cclxuICAgIG90cm9zX2VzcGVjaWFsaXN0YXM6IFswXSxcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gRVBJREVNSU9MT0fDjUFcclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgYW5ob19lcGk6IFtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCldLFxyXG5cclxuICAgIHNlbWFuYV9lcGk6IFsxLCBbVmFsaWRhdG9ycy5taW4oMSksIFZhbGlkYXRvcnMubWF4KDUzKV1dLFxyXG5cclxuICAgIGNhc29zX2Rlbmd1ZTogWzBdLFxyXG5cclxuICAgIGNhc29zX2FuZW1pYTogWzBdLFxyXG5cclxuICAgIG1vcnRfbWF0ZXJuYTogWzBdLFxyXG5cclxuICAgIGNhc29zX2Rlc251dHJpY2lvbjogWzBdLFxyXG5cclxuICAgIGlyYXNfZWRhczogWzBdLFxyXG5cclxuICAgIG1vcnRhbGlkYWRfbmVvbmF0YWw6IFswXSxcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gU0VSVklDSU9TXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGVtZXJnZW5jaWE6IFtmYWxzZV0sXHJcblxyXG4gICAgdWNpOiBbZmFsc2VdLFxyXG5cclxuICAgIGNlbnRyb19xdWlydXJnaWNvOiBbZmFsc2VdLFxyXG5cclxuICAgIHBhcnRvczogW2ZhbHNlXSxcclxuXHJcbiAgICBjb25zdWx0YXNfZGlhcmlhc19wcm9tOiBbMF0sXHJcblxyXG4gICAgY2FtYXNfb2N1cGFkYXM6IFswXSxcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gQ09ORElDSU9ORVMgQsOBU0lDQVNcclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgYWd1YTogW2ZhbHNlXSxcclxuXHJcbiAgICBkZXNhZ3VlOiBbZmFsc2VdLFxyXG5cclxuICAgIGVsZWN0cmljaWRhZDogW2ZhbHNlXSxcclxuXHJcbiAgICBveGlnZW5vOiBbZmFsc2VdLFxyXG5cclxuICAgIGludGVybmV0OiBbZmFsc2VdLFxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBGRUNIQVxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBmZWNoYV9jb3J0ZTogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcclxuICB9KTtcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSByZWFjdGl2ZSBjcm9zcy1maWVsZCB2YWxpZGF0aW9uc1xyXG4gIHByaXZhdGUgX2luaXQgPSB0aGlzLnNldHVwVmFsaWRhdG9ycygpO1xyXG5cclxuICBwcml2YXRlIHNldHVwVmFsaWRhdG9ycygpOiB2b2lkIHtcclxuICAgIC8vIGNhbWFzIFVDSTogZGlzcG9uaWJsZXMgPD0gdG90YWxlc1xyXG4gICAgdGhpcy5mb3JtLmdldCgnY2FtYXNfdWNpX3RvdCcpPy52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2hlY2tDYW1hcygpKTtcclxuICAgIHRoaXMuZm9ybS5nZXQoJ2NhbWFzX3VjaV9kaXNwJyk/LnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jaGVja0NhbWFzKCkpO1xyXG5cclxuICAgIC8vIG3DqWRpY29zIGVuIHNlcnZpY2lvIDw9IG3DqWRpY29zIHByb2dyYW1hZG9zXHJcbiAgICB0aGlzLmZvcm0uZ2V0KCdtZWRfcHJvZycpPy52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2hlY2tNZWRpY29zKCkpO1xyXG4gICAgdGhpcy5mb3JtLmdldCgnbWVkX2V4aXN0Jyk/LnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jaGVja01lZGljb3MoKSk7XHJcblxyXG4gICAgLy8gZmVjaGEgZGViZSBzZXIgbWF5b3IgYSBob3lcclxuICAgIHRoaXMuZm9ybS5nZXQoJ2ZlY2hhX2NvcnRlJyk/LnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jaGVja0ZlY2hhKCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0NhbWFzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgdG90ID0gTnVtYmVyKHRoaXMuZm9ybS5nZXQoJ2NhbWFzX3VjaV90b3QnKT8udmFsdWUpIHx8IDA7XHJcbiAgICBjb25zdCBkaXNwID0gTnVtYmVyKHRoaXMuZm9ybS5nZXQoJ2NhbWFzX3VjaV9kaXNwJyk/LnZhbHVlKSB8fCAwO1xyXG4gICAgY29uc3QgY29udHJvbCA9IHRoaXMuZm9ybS5nZXQoJ2NhbWFzX3VjaV9kaXNwJyk7XHJcbiAgICBpZiAoZGlzcCA+IHRvdCkge1xyXG4gICAgICBjb250cm9sPy5zZXRFcnJvcnMoeyBtYXhFeGNlZWRlZDogdHJ1ZSB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHJlbW92ZSBzcGVjaWZpYyBlcnJvciB3aGlsZSBwcmVzZXJ2aW5nIG90aGVyc1xyXG4gICAgICBpZiAoY29udHJvbD8uaGFzRXJyb3IoJ21heEV4Y2VlZGVkJykpIHtcclxuICAgICAgICBjb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZSB9KTtcclxuICAgICAgICBjb25zdCBlcnJvcnMgPSBjb250cm9sLmVycm9ycztcclxuICAgICAgICBpZiAoZXJyb3JzKSB7XHJcbiAgICAgICAgICBkZWxldGUgZXJyb3JzWydtYXhFeGNlZWRlZCddO1xyXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID09PSAwKSBjb250cm9sLnNldEVycm9ycyhudWxsKTtcclxuICAgICAgICAgIGVsc2UgY29udHJvbC5zZXRFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hlY2tNZWRpY29zKCk6IHZvaWQge1xyXG4gICAgY29uc3QgcHJvZyA9IE51bWJlcih0aGlzLmZvcm0uZ2V0KCdtZWRfcHJvZycpPy52YWx1ZSkgfHwgMDtcclxuICAgIGNvbnN0IGV4aXN0ID0gTnVtYmVyKHRoaXMuZm9ybS5nZXQoJ21lZF9leGlzdCcpPy52YWx1ZSkgfHwgMDtcclxuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmZvcm0uZ2V0KCdtZWRfZXhpc3QnKTtcclxuICAgIGlmIChleGlzdCA+IHByb2cpIHtcclxuICAgICAgY29udHJvbD8uc2V0RXJyb3JzKHsgbWF4RXhjZWVkZWQ6IHRydWUgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoY29udHJvbD8uaGFzRXJyb3IoJ21heEV4Y2VlZGVkJykpIHtcclxuICAgICAgICBjb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZSB9KTtcclxuICAgICAgICBjb25zdCBlcnJvcnMgPSBjb250cm9sLmVycm9ycztcclxuICAgICAgICBpZiAoZXJyb3JzKSB7XHJcbiAgICAgICAgICBkZWxldGUgZXJyb3JzWydtYXhFeGNlZWRlZCddO1xyXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID09PSAwKSBjb250cm9sLnNldEVycm9ycyhudWxsKTtcclxuICAgICAgICAgIGVsc2UgY29udHJvbC5zZXRFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hlY2tGZWNoYSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJhdyA9IHRoaXMuZm9ybS5nZXQoJ2ZlY2hhX2NvcnRlJyk/LnZhbHVlO1xyXG4gICAgY29uc3QgcGFyc2VkID0gdGhpcy5wYXJzZURhdGUocmF3KTtcclxuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmZvcm0uZ2V0KCdmZWNoYV9jb3J0ZScpO1xyXG4gICAgaWYgKCFwYXJzZWQpIHtcclxuICAgICAgY29udHJvbD8uc2V0RXJyb3JzKHsgaW52YWxpZERhdGU6IHRydWUgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIC8vIHplcm8gdGltZSBmb3IgY29tcGFyaXNvblxyXG4gICAgdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUocGFyc2VkLmdldEZ1bGxZZWFyKCksIHBhcnNlZC5nZXRNb250aCgpLCBwYXJzZWQuZ2V0RGF0ZSgpKTtcclxuICAgIGlmIChkIDw9IHRvZGF5KSB7XHJcbiAgICAgIGNvbnRyb2w/LnNldEVycm9ycyh7IGludmFsaWREYXRlOiB0cnVlIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGNvbnRyb2w/Lmhhc0Vycm9yKCdpbnZhbGlkRGF0ZScpKSB7XHJcbiAgICAgICAgY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgb25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2UgfSk7XHJcbiAgICAgICAgY29uc3QgZXJyb3JzID0gY29udHJvbC5lcnJvcnM7XHJcbiAgICAgICAgaWYgKGVycm9ycykge1xyXG4gICAgICAgICAgZGVsZXRlIGVycm9yc1snaW52YWxpZERhdGUnXTtcclxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhlcnJvcnMpLmxlbmd0aCA9PT0gMCkgY29udHJvbC5zZXRFcnJvcnMobnVsbCk7XHJcbiAgICAgICAgICBlbHNlIGNvbnRyb2wuc2V0RXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBidXNjYXJFc3RhYmxlY2ltaWVudG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmlkUmVuYWVzTWVuc2FqZSA9ICcnO1xyXG4gICAgY29uc3QgaWQgPSBOdW1iZXIodGhpcy5mb3JtLmdldCgnaWRfcmVuYWVzJyk/LnZhbHVlKTtcclxuXHJcbiAgICBpZiAoIWlkKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5zYWx1ZFNlcnZpY2VcclxuICAgICAgLm9idGVuZXJSZXBvcnRlQ29tcGxldG8oaWQpXHJcblxyXG4gICAgICAuc3Vic2NyaWJlKHtcclxuICAgICAgICBuZXh0OiAocmVzcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCFyZXNwLnN1Y2Nlc3MgfHwgIXJlc3AuZGF0YSB8fCAhcmVzcC5kYXRhLmVzdGFibGVjaW1pZW50bykge1xyXG4gICAgICAgICAgICB0aGlzLmlkUmVuYWVzTWVuc2FqZSA9ICdFc3RhYmxlY2ltaWVudG8gbm8gZXhpc3RlLCBzZSByZWdpc3RyYXLDoSBudWV2byBlc3RhYmxlY2ltaWVudG8uJztcclxuICAgICAgICAgICAgdGhpcy5saW1waWFyRGF0b3NFc3RhYmxlY2ltaWVudG8oKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbCA9IHRoaXMuZm9ybS5nZXQoJ2lkX3JlbmFlcycpO1xyXG4gICAgICAgICAgICBjb25zdCB2YWwgPSBjb250cm9sPy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2wgJiYgL15cXGR7MSw4fSQvLnRlc3QoU3RyaW5nKHZhbCkpKSB7XHJcbiAgICAgICAgICAgICAgY29udHJvbC5zZXRFcnJvcnMobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuaWRSZW5hZXNNZW5zYWplID0gJyc7XHJcblxyXG4gICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgIGNvbnN0IGUgPSBkYXRhLmVzdGFibGVjaW1pZW50bztcclxuICAgICAgICAgIGNvbnN0IGVxID0gZGF0YS5lcXVpcGFtaWVudG87XHJcbiAgICAgICAgICBjb25zdCByaCA9IGRhdGEucmVjdXJzb3NfaHVtYW5vcztcclxuICAgICAgICAgIGNvbnN0IGVwID0gZGF0YS5lcGlkZW1pb2xvZ2lhO1xyXG4gICAgICAgICAgY29uc3Qgc3YgPSBkYXRhLnNlcnZpY2lvcztcclxuICAgICAgICAgIGNvbnN0IGNiID0gZGF0YS5jb25kaWNpb25lc19iYXNpY2FzO1xyXG4gICAgICAgICAgY29uc3QgcHIgPSBkYXRhLnByb3llY3RvO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHBhdGNoVmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XHJcblxyXG4gICAgICAgICAgLy8gRXN0YWJsZWNpbWllbnRvXHJcbiAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1snbm9tYnJlX2Vlc3MnXSA9IGUubm9tYnJlX2Vlc3MgfHwgJyc7XHJcbiAgICAgICAgICAgIHBhdGNoVmFsdWVzWydjYXRlZ29yaWEnXSA9IGUuY2F0ZWdvcmlhIHx8ICcnO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1sncmVkX3NhbHVkJ10gPSBlLnJlZF9zYWx1ZCB8fCAnJztcclxuICAgICAgICAgICAgcGF0Y2hWYWx1ZXNbJ21pY3JvcmVkJ10gPSBlLm1pY3JvcmVkIHx8ICcnO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1sncHJvdmluY2lhJ10gPSBlLnByb3ZpbmNpYSB8fCAnJztcclxuICAgICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2Rpc3RyaXRvJ10gPSBlLmRpc3RyaXRvIHx8ICcnO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1sndGlwbyddID0gZS50aXBvIHx8ICcnO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1snY29vcmRfbGF0J10gPSBOdW1iZXIoZS5jb29yZF9sYXQpIHx8IDA7XHJcbiAgICAgICAgICAgIHBhdGNoVmFsdWVzWydjb29yZF9sb25nJ10gPSBOdW1iZXIoZS5jb29yZF9sb25nKSB8fCAwO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1sncG9ibGFjaW9uX2FzaWduYWRhJ10gPSBlLnBvYmxhY2lvbl9hc2lnbmFkYSB8fCAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIExpbXBpYXIgY2FtcG9zIHF1ZSBkZWJlbiBzZXIgc2llbXByZSBudWV2b3NcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydjYW1hc191Y2lfdG90J10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2NhbWFzX3VjaV9kaXNwJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2NhbWFzX2hvc3BpdGFsYXJpYXMnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZXF1aXBvX3JheW9zX3gnXSA9ICcnO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ3BsYW50YV9veGlnZW5vJ10gPSAnJztcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydlc3RhZG9faW5mcmEnXSA9IDE7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1sndmVudGlsYWRvcmVzJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ21vbml0b3JlcyddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydlY29ncmFmbyddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1sndG9tb2dyYWZvJ10gPSBmYWxzZTtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydvcGVyYXRpdm8nXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snaW5vcGVyYXRpdm8nXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snbWVkX3Byb2cnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snbWVkX2V4aXN0J10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ3R1cm5vXzI0aCddID0gJyc7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZW5mZXJtZXJhcyddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWyd0ZWNuaWNvcyddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydwZWRpYXRyYSddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydnaW5lY29fb2JzdGV0cmEnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snYW5lc3Rlc2lvbG9nbyddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydjaXJ1amFub19nZW5lcmFsJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2ludGVuc2l2aXN0YSddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydpbnRlcm5pc3RhJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2NhcmRpb2xvZ28nXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1sndHJhdW1hdG9sb2dvJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ290cm9zX2VzcGVjaWFsaXN0YXMnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snYW5ob19lcGknXSA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydzZW1hbmFfZXBpJ10gPSAxO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2Nhc29zX2Rlbmd1ZSddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydjYXNvc19hbmVtaWEnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snbW9ydF9tYXRlcm5hJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2Nhc29zX2Rlc251dHJpY2lvbiddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydpcmFzX2VkYXMnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snbW9ydGFsaWRhZF9uZW9uYXRhbCddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydlbWVyZ2VuY2lhJ10gPSBmYWxzZTtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWyd1Y2knXSA9IGZhbHNlO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2NlbnRyb19xdWlydXJnaWNvJ10gPSBmYWxzZTtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydwYXJ0b3MnXSA9IGZhbHNlO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2NvbnN1bHRhc19kaWFyaWFzX3Byb20nXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snY2FtYXNfb2N1cGFkYXMnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snYWd1YSddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZGVzYWd1ZSddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZWxlY3RyaWNpZGFkJ10gPSBmYWxzZTtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydveGlnZW5vJ10gPSBmYWxzZTtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydpbnRlcm5ldCddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snaWRfcHJveWVjdG8nXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZXN0YWRvX2ludmVyc2lvbiddID0gJyc7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snYXZhbmNlX2Zpc2ljbyddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydhdmFuY2VfZmluYW5jaWVybyddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydtb250b190b3RhbCddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydtb250b19kZXZlbmdhZG8nXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1sndW5pZGFkX2VqZWN1dG9yYSddID0gJyc7XHJcblxyXG4gICAgICAgICAgdGhpcy5mb3JtLnBhdGNoVmFsdWUocGF0Y2hWYWx1ZXMpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICBpZiAoZXJyPy5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICAgICB0aGlzLmlkUmVuYWVzTWVuc2FqZSA9ICdFc3RhYmxlY2ltaWVudG8gbm8gZXhpc3RlLCBzZSByZWdpc3RyYXLDoSBudWV2byBlc3RhYmxlY2ltaWVudG8uJztcclxuICAgICAgICAgICAgdGhpcy5saW1waWFyRGF0b3NFc3RhYmxlY2ltaWVudG8oKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbDQwNCA9IHRoaXMuZm9ybS5nZXQoJ2lkX3JlbmFlcycpO1xyXG4gICAgICAgICAgICBjb25zdCB2NDA0ID0gY29udHJvbDQwND8udmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sNDA0ICYmIC9eXFxkezEsOH0kLy50ZXN0KFN0cmluZyh2NDA0KSkpIHtcclxuICAgICAgICAgICAgICBjb250cm9sNDA0LnNldEVycm9ycyhudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmlkUmVuYWVzTWVuc2FqZSA9ICdFcnJvciBhbCBjb25zdWx0YXIgZWwgZXN0YWJsZWNpbWllbnRvLic7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVJZElucHV0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pZFJlbmFlc01lbnNhamUgPSAnJztcclxuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmZvcm0uZ2V0KCdpZF9yZW5hZXMnKTtcclxuICAgIGNvbnN0IHZhbCA9IGNvbnRyb2w/LnZhbHVlO1xyXG4gICAgaWYgKGNvbnRyb2wgJiYgL15cXGR7MSw4fSQvLnRlc3QoU3RyaW5nKHZhbCkpKSB7XHJcbiAgICAgIGNvbnRyb2wuc2V0RXJyb3JzKG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB2YWxpZGFyQ2FtcG9zT2JsaWdhdG9yaW9zKCk6IHsgdmFsaWRvOiBib29sZWFuOyBjYW1wb3NGYWx0YW50ZXM6IHN0cmluZ1tdIH0ge1xyXG4gICAgY29uc3QgY2FtcG9zRmFsdGFudGVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIC8vIFZhbGlkYXIgRXN0YWJsZWNpbWllbnRvcyAtIFRPRE9TIGRlYmVuIGVzdGFyIGxsZW5vc1xyXG4gICAgY29uc3QgY2FtcG9zRXN0YWJsZWNpbWllbnRvID0gW1xyXG4gICAgICAnaWRfcmVuYWVzJyxcclxuICAgICAgJ25vbWJyZV9lZXNzJyxcclxuICAgICAgJ2NhdGVnb3JpYScsXHJcbiAgICAgICdyZWRfc2FsdWQnLFxyXG4gICAgICAncHJvdmluY2lhJyxcclxuICAgICAgJ2Rpc3RyaXRvJyxcclxuICAgICAgJ3RpcG8nLFxyXG4gICAgXTtcclxuICAgIGZvciAoY29uc3QgY2FtcG8gb2YgY2FtcG9zRXN0YWJsZWNpbWllbnRvKSB7XHJcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmZvcm0uZ2V0KGNhbXBvKTtcclxuICAgICAgY29uc3QgdmFsdWUgPSBjb250cm9sPy52YWx1ZTtcclxuICAgICAgaWYgKCF2YWx1ZSB8fCAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgPT09ICcnKSkge1xyXG4gICAgICAgIGNhbXBvc0ZhbHRhbnRlcy5wdXNoKGNhbXBvKTtcclxuICAgICAgICBjb250cm9sPy5tYXJrQXNUb3VjaGVkKCk7XHJcbiAgICAgICAgY29udHJvbD8uc2V0RXJyb3JzKHsgcmVxdWlyZWQ6IHRydWUgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBWYWxpZGFyIEdlc3Rpw7NuIGRlIEludmVyc2lvbmVzIC0gZXN0YWRvX2ludmVyc2lvbiBkZWJlIHRlbmVyIHNlbGVjY2nDs25cclxuICAgIGNvbnN0IGVzdEludmVyc2lvbiA9IHRoaXMuZm9ybS5nZXQoJ2VzdGFkb19pbnZlcnNpb24nKTtcclxuICAgIGlmICghZXN0SW52ZXJzaW9uPy52YWx1ZSB8fCBlc3RJbnZlcnNpb24udmFsdWUudHJpbSgpID09PSAnJykge1xyXG4gICAgICBjYW1wb3NGYWx0YW50ZXMucHVzaCgnZXN0YWRvX2ludmVyc2lvbicpO1xyXG4gICAgICBlc3RJbnZlcnNpb24/Lm1hcmtBc1RvdWNoZWQoKTtcclxuICAgICAgZXN0SW52ZXJzaW9uPy5zZXRFcnJvcnMoeyByZXF1aXJlZDogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBWYWxpZGFyIGZlY2hhX2NvcnRlXHJcbiAgICBjb25zdCBmZWNoYUNvcnRlID0gdGhpcy5mb3JtLmdldCgnZmVjaGFfY29ydGUnKTtcclxuICAgIGlmICghZmVjaGFDb3J0ZT8udmFsdWUgfHwgZmVjaGFDb3J0ZS52YWx1ZS50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgIGNhbXBvc0ZhbHRhbnRlcy5wdXNoKCdmZWNoYV9jb3J0ZScpO1xyXG4gICAgICBmZWNoYUNvcnRlPy5tYXJrQXNUb3VjaGVkKCk7XHJcbiAgICAgIGZlY2hhQ29ydGU/LnNldEVycm9ycyh7IHJlcXVpcmVkOiB0cnVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkbzogY2FtcG9zRmFsdGFudGVzLmxlbmd0aCA9PT0gMCxcclxuICAgICAgY2FtcG9zRmFsdGFudGVzLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGd1YXJkYXJSZXBvcnRlKCk6IHZvaWQge1xyXG4gICAgY29uc3QgdmFsaWRhY2lvbiA9IHRoaXMudmFsaWRhckNhbXBvc09ibGlnYXRvcmlvcygpO1xyXG5cclxuICAgIGlmICghdmFsaWRhY2lvbi52YWxpZG8pIHtcclxuICAgICAgdGhpcy5tZW5zYWplR3VhcmRhZG8gPSAnRmFsdGEgY29tcGxldGFyIGNhbXBvcyc7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByYXdWYWx1ZXMgPSB0aGlzLmZvcm0uZ2V0UmF3VmFsdWUoKTtcclxuXHJcbiAgICBjb25zdCBmZWNoYUNvcnRlID0gdGhpcy5wYXJzZURhdGUocmF3VmFsdWVzLmZlY2hhX2NvcnRlKSB8fCBuZXcgRGF0ZSgpO1xyXG5cclxuICAgIGNvbnN0IGR0bzogQ3JlYXJTYWx1ZERUTyA9IHtcclxuICAgICAgaWRfcmVuYWVzOiBOdW1iZXIocmF3VmFsdWVzLmlkX3JlbmFlcyksXHJcbiAgICAgIG5vbWJyZV9lZXNzOiByYXdWYWx1ZXMubm9tYnJlX2Vlc3MgfHwgJycsXHJcbiAgICAgIGNhdGVnb3JpYTogcmF3VmFsdWVzLmNhdGVnb3JpYSB8fCAnJyxcclxuICAgICAgcmVkX3NhbHVkOiByYXdWYWx1ZXMucmVkX3NhbHVkIHx8ICcnLFxyXG4gICAgICBtaWNyb3JlZDogcmF3VmFsdWVzLm1pY3JvcmVkIHx8ICcnLFxyXG4gICAgICBwcm92aW5jaWE6IHJhd1ZhbHVlcy5wcm92aW5jaWEgfHwgJycsXHJcbiAgICAgIGRpc3RyaXRvOiByYXdWYWx1ZXMuZGlzdHJpdG8gfHwgJycsXHJcbiAgICAgIHRpcG86IHJhd1ZhbHVlcy50aXBvIHx8ICcnLFxyXG4gICAgICBjb29yZF9sYXQ6IE51bWJlcihyYXdWYWx1ZXMuY29vcmRfbGF0KSxcclxuICAgICAgY29vcmRfbG9uZzogTnVtYmVyKHJhd1ZhbHVlcy5jb29yZF9sb25nKSxcclxuICAgICAgcG9ibGFjaW9uX2FzaWduYWRhOiBOdW1iZXIocmF3VmFsdWVzLnBvYmxhY2lvbl9hc2lnbmFkYSksXHJcbiAgICAgIGlkX3Byb3llY3RvOiBOdW1iZXIocmF3VmFsdWVzLmlkX3Byb3llY3RvKSxcclxuICAgICAgZXN0YWRvX2ludmVyc2lvbjogcmF3VmFsdWVzLmVzdGFkb19pbnZlcnNpb24gfHwgJycsXHJcbiAgICAgIGF2YW5jZV9maXNpY286IE51bWJlcihyYXdWYWx1ZXMuYXZhbmNlX2Zpc2ljbyksXHJcbiAgICAgIGF2YW5jZV9maW5hbmNpZXJvOiBOdW1iZXIocmF3VmFsdWVzLmF2YW5jZV9maW5hbmNpZXJvKSxcclxuICAgICAgbW9udG9fdG90YWw6IE51bWJlcihyYXdWYWx1ZXMubW9udG9fdG90YWwpLFxyXG4gICAgICBtb250b19kZXZlbmdhZG86IE51bWJlcihyYXdWYWx1ZXMubW9udG9fZGV2ZW5nYWRvKSxcclxuICAgICAgdW5pZGFkX2VqZWN1dG9yYTogcmF3VmFsdWVzLnVuaWRhZF9lamVjdXRvcmEgfHwgJycsXHJcbiAgICAgIGNhbWFzX3VjaV90b3Q6IE51bWJlcihyYXdWYWx1ZXMuY2FtYXNfdWNpX3RvdCksXHJcbiAgICAgIGNhbWFzX3VjaV9kaXNwOiBOdW1iZXIocmF3VmFsdWVzLmNhbWFzX3VjaV9kaXNwKSxcclxuICAgICAgY2FtYXNfaG9zcGl0YWxhcmlhczogTnVtYmVyKHJhd1ZhbHVlcy5jYW1hc19ob3NwaXRhbGFyaWFzKSxcclxuICAgICAgZXF1aXBvX3JheW9zX3g6IHRoaXMucGFyc2VCb29sZWFuKHJhd1ZhbHVlcy5lcXVpcG9fcmF5b3NfeCksXHJcbiAgICAgIHBsYW50YV9veGlnZW5vOiB0aGlzLnBhcnNlQm9vbGVhbihyYXdWYWx1ZXMucGxhbnRhX294aWdlbm8pLFxyXG4gICAgICBlc3RhZG9faW5mcmE6IE51bWJlcihyYXdWYWx1ZXMuZXN0YWRvX2luZnJhKSxcclxuICAgICAgdmVudGlsYWRvcmVzOiBOdW1iZXIocmF3VmFsdWVzLnZlbnRpbGFkb3JlcyksXHJcbiAgICAgIG1vbml0b3JlczogTnVtYmVyKHJhd1ZhbHVlcy5tb25pdG9yZXMpLFxyXG4gICAgICBlY29ncmFmbzogdGhpcy5wYXJzZUJvb2xlYW4ocmF3VmFsdWVzLmVjb2dyYWZvKSxcclxuICAgICAgdG9tb2dyYWZvOiB0aGlzLnBhcnNlQm9vbGVhbihyYXdWYWx1ZXMudG9tb2dyYWZvKSxcclxuICAgICAgb3BlcmF0aXZvOiBOdW1iZXIocmF3VmFsdWVzLm9wZXJhdGl2byksXHJcbiAgICAgIGlub3BlcmF0aXZvOiBOdW1iZXIocmF3VmFsdWVzLmlub3BlcmF0aXZvKSxcclxuICAgICAgbWVkX3Byb2c6IE51bWJlcihyYXdWYWx1ZXMubWVkX3Byb2cpLFxyXG4gICAgICBtZWRfZXhpc3Q6IE51bWJlcihyYXdWYWx1ZXMubWVkX2V4aXN0KSxcclxuICAgICAgdHVybm9fMjRoOiB0aGlzLnBhcnNlQm9vbGVhbihyYXdWYWx1ZXMudHVybm9fMjRoKSxcclxuICAgICAgZW5mZXJtZXJhczogTnVtYmVyKHJhd1ZhbHVlcy5lbmZlcm1lcmFzKSxcclxuICAgICAgdGVjbmljb3M6IE51bWJlcihyYXdWYWx1ZXMudGVjbmljb3MpLFxyXG4gICAgICBwZWRpYXRyYTogTnVtYmVyKHJhd1ZhbHVlcy5wZWRpYXRyYSksXHJcbiAgICAgIGdpbmVjb19vYnN0ZXRyYTogTnVtYmVyKHJhd1ZhbHVlcy5naW5lY29fb2JzdGV0cmEpLFxyXG4gICAgICBhbmVzdGVzaW9sb2dvOiBOdW1iZXIocmF3VmFsdWVzLmFuZXN0ZXNpb2xvZ28pLFxyXG4gICAgICBjaXJ1amFub19nZW5lcmFsOiBOdW1iZXIocmF3VmFsdWVzLmNpcnVqYW5vX2dlbmVyYWwpLFxyXG4gICAgICBpbnRlbnNpdmlzdGE6IE51bWJlcihyYXdWYWx1ZXMuaW50ZW5zaXZpc3RhKSxcclxuICAgICAgaW50ZXJuaXN0YTogTnVtYmVyKHJhd1ZhbHVlcy5pbnRlcm5pc3RhKSxcclxuICAgICAgY2FyZGlvbG9nbzogTnVtYmVyKHJhd1ZhbHVlcy5jYXJkaW9sb2dvKSxcclxuICAgICAgdHJhdW1hdG9sb2dvOiBOdW1iZXIocmF3VmFsdWVzLnRyYXVtYXRvbG9nbyksXHJcbiAgICAgIG90cm9zX2VzcGVjaWFsaXN0YXM6IE51bWJlcihyYXdWYWx1ZXMub3Ryb3NfZXNwZWNpYWxpc3RhcyksXHJcbiAgICAgIGFuaG9fZXBpOiBOdW1iZXIocmF3VmFsdWVzLmFuaG9fZXBpKSxcclxuICAgICAgc2VtYW5hX2VwaTogTnVtYmVyKHJhd1ZhbHVlcy5zZW1hbmFfZXBpKSxcclxuICAgICAgY2Fzb3NfZGVuZ3VlOiBOdW1iZXIocmF3VmFsdWVzLmNhc29zX2Rlbmd1ZSksXHJcbiAgICAgIGNhc29zX2FuZW1pYTogTnVtYmVyKHJhd1ZhbHVlcy5jYXNvc19hbmVtaWEpLFxyXG4gICAgICBtb3J0X21hdGVybmE6IE51bWJlcihyYXdWYWx1ZXMubW9ydF9tYXRlcm5hKSxcclxuICAgICAgY2Fzb3NfZGVzbnV0cmljaW9uOiBOdW1iZXIocmF3VmFsdWVzLmNhc29zX2Rlc251dHJpY2lvbiB8fCAwKSxcclxuICAgICAgaXJhc19lZGFzOiBOdW1iZXIocmF3VmFsdWVzLmlyYXNfZWRhcyB8fCAwKSxcclxuICAgICAgbW9ydGFsaWRhZF9uZW9uYXRhbDogTnVtYmVyKHJhd1ZhbHVlcy5tb3J0YWxpZGFkX25lb25hdGFsIHx8IDApLFxyXG4gICAgICBlbWVyZ2VuY2lhOiB0aGlzLnBhcnNlQm9vbGVhbihyYXdWYWx1ZXMuZW1lcmdlbmNpYSksXHJcbiAgICAgIHVjaTogdGhpcy5wYXJzZUJvb2xlYW4ocmF3VmFsdWVzLnVjaSksXHJcbiAgICAgIGNlbnRyb19xdWlydXJnaWNvOiB0aGlzLnBhcnNlQm9vbGVhbihyYXdWYWx1ZXMuY2VudHJvX3F1aXJ1cmdpY28pLFxyXG4gICAgICBwYXJ0b3M6IHRoaXMucGFyc2VCb29sZWFuKHJhd1ZhbHVlcy5wYXJ0b3MpLFxyXG4gICAgICBjb25zdWx0YXNfZGlhcmlhc19wcm9tOiBOdW1iZXIocmF3VmFsdWVzLmNvbnN1bHRhc19kaWFyaWFzX3Byb20pLFxyXG4gICAgICBjYW1hc19vY3VwYWRhczogTnVtYmVyKHJhd1ZhbHVlcy5jYW1hc19vY3VwYWRhcyksXHJcbiAgICAgIGFndWE6IHRoaXMucGFyc2VCb29sZWFuKHJhd1ZhbHVlcy5hZ3VhKSxcclxuICAgICAgZGVzYWd1ZTogdGhpcy5wYXJzZUJvb2xlYW4ocmF3VmFsdWVzLmRlc2FndWUpLFxyXG4gICAgICBlbGVjdHJpY2lkYWQ6IHRoaXMucGFyc2VCb29sZWFuKHJhd1ZhbHVlcy5lbGVjdHJpY2lkYWQpLFxyXG4gICAgICBveGlnZW5vOiB0aGlzLnBhcnNlQm9vbGVhbihyYXdWYWx1ZXMub3hpZ2VubyksXHJcbiAgICAgIGludGVybmV0OiB0aGlzLnBhcnNlQm9vbGVhbihyYXdWYWx1ZXMuaW50ZXJuZXQpLFxyXG4gICAgICBmZWNoYV9jb3J0ZTogZmVjaGFDb3J0ZSxcclxuICAgICAgbm9tYnJlX3VzdWFyaW86IHRoaXMuYXV0aFNlcnZpY2Uub2J0ZW5lclVzdWFyaW8oKT8udXN1YXJpbyB8fCAnJyxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5tZW5zYWplR3VhcmRhZG8gPSAnJztcclxuXHJcbiAgICB0aGlzLnNhbHVkU2VydmljZS5ndWFyZGFyUmVwb3J0ZVNhbHVkKGR0bykuc3Vic2NyaWJlKHtcclxuICAgICAgbmV4dDogKHJlc3ApID0+IHtcclxuICAgICAgICB0aGlzLm1lbnNhamVHdWFyZGFkbyA9ICdSZXBvcnRlIHJlZ2lzdHJhZG8gY29ycmVjdGFtZW50ZS4nO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5tZW5zYWplR3VhcmRhZG8gPSAnJztcclxuICAgICAgICB9LCA1MDAwKTtcclxuICAgICAgICB0aGlzLmxpbXBpYXJGb3JtdWxhcmlvKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIGNvbnN0IG1zZyA9IGVycj8uZXJyb3I/Lm1lc3NhZ2UgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5tZW5zYWplR3VhcmRhZG8gPSBtc2cuaW5jbHVkZXMoJ1Byb3llY3RvIHlhIGV4aXN0ZW50ZScpXHJcbiAgICAgICAgICA/ICdQcm95ZWN0byB5YSBleGlzdGVudGUnXHJcbiAgICAgICAgICA6ICdFcnJvciBhbCByZWdpc3RyYXIgZWwgcmVwb3J0ZS4nO1xyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlQm9vbGVhbih2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdmFsdWUgPT09IHRydWUgfHxcclxuICAgICAgdmFsdWUgPT09ICd0cnVlJyB8fFxyXG4gICAgICB2YWx1ZSA9PT0gJ1NJJyB8fFxyXG4gICAgICB2YWx1ZSA9PT0gJ1NpJyB8fFxyXG4gICAgICB2YWx1ZSA9PT0gJ1lFUycgfHxcclxuICAgICAgdmFsdWUgPT09ICd5ZXMnXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZURhdGUodmFsdWU6IHVua25vd24pOiBEYXRlIHwgbnVsbCB7XHJcbiAgICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHJldHVybiBpc05hTih2YWx1ZS5nZXRUaW1lKCkpID8gbnVsbCA6IHZhbHVlO1xyXG4gICAgY29uc3QgcyA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xyXG4gICAgLy8gREQvTU0vWVlZWVxyXG4gICAgY29uc3QgZG15ID0gL14oWzAtM10/XFxkKVxcLyhbMC0xXT9cXGQpXFwvKFxcZHs0fSkkLztcclxuICAgIGNvbnN0IHltZCA9IC9eKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSkkLztcclxuICAgIGxldCBtO1xyXG4gICAgaWYgKChtID0gcy5tYXRjaChkbXkpKSkge1xyXG4gICAgICBjb25zdCBkYXkgPSBOdW1iZXIobVsxXSk7XHJcbiAgICAgIGNvbnN0IG1vbnRoID0gTnVtYmVyKG1bMl0pIC0gMTtcclxuICAgICAgY29uc3QgeWVhciA9IE51bWJlcihtWzNdKTtcclxuICAgICAgY29uc3QgZHQgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcclxuICAgICAgcmV0dXJuIGlzTmFOKGR0LmdldFRpbWUoKSkgPyBudWxsIDogZHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoKG0gPSBzLm1hdGNoKHltZCkpKSB7XHJcbiAgICAgIGNvbnN0IHllYXIgPSBOdW1iZXIobVsxXSk7XHJcbiAgICAgIGNvbnN0IG1vbnRoID0gTnVtYmVyKG1bMl0pIC0gMTtcclxuICAgICAgY29uc3QgZGF5ID0gTnVtYmVyKG1bM10pO1xyXG4gICAgICBjb25zdCBkdCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXkpO1xyXG4gICAgICByZXR1cm4gaXNOYU4oZHQuZ2V0VGltZSgpKSA/IG51bGwgOiBkdDtcclxuICAgIH1cclxuICAgIGNvbnN0IGR0ID0gbmV3IERhdGUocyk7XHJcbiAgICByZXR1cm4gaXNOYU4oZHQuZ2V0VGltZSgpKSA/IG51bGwgOiBkdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0VG9kYXlTdHJpbmcoKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgeXl5eSA9IGQuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IG1tID0gU3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBkZCA9IFN0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIHJldHVybiBgJHt5eXl5fS0ke21tfS0ke2RkfWA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxpbXBpYXJEYXRvc0VzdGFibGVjaW1pZW50bygpOiB2b2lkIHtcclxuICAgIHRoaXMuZm9ybS5wYXRjaFZhbHVlKHtcclxuICAgICAgbm9tYnJlX2Vlc3M6ICcnLFxyXG4gICAgICBjYXRlZ29yaWE6ICcnLFxyXG4gICAgICByZWRfc2FsdWQ6ICcnLFxyXG4gICAgICBtaWNyb3JlZDogJycsXHJcbiAgICAgIHByb3ZpbmNpYTogJycsXHJcbiAgICAgIGRpc3RyaXRvOiAnJyxcclxuICAgICAgdGlwbzogJycsXHJcbiAgICAgIGNvb3JkX2xhdDogMCxcclxuICAgICAgY29vcmRfbG9uZzogMCxcclxuICAgICAgcG9ibGFjaW9uX2FzaWduYWRhOiAwLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsaW1waWFyRm9ybXVsYXJpbygpOiB2b2lkIHtcclxuXHJcbiAgICB0aGlzLmZvcm0ucmVzZXQoe1xyXG5cclxuICAgICAgaWRfcmVuYWVzOiAnJyxcclxuXHJcbiAgICAgIG5vbWJyZV9lZXNzOiAnJyxcclxuXHJcbiAgICAgIGNhdGVnb3JpYTogJycsXHJcblxyXG4gICAgICByZWRfc2FsdWQ6ICcnLFxyXG5cclxuICAgICAgbWljcm9yZWQ6ICcnLFxyXG5cclxuICAgICAgcHJvdmluY2lhOiAnJyxcclxuXHJcbiAgICAgIGRpc3RyaXRvOiAnJyxcclxuXHJcbiAgICAgIHRpcG86ICcnLFxyXG5cclxuICAgICAgY29vcmRfbGF0OiAwLFxyXG5cclxuICAgICAgY29vcmRfbG9uZzogMCxcclxuXHJcbiAgICAgIHBvYmxhY2lvbl9hc2lnbmFkYTogMCxcclxuXHJcbiAgICAgIGlkX3Byb3llY3RvOiAwLFxyXG5cclxuICAgICAgZXN0YWRvX2ludmVyc2lvbjogJycsXHJcblxyXG4gICAgICBhdmFuY2VfZmlzaWNvOiAwLFxyXG5cclxuICAgICAgYXZhbmNlX2ZpbmFuY2llcm86IDAsXHJcblxyXG4gICAgICBtb250b190b3RhbDogMCxcclxuXHJcbiAgICAgIG1vbnRvX2RldmVuZ2FkbzogMCxcclxuXHJcbiAgICAgIHVuaWRhZF9lamVjdXRvcmE6ICcnLFxyXG5cclxuICAgICAgY2FtYXNfdWNpX3RvdDogMCxcclxuXHJcbiAgICAgIGNhbWFzX3VjaV9kaXNwOiAwLFxyXG5cclxuICAgICAgY2FtYXNfaG9zcGl0YWxhcmlhczogMCxcclxuXHJcbiAgICAgIGVxdWlwb19yYXlvc194OiAnJyxcclxuXHJcbiAgICAgIHBsYW50YV9veGlnZW5vOiAnJyxcclxuXHJcbiAgICAgIGVzdGFkb19pbmZyYTogMSxcclxuXHJcbiAgICAgIHZlbnRpbGFkb3JlczogMCxcclxuXHJcbiAgICAgIG1vbml0b3JlczogMCxcclxuXHJcbiAgICAgIGVjb2dyYWZvOiBmYWxzZSxcclxuXHJcbiAgICAgIHRvbW9ncmFmbzogZmFsc2UsXHJcblxyXG4gICAgICBvcGVyYXRpdm86IDAsXHJcblxyXG4gICAgICBpbm9wZXJhdGl2bzogMCxcclxuXHJcbiAgICAgIG1lZF9wcm9nOiAwLFxyXG5cclxuICAgICAgbWVkX2V4aXN0OiAwLFxyXG5cclxuICAgICAgdHVybm9fMjRoOiAnJyxcclxuXHJcbiAgICAgIGVuZmVybWVyYXM6IDAsXHJcblxyXG4gICAgICB0ZWNuaWNvczogMCxcclxuXHJcbiAgICAgIHBlZGlhdHJhOiAwLFxyXG5cclxuICAgICAgZ2luZWNvX29ic3RldHJhOiAwLFxyXG5cclxuICAgICAgYW5lc3Rlc2lvbG9nbzogMCxcclxuXHJcbiAgICAgIGNpcnVqYW5vX2dlbmVyYWw6IDAsXHJcblxyXG4gICAgICBpbnRlbnNpdmlzdGE6IDAsXHJcblxyXG4gICAgICBpbnRlcm5pc3RhOiAwLFxyXG5cclxuICAgICAgY2FyZGlvbG9nbzogMCxcclxuXHJcbiAgICAgIHRyYXVtYXRvbG9nbzogMCxcclxuXHJcbiAgICAgIG90cm9zX2VzcGVjaWFsaXN0YXM6IDAsXHJcblxyXG4gICAgICBhbmhvX2VwaTogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLFxyXG5cclxuICAgICAgc2VtYW5hX2VwaTogMSxcclxuXHJcbiAgICAgIGNhc29zX2Rlbmd1ZTogMCxcclxuXHJcbiAgICAgIGNhc29zX2FuZW1pYTogMCxcclxuXHJcbiAgICAgIG1vcnRfbWF0ZXJuYTogMCxcclxuXHJcbiAgICAgIGNhc29zX2Rlc251dHJpY2lvbjogMCxcclxuXHJcbiAgICAgIGlyYXNfZWRhczogMCxcclxuXHJcbiAgICAgIG1vcnRhbGlkYWRfbmVvbmF0YWw6IDAsXHJcblxyXG4gICAgICBlbWVyZ2VuY2lhOiBmYWxzZSxcclxuXHJcbiAgICAgIHVjaTogZmFsc2UsXHJcblxyXG4gICAgICBjZW50cm9fcXVpcnVyZ2ljbzogZmFsc2UsXHJcblxyXG4gICAgICBwYXJ0b3M6IGZhbHNlLFxyXG5cclxuICAgICAgY29uc3VsdGFzX2RpYXJpYXNfcHJvbTogMCxcclxuXHJcbiAgICAgIGNhbWFzX29jdXBhZGFzOiAwLFxyXG5cclxuICAgICAgYWd1YTogZmFsc2UsXHJcblxyXG4gICAgICBkZXNhZ3VlOiBmYWxzZSxcclxuXHJcbiAgICAgIGVsZWN0cmljaWRhZDogZmFsc2UsXHJcblxyXG4gICAgICBveGlnZW5vOiBmYWxzZSxcclxuXHJcbiAgICAgIGludGVybmV0OiBmYWxzZSxcclxuXHJcbiAgICAgIGZlY2hhX2NvcnRlOiAnJ1xyXG5cclxuICAgIH0pO1xyXG5cclxuICB9XHJcbn1cclxuIiwiPGRpdiBjbGFzcz1cInBhZ2UtdGl0bGVcIj5cclxuICAgIDxoMT5SZXBvcnRlIGRlIEluZGljYWRvcmVzIGRlIFNhbHVkPC9oMT5cclxuPC9kaXY+XHJcblxyXG48ZGl2IGNsYXNzPVwibWVzc2FnZVwiICpuZ0lmPVwibWVuc2FqZUd1YXJkYWRvXCI+XHJcbiAgICA8c3Bhbj57eyBtZW5zYWplR3VhcmRhZG8gfX08L3NwYW4+XHJcbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlLWJ0blwiIChjbGljayk9XCJjZXJyYXJNZW5zYWplKClcIj7inJU8L2J1dHRvbj5cclxuPC9kaXY+XHJcblxyXG48Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiAobmdTdWJtaXQpPVwiZ3VhcmRhclJlcG9ydGUoKVwiIGNsYXNzPVwibWFpbi1mb3JtLWNvbnRhaW5lclwiIGlkPVwiU2FsdWRcIj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1jb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkZXJcIj5cclxuICAgICAgICAgICAgPGgzPvCfk4sgSW5mb3JtYWNpw7NuIEdlbmVyYWw8L2gzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyaWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZnVsbC13aWR0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkX3JlbmFlc1wiPklEIFJFTkFFUzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiaWRfcmVuYWVzXCIgZm9ybUNvbnRyb2xOYW1lPVwiaWRfcmVuYWVzXCIgKGlucHV0KT1cImhhbmRsZUlkSW5wdXQoKVwiIChibHVyKT1cImJ1c2NhckVzdGFibGVjaW1pZW50bygpXCIgbWluPVwiMVwiIG1heD1cIjk5OTk5OTk5XCIgc3RlcD1cIjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkLW1lc3NhZ2Ugd2FybmluZ1wiICpuZ0lmPVwiaWRSZW5hZXNNZW5zYWplXCI+e3sgaWRSZW5hZXNNZW5zYWplIH19PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZnVsbC13aWR0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5vbWJyZV9lZXNzXCI+Tm9tYnJlIGRlbCBFc3RhYmxlY2ltaWVudG88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJub21icmVfZWVzc1wiIGZvcm1Db250cm9sTmFtZT1cIm5vbWJyZV9lZXNzXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInJlZFwiPlJlZCBkZSBTYWx1ZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicmVkX3NhbHVkXCIgZm9ybUNvbnRyb2xOYW1lPVwicmVkX3NhbHVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjY2lvbmUgUmVkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkNoaWNsYXlvXCI+Q2hpY2xheW88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTGFtYmF5ZXF1ZVwiPkxhbWJheWVxdWU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRmVycmXDsWFmZVwiPkZlcnJlw7FhZmU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibWljcm9yZWRcIj5NaWNyb3JlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cIm1pY3JvcmVkXCIgZm9ybUNvbnRyb2xOYW1lPVwibWljcm9yZWRcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY2F0ZWdvcmlhXCI+Q2F0ZWdvcsOtYTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiY2F0ZWdvcmlhXCIgZm9ybUNvbnRyb2xOYW1lPVwiY2F0ZWdvcmlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjY2lvbmUgQ2F0ZWdvcsOtYTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJJLTFcIj5JLTE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSS0yXCI+SS0yPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkktM1wiPkktMzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJJLTRcIj5JLTQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSUktMVwiPklJLTE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSUktMlwiPklJLTI8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvdmluY2lhXCI+UHJvdmluY2lhPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicHJvdmluY2lhXCIgZm9ybUNvbnRyb2xOYW1lPVwicHJvdmluY2lhXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImRpc3RyaXRvXCI+RGlzdHJpdG88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJkaXN0cml0b1wiIGZvcm1Db250cm9sTmFtZT1cImRpc3RyaXRvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIkVFU1NcIj5UaXBvIGRlIEVFU1M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ0aXBvXCIgZm9ybUNvbnRyb2xOYW1lPVwidGlwb1wiIHBsYWNlaG9sZGVyPVwiUHVlc3RvLCBDZW50cm8sIEhvc3BpdGFsXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBvYmxhY2lvbl9hc2lnbmFkYVwiPlBvYmxhY2nDs24gYXNpZ25hZGE8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cInBvYmxhY2lvbl9hc2lnbmFkYVwiIGZvcm1Db250cm9sTmFtZT1cInBvYmxhY2lvbl9hc2lnbmFkYVwiIG1pbj1cIjBcIiBzdGVwPVwiMVwiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb29yX2xhdGl0dWRcIj5MYXRpdHVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY29vcl9sYXRcIiBmb3JtQ29udHJvbE5hbWU9XCJjb29yZF9sYXRcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29vcl9sb25naXR1ZFwiPkxvbmdpdHVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY29vcl9sb25nXCIgZm9ybUNvbnRyb2xOYW1lPVwiY29vcmRfbG9uZ1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24taGVhZGVyXCI+XHJcbiAgICAgICAgICAgIDxoMz7wn4+X77iPIEdlc3Rpw7NuIGRlIEludmVyc2lvbmVzPC9oMz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncmlkXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGZ1bGwtd2lkdGhcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZF9wcm95ZWN0b1wiPkNVSSBQcm95ZWN0bzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlkX3Byb3llY3RvXCIgZm9ybUNvbnRyb2xOYW1lPVwiaWRfcHJveWVjdG9cIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZXN0YWRvX2ludmVyc2lvblwiPkVzdGFkbyBkZSBJbnZlcnNpw7NuPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJlc3RhZG9faW52ZXJzaW9uXCIgZm9ybUNvbnRyb2xOYW1lPVwiZXN0YWRvX2ludmVyc2lvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY2Npb25lIEVzdGFkbzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFbiBFamVjdWNpw7NuXCI+RW4gRWplY3VjacOzbjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJBcHJvYmFkb1wiPkFwcm9iYWRvPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlZpYWJsZVwiPlZpYWJsZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJQYXJhbGl6YWRvXCI+UGFyYWxpemFkbzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJGaXNpY29cIj5BdmFuY2UgRsOtc2ljbyAoJSk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImF2YW5jZV9maXNpY29cIiBmb3JtQ29udHJvbE5hbWU9XCJhdmFuY2VfZmlzaWNvXCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQtbWVzc2FnZVwiICpuZ0lmPVwiZm9ybS5nZXQoJ2F2YW5jZV9maXNpY28nKT8uaW52YWxpZCAmJiBmb3JtLmdldCgnYXZhbmNlX2Zpc2ljbycpPy50b3VjaGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgSW5ncmVzZSB1biBuw7ptZXJvIHbDoWxpZG8gZW50cmUgMCB5IDEwMC5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiTW9udG9cIj5Nb250byBUb3RhbCAoUy8pPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJtb250b190b3RhbFwiIGZvcm1Db250cm9sTmFtZT1cIm1vbnRvX3RvdGFsXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIkZpbmFuY2llcm9cIj5BdmFuY2UgRmluYW5jaWVybyAoJSk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImF2YW5jZV9maW5hbmNpZXJvXCIgZm9ybUNvbnRyb2xOYW1lPVwiYXZhbmNlX2ZpbmFuY2llcm9cIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZC1tZXNzYWdlXCIgKm5nSWY9XCJmb3JtLmdldCgnYXZhbmNlX2ZpbmFuY2llcm8nKT8uaW52YWxpZCAmJiBmb3JtLmdldCgnYXZhbmNlX2ZpbmFuY2llcm8nKT8udG91Y2hlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIEluZ3Jlc2UgdW4gbsO6bWVybyB2w6FsaWRvIGVudHJlIDAgeSAxMDAuXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIk1vbnRvRGV2XCI+TW9udG8gRGV2ZW5nYWRvIChTLyk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cIm1vbnRvX2RldmVuZ2Fkb1wiIGZvcm1Db250cm9sTmFtZT1cIm1vbnRvX2RldmVuZ2Fkb1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJFamVjdXRvcmFcIj5VbmlkYWQgRWplY3V0b3JhPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJ1bmlkYWRfZWplY3V0b3JhXCIgZm9ybUNvbnRyb2xOYW1lPVwidW5pZGFkX2VqZWN1dG9yYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY2Npb25lIFVuaWRhZCBFamVjdXRvcmE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiUkVHScOTTiBMQU1CQVlFUVVFIC0gU0VERSBDRU5UUkFMXCI+UkVHScOTTiBMQU1CQVlFUVVFIC0gU0VERSBDRU5UUkFMPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlBST1lFQ1RPIEVTUEVDSUFMIE9MTU9TIFRJTkFKT05FU1wiPlBST1lFQ1RPIEVTUEVDSUFMIE9MTU9TIFRJTkFKT05FUzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJHRVJFTkNJQSBSRUdJT05BTCBERSBTQUxVRCBMQU1CQVlFUVVFXCI+R0VSRU5DSUEgUkVHSU9OQUwgREUgU0FMVUQgTEFNQkFZRVFVRTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJIT1NQSVRBTCBSRUdJT05BTCBET0NFTlRFIExBUyBNRVJDRURFU1wiPkhPU1BJVEFMIFJFR0lPTkFMIERPQ0VOVEUgTEFTIE1FUkNFREVTPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkhPU1BJVEFMIEJFTMOJTiBERSBMQU1CQVlFUVVFXCI+SE9TUElUQUwgQkVMw4lOIERFIExBTUJBWUVRVUU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSE9TUElUQUwgUkVHSU9OQUwgREUgTEFNQkFZRVFVRVwiPkhPU1BJVEFMIFJFR0lPTkFMIERFIExBTUJBWUVRVUU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8aDM+8J+PpSBDYXBhY2lkYWQgSW5zdGFsYWRhIHkgRXF1aXBhbWllbnRvPC9oMz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncmlkXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiVG90YWxlc1wiPkNhbWFzIFVDSSBUb3RhbGVzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJjYW1hc191Y2lfdG90XCIgZm9ybUNvbnRyb2xOYW1lPVwiY2FtYXNfdWNpX3RvdFwiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJEaXNwb25pYmxlc1wiPkNhbWFzIFVDSSBEaXNwb25pYmxlczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiY2FtYXNfdWNpX2Rpc3BcIiBmb3JtQ29udHJvbE5hbWU9XCJjYW1hc191Y2lfZGlzcFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQtbWVzc2FnZVwiICpuZ0lmPVwiZm9ybS5nZXQoJ2NhbWFzX3VjaV9kaXNwJyk/Lmhhc0Vycm9yKCdtYXhFeGNlZWRlZCcpICYmIGZvcm0uZ2V0KCdjYW1hc191Y2lfZGlzcCcpPy50b3VjaGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgTGFzIGNhbWFzIFVDSSBkaXNwb25pYmxlcyBubyBwdWVkZW4gc2VyIG1heW9yZXMgYSBsYXMgY2FtYXMgdG90YWxlcy5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiSG9zcGl0YWxhcmlhc1wiPkNhbWFzIEhvc3BpdGFsYXJpYXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImNhbWFzX2hvc3BpdGFsYXJpYXNcIiBmb3JtQ29udHJvbE5hbWU9XCJjYW1hc19ob3NwaXRhbGFyaWFzXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIlJheW9zXCI+wr9UaWVuZSBSYXlvcyBYPzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiZXF1aXBvX3JheW9zX3hcIiBmb3JtQ29udHJvbE5hbWU9XCJlcXVpcG9fcmF5b3NfeFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY2Npb25lPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNJXCI+U8OtPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk5PXCI+Tm88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiUGxhbnRhT3hpZ2Vub1wiPsK/VGllbmUgUGxhbnRhIGRlIE94w61nZW5vPzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicGxhbnRhX294aWdlbm9cIiBmb3JtQ29udHJvbE5hbWU9XCJwbGFudGFfb3hpZ2Vub1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY2Npb25lPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNJXCI+U8OtPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk5PXCI+Tm88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiSW5mcmFlc3RydWN0dXJhXCI+RXN0YWRvIEluZnJhZXN0cnVjdHVyYSAoMS01KTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiZXN0YWRvX2luZnJhXCIgZm9ybUNvbnRyb2xOYW1lPVwiZXN0YWRvX2luZnJhXCIgbWluPVwiMVwiIG1heD1cIjVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMS4gTWFsbyAtIDUuIMOTcHRpbW9cIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8aDM+8J+RpSBQZXJzb25hbCB5IFJlY3Vyc29zIEh1bWFub3M8L2gzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyaWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJQcm9ncmFtYWRvc1wiPk3DqWRpY29zIFByb2dyYW1hZG9zPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJtZWRfcHJvZ1wiIGZvcm1Db250cm9sTmFtZT1cIm1lZF9wcm9nXCIvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiU2VydmljaW9cIj5Nw6lkaWNvcyBlbiBTZXJ2aWNpbyAoSG95KTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwibWVkX2V4aXN0XCIgZm9ybUNvbnRyb2xOYW1lPVwibWVkX2V4aXN0XCIgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZC1tZXNzYWdlXCIgKm5nSWY9XCJmb3JtLmdldCgnbWVkX2V4aXN0Jyk/Lmhhc0Vycm9yKCdtYXhFeGNlZWRlZCcpICYmIGZvcm0uZ2V0KCdtZWRfZXhpc3QnKT8udG91Y2hlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIExvcyBtw6lkaWNvcyBlbiBzZXJ2aWNpbyBubyBwdWVkZW4gc2VyIG1heW9yZXMgYSBsb3MgbcOpZGljb3MgcHJvZ3JhbWFkb3MuXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBmdWxsLXdpZHRoXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiSG9yYXNcIj7Cv0F0ZW5jacOzbiAyNCBIb3Jhcz88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInR1cm5vXzI0aFwiIGZvcm1Db250cm9sTmFtZT1cInR1cm5vXzI0aFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY2Npb25lPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNJXCI+U8OtPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk5PXCI+Tm88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8aDM+8J+aqCBWaWdpbGFuY2lhIEVwaWRlbWlvbMOzZ2ljYTwvaDM+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JpZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIlNlbWFuYVwiPlNlbWFuYSBFcGlkZW1pb2zDs2dpY2E8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cInNlbWFuYV9lcGlcIiBmb3JtQ29udHJvbE5hbWU9XCJzZW1hbmFfZXBpXCIgbWluPVwiMVwiIG1heD1cIjUzXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIkRlbmd1ZVwiPkNhc29zIERlbmd1ZSAoQ29uZmlybWFkb3MpPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJjYXNvc19kZW5ndWVcIiBmb3JtQ29udHJvbE5hbWU9XCJjYXNvc19kZW5ndWVcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiQW5lbWlhXCI+Q2Fzb3MgQW5lbWlhPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJjYXNvc19hbmVtaWFcIiBmb3JtQ29udHJvbE5hbWU9XCJjYXNvc19hbmVtaWFcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiTWF0ZXJuYVwiPk1vcnRhbGlkYWQgTWF0ZXJuYTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwibW9ydF9tYXRlcm5hXCIgZm9ybUNvbnRyb2xOYW1lPVwibW9ydF9tYXRlcm5hXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1jb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkZXJcIj5cclxuICAgICAgICAgICAgPGgzPvCfk4UgUmVnaXN0cm8gVGVtcG9yYWw8L2gzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyaWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZnVsbC13aWR0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZlY2hhQ29ydGVcIj5GZWNoYSBkZSBDb3J0ZSBkZSBJbmZvcm1hY2nDs248L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJmZWNoYV9jb3J0ZVwiIGZvcm1Db250cm9sTmFtZT1cImZlY2hhX2NvcnRlXCIgW2F0dHIubWluXT1cIm1pbkRhdGVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkLW1lc3NhZ2VcIiAqbmdJZj1cImZvcm0uZ2V0KCdmZWNoYV9jb3J0ZScpPy5oYXNFcnJvcignaW52YWxpZERhdGUnKSAmJiBmb3JtLmdldCgnZmVjaGFfY29ydGUnKT8udG91Y2hlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIExhIGZlY2hhIGRlIGNvcnRlIGRlYmUgc2VyIG1heW9yIGFsIGTDrWEgZGUgaG95LlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtZW5kIGdhcC0zIG10LTUgbWItNFwiPlxyXG5cclxuICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAoY2xpY2spPVwibGltcGlhckZvcm11bGFyaW8oKVwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW1waWFyXCI+XHJcblxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImJpIGJpLWFycm93LWNvdW50ZXJjbG9ja3dpc2VcIj48L2k+XHJcbiAgICAgICAgICAgIExpbXBpYXJcclxuXHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1ndWFyZGFyXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiYmkgYmktZmxvcHB5XCI+PC9pPlxyXG4gICAgICAgICAgICBHdWFyZGFyIFJlcG9ydGVcclxuXHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgPC9kaXY+XHJcblxyXG48L2Zvcm0+IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ3JlYXJTYWx1ZERUTyB9IGZyb20gJy4uL21vZGVscy9jcmVhci1zYWx1ZC5kdG8nO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2FsdWRTZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSBodHRwID0gaW5qZWN0KEh0dHBDbGllbnQpO1xyXG5cclxuICBwcml2YXRlIGFwaSA9ICdodHRwOi8vMTkyLjE2OC4yLjE5NDozMDAwL2FwaS9zYWx1ZCc7XHJcblxyXG4gIG9idGVuZXJFc3RhYmxlY2ltaWVudG8oaWQ6IG51bWJlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYXBpfS8ke2lkfWApO1xyXG4gIH1cclxuXHJcbiAgb2J0ZW5lclJlcG9ydGVDb21wbGV0byhpZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5hcGl9LyR7aWR9L2NvbXBsZXRvYCk7XHJcbiAgfVxyXG5cclxuICBndWFyZGFyUmVwb3J0ZVNhbHVkKGR0bzogQ3JlYXJTYWx1ZERUTyk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oXHJcbiAgICAgIHRoaXMuYXBpLFxyXG4gICAgICBkdG9cclxuICAgICk7XHJcblxyXG4gIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBDb21wb25lbnQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ0lmIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5pbXBvcnQgeyBFZHVjYWNpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZWR1Y2FjaW9uJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDcmVhckVkdWNhY2lvbkRUTyB9IGZyb20gJy4uLy4uL21vZGVscy9jcmVhci1lZHVjYWNpb24uZHRvJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWVkdWNhY2lvbicsXHJcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICBpbXBvcnRzOiBbUmVhY3RpdmVGb3Jtc01vZHVsZSwgTmdJZl0sXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2VkdWNhY2lvbi5odG1sJyxcclxuICBzdHlsZVVybDogJy4vZWR1Y2FjaW9uLmNzcycsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBFZHVjYWNpb24ge1xyXG4gIHByaXZhdGUgZmIgPSBpbmplY3QoRm9ybUJ1aWxkZXIpO1xyXG4gIHByaXZhdGUgZWR1Y2FjaW9uU2VydmljZSA9IGluamVjdChFZHVjYWNpb25TZXJ2aWNlKTtcclxuICBwcml2YXRlIGF1dGhTZXJ2aWNlID0gaW5qZWN0KEF1dGhTZXJ2aWNlKTtcclxuXHJcbiAgbWVuc2FqZUd1YXJkYWRvID0gJyc7XHJcbiAgY29kTW9kdWxhck1lbnNhamUgPSAnJztcclxuXHJcbiAgbWluRGF0ZSA9IHRoaXMuZ2V0VG9kYXlTdHJpbmcoKTtcclxuXHJcbiAgY2VycmFyTWVuc2FqZSgpOiB2b2lkIHtcclxuICAgIHRoaXMubWVuc2FqZUd1YXJkYWRvID0gJyc7XHJcbiAgfVxyXG5cclxuICBmb3JtID0gdGhpcy5mYi5ncm91cCh7XHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gRElWIDEgLSBJREVOVElGSUNBQ0nDk04gREUgTEEgSU5TVElUVUNJw5NOIEVEVUNBVElWQVxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBjb2RfbW9kdWxhcjogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKC9eXFxkezEsOH0kLyldXSxcclxuXHJcbiAgICBub21icmVfaWU6IFsnJ10sXHJcblxyXG4gICAgZHJlOiBbJ0xBTUJBWUVRVUUnXSxcclxuXHJcbiAgICB1Z2VsOiBbJ0NISUNMQVlPJ10sXHJcblxyXG4gICAgbml2ZWw6IFsnJ10sXHJcblxyXG4gICAgZ2VzdGlvbjogWydQw7pibGljYSBkZSBnZXN0acOzbiBkaXJlY3RhJ10sXHJcblxyXG4gICAgcHJvdmluY2lhOiBbJyddLFxyXG5cclxuICAgIGRpc3RyaXRvOiBbJyddLFxyXG5cclxuICAgIGNlbnRyb19wb2JsYWRvOiBbJyddLFxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBESVYgMiAtIFBST1lFQ1RPUyBERSBJTlZFUlNJw5NOIChJTlZJRVJURS5QRSlcclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaWRfcHJveWVjdG86IFswXSxcclxuXHJcbiAgICBlc3RhZG9fcHJveWVjdG86IFsnJ10sXHJcblxyXG4gICAgYXZhbmNlX2Zpc2ljbzogWzAsIFtWYWxpZGF0b3JzLm1pbigwKSwgVmFsaWRhdG9ycy5tYXgoMTAwKV1dLFxyXG5cclxuICAgIG1vbnRvX3RvdGFsOiBbMF0sXHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIERJViAzIC0gSU5GUkFFU1RSVUNUVVJBIFkgRVFVSVBBTUlFTlRPXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGVzdGFkb19pbmZyYTogWzBdLFxyXG5cclxuICAgIGF1bGFzX2J1ZW5hczogWzBdLFxyXG5cclxuICAgIG1vYmlsaWFyaW9fb3B0aW1vX3BvcmM6IFswLCBbVmFsaWRhdG9ycy5taW4oMCksIFZhbGlkYXRvcnMubWF4KDEwMCldXSxcclxuXHJcbiAgICBjb21wdXRhZG9yYXNfdG90YWw6IFswXSxcclxuXHJcbiAgICBzZXJ2aWNpb19hZ3VhOiBbZmFsc2VdLFxyXG5cclxuICAgIHNlcnZpY2lvX2Rlc2FndWU6IFtmYWxzZV0sXHJcblxyXG4gICAgc2VydmljaW9fbHV6OiBbZmFsc2VdLFxyXG5cclxuICAgIHRpZW5lX2ludGVybmV0OiBbZmFsc2VdLFxyXG5cclxuICAgIHJpZXNnb19jcml0aWNvOiBbZmFsc2VdLFxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBESVYgNCAtIFBFUlNPTkFMIERPQ0VOVEUgWSBBRE1JTklTVFJBVElWT1xyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB0b3RhbF9tYXRyaWN1bGE6IFswXSxcclxuXHJcbiAgICBkb2NlbnRlc19yZXF1ZXJpZG9zOiBbMF0sXHJcblxyXG4gICAgZG9jZW50ZXNfbm9tYnJhZG9zOiBbMF0sXHJcblxyXG4gICAgZG9jZW50ZXNfY29udHJhdGFkb3M6IFswXSxcclxuXHJcbiAgICBwZXJzb25hbF9hZG1pbjogWzBdLFxyXG5cclxuICAgIHRpZW5lX3BzaWNvbG9nbzogWycnXSxcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gRElWIDUgLSBNRVRBREFUT1NcclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgZmVjaGFfY29ydGU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXHJcbiAgfSk7XHJcblxyXG4gIGJ1c2Nhckluc3RpdHVjaW9uKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2RNb2R1bGFyTWVuc2FqZSA9ICcnO1xyXG4gICAgY29uc3QgaWQgPSBOdW1iZXIodGhpcy5mb3JtLmdldCgnY29kX21vZHVsYXInKT8udmFsdWUpO1xyXG5cclxuICAgIGlmICghaWQpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmVkdWNhY2lvblNlcnZpY2VcclxuICAgICAgLm9idGVuZXJSZXBvcnRlQ29tcGxldG8oaWQpXHJcbiAgICAgIC5zdWJzY3JpYmUoe1xyXG4gICAgICAgIG5leHQ6IChyZXNwKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXJlc3Auc3VjY2VzcyB8fCAhcmVzcC5kYXRhIHx8ICFyZXNwLmRhdGEuaW5zdGl0dWNpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5jb2RNb2R1bGFyTWVuc2FqZSA9ICdJbnN0aXR1Y2nDs24gbm8gZXhpc3RlLCBzZSByZWdpc3RyYXLDoSBudWV2YSBpbnN0aXR1Y2nDs24uJztcclxuICAgICAgICAgICAgdGhpcy5saW1waWFyRGF0b3NJbnN0aXR1Y2lvbigpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5mb3JtLmdldCgnY29kX21vZHVsYXInKTtcclxuICAgICAgICAgICAgY29uc3QgdmFsID0gY29udHJvbD8udmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sICYmIC9eXFxkezEsOH0kLy50ZXN0KFN0cmluZyh2YWwpKSkge1xyXG4gICAgICAgICAgICAgIGNvbnRyb2wuc2V0RXJyb3JzKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLmNvZE1vZHVsYXJNZW5zYWplID0gJyc7XHJcblxyXG4gICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgIGNvbnN0IGllID0gZGF0YS5pbnN0aXR1Y2lvbjtcclxuICAgICAgICAgIGNvbnN0IGVxID0gZGF0YS5lcXVpcGFtaWVudG87XHJcbiAgICAgICAgICBjb25zdCByaCA9IGRhdGEucmVjdXJzb3NfaHVtYW5vcztcclxuICAgICAgICAgIGNvbnN0IGNiID0gZGF0YS5jb25kaWNpb25lc19iYXNpY2FzO1xyXG4gICAgICAgICAgY29uc3QgcHIgPSBkYXRhLnByb3llY3RvO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHBhdGNoVmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XHJcblxyXG4gICAgICAgICAgLy8gSW5zdGl0dWNpw7NuIC0gc29sbyBpbmZvcm1hY2nDs24gZ2VuZXJhbCBzZSBhdXRvLWxsZW5hXHJcbiAgICAgICAgICBpZiAoaWUpIHtcclxuICAgICAgICAgICAgcGF0Y2hWYWx1ZXNbJ25vbWJyZV9pZSddID0gaWUubm9tYnJlX2llIHx8ICcnO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1snZHJlJ10gPSBpZS5kcmUgfHwgJ0xBTUJBWUVRVUUnO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1sndWdlbCddID0gaWUudWdlbCB8fCAnQ0hJQ0xBWU8nO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1snbml2ZWwnXSA9IGllLm5pdmVsIHx8ICcnO1xyXG4gICAgICAgICAgICBwYXRjaFZhbHVlc1snZ2VzdGlvbiddID0gaWUuZ2VzdGlvbiB8fCAnUMO6YmxpY2EgZGUgZ2VzdGnDs24gZGlyZWN0YSc7XHJcbiAgICAgICAgICAgIHBhdGNoVmFsdWVzWydwcm92aW5jaWEnXSA9IGllLnByb3ZpbmNpYSB8fCAnJztcclxuICAgICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2Rpc3RyaXRvJ10gPSBpZS5kaXN0cml0byB8fCAnJztcclxuICAgICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2NlbnRyb19wb2JsYWRvJ10gPSBpZS5jZW50cm9fcG9ibGFkbyB8fCAnJztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBMaW1waWFyIGNhbXBvcyBxdWUgZGViZW4gc2VyIHNpZW1wcmUgbnVldm9zXHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZXN0YWRvX2luZnJhJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2F1bGFzX2J1ZW5hcyddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydtb2JpbGlhcmlvX29wdGltb19wb3JjJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2NvbXB1dGFkb3Jhc190b3RhbCddID0gMDtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWyd0aWVuZV9pbnRlcm5ldCddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snc2VydmljaW9fYWd1YSddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snc2VydmljaW9fZGVzYWd1ZSddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snc2VydmljaW9fbHV6J10gPSBmYWxzZTtcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydyaWVzZ29fY3JpdGljbyddID0gZmFsc2U7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1sndG90YWxfbWF0cmljdWxhJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2RvY2VudGVzX3JlcXVlcmlkb3MnXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZG9jZW50ZXNfbm9tYnJhZG9zJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ2RvY2VudGVzX2NvbnRyYXRhZG9zJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ3BlcnNvbmFsX2FkbWluJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ3RpZW5lX3BzaWNvbG9nbyddID0gJyc7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snaWRfcHJveWVjdG8nXSA9IDA7XHJcbiAgICAgICAgICBwYXRjaFZhbHVlc1snZXN0YWRvX3Byb3llY3RvJ10gPSAnJztcclxuICAgICAgICAgIHBhdGNoVmFsdWVzWydhdmFuY2VfZmlzaWNvJ10gPSAwO1xyXG4gICAgICAgICAgcGF0Y2hWYWx1ZXNbJ21vbnRvX3RvdGFsJ10gPSAwO1xyXG5cclxuICAgICAgICAgIHRoaXMuZm9ybS5wYXRjaFZhbHVlKHBhdGNoVmFsdWVzKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgaWYgKGVycj8uc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2RNb2R1bGFyTWVuc2FqZSA9ICdJbnN0aXR1Y2nDs24gbm8gZXhpc3RlLCBzZSByZWdpc3RyYXLDoSBudWV2YSBpbnN0aXR1Y2nDs24uJztcclxuICAgICAgICAgICAgdGhpcy5saW1waWFyRGF0b3NJbnN0aXR1Y2lvbigpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sNDA0ID0gdGhpcy5mb3JtLmdldCgnY29kX21vZHVsYXInKTtcclxuICAgICAgICAgICAgY29uc3QgdjQwNCA9IGNvbnRyb2w0MDQ/LnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbDQwNCAmJiAvXlxcZHsxLDh9JC8udGVzdChTdHJpbmcodjQwNCkpKSB7XHJcbiAgICAgICAgICAgICAgY29udHJvbDQwNC5zZXRFcnJvcnMobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5jb2RNb2R1bGFyTWVuc2FqZSA9ICdFcnJvciBhbCBjb25zdWx0YXIgbGEgaW5zdGl0dWNpw7NuLic7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVJZElucHV0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2RNb2R1bGFyTWVuc2FqZSA9ICcnO1xyXG4gICAgY29uc3QgY29udHJvbCA9IHRoaXMuZm9ybS5nZXQoJ2NvZF9tb2R1bGFyJyk7XHJcbiAgICBjb25zdCB2YWwgPSBjb250cm9sPy52YWx1ZTtcclxuICAgIGlmIChjb250cm9sICYmIC9eXFxkezEsOH0kLy50ZXN0KFN0cmluZyh2YWwpKSkge1xyXG4gICAgICBjb250cm9sLnNldEVycm9ycyhudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdmFsaWRhckNhbXBvc09ibGlnYXRvcmlvcygpOiB7IHZhbGlkbzogYm9vbGVhbjsgY2FtcG9zRmFsdGFudGVzOiBzdHJpbmdbXSB9IHtcclxuICAgIGNvbnN0IGNhbXBvc0ZhbHRhbnRlczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAvLyBWYWxpZGFyIEluc3RpdHVjacOzbiAtIFRPRE9TIGRlYmVuIGVzdGFyIGxsZW5vc1xyXG4gICAgY29uc3QgY2FtcG9zSW5zdGl0dWNpb24gPSBbXHJcbiAgICAgICdjb2RfbW9kdWxhcicsXHJcbiAgICAgICdub21icmVfaWUnLFxyXG4gICAgICAnbml2ZWwnLFxyXG4gICAgICAncHJvdmluY2lhJyxcclxuICAgICAgJ2Rpc3RyaXRvJyxcclxuICAgIF07XHJcbiAgICBmb3IgKGNvbnN0IGNhbXBvIG9mIGNhbXBvc0luc3RpdHVjaW9uKSB7XHJcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmZvcm0uZ2V0KGNhbXBvKTtcclxuICAgICAgY29uc3QgdmFsdWUgPSBjb250cm9sPy52YWx1ZTtcclxuICAgICAgaWYgKCF2YWx1ZSB8fCAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgPT09ICcnKSkge1xyXG4gICAgICAgIGNhbXBvc0ZhbHRhbnRlcy5wdXNoKGNhbXBvKTtcclxuICAgICAgICBjb250cm9sPy5tYXJrQXNUb3VjaGVkKCk7XHJcbiAgICAgICAgY29udHJvbD8uc2V0RXJyb3JzKHsgcmVxdWlyZWQ6IHRydWUgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBWYWxpZGFyIFByb3llY3RvIC0gZXN0YWRvX3Byb3llY3RvIGRlYmUgdGVuZXIgc2VsZWNjacOzblxyXG4gICAgY29uc3QgZXN0UHJveWVjdG8gPSB0aGlzLmZvcm0uZ2V0KCdlc3RhZG9fcHJveWVjdG8nKTtcclxuICAgIGlmICghZXN0UHJveWVjdG8/LnZhbHVlIHx8IGVzdFByb3llY3RvLnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgY2FtcG9zRmFsdGFudGVzLnB1c2goJ2VzdGFkb19wcm95ZWN0bycpO1xyXG4gICAgICBlc3RQcm95ZWN0bz8ubWFya0FzVG91Y2hlZCgpO1xyXG4gICAgICBlc3RQcm95ZWN0bz8uc2V0RXJyb3JzKHsgcmVxdWlyZWQ6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVmFsaWRhciBmZWNoYV9jb3J0ZVxyXG4gICAgY29uc3QgZmVjaGFDb3J0ZSA9IHRoaXMuZm9ybS5nZXQoJ2ZlY2hhX2NvcnRlJyk7XHJcbiAgICBpZiAoIWZlY2hhQ29ydGU/LnZhbHVlIHx8IGZlY2hhQ29ydGUudmFsdWUudHJpbSgpID09PSAnJykge1xyXG4gICAgICBjYW1wb3NGYWx0YW50ZXMucHVzaCgnZmVjaGFfY29ydGUnKTtcclxuICAgICAgZmVjaGFDb3J0ZT8ubWFya0FzVG91Y2hlZCgpO1xyXG4gICAgICBmZWNoYUNvcnRlPy5zZXRFcnJvcnMoeyByZXF1aXJlZDogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZG86IGNhbXBvc0ZhbHRhbnRlcy5sZW5ndGggPT09IDAsXHJcbiAgICAgIGNhbXBvc0ZhbHRhbnRlcyxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBndWFyZGFyUmVwb3J0ZSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZhbGlkYWNpb24gPSB0aGlzLnZhbGlkYXJDYW1wb3NPYmxpZ2F0b3Jpb3MoKTtcclxuXHJcbiAgICBpZiAoIXZhbGlkYWNpb24udmFsaWRvKSB7XHJcbiAgICAgIHRoaXMubWVuc2FqZUd1YXJkYWRvID0gJ0ZhbHRhIGNvbXBsZXRhciBjYW1wb3MnO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmF3VmFsdWVzID0gdGhpcy5mb3JtLmdldFJhd1ZhbHVlKCk7XHJcblxyXG4gICAgY29uc3QgZmVjaGFDb3J0ZSA9IHRoaXMucGFyc2VEYXRlKHJhd1ZhbHVlcy5mZWNoYV9jb3J0ZSkgfHwgbmV3IERhdGUoKTtcclxuXHJcbiAgICBjb25zdCBkdG86IENyZWFyRWR1Y2FjaW9uRFRPID0ge1xyXG4gICAgICBjb2RfbW9kdWxhcjogTnVtYmVyKHJhd1ZhbHVlcy5jb2RfbW9kdWxhciksXHJcbiAgICAgIG5vbWJyZV9pZTogcmF3VmFsdWVzLm5vbWJyZV9pZSB8fCAnJyxcclxuICAgICAgZHJlOiByYXdWYWx1ZXMuZHJlIHx8ICdMQU1CQVlFUVVFJyxcclxuICAgICAgdWdlbDogcmF3VmFsdWVzLnVnZWwgfHwgJ0NISUNMQVlPJyxcclxuICAgICAgbml2ZWw6IHJhd1ZhbHVlcy5uaXZlbCB8fCAnJyxcclxuICAgICAgZ2VzdGlvbjogcmF3VmFsdWVzLmdlc3Rpb24gfHwgJ1DDumJsaWNhIGRlIGdlc3Rpw7NuIGRpcmVjdGEnLFxyXG4gICAgICBwcm92aW5jaWE6IHJhd1ZhbHVlcy5wcm92aW5jaWEgfHwgJycsXHJcbiAgICAgIGRpc3RyaXRvOiByYXdWYWx1ZXMuZGlzdHJpdG8gfHwgJycsXHJcbiAgICAgIGNlbnRyb19wb2JsYWRvOiByYXdWYWx1ZXMuY2VudHJvX3BvYmxhZG8gfHwgJycsXHJcbiAgICAgIGlkX3Byb3llY3RvOiBOdW1iZXIocmF3VmFsdWVzLmlkX3Byb3llY3RvKSxcclxuICAgICAgZXN0YWRvX3Byb3llY3RvOiByYXdWYWx1ZXMuZXN0YWRvX3Byb3llY3RvIHx8ICcnLFxyXG4gICAgICBhdmFuY2VfZmlzaWNvOiBOdW1iZXIocmF3VmFsdWVzLmF2YW5jZV9maXNpY28pLFxyXG4gICAgICBtb250b190b3RhbDogTnVtYmVyKHJhd1ZhbHVlcy5tb250b190b3RhbCksXHJcbiAgICAgIGVzdGFkb19pbmZyYTogTnVtYmVyKHJhd1ZhbHVlcy5lc3RhZG9faW5mcmEpLFxyXG4gICAgICBhdWxhc19idWVuYXM6IE51bWJlcihyYXdWYWx1ZXMuYXVsYXNfYnVlbmFzKSxcclxuICAgICAgbW9iaWxpYXJpb19vcHRpbW9fcG9yYzogTnVtYmVyKHJhd1ZhbHVlcy5tb2JpbGlhcmlvX29wdGltb19wb3JjKSxcclxuICAgICAgY29tcHV0YWRvcmFzX3RvdGFsOiBOdW1iZXIocmF3VmFsdWVzLmNvbXB1dGFkb3Jhc190b3RhbCksXHJcbiAgICAgIHNlcnZpY2lvX2FndWE6IHJhd1ZhbHVlcy5zZXJ2aWNpb19hZ3VhIHx8IGZhbHNlLFxyXG4gICAgICBzZXJ2aWNpb19kZXNhZ3VlOiByYXdWYWx1ZXMuc2VydmljaW9fZGVzYWd1ZSB8fCBmYWxzZSxcclxuICAgICAgc2VydmljaW9fbHV6OiByYXdWYWx1ZXMuc2VydmljaW9fbHV6IHx8IGZhbHNlLFxyXG4gICAgICB0aWVuZV9pbnRlcm5ldDogcmF3VmFsdWVzLnRpZW5lX2ludGVybmV0IHx8IGZhbHNlLFxyXG4gICAgICByaWVzZ29fY3JpdGljbzogcmF3VmFsdWVzLnJpZXNnb19jcml0aWNvIHx8IGZhbHNlLFxyXG4gICAgICB0b3RhbF9tYXRyaWN1bGE6IE51bWJlcihyYXdWYWx1ZXMudG90YWxfbWF0cmljdWxhKSxcclxuICAgICAgZG9jZW50ZXNfcmVxdWVyaWRvczogTnVtYmVyKHJhd1ZhbHVlcy5kb2NlbnRlc19yZXF1ZXJpZG9zKSxcclxuICAgICAgZG9jZW50ZXNfbm9tYnJhZG9zOiBOdW1iZXIocmF3VmFsdWVzLmRvY2VudGVzX25vbWJyYWRvcyksXHJcbiAgICAgIGRvY2VudGVzX2NvbnRyYXRhZG9zOiBOdW1iZXIocmF3VmFsdWVzLmRvY2VudGVzX2NvbnRyYXRhZG9zKSxcclxuICAgICAgcGVyc29uYWxfYWRtaW46IE51bWJlcihyYXdWYWx1ZXMucGVyc29uYWxfYWRtaW4pLFxyXG4gICAgICB0aWVuZV9wc2ljb2xvZ286IHJhd1ZhbHVlcy50aWVuZV9wc2ljb2xvZ28gPT09ICdTSScsXHJcbiAgICAgIGZlY2hhX2NvcnRlOiBmZWNoYUNvcnRlLFxyXG4gICAgICBub21icmVfdXN1YXJpbzogdGhpcy5hdXRoU2VydmljZS5vYnRlbmVyVXN1YXJpbygpPy51c3VhcmlvIHx8ICcnLFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm1lbnNhamVHdWFyZGFkbyA9ICcnO1xyXG5cclxuICAgIHRoaXMuZWR1Y2FjaW9uU2VydmljZS5ndWFyZGFyUmVwb3J0ZUVkdWNhY2lvbihkdG8pLnN1YnNjcmliZSh7XHJcbiAgICAgIG5leHQ6IChyZXNwKSA9PiB7XHJcbiAgICAgICAgdGhpcy5tZW5zYWplR3VhcmRhZG8gPSAnUmVwb3J0ZSByZWdpc3RyYWRvIGNvcnJlY3RhbWVudGUuJztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMubWVuc2FqZUd1YXJkYWRvID0gJyc7XHJcbiAgICAgICAgfSwgNTAwMCk7XHJcbiAgICAgICAgdGhpcy5saW1waWFyRm9ybXVsYXJpbygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICBjb25zdCBtc2cgPSBlcnI/LmVycm9yPy5tZXNzYWdlIHx8ICcnO1xyXG4gICAgICAgIHRoaXMubWVuc2FqZUd1YXJkYWRvID0gbXNnLmluY2x1ZGVzKCdQcm95ZWN0byB5YSBleGlzdGVudGUnKVxyXG4gICAgICAgICAgPyAnUHJveWVjdG8geWEgZXhpc3RlbnRlJ1xyXG4gICAgICAgICAgOiAnRXJyb3IgYWwgcmVnaXN0cmFyIGVsIHJlcG9ydGUuJztcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZUJvb2xlYW4odmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHZhbHVlID09PSB0cnVlIHx8XHJcbiAgICAgIHZhbHVlID09PSAndHJ1ZScgfHxcclxuICAgICAgdmFsdWUgPT09ICdTSScgfHxcclxuICAgICAgdmFsdWUgPT09ICdTaScgfHxcclxuICAgICAgdmFsdWUgPT09ICdZRVMnIHx8XHJcbiAgICAgIHZhbHVlID09PSAneWVzJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFyc2VEYXRlKHZhbHVlOiB1bmtub3duKTogRGF0ZSB8IG51bGwge1xyXG4gICAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gaXNOYU4odmFsdWUuZ2V0VGltZSgpKSA/IG51bGwgOiB2YWx1ZTtcclxuICAgIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcclxuICAgIGNvbnN0IGRteSA9IC9eKFswLTNdP1xcZClcXC8oWzAtMV0/XFxkKVxcLyhcXGR7NH0pJC87XHJcbiAgICBjb25zdCB5bWQgPSAvXihcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pJC87XHJcbiAgICBsZXQgbTtcclxuICAgIGlmICgobSA9IHMubWF0Y2goZG15KSkpIHtcclxuICAgICAgY29uc3QgZGF5ID0gTnVtYmVyKG1bMV0pO1xyXG4gICAgICBjb25zdCBtb250aCA9IE51bWJlcihtWzJdKSAtIDE7XHJcbiAgICAgIGNvbnN0IHllYXIgPSBOdW1iZXIobVszXSk7XHJcbiAgICAgIGNvbnN0IGR0ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIGRheSk7XHJcbiAgICAgIHJldHVybiBpc05hTihkdC5nZXRUaW1lKCkpID8gbnVsbCA6IGR0O1xyXG4gICAgfVxyXG4gICAgaWYgKChtID0gcy5tYXRjaCh5bWQpKSkge1xyXG4gICAgICBjb25zdCB5ZWFyID0gTnVtYmVyKG1bMV0pO1xyXG4gICAgICBjb25zdCBtb250aCA9IE51bWJlcihtWzJdKSAtIDE7XHJcbiAgICAgIGNvbnN0IGRheSA9IE51bWJlcihtWzNdKTtcclxuICAgICAgY29uc3QgZHQgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcclxuICAgICAgcmV0dXJuIGlzTmFOKGR0LmdldFRpbWUoKSkgPyBudWxsIDogZHQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkdCA9IG5ldyBEYXRlKHMpO1xyXG4gICAgcmV0dXJuIGlzTmFOKGR0LmdldFRpbWUoKSkgPyBudWxsIDogZHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFRvZGF5U3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IHl5eXkgPSBkLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBtbSA9IFN0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgZGQgPSBTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICByZXR1cm4gYCR7eXl5eX0tJHttbX0tJHtkZH1gO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsaW1waWFyRGF0b3NJbnN0aXR1Y2lvbigpOiB2b2lkIHtcclxuICAgIHRoaXMuZm9ybS5wYXRjaFZhbHVlKHtcclxuICAgICAgbm9tYnJlX2llOiAnJyxcclxuICAgICAgbml2ZWw6ICcnLFxyXG4gICAgICBwcm92aW5jaWE6ICcnLFxyXG4gICAgICBkaXN0cml0bzogJycsXHJcbiAgICAgIGNlbnRyb19wb2JsYWRvOiAnJyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbGltcGlhckZvcm11bGFyaW8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmZvcm0ucmVzZXQoe1xyXG4gICAgICBjb2RfbW9kdWxhcjogJycsXHJcbiAgICAgIG5vbWJyZV9pZTogJycsXHJcbiAgICAgIGRyZTogJ0xBTUJBWUVRVUUnLFxyXG4gICAgICB1Z2VsOiAnQ0hJQ0xBWU8nLFxyXG4gICAgICBuaXZlbDogJycsXHJcbiAgICAgIGdlc3Rpb246ICdQw7pibGljYSBkZSBnZXN0acOzbiBkaXJlY3RhJyxcclxuICAgICAgcHJvdmluY2lhOiAnJyxcclxuICAgICAgZGlzdHJpdG86ICcnLFxyXG4gICAgICBjZW50cm9fcG9ibGFkbzogJycsXHJcbiAgICAgIGlkX3Byb3llY3RvOiAwLFxyXG4gICAgICBlc3RhZG9fcHJveWVjdG86ICcnLFxyXG4gICAgICBhdmFuY2VfZmlzaWNvOiAwLFxyXG4gICAgICBtb250b190b3RhbDogMCxcclxuICAgICAgZXN0YWRvX2luZnJhOiAwLFxyXG4gICAgICBhdWxhc19idWVuYXM6IDAsXHJcbiAgICAgIG1vYmlsaWFyaW9fb3B0aW1vX3BvcmM6IDAsXHJcbiAgICAgIGNvbXB1dGFkb3Jhc190b3RhbDogMCxcclxuICAgICAgc2VydmljaW9fYWd1YTogZmFsc2UsXHJcbiAgICAgIHNlcnZpY2lvX2Rlc2FndWU6IGZhbHNlLFxyXG4gICAgICBzZXJ2aWNpb19sdXo6IGZhbHNlLFxyXG4gICAgICB0aWVuZV9pbnRlcm5ldDogZmFsc2UsXHJcbiAgICAgIHJpZXNnb19jcml0aWNvOiBmYWxzZSxcclxuICAgICAgdG90YWxfbWF0cmljdWxhOiAwLFxyXG4gICAgICBkb2NlbnRlc19yZXF1ZXJpZG9zOiAwLFxyXG4gICAgICBkb2NlbnRlc19ub21icmFkb3M6IDAsXHJcbiAgICAgIGRvY2VudGVzX2NvbnRyYXRhZG9zOiAwLFxyXG4gICAgICBwZXJzb25hbF9hZG1pbjogMCxcclxuICAgICAgdGllbmVfcHNpY29sb2dvOiAnJyxcclxuICAgICAgZmVjaGFfY29ydGU6ICcnLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59IiwiPGRpdiBjbGFzcz1cInBhZ2UtdGl0bGVcIj5cclxuICAgIDxoMT5SZXBvcnRlIGRlIEluZGljYWRvcmVzIGRlIEVkdWNhY2nDs248L2gxPlxyXG48L2Rpdj5cclxuXHJcbjxkaXYgY2xhc3M9XCJtZXNzYWdlXCIgKm5nSWY9XCJtZW5zYWplR3VhcmRhZG9cIj5cclxuICAgIDxzcGFuPnt7IG1lbnNhamVHdWFyZGFkbyB9fTwvc3Bhbj5cclxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2UtYnRuXCIgKGNsaWNrKT1cImNlcnJhck1lbnNhamUoKVwiPuKclTwvYnV0dG9uPlxyXG48L2Rpdj5cclxuXHJcbjxmb3JtIFtmb3JtR3JvdXBdPVwiZm9ybVwiIChuZ1N1Ym1pdCk9XCJndWFyZGFyUmVwb3J0ZSgpXCIgY2xhc3M9XCJtYWluLWZvcm0tY29udGFpbmVyXCIgaWQ9XCJFZHVjYWNpb25cIj5cclxuXHJcbiAgICA8IS0tID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLS0+XHJcbiAgICA8IS0tIElERU5USUZJQ0FDScOTTiBERSBMQSBJTlNUSVRVQ0nDk04gRURVQ0FUSVZBIC0tPlxyXG4gICAgPCEtLSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24taGVhZGVyXCI+XHJcbiAgICAgICAgICAgIDxoMz7wn5OLIElkZW50aWZpY2FjacOzbiBkZSBsYSBJbnN0aXR1Y2nDs24gRWR1Y2F0aXZhPC9oMz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncmlkXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGZ1bGwtd2lkdGhcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb2RfbW9kdWxhclwiPkPDs2RpZ28gTW9kdWxhcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiY29kX21vZHVsYXJcIiBmb3JtQ29udHJvbE5hbWU9XCJjb2RfbW9kdWxhclwiIChpbnB1dCk9XCJoYW5kbGVJZElucHV0KClcIiAoYmx1cik9XCJidXNjYXJJbnN0aXR1Y2lvbigpXCIgbWluPVwiMVwiIHN0ZXA9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZC1tZXNzYWdlIHdhcm5pbmdcIiAqbmdJZj1cImNvZE1vZHVsYXJNZW5zYWplXCI+e3sgY29kTW9kdWxhck1lbnNhamUgfX08L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBmdWxsLXdpZHRoXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibm9tYnJlX2llXCI+Tm9tYnJlIGRlIGxhIEkuRS48L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJub21icmVfaWVcIiBmb3JtQ29udHJvbE5hbWU9XCJub21icmVfaWVcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZHJlXCI+RFJFPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZHJlXCIgZm9ybUNvbnRyb2xOYW1lPVwiZHJlXCIgdmFsdWU9XCJMQU1CQVlFUVVFXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVnZWxcIj5VR0VMPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJ1Z2VsXCIgZm9ybUNvbnRyb2xOYW1lPVwidWdlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJDSElDTEFZT1wiPkNISUNMQVlPPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkxBTUJBWUVRVUVcIj5MQU1CQVlFUVVFPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkZFUlJFw5FBRkVcIj5GRVJSRcORQUZFPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5pdmVsXCI+Tml2ZWwgLyBNb2RhbGlkYWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cIm5pdmVsXCIgZm9ybUNvbnRyb2xOYW1lPVwibml2ZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWNjaW9uZSBOaXZlbDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJJbmljaWFsXCI+SW5pY2lhbDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJQcmltYXJpYVwiPlByaW1hcmlhPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNlY3VuZGFyaWFcIj5TZWN1bmRhcmlhPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkluaWNpYWwgLSBQcmltYXJpYVwiPkluaWNpYWwgLSBQcmltYXJpYTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJQcmltYXJpYSAtIFNlY3VuZGFyaWFcIj5QcmltYXJpYSAtIFNlY3VuZGFyaWE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSW5pY2lhbCAtIFByaW1hcmlhIC0gU2VjdW5kYXJpYVwiPkluaWNpYWwgLSBQcmltYXJpYSAtIFNlY3VuZGFyaWE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiU3VwZXJpb3IgTm8gVW5pdmVyc2l0YXJpb1wiPlN1cGVyaW9yIE5vIFVuaXZlcnNpdGFyaW88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiU3VwZXJpb3IgVW5pdmVyc2l0YXJpb1wiPlN1cGVyaW9yIFVuaXZlcnNpdGFyaW88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZ2VzdGlvblwiPlRpcG8gZGUgR2VzdGnDs248L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImdlc3Rpb25cIiBmb3JtQ29udHJvbE5hbWU9XCJnZXN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjY2lvbmUgR2VzdGnDs248L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiUMO6YmxpY2EgZGUgZ2VzdGnDs24gZGlyZWN0YVwiPlDDumJsaWNhIGRlIGdlc3Rpw7NuIGRpcmVjdGE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiUMO6YmxpY2EgZGUgZ2VzdGnDs24gcHJpdmFkYVwiPlDDumJsaWNhIGRlIGdlc3Rpw7NuIHByaXZhZGE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiUHJpdmFkYVwiPlByaXZhZGE8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvdmluY2lhXCI+UHJvdmluY2lhPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicHJvdmluY2lhXCIgZm9ybUNvbnRyb2xOYW1lPVwicHJvdmluY2lhXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImRpc3RyaXRvXCI+RGlzdHJpdG88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJkaXN0cml0b1wiIGZvcm1Db250cm9sTmFtZT1cImRpc3RyaXRvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNlbnRyb19wb2JsYWRvXCI+Q2VudHJvIFBvYmxhZG88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJjZW50cm9fcG9ibGFkb1wiIGZvcm1Db250cm9sTmFtZT1cImNlbnRyb19wb2JsYWRvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8IS0tID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLS0+XHJcbiAgICA8IS0tIFBST1lFQ1RPUyBERSBJTlZFUlNJw5NOIChJTlZJRVJURS5QRSkgLS0+XHJcbiAgICA8IS0tID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1jb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkZXJcIj5cclxuICAgICAgICAgICAgPGgzPvCfj5fvuI8gUHJveWVjdG9zIGRlIEludmVyc2nDs24gKElOVklFUlRFLlBFKTwvaDM+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JpZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBmdWxsLXdpZHRoXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWRfcHJveWVjdG9cIj5JRCBQcm95ZWN0bzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiaWRfcHJveWVjdG9cIiBmb3JtQ29udHJvbE5hbWU9XCJpZF9wcm95ZWN0b1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJlc3RhZG9fcHJveWVjdG9cIj5Fc3RhZG8gZGVsIFByb3llY3RvPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJlc3RhZG9fcHJveWVjdG9cIiBmb3JtQ29udHJvbE5hbWU9XCJlc3RhZG9fcHJveWVjdG9cIj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWNjaW9uZSBFc3RhZG88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRW4gRWplY3VjacOzblwiPkVuIEVqZWN1Y2nDs248L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQXByb2JhZG9cIj5BcHJvYmFkbzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJWaWFibGVcIj5WaWFibGU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiUGFyYWxpemFkb1wiPlBhcmFsaXphZG88L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQ29uY2x1aWRvXCI+Q29uY2x1aWRvPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImF2YW5jZV9maXNpY29cIj5BdmFuY2UgRsOtc2ljbyAoJSk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImF2YW5jZV9maXNpY29cIiBmb3JtQ29udHJvbE5hbWU9XCJhdmFuY2VfZmlzaWNvXCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQtbWVzc2FnZVwiICpuZ0lmPVwiZm9ybS5nZXQoJ2F2YW5jZV9maXNpY28nKT8uaW52YWxpZCAmJiBmb3JtLmdldCgnYXZhbmNlX2Zpc2ljbycpPy50b3VjaGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgSW5ncmVzZSB1biBuw7ptZXJvIHbDoWxpZG8gZW50cmUgMCB5IDEwMC5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibW9udG9fdG90YWxcIj5Nb250byBUb3RhbCBJbnZlcnNpw7NuPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJtb250b190b3RhbFwiIGZvcm1Db250cm9sTmFtZT1cIm1vbnRvX3RvdGFsXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8IS0tID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLS0+XHJcbiAgICA8IS0tIElORlJBRVNUUlVDVFVSQSBZIEVRVUlQQU1JRU5UTyAtLT5cclxuICAgIDwhLS0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8aDM+8J+PoiBJbmZyYWVzdHJ1Y3R1cmEgeSBFcXVpcGFtaWVudG88L2gzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyaWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJlc3RhZG9faW5mcmFcIj5Fc3RhZG8gSW5mcmFlc3RydWN0dXJhPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJlc3RhZG9faW5mcmFcIiBmb3JtQ29udHJvbE5hbWU9XCJlc3RhZG9faW5mcmFcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXVsYXNfYnVlbmFzXCI+QXVsYXMgZW4gQnVlbiBFc3RhZG88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImF1bGFzX2J1ZW5hc1wiIGZvcm1Db250cm9sTmFtZT1cImF1bGFzX2J1ZW5hc1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJtb2JpbGlhcmlvX29wdGltb19wb3JjXCI+TW9iaWxpYXJpbyDDk3B0aW1vICglKTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwibW9iaWxpYXJpb19vcHRpbW9fcG9yY1wiIGZvcm1Db250cm9sTmFtZT1cIm1vYmlsaWFyaW9fb3B0aW1vX3BvcmNcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgc3RlcD1cIjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkLW1lc3NhZ2VcIiAqbmdJZj1cImZvcm0uZ2V0KCdtb2JpbGlhcmlvX29wdGltb19wb3JjJyk/LmludmFsaWQgJiYgZm9ybS5nZXQoJ21vYmlsaWFyaW9fb3B0aW1vX3BvcmMnKT8udG91Y2hlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIEluZ3Jlc2UgdW4gbsO6bWVybyB2w6FsaWRvIGVudHJlIDAgeSAxMDAuXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNvbXB1dGFkb3Jhc190b3RhbFwiPlRvdGFsIENvbXB1dGFkb3JhczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiY29tcHV0YWRvcmFzX3RvdGFsXCIgZm9ybUNvbnRyb2xOYW1lPVwiY29tcHV0YWRvcmFzX3RvdGFsXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2JveC1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94LXNlY3Rpb24tdGl0bGVcIj5TZXJ2aWNpb3MgQsOhc2ljb3MgeSBSaWVzZ29zPC9sYWJlbD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoZWNrYm94LWdyaWRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2JveC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInNlcnZpY2lvX2FndWFcIiBmb3JtQ29udHJvbE5hbWU9XCJzZXJ2aWNpb19hZ3VhXCIgW3ZhbHVlXT1cIidTSSdcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZXJ2aWNpb19hZ3VhXCI+U2VydmljaW8gQWd1YTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tib3gtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJzZXJ2aWNpb19kZXNhZ3VlXCIgZm9ybUNvbnRyb2xOYW1lPVwic2VydmljaW9fZGVzYWd1ZVwiIFt2YWx1ZV09XCInU0knXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VydmljaW9fZGVzYWd1ZVwiPlNlcnZpY2lvIERlc2Fnw7xlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2JveC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInNlcnZpY2lvX2x1elwiIGZvcm1Db250cm9sTmFtZT1cInNlcnZpY2lvX2x1elwiIFt2YWx1ZV09XCInU0knXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VydmljaW9fbHV6XCI+U2VydmljaW8gTHV6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2JveC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInRpZW5lX2ludGVybmV0XCIgZm9ybUNvbnRyb2xOYW1lPVwidGllbmVfaW50ZXJuZXRcIiBbdmFsdWVdPVwiJ1NJJ1wiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInRpZW5lX2ludGVybmV0XCI+SW50ZXJuZXQgT3BlcmF0aXZvPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2JveC1ncm91cFwiIHN0eWxlPVwiYmFja2dyb3VuZDogI2ZmZjVmNTsgYm9yZGVyOiAxcHggZGFzaGVkICNlNzRjM2M7IHBhZGRpbmc6IDEwcHg7IGJvcmRlci1yYWRpdXM6IDRweDtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJyaWVzZ29fY3JpdGljb1wiIGZvcm1Db250cm9sTmFtZT1cInJpZXNnb19jcml0aWNvXCIgW3ZhbHVlXT1cIidTSSdcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyaWVzZ29fY3JpdGljb1wiIHN0eWxlPVwiY29sb3I6ICNlNzRjM2M7IGZvbnQtd2VpZ2h0OiBib2xkO1wiPlJpZXNnbyBkZSBEZXJydW1iZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8IS0tID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLS0+XHJcbiAgICA8IS0tIFBFUlNPTkFMIERPQ0VOVEUgWSBBRE1JTklTVFJBVElWTyAtLT5cclxuICAgIDwhLS0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8aDM+8J+RpSBQZXJzb25hbCBEb2NlbnRlIHkgQWRtaW5pc3RyYXRpdm88L2gzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyaWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0b3RhbF9tYXRyaWN1bGFcIj5BbHVtbm9zIE1hdHJpY3VsYWRvczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwidG90YWxfbWF0cmljdWxhXCIgZm9ybUNvbnRyb2xOYW1lPVwidG90YWxfbWF0cmljdWxhXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImRvY2VudGVzX3JlcXVlcmlkb3NcIj5Eb2NlbnRlcyBSZXF1ZXJpZG9zPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJkb2NlbnRlc19yZXF1ZXJpZG9zXCIgZm9ybUNvbnRyb2xOYW1lPVwiZG9jZW50ZXNfcmVxdWVyaWRvc1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkb2NlbnRlc19ub21icmFkb3NcIj5Eb2NlbnRlcyBOb21icmFkb3M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImRvY2VudGVzX25vbWJyYWRvc1wiIGZvcm1Db250cm9sTmFtZT1cImRvY2VudGVzX25vbWJyYWRvc1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkb2NlbnRlc19jb250cmF0YWRvc1wiPkRvY2VudGVzIENvbnRyYXRhZG9zPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJkb2NlbnRlc19jb250cmF0YWRvc1wiIGZvcm1Db250cm9sTmFtZT1cImRvY2VudGVzX2NvbnRyYXRhZG9zXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBlcnNvbmFsX2FkbWluXCI+UGVyc29uYWwgQWRtaW5pc3RyYXRpdm88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cInBlcnNvbmFsX2FkbWluXCIgZm9ybUNvbnRyb2xOYW1lPVwicGVyc29uYWxfYWRtaW5cIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidGllbmVfcHNpY29sb2dvXCI+UHNpY8OzbG9nbyBlbiBsYSBJLkUuPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJ0aWVuZV9wc2ljb2xvZ29cIiBmb3JtQ29udHJvbE5hbWU9XCJ0aWVuZV9wc2ljb2xvZ29cIj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWNjaW9uZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTSVwiPlPDrTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJOT1wiPk5vPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8IS0tID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLS0+XHJcbiAgICA8IS0tIE1FVEFEQVRPUyAtLT5cclxuICAgIDwhLS0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8aDM+8J+ThSBNZXRhZGF0b3M8L2gzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyaWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZnVsbC13aWR0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZlY2hhX2NvcnRlXCI+RmVjaGEgZGUgQ29ydGU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJmZWNoYV9jb3J0ZVwiIGZvcm1Db250cm9sTmFtZT1cImZlY2hhX2NvcnRlXCIgW2F0dHIubWluXT1cIm1pbkRhdGVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkLW1lc3NhZ2VcIiAqbmdJZj1cImZvcm0uZ2V0KCdmZWNoYV9jb3J0ZScpPy5oYXNFcnJvcignaW52YWxpZERhdGUnKSAmJiBmb3JtLmdldCgnZmVjaGFfY29ydGUnKT8udG91Y2hlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIExhIGZlY2hhIGRlIGNvcnRlIGRlYmUgc2VyIG1heW9yIGFsIGTDrWEgZGUgaG95LlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtZW5kIGdhcC0zIG10LTUgbWItNFwiPlxyXG5cclxuICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAoY2xpY2spPVwibGltcGlhckZvcm11bGFyaW8oKVwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW1waWFyXCI+XHJcblxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImJpIGJpLWFycm93LWNvdW50ZXJjbG9ja3dpc2VcIj48L2k+XHJcbiAgICAgICAgICAgIExpbXBpYXJcclxuXHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1ndWFyZGFyXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiYmkgYmktZmxvcHB5XCI+PC9pPlxyXG4gICAgICAgICAgICBHdWFyZGFyIFJlcG9ydGVcclxuXHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgPC9kaXY+XHJcblxyXG48L2Zvcm0+IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ3JlYXJFZHVjYWNpb25EVE8gfSBmcm9tICcuLi9tb2RlbHMvY3JlYXItZWR1Y2FjaW9uLmR0byc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBFZHVjYWNpb25TZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSBodHRwID0gaW5qZWN0KEh0dHBDbGllbnQpO1xyXG5cclxuICBwcml2YXRlIGFwaSA9ICdodHRwOi8vMTkyLjE2OC4yLjE5NDozMDAwL2FwaS9lZHVjYWNpb24nO1xyXG5cclxuICBvYnRlbmVySW5zdGl0dWNpb24oaWQ6IG51bWJlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYXBpfS8ke2lkfWApO1xyXG4gIH1cclxuXHJcbiAgb2J0ZW5lclJlcG9ydGVDb21wbGV0byhpZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5hcGl9LyR7aWR9L2NvbXBsZXRvYCk7XHJcbiAgfVxyXG5cclxuICBndWFyZGFyUmVwb3J0ZUVkdWNhY2lvbihkdG86IENyZWFyRWR1Y2FjaW9uRFRPKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihcclxuICAgICAgdGhpcy5hcGksXHJcbiAgICAgIGR0b1xyXG4gICAgKTtcclxuXHJcbiAgfVxyXG5cclxuICBvYnRlbmVySGlzdG9yaWFsKGZpbHRyb3M/OiB7XHJcbiAgICB0aXBvPzogc3RyaW5nO1xyXG4gICAgYnVzcXVlZGE/OiBzdHJpbmc7XHJcbiAgICBmZWNoYV9kZXNkZT86IHN0cmluZztcclxuICAgIGZlY2hhX2hhc3RhPzogc3RyaW5nO1xyXG4gICAgdXN1YXJpbz86IHN0cmluZztcclxuICB9KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuXHJcbiAgICBjb25zdCBwYXJhbXM6IGFueSA9IHt9O1xyXG5cclxuICAgIGlmIChmaWx0cm9zPy50aXBvKSBwYXJhbXMudGlwbyA9IGZpbHRyb3MudGlwbztcclxuICAgIGlmIChmaWx0cm9zPy5idXNxdWVkYSkgcGFyYW1zLmJ1c3F1ZWRhID0gZmlsdHJvcy5idXNxdWVkYTtcclxuICAgIGlmIChmaWx0cm9zPy5mZWNoYV9kZXNkZSkgcGFyYW1zLmZlY2hhX2Rlc2RlID0gZmlsdHJvcy5mZWNoYV9kZXNkZTtcclxuICAgIGlmIChmaWx0cm9zPy5mZWNoYV9oYXN0YSkgcGFyYW1zLmZlY2hhX2hhc3RhID0gZmlsdHJvcy5mZWNoYV9oYXN0YTtcclxuICAgIGlmIChmaWx0cm9zPy51c3VhcmlvKSBwYXJhbXMudXN1YXJpbyA9IGZpbHRyb3MudXN1YXJpbztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KCdodHRwOi8vMTkyLjE2OC4yLjE5NDozMDAwL2FwaS9oaXN0b3JpYWwnLCB7IHBhcmFtcyB9KTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIGluamVjdCwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IERhdGVQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IEhpc3RvcmlhbFNlcnZpY2UsIEhpc3RvcmlhbEl0ZW0sIEhpc3RvcmlhbEZpbHRyb3MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9oaXN0b3JpYWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtaGlzdG9yaWFsJyxcclxuICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBEYXRlUGlwZV0sXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2hpc3RvcmlhbC5odG1sJyxcclxuICBzdHlsZVVybDogJy4vaGlzdG9yaWFsLmNzcycsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIaXN0b3JpYWwge1xyXG4gIHByaXZhdGUgaGlzdG9yaWFsU2VydmljZSA9IGluamVjdChIaXN0b3JpYWxTZXJ2aWNlKTtcclxuICBwcml2YXRlIGNkciA9IGluamVjdChDaGFuZ2VEZXRlY3RvclJlZik7XHJcblxyXG4gIGhpc3RvcmlhbDogSGlzdG9yaWFsSXRlbVtdID0gW107XHJcbiAgbWVuc2FqZSA9ICcnO1xyXG5cclxuICBmaWx0cm9zOiBIaXN0b3JpYWxGaWx0cm9zID0ge1xyXG4gICAgdGlwbzogJycsXHJcbiAgICBidXNxdWVkYTogJycsXHJcbiAgICBmZWNoYV9kZXNkZTogJycsXHJcbiAgICBmZWNoYV9oYXN0YTogJycsXHJcbiAgICB1c3VhcmlvOiAnJyxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5idXNjYXIoKTtcclxuICB9XHJcblxyXG4gIGJ1c2NhcigpOiB2b2lkIHtcclxuICAgIHRoaXMubWVuc2FqZSA9ICdDYXJnYW5kby4uLic7XHJcbiAgICBjb25zb2xlLmxvZygnQnVzY2FuZG8gaGlzdG9yaWFsIGNvbiBmaWx0cm9zOicsIHRoaXMuZmlsdHJvcyk7XHJcblxyXG4gICAgdGhpcy5oaXN0b3JpYWxTZXJ2aWNlLmxpc3Rhcih0aGlzLmZpbHRyb3MpLnN1YnNjcmliZSh7XHJcbiAgICAgIG5leHQ6IChyZXNwKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1Jlc3B1ZXN0YSByZWNpYmlkYTonLCByZXNwKTtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVzcC5kYXRhOicsIHJlc3AuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3Auc3VjY2VzczonLCByZXNwLnN1Y2Nlc3MpO1xyXG4gICAgICAgIHRoaXMuaGlzdG9yaWFsID0gcmVzcC5kYXRhIHx8IFtdO1xyXG4gICAgICAgIHRoaXMubWVuc2FqZSA9IHJlc3Auc3VjY2VzcyA/ICcnIDogJ05vIGhheSBkYXRvcyc7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0hpc3RvcmlhbCBhY3R1YWxpemFkbzonLCB0aGlzLmhpc3RvcmlhbCk7XHJcbiAgICAgICAgLy8gRm9yemFyIGRldGVjY2nDs24gZGUgY2FtYmlvc1xyXG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbiBoaXN0b3JpYWw6JywgZXJyKTtcclxuICAgICAgICB0aGlzLm1lbnNhamUgPSAnRXJyb3IgYWwgY2FyZ2FyIGVsIGhpc3RvcmlhbC4nO1xyXG4gICAgICAgIHRoaXMuaGlzdG9yaWFsID0gW107XHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxpbXBpYXJGaWx0cm9zKCk6IHZvaWQge1xyXG4gICAgdGhpcy5maWx0cm9zID0ge1xyXG4gICAgICB0aXBvOiAnJyxcclxuICAgICAgYnVzcXVlZGE6ICcnLFxyXG4gICAgICBmZWNoYV9kZXNkZTogJycsXHJcbiAgICAgIGZlY2hhX2hhc3RhOiAnJyxcclxuICAgICAgdXN1YXJpbzogJycsXHJcbiAgICB9O1xyXG4gICAgdGhpcy5idXNjYXIoKTtcclxuICB9XHJcbn0iLCI8ZGl2IGNsYXNzPVwicGFnZS10aXRsZVwiPlxuICAgIDxoMT7wn5OcIEhpc3RvcmlhbCBkZSBNb2RpZmljYWNpb25lczwvaDE+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cImZpbHRyb3MtY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImZpbHRyb3MtZ3JpZFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRyb1RpcG9cIj5UaXBvPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJmaWx0cm9UaXBvXCIgWyhuZ01vZGVsKV09XCJmaWx0cm9zLnRpcG9cIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+VG9kb3M8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2FsdWRcIj5TYWx1ZDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJlZHVjYWNpb25cIj5FZHVjYWNpw7NuPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaWx0cm9CdXNxdWVkYVwiPkJ1c2NhciBwb3Igbm9tYnJlPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZmlsdHJvQnVzcXVlZGFcIiBbKG5nTW9kZWwpXT1cImZpbHRyb3MuYnVzcXVlZGFcIiBwbGFjZWhvbGRlcj1cIk5vbWJyZSBkZWwgZXN0YWJsZWNpbWllbnRvIG8gSUVcIiAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRyb0ZlY2hhRGVzZGVcIj5GZWNoYSBkZXNkZTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cImZpbHRyb0ZlY2hhRGVzZGVcIiBbKG5nTW9kZWwpXT1cImZpbHRyb3MuZmVjaGFfZGVzZGVcIiAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRyb0ZlY2hhSGFzdGFcIj5GZWNoYSBoYXN0YTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cImZpbHRyb0ZlY2hhSGFzdGFcIiBbKG5nTW9kZWwpXT1cImZpbHRyb3MuZmVjaGFfaGFzdGFcIiAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRyb1VzdWFyaW9cIj5Vc3VhcmlvPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZmlsdHJvVXN1YXJpb1wiIFsobmdNb2RlbCldPVwiZmlsdHJvcy51c3VhcmlvXCIgcGxhY2Vob2xkZXI9XCJOb21icmUgZGUgdXN1YXJpb1wiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGZpbHRyb3MtYWN0aW9uc1wiPlxuICAgICAgICAgICAgPGxhYmVsPiZuYnNwOzwvbGFiZWw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWJ1c2NhclwiIChjbGljayk9XCJidXNjYXIoKVwiPlxuICAgICAgICAgICAgICAgICAgICDwn5SNIEJ1c2NhclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW1waWFyLWZpbHRyb3NcIiAoY2xpY2spPVwibGltcGlhckZpbHRyb3MoKVwiPlxuICAgICAgICAgICAgICAgICAgICDinJUgTGltcGlhclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJtZXNzYWdlXCIgKm5nSWY9XCJtZW5zYWplXCI+XG4gICAgPHNwYW4+e3sgbWVuc2FqZSB9fTwvc3Bhbj5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwidGFibGUtY29udGFpbmVyXCI+XG4gICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aD4jPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+Tm9tYnJlPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+VGlwbzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkZlY2hhIGRlIE1vZGlmaWNhY2nDs248L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5Vc3VhcmlvPC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIEBmb3IgKGl0ZW0gb2YgaGlzdG9yaWFsOyB0cmFjayBpdGVtLmlkX2hpc3RvcmlhbCkge1xuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRkPnt7IGl0ZW0uaWRfaGlzdG9yaWFsIH19PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPnt7IGl0ZW0ubm9tYnJlIH19PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZVwiIFtjbGFzcy5iYWRnZS1zYWx1ZF09XCJpdGVtLnRpcG8gPT09ICdTYWx1ZCdcIiBbY2xhc3MuYmFkZ2UtZWR1Y2FjaW9uXT1cIml0ZW0udGlwbyA9PT0gJ0VkdWNhY2nDs24nXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgaXRlbS50aXBvIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ZD57eyBpdGVtLmZlY2hhX21vZGlmaWNhY2lvbiB8IGRhdGU6J2RkL01NL3l5eXkgSEg6bW0nIH19PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPnt7IGl0ZW0udXN1YXJpbyB9fTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIH0gQGVtcHR5IHtcbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiNVwiIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5ObyBzZSBlbmNvbnRyYXJvbiByZWdpc3Ryb3MuPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgfVxuICAgICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG48L2Rpdj4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGlzdG9yaWFsSXRlbSB7XG4gIGlkX2hpc3RvcmlhbDogbnVtYmVyO1xuICBub21icmU6IHN0cmluZztcbiAgdGlwbzogJ1NhbHVkJyB8ICdFZHVjYWNpw7NuJztcbiAgZmVjaGFfbW9kaWZpY2FjaW9uOiBzdHJpbmc7XG4gIHVzdWFyaW86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIaXN0b3JpYWxGaWx0cm9zIHtcbiAgdGlwbz86IHN0cmluZztcbiAgYnVzcXVlZGE/OiBzdHJpbmc7XG4gIGZlY2hhX2Rlc2RlPzogc3RyaW5nO1xuICBmZWNoYV9oYXN0YT86IHN0cmluZztcbiAgdXN1YXJpbz86IHN0cmluZztcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgSGlzdG9yaWFsU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBodHRwID0gaW5qZWN0KEh0dHBDbGllbnQpO1xuXG4gIHByaXZhdGUgYXBpID0gJ2h0dHA6Ly8xOTIuMTY4LjIuMTk0OjMwMDAvYXBpL2hpc3RvcmlhbCc7XG5cbiAgbGlzdGFyKGZpbHRyb3M/OiBIaXN0b3JpYWxGaWx0cm9zKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgcGFyYW1zOiBhbnkgPSB7fTtcbiAgICBpZiAoZmlsdHJvcykge1xuICAgICAgaWYgKGZpbHRyb3MudGlwbykgcGFyYW1zLnRpcG8gPSBmaWx0cm9zLnRpcG87XG4gICAgICBpZiAoZmlsdHJvcy5idXNxdWVkYSkgcGFyYW1zLmJ1c3F1ZWRhID0gZmlsdHJvcy5idXNxdWVkYTtcbiAgICAgIGlmIChmaWx0cm9zLmZlY2hhX2Rlc2RlKSBwYXJhbXMuZmVjaGFfZGVzZGUgPSBmaWx0cm9zLmZlY2hhX2Rlc2RlO1xuICAgICAgaWYgKGZpbHRyb3MuZmVjaGFfaGFzdGEpIHBhcmFtcy5mZWNoYV9oYXN0YSA9IGZpbHRyb3MuZmVjaGFfaGFzdGE7XG4gICAgICBpZiAoZmlsdHJvcy51c3VhcmlvKSBwYXJhbXMudXN1YXJpbyA9IGZpbHRyb3MudXN1YXJpbztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55Pih0aGlzLmFwaSwgeyBwYXJhbXMgfSk7XG4gIH1cblxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2FuQWN0aXZhdGUsIFJvdXRlciwgVXJsVHJlZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dGhHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSxcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcclxuICApIHt9XHJcblxyXG4gIGNhbkFjdGl2YXRlKCk6IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHtcclxuICAgIGlmICh0aGlzLmF1dGhTZXJ2aWNlLmVzdGFBdXRlbnRpY2FkbygpKSB7XHJcbiAgICAgIHJldHVybiBvZih0cnVlKTtcclxuICAgIH1cclxuICAgIC8vIFNpIG5vIGhheSB0b2tlbiwgcmVkaXJpZ2lyIGFsIGxvZ2luXHJcbiAgICByZXR1cm4gb2YodGhpcy5yb3V0ZXIuY3JlYXRlVXJsVHJlZShbJy9sb2dpbiddKSk7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbmltcG9ydCB7IExvZ2luIH0gZnJvbSAnLi9wYWdlcy9sb2dpbi9sb2dpbic7XHJcbmltcG9ydCB7IERhc2hib2FyZCB9IGZyb20gJy4vcGFnZXMvZGFzaGJvYXJkL2Rhc2hib2FyZCc7XHJcbmltcG9ydCB7IE1haW5MYXlvdXQgfSBmcm9tICcuL3NoYXJlZC9sYXlvdXQvbWFpbi1sYXlvdXQvbWFpbi1sYXlvdXQnO1xyXG5pbXBvcnQgeyBTYWx1ZCB9IGZyb20gJy4vcGFnZXMvc2FsdWQvc2FsdWQnO1xyXG5pbXBvcnQgeyBFZHVjYWNpb24gfSBmcm9tICcuL3BhZ2VzL2VkdWNhY2lvbi9lZHVjYWNpb24nO1xyXG5pbXBvcnQgeyBIaXN0b3JpYWwgfSBmcm9tICcuL3BhZ2VzL2hpc3RvcmlhbC9oaXN0b3JpYWwnO1xyXG5pbXBvcnQgeyBBdXRoR3VhcmQgfSBmcm9tICcuL2d1YXJkcy9hdXRoLmd1YXJkJztcclxuXHJcbmV4cG9ydCBjb25zdCByb3V0ZXM6IFJvdXRlcyA9IFtcclxuXHJcbiAgLy8gUMOhZ2luYSBpbmljaWFsXHJcbiAge1xyXG4gICAgcGF0aDogJycsXHJcbiAgICByZWRpcmVjdFRvOiAnbG9naW4nLFxyXG4gICAgcGF0aE1hdGNoOiAnZnVsbCdcclxuICB9LFxyXG5cclxuICAvLyBMb2dpblxyXG4gIHtcclxuICAgIHBhdGg6ICdsb2dpbicsXHJcbiAgICBjb21wb25lbnQ6IExvZ2luXHJcbiAgfSxcclxuXHJcbiAgLy8gTGF5b3V0IHByaW5jaXBhbFxyXG4gIHtcclxuICAgIHBhdGg6ICcnLFxyXG4gICAgY29tcG9uZW50OiBNYWluTGF5b3V0LFxyXG4gICAgY2FuQWN0aXZhdGU6IFtBdXRoR3VhcmRdLFxyXG4gICAgY2hpbGRyZW46IFtcclxuXHJcbiAgICAgIHtcclxuICAgICAgICBwYXRoOiAnZGFzaGJvYXJkJyxcclxuICAgICAgICBjb21wb25lbnQ6IERhc2hib2FyZFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgIHBhdGg6ICdzYWx1ZCcsXHJcbiAgICAgICAgIGNvbXBvbmVudDogU2FsdWRcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgICBwYXRoOiAnZWR1Y2FjaW9uJyxcclxuICAgICAgICAgY29tcG9uZW50OiBFZHVjYWNpb25cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgICBwYXRoOiAnaGlzdG9yaWFsJyxcclxuICAgICAgICAgY29tcG9uZW50OiBIaXN0b3JpYWxcclxuICAgICAgfSxcclxuXHJcbiAgICBdXHJcbiAgfSxcclxuXHJcbiAgLy8gQ3VhbHF1aWVyIHJ1dGEgaW5leGlzdGVudGVcclxuICB7XHJcbiAgICBwYXRoOiAnKionLFxyXG4gICAgcmVkaXJlY3RUbzogJ2xvZ2luJ1xyXG4gIH1cclxuXHJcbl07IiwiaW1wb3J0IHsgQ29tcG9uZW50LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxyXG4gIGltcG9ydHM6IFtSb3V0ZXJPdXRsZXRdLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAuaHRtbCcsXHJcbiAgc3R5bGVVcmw6ICcuL2FwcC5jc3MnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG4gIHByb3RlY3RlZCByZWFkb25seSB0aXRsZSA9IHNpZ25hbCgnZnJvbnRlbmQtZ29yZScpO1xyXG59XHJcbiIsIjxyb3V0ZXItb3V0bGV0IC8+Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsU0FBUyw0QkFBNEI7OztBQ0FyQyxTQUE0QiwwQ0FBMEM7QUFDdEUsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyx5QkFBeUI7OztBQ0ZsQyxTQUFTLGlCQUE0QztBQUVyRCxTQUFTLG1CQUFtQjs7OztBRUY1Qjs7OztTQUFTLGtCQUFrQjtBQUUzQixTQUFTLGlCQUE2QixJQUFJLGtCQUFrQjtBQUM1RCxTQUFTLEtBQUssWUFBWSxXQUFXOzs7QUFtQi9CLElBQU8sY0FBUCxNQUFPLGFBQVc7RUFLRjtFQUpaLFNBQVM7RUFDVCxpQkFBaUIsSUFBSSxn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LEdBQUEsQ0FBQSxNQUFBLFNBQUEsR0FBQSx1QkFBQSxHQUFBLFlBQUEsV0FBQSxHQUFBLENBQUEsR0FBQSxnQkFBQSxHQUFBLENBQUEsR0FBQSxnQkFBQSxHQUFBLENBQUEsR0FBQSxXQUFBLEdBQUEsQ0FBQSxHQUFBLGNBQUEsWUFBQSxHQUFBLENBQUEsT0FBQSxXQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsTUFBQSxhQUFBLG1CQUFBLGFBQUEsT0FBQSxLQUFBLE9BQUEsWUFBQSxRQUFBLEtBQUEsR0FBQSxTQUFBLE1BQUEsR0FBQSxDQUFBLFNBQUEseUJBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxPQUFBLGFBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLGVBQUEsbUJBQUEsYUFBQSxHQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxPQUFBLEtBQUEsR0FBQSxDQUFBLE1BQUEsYUFBQSxtQkFBQSxXQUFBLEdBQUEsQ0FBQSxTQUFBLEVBQUEsR0FBQSxDQUFBLFNBQUEsVUFBQSxHQUFBLENBQUEsU0FBQSxZQUFBLEdBQUEsQ0FBQSxTQUFBLGNBQUEsR0FBQSxDQUFBLE9BQUEsVUFBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsWUFBQSxtQkFBQSxVQUFBLEdBQUEsQ0FBQSxPQUFBLFdBQUEsR0FBQSxDQUFBLE1BQUEsYUFBQSxtQkFBQSxXQUFBLEdBQUEsQ0FBQSxTQUFBLEtBQUEsR0FBQSxDQUFBLFNBQUEsS0FBQSxHQUFBLENBQUEsU0FBQSxLQUFBLEdBQUEsQ0FBQSxTQUFBLEtBQUEsR0FBQSxDQUFBLFNBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxNQUFBLEdBQUEsQ0FBQSxPQUFBLFdBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLGFBQUEsbUJBQUEsV0FBQSxHQUFBLENBQUEsT0FBQSxVQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxZQUFBLG1CQUFBLFVBQUEsR0FBQSxDQUFBLE9BQUEsTUFBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsUUFBQSxtQkFBQSxRQUFBLGVBQUEsMEJBQUEsR0FBQSxDQUFBLE9BQUEsb0JBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLHNCQUFBLG1CQUFBLHNCQUFBLE9BQUEsS0FBQSxRQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsY0FBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsWUFBQSxtQkFBQSxXQUFBLEdBQUEsQ0FBQSxPQUFBLGVBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLGFBQUEsbUJBQUEsWUFBQSxHQUFBLENBQUEsT0FBQSxhQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxlQUFBLG1CQUFBLGFBQUEsR0FBQSxDQUFBLE9BQUEsa0JBQUEsR0FBQSxDQUFBLE1BQUEsb0JBQUEsbUJBQUEsa0JBQUEsR0FBQSxDQUFBLFNBQUEsaUJBQUEsR0FBQSxDQUFBLFNBQUEsVUFBQSxHQUFBLENBQUEsU0FBQSxRQUFBLEdBQUEsQ0FBQSxTQUFBLFlBQUEsR0FBQSxDQUFBLE9BQUEsUUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsaUJBQUEsbUJBQUEsaUJBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxHQUFBLENBQUEsU0FBQSxpQkFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsZUFBQSxtQkFBQSxhQUFBLEdBQUEsQ0FBQSxPQUFBLFlBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLHFCQUFBLG1CQUFBLHFCQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsR0FBQSxDQUFBLE9BQUEsVUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsbUJBQUEsbUJBQUEsaUJBQUEsR0FBQSxDQUFBLE9BQUEsV0FBQSxHQUFBLENBQUEsTUFBQSxvQkFBQSxtQkFBQSxrQkFBQSxHQUFBLENBQUEsU0FBQSxxQ0FBQSxHQUFBLENBQUEsU0FBQSxtQ0FBQSxHQUFBLENBQUEsU0FBQSx1Q0FBQSxHQUFBLENBQUEsU0FBQSx3Q0FBQSxHQUFBLENBQUEsU0FBQSxpQ0FBQSxHQUFBLENBQUEsU0FBQSxpQ0FBQSxHQUFBLENBQUEsT0FBQSxTQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsTUFBQSxpQkFBQSxtQkFBQSxlQUFBLEdBQUEsQ0FBQSxPQUFBLGFBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLGtCQUFBLG1CQUFBLGdCQUFBLEdBQUEsQ0FBQSxPQUFBLGVBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLHVCQUFBLG1CQUFBLHFCQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsa0JBQUEsbUJBQUEsZ0JBQUEsR0FBQSxDQUFBLFNBQUEsSUFBQSxHQUFBLENBQUEsU0FBQSxJQUFBLEdBQUEsQ0FBQSxPQUFBLGVBQUEsR0FBQSxDQUFBLE1BQUEsa0JBQUEsbUJBQUEsZ0JBQUEsR0FBQSxDQUFBLE9BQUEsaUJBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLGdCQUFBLG1CQUFBLGdCQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsZUFBQSx3QkFBQSxHQUFBLENBQUEsT0FBQSxhQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsTUFBQSxZQUFBLG1CQUFBLFVBQUEsR0FBQSxDQUFBLE9BQUEsVUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsYUFBQSxtQkFBQSxXQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsYUFBQSxtQkFBQSxXQUFBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLGNBQUEsbUJBQUEsY0FBQSxPQUFBLEtBQUEsT0FBQSxJQUFBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLGdCQUFBLG1CQUFBLGNBQUEsR0FBQSxDQUFBLE9BQUEsUUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsZ0JBQUEsbUJBQUEsY0FBQSxHQUFBLENBQUEsT0FBQSxTQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsTUFBQSxnQkFBQSxtQkFBQSxjQUFBLEdBQUEsQ0FBQSxPQUFBLFlBQUEs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QUEsU0FBQSx5QkFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLE9BQUEsV0FBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsYUFBQSxtQkFBQSxXQUFBLEdBQUEsQ0FBQSxHQUFBLFlBQUEsR0FBQSxDQUFBLE9BQUEsS0FBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsT0FBQSxtQkFBQSxPQUFBLFNBQUEsWUFBQSxHQUFBLENBQUEsT0FBQSxNQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsbUJBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxVQUFBLEdBQUEsQ0FBQSxTQUFBLFlBQUEsR0FBQSxDQUFBLFNBQUEsY0FBQSxHQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLFNBQUEsbUJBQUEsT0FBQSxHQUFBLENBQUEsU0FBQSxFQUFBLEdBQUEsQ0FBQSxTQUFBLFNBQUEsR0FBQSxDQUFBLFNBQUEsVUFBQSxHQUFBLENBQUEsU0FBQSxZQUFBLEdBQUEsQ0FBQSxTQUFBLG9CQUFBLEdBQUEsQ0FBQSxTQUFBLHVCQUFBLEdBQUEsQ0FBQSxTQUFBLGlDQUFBLEdBQUEsQ0FBQSxTQUFBLDJCQUFBLEdBQUEsQ0FBQSxTQUFBLHdCQUFBLEdBQUEsQ0FBQSxPQUFBLFNBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxtQkFBQSxTQUFBLEdBQUEsQ0FBQSxTQUFBLGtDQUFBLEdBQUEsQ0FBQSxTQUFBLGtDQUFBLEdBQUEsQ0FBQSxTQUFBLFNBQUEsR0FBQSxDQUFBLE9BQUEsV0FBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsYUFBQSxtQkFBQSxXQUFBLEdBQUEsQ0FBQSxPQUFBLFVBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLFlBQUEsbUJBQUEsVUFBQSxHQUFBLENBQUEsT0FBQSxnQkFBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsa0JBQUEsbUJBQUEsZ0JBQUEsR0FBQSxDQUFBLE9BQUEsYUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsZUFBQSxtQkFBQSxhQUFBLEdBQUEsQ0FBQSxPQUFBLGlCQUFBLEdBQUEsQ0FBQSxNQUFBLG1CQUFBLG1CQUFBLGlCQUFBLEdBQUEsQ0FBQSxTQUFBLGlCQUFBLEdBQUEsQ0FBQSxTQUFBLFVBQUEsR0FBQSxDQUFBLFNBQUEsUUFBQSxHQUFBLENBQUEsU0FBQSxZQUFBLEdBQUEsQ0FBQSxTQUFBLFdBQUEsR0FBQSxDQUFBLE9BQUEsZUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsaUJBQUEsbUJBQUEsaUJBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxHQUFBLENBQUEsU0FBQSxpQkFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLE9BQUEsYUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsZUFBQSxtQkFBQSxhQUFBLEdBQUEsQ0FBQSxPQUFBLGNBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLGdCQUFBLG1CQUFBLGNBQUEsR0FBQSxDQUFBLE9BQUEsY0FBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsZ0JBQUEsbUJBQUEsY0FBQSxHQUFBLENBQUEsT0FBQSx3QkFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsMEJBQUEsbUJBQUEsMEJBQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsb0JBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLHNCQUFBLG1CQUFBLG9CQUFBLEdBQUEsQ0FBQSxHQUFBLGtCQUFBLEdBQUEsQ0FBQSxHQUFBLHdCQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsZ0JBQUEsR0FBQSxDQUFBLFFBQUEsWUFBQSxNQUFBLGlCQUFBLG1CQUFBLGlCQUFBLEdBQUEsT0FBQSxHQUFBLENBQUEsT0FBQSxlQUFBLEdBQUEsQ0FBQSxRQUFBLFlBQUEsTUFBQSxvQkFBQSxtQkFBQSxvQkFBQSxHQUFBLE9BQUEsR0FBQSxDQUFBLE9BQUEsa0JBQUEsR0FBQSxDQUFBLFFBQUEsWUFBQSxNQUFBLGdCQUFBLG1CQUFBLGdCQUFBLEdBQUEsT0FBQSxHQUFBLENBQUEsT0FBQSxjQUFBLEdBQUEsQ0FBQSxRQUFBLFlBQUEsTUFBQSxrQkFBQSxtQkFBQSxrQkFBQSxHQUFBLE9BQUEsR0FBQSxDQUFBLE9BQUEsZ0JBQUEsR0FBQSxDQUFBLEdBQUEsa0JBQUEsR0FBQSxjQUFBLFdBQUEsVUFBQSxzQkFBQSxXQUFBLFFBQUEsaUJBQUEsS0FBQSxHQUFBLENBQUEsUUFBQSxZQUFBLE1BQUEsa0JBQUEsbUJBQUEsa0JBQUEsR0FBQSxPQUFBLEdBQUEsQ0FBQSxPQUFBLGtCQUFBLEdBQUEsU0FBQSxXQUFBLGVBQUEsTUFBQSxHQUFBLENBQUEsT0FBQSxpQkFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsbUJBQUEsbUJBQUEsaUJBQUEsR0FBQSxDQUFBLE9BQUEscUJBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLHVCQUFBLG1CQUFBLHFCQUFBLEdBQUEsQ0FBQSxPQUFBLG9CQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsTUFBQSxzQkFBQSxtQkFBQSxvQkFBQSxHQUFBLENBQUEsT0FBQSxzQkFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLE1BQUEsd0JBQUEsbUJBQUEsc0JBQUEsR0FBQSxDQUFBLE9BQUEsZ0JBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLGtCQUFBLG1CQUFBLGdCQUFBLEdBQUEsQ0FBQSxPQUFBLGlCQUFBLEdBQUEsQ0FBQSxNQUFBLG1CQUFBLG1CQUFBLGlCQUFBLEdBQUEsQ0FBQSxTQUFBLElBQUEsR0FBQSxDQUFBLFNBQUEsSUFBQSxHQUFBLENBQUEsT0FBQSxhQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxlQUFBLG1CQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsVUFBQSx1QkFBQSxTQUFBLFFBQUEsTUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsT0FBQSxlQUFBLEdBQUEsT0FBQSxHQUFBLENBQUEsR0FBQSxNQUFBLDJCQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsR0FBQSxPQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsTUFBQSxXQUFBLEdBQUEsQ0FBQSxHQUFB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ZUFBQSxZQUFBLE9BQUEsWUFBQSxJQUFBLEdBQUEsNEJBQUEsT0FBQSxFQUFBLE9BQUEsTUFBQSxZQUFBLEVBQUEsU0FBQSxDQUFBO0FBQUEsR0FBQTs7O0F6QkxoQixxQkFBcUIsS0FBSyxTQUFTLEVBQ2hDLE1BQU0sQ0FBQyxRQUFRLFFBQVEsTUFBTSxHQUFHLENBQUM7IiwibmFtZXMiOlsiaTAiLCJDb21wb25lbnQiLCJpbmplY3QiLCJJbmplY3RhYmxlIiwiSHR0cENsaWVudCIsImluamVjdCIsIkNvbXBvbmVudCIsImkwIiwiQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiaTAiLCJpMiIsIkNvbXBvbmVudCIsIkNvbXBvbmVudCIsImkwIiwiQ29tcG9uZW50IiwiaTAiLCJpMSIsIkNvbXBvbmVudCIsImluamVjdCIsIkluamVjdGFibGUiLCJpbmplY3QiLCJIdHRwQ2xpZW50IiwiaW5qZWN0IiwiZHQiLCJDb21wb25lbnQiLCJpMCIsImkxIiwiQ29tcG9uZW50IiwiaW5qZWN0IiwiTmdJZiIsIkZvcm1CdWlsZGVyIiwiUmVhY3RpdmVGb3Jtc01vZHVsZSIsIlZhbGlkYXRvcnMiLCJJbmplY3RhYmxlIiwiaW5qZWN0IiwiSHR0cENsaWVudCIsImluamVjdCIsIkZvcm1CdWlsZGVyIiwiVmFsaWRhdG9ycyIsImR0IiwiUmVhY3RpdmVGb3Jtc01vZHVsZSIsIk5nSWYiLCJDb21wb25lbnQiLCJpMCIsImkxIiwiQ29tcG9uZW50IiwiaW5qZWN0IiwiQ2hhbmdlRGV0ZWN0b3JSZWYiLCJGb3Jtc01vZHVsZSIsIkluamVjdGFibGUiLCJpbmplY3QiLCJIdHRwQ2xpZW50IiwiaW5qZWN0IiwiQ2hhbmdlRGV0ZWN0b3JSZWYiLCJGb3Jtc01vZHVsZSIsIkNvbXBvbmVudCIsImkwIiwiaTEiLCJpMiIsIkluamVjdGFibGUiLCJvZiIsIm9mIiwiSW5qZWN0YWJsZSIsIkNvbXBvbmVudCIsIlJvdXRlck91dGxldCIsImkwIl19