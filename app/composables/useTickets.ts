export interface Category {
  id: string
  code: string
  name: string
  description?: string
  is_active: boolean
}

export interface TicketMessage {
  id: string
  ticket_id: string
  user_id: string
  message: string
  is_internal_note: boolean
  created_at: string
  user?: {
    id: string
    name: string
    role: string
  }
}

export interface TicketAuditFeedback {
  id: string
  ticket_id: string
  user_id: string
  subject_snapshot: string
  description_snapshot: string
  old_priority?: string
  new_priority?: string
  old_subcategory?: string
  new_subcategory?: string
  reason?: string
  created_at: string
  user?: {
    id: string
    name: string
    role: string
  }
  old_category?: { id: string; name: string }
  new_category?: { id: string; name: string }
}

export interface Ticket {
  id: string
  ticket_number: string
  user_id: string
  assigned_agent_id?: string | null
  category_id: string
  subcategory?: string | null
  subject: string
  description: string
  location?: string | null
  request_type: string
  priority: 'rendah' | 'sedang' | 'tinggi' | 'kritis'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  is_ai_predicted: boolean
  ai_confidence_score?: number | null
  resolution_notes?: string | null
  resolved_at?: string | null
  closed_at?: string | null
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
    phone?: string
    department?: string
  }
  assigned_agent?: {
    id: string
    name: string
    email: string
    phone?: string
  }
  category?: Category
  messages?: TicketMessage[]
  audit_feedbacks?: TicketAuditFeedback[]
}

export const useTickets = () => {
  const { apiFetch } = useApi()

  const getTickets = async (filters: Record<string, any> = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const query = params.toString() ? `?${params.toString()}` : ''
    return await apiFetch<{
      data: Ticket[]
      current_page: number
      last_page: number
      total: number
      per_page: number
    }>(`/tickets${query}`)
  }

  const getTicketDetail = async (id: string) => {
    const response = await apiFetch<{ data: Ticket }>(`/tickets/${id}`)
    return response.data
  }

  const createTicket = async (payload: {
    subject: string
    description: string
    location?: string
    request_type?: string
  }) => {
    return await apiFetch<{
      message: string
      data: Ticket
      ml_prediction: {
        is_ai_predicted: boolean
        confidence_score: number | null
        processing_time_ms: number | null
      }
    }>('/tickets', {
      method: 'POST',
      body: payload,
    })
  }

  const updateStatus = async (id: string, status: string, resolutionNotes?: string) => {
    return await apiFetch<{ message: string; data: Ticket }>(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: {
        status,
        resolution_notes: resolutionNotes,
      },
    })
  }

  const overrideTicket = async (
    id: string,
    payload: {
      category_id: string
      subcategory?: string
      priority: string
      reason?: string
    }
  ) => {
    return await apiFetch<{ message: string; data: Ticket }>(`/tickets/${id}/override`, {
      method: 'PATCH',
      body: payload,
    })
  }

  const addMessage = async (ticketId: string, message: string, isInternalNote = false) => {
    return await apiFetch<{ message: string; data: TicketMessage }>(`/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: {
        message,
        is_internal_note: isInternalNote,
      },
    })
  }

  const getCategories = async () => {
    const response = await apiFetch<{ data: Category[] }>('/categories')
    return response.data
  }

  // Helpers
  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return {
          label: 'Menunggu (Open)',
          class: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
          dot: 'bg-amber-500',
        }
      case 'in_progress':
        return {
          label: 'Sedang Ditangani',
          class: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/60',
          dot: 'bg-indigo-500 animate-pulse',
        }
      case 'resolved':
        return {
          label: 'Selesai (Resolved)',
          class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
          dot: 'bg-emerald-500',
        }
      case 'closed':
        return {
          label: 'Ditutup (Closed)',
          class: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
          dot: 'bg-zinc-400',
        }
      default:
        return {
          label: status,
          class: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          dot: 'bg-zinc-400',
        }
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'kritis':
        return {
          label: 'Kritis',
          class: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
          icon: '🔥',
        }
      case 'tinggi':
        return {
          label: 'Tinggi',
          class: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
          icon: '⚡',
        }
      case 'sedang':
        return {
          label: 'Sedang',
          class: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
          icon: '🔹',
        }
      case 'rendah':
        return {
          label: 'Rendah',
          class: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
          icon: '🟢',
        }
      default:
        return {
          label: priority,
          class: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          icon: '•',
        }
    }
  }

  return {
    getTickets,
    getTicketDetail,
    createTicket,
    updateStatus,
    overrideTicket,
    addMessage,
    getCategories,
    formatDateTime,
    getStatusBadge,
    getPriorityBadge,
  }
}
