export interface Analysis {
  comportamentos_observados: string[];
  gatilhos_de_consumo: string[];
  recomendações_práticas: string[];
  melhorias_sugeridas: string[];
}

export interface AnalysisInputPayload {
  month: string;
}
