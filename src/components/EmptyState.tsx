import { Card } from "./ui/card"

export const EmptyState = () => {
  return (
    <Card className="animate-fadeIn border-dashed border-white/20 text-center">
      <p className="text-sm text-slate-200">Nenhum padrao suspeito detectado ainda.</p>
      <p className="mt-1 text-xs text-slate-400">
        Clique em Analisar pagina para rodar as heuristicas locais.
      </p>
    </Card>
  )
}
