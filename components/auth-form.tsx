"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client" // Importa do cliente

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      let authResponse

      if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      } else {
        authResponse = await supabase.auth.signUp({ email, password })
      }

      const { data, error } = authResponse

      if (error) {
        setMessage(error.message)
      } else if (data.user) {
        if (isLogin) {
          setMessage("Login bem-sucedido! Redirecionando...")
          router.refresh()
          const redirectTo = searchParams.get("redirectedFrom") || "/admin"
          router.push(redirectTo)
        } else {
          setMessage(
            "Cadastro realizado! Verifique seu email para confirmar a conta."
          )
        }
      }
    } catch (err: any) {
      setMessage("Ocorreu um erro inesperado: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.includes("sucesso") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
      </Button>

      <Button
        type="button"
        variant="link"
        className="w-full text-sm"
        onClick={() => setIsLogin(!isLogin)}
        disabled={loading}
      >
        {isLogin
          ? "Não tem uma conta? Cadastre-se"
          : "Já tem uma conta? Faça login"}
      </Button>
    </form>
  )
}
