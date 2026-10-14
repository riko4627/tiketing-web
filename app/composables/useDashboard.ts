export interface DashboardStats {
  summary: {
    total_tickets: number
    open_tickets: number
    in_progress_tickets: number
    resolved_tickets: number
    closed_tickets: number
    ai_predicted_count: number
    manual_fallback_count: number
  }
  by_category: Array<{
    id: string
    name: string
    code: string
    tickets_count: number
  }>
  by_priority: Record<string, number>
  by_status: Record<string, number>
  ai_metrics: {
    total_ai_predicted: number
    total_overridden_by_agents: number
    ai_acceptance_rate_percentage: number
    average_confidence_score: number
  }
}

export const useDashboard = () => {
  const { apiFetch } = useApi()

  const getStats = async () => {
    return await apiFetch<DashboardStats>('/dashboard/stats')
  }

  const getAuditFeedbacks = async (page = 1) => {
    return await apiFetch<{
      data: any[]
      current_page: number
      last_page: number
      total: number
      per_page: number
    }>(`/dashboard/audit-feedbacks?page=${page}`)
  }

  return {
    getStats,
    getAuditFeedbacks,
  }
}
