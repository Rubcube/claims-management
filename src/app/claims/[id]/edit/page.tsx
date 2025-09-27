"use client"

import { MainLayout } from "@/app/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditarSinistroPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/claims/${params.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Editar claim</h1>
            <p className="text-muted-foreground">claim {params.id} - Maria Santos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações do claim</CardTitle>
                <CardDescription>Edite os dados do claim</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numero">Número do claim</Label>
                    <Input id="numero" value={params.id} disabled />
                  </div>
                  <div>
                    <Label htmlFor="policy">Apólice</Label>
                    <Select defaultValue="APL-2024-156">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APL-2024-156">APL-2024-156 - Maria Santos</SelectItem>
                        <SelectItem value="APL-2024-189">APL-2024-189 - João Oliveira</SelectItem>
                        <SelectItem value="APL-2024-203">APL-2024-203 - Ana Costa</SelectItem>
                        <SelectItem value="APL-2024-178">APL-2024-178 - Pedro Alves</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de claim</Label>
                    <Select defaultValue="colisao">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colisao">Colisão</SelectItem>
                        <SelectItem value="roubo">Roubo</SelectItem>
                        <SelectItem value="incendio">Incêndio</SelectItem>
                        <SelectItem value="danos-naturais">Danos Naturais</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dataOcorrencia">Data da Ocorrência</Label>
                    <Input id="dataOcorrencia" type="date" defaultValue="2024-12-10" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valorEstimado">Valor Estimado</Label>
                    <Input id="valorEstimado" defaultValue="15000" />
                  </div>
                  <div>
                    <Label htmlFor="valorAprovado">Valor Aprovado</Label>
                    <Input id="valorAprovado" defaultValue="12500" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Select defaultValue="joao-silva">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao-silva">João Silva</SelectItem>
                      <SelectItem value="ana-costa">Ana Costa</SelectItem>
                      <SelectItem value="carlos-lima">Carlos Lima</SelectItem>
                      <SelectItem value="maria-souza">Maria Souza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição do claim</Label>
                  <Textarea
                    id="descricao"
                    defaultValue="Colisão frontal em cruzamento. Veículo segurado colidiu com outro veículo ao avançar sinal vermelho. Danos na parte frontal do veículo, incluindo para-choque, faróis e capô."
                    className="min-h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="local">Local da Ocorrência</Label>
                  <Input id="local" defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações adicionais */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status e Prioridade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="em-analise">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em-analise">Em Análise</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select defaultValue="alta">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/claims/${params.id}`}>Cancelar</Link>
                </Button>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir claim
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
