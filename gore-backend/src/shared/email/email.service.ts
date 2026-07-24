import nodemailer from 'nodemailer';
import { env } from '../../config/env';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: true, // true para 465, false para 587
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async enviarCodigo2FA(correo: string, codigo: string, nombreUsuario: string): Promise<void> {
    console.log(`[EmailService] Intentando enviar código a ${correo}...`);
    console.log(`[EmailService] Config: host=${env.SMTP_HOST}, port=${env.SMTP_PORT}, user=${env.SMTP_USER}`);

    const mailOptions = {
      from: `"GORE - Sistema de Proyectos" <${env.SMTP_FROM}>`,
      to: correo,
      subject: 'Código de verificación - Inicio de sesión',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #571414;">Gobierno Regional de Lambayeque</h2>
            <p style="color: #666;">Sistema de Seguimiento de Proyectos</p>
          </div>

          <div style="background: #f8f9fb; border-radius: 12px; padding: 30px; text-align: center;">
            <h3 style="color: #333; margin-bottom: 10px;">Hola, ${nombreUsuario}</h3>
            <p style="color: #666; margin-bottom: 20px;">
              Has solicitado iniciar sesión en el sistema. 
              Utiliza el siguiente código para verificar tu identidad:
            </p>

            <div style="background: #fff; border-radius: 8px; padding: 15px 30px; display: inline-block; 
                        border: 2px solid #571414; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #571414; letter-spacing: 8px;">
                ${codigo}
              </span>
            </div>

            <p style="color: #999; font-size: 14px;">
              Este código expirará en <strong>5 minutos</strong>.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>Si no solicitaste este inicio de sesión, ignora este mensaje.</p>
            <p>© Gobierno Regional de Lambayeque</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Correo enviado exitosamente a ${correo}: ${info.messageId}`);
    } catch (error: any) {
      console.error(`[EmailService] Error detallado al enviar a ${correo}:`, {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      });
      throw error;
    }
  }
}

export default new EmailService();