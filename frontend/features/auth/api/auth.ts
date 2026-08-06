import { LoginInput, RegisterInput } from "@/features/auth/schemas/auth.schema";
import { Usuario } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(data: LoginInput) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function register(data: RegisterInput) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function getPerfil(): Promise<Usuario | null> {
  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    credentials: "include"
  })
  if(!response.ok) return null
  return response.json();
}