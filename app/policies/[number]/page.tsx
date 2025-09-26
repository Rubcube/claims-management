"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export default function ApoliceDetalhePage({ params }: { params: { numero: string } }) {
  // Dados mockados da apólice
  const policy = {
    numero: params.numero,
    cliente: {
      nome: "Maria Santos",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-9999",
      email: "maria.santos@email.com",
      endereco: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
    },
    produto: "Seguro Auto",
    vigenciaInicio: "15/01/2024",
    vigenciaFim: "15/01/2025",
    premio: "R$ 2.400,00",
    valorSegurado: "R$ 45.000,00",
    status: "Vigente",
    corretor: "João Silva",
    formaPagamento: "Mensal",
    dataEmissao: "10/01/2024",
    observacoes: "Apólice com cobertura completa incluindo terceiros, danos próprios e assistência 24h.",
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/policies">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Apólice {policy.numero}</h1>
              <p className="text-muted-foreground">Detalhes completos da apólice</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Apólice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Número</p>
                    <p className="text-lg font-semibold">{policy.numero}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Produto</p>
                    <p className="text-lg font-semibold">{policy.produto}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Início da Vigência</p>
                    <p className="text-lg font-semibold">{policy.vigenciaInicio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fim da Vigência</p>
                    <p className="text-lg font-semibold">{policy.vigenciaFim}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prêmio</p>
                    <p className="text-lg font-semibold">{policy.premio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Segurado</p>
                    <p className="text-lg font-semibold text-success">{policy.valorSegurado}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Corretor</p>
                    <p className="text-lg font-semibold">{policy.corretor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Forma de Pagamento</p>
                    <p className="text-lg font-semibold">{policy.formaPagamento}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Observações</p>
                  <p className="text-sm leading-relaxed">{policy.observacoes}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-lg font-semibold">{policy.cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p className="text-lg font-semibold">{policy.cliente.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{policy.cliente.telefone}</p>
                      <Button size="sm" variant="ghost">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{policy.cliente.email}</p>
                      <Button size="sm" variant="ghost">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Endereço</p>
                  <p className="text-sm">{policy.cliente.endereco}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com status e ações */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Status Atual</p>
                  <Badge variant="default" className="text-sm">
                    {policy.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Data de Emissão</p>
                  <p className="text-sm">{policy.dataEmissao}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Dias para Vencimento</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-warning" />
                    <p className="text-sm font-semibold text-warning">32 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Apólice Original
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Condições Gerais
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Proposta de Seguro
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Comprovante de Pagamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
