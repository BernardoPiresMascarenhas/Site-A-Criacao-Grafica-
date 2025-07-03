import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, numero, mensagem } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nova Mensagem de Cliente",
      text: `Nome: ${nome}\nEmail: ${email}\nTelefone de contato: ${numero}\nMensagem: ${mensagem}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao enviar mensagem.", error }, { status: 500 });
  }
}