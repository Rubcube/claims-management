"use client"

import { MainLayout } from "@/app/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Textarea } from "@/app/components/ui/textarea"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Plus, ArrowLeft, Clock, User, FileText } from "lucide-react"
import Link from "next/link"

const activities = [
  {
    id: 1,
    tipo: "Análise Inicial",
    descricao: "claim registrado no sistema. Iniciando processo de análise.",
    responsavel: "João Silva",
    data: "10/12/2024 14:30",
    status: "Concluída",
  },
  {
    id: 2,
    tipo: "Vistoria Agendada",
    descricao: "Vistoria agendada para o dia 12/12/2024 às 10:00 com o perito Carlos Santos.",
    responsavel: "Ana Costa",
    data: "11/12/2024 09:15",
    status: "Concluída",
  },
  {
    id: 3,
    tipo: "Vistoria Realizada",
    descricao: "Vistoria realizada. Danos confirmados conforme relatado. Aguardando orçamentos.",
    responsavel: "Carlos Santos",
    data: "12/12/2024 11:30",
    status: "Concluída",
  },
  {
    id: 4,
    tipo: "Solicitação de Documentos",
    descricao: "Solicitados documentos adicionais: RG, CNH e comprovante de residência atualizados.",
    responsavel: "João Silva",
    data: "13/12/2024 16:45",
    status: "Pendente",
  },
]

export default function ActivitiesPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activities</h1>
              <p className="text-muted-foreground">Activity ID: {params.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de activities */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>Activities related to claim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((atividade) => (
                    <div key={atividade.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{atividade.tipo}</h4>
                          <Badge variant={atividade.status === "Concluída" ? "green_darker" : "secondary"}>
                            {atividade.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{atividade.descricao}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {atividade.responsavel}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {atividade.data}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário para nova atividade */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  New activity
                </CardTitle>
                <CardDescription>Add activity to claim</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analise">Análise</SelectItem>
                      <SelectItem value="vistoria">Vistoria</SelectItem>
                      <SelectItem value="documentos">Documentos</SelectItem>
                      <SelectItem value="contato">Contato Cliente</SelectItem>
                      <SelectItem value="aprovacao">Aprovação</SelectItem>
                      <SelectItem value="pagamento">Pagamento</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" placeholder="Descreva a atividade realizada..." className="min-h-24" />
                </div>

                <div>
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input id="responsavel" defaultValue="João Silva" />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="concluida">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Atividade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
