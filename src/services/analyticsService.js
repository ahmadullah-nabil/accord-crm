// ─── Analytics Service ────────────────────────────────────────────────────────
//
// TO MIGRATE: set VITE_USE_REAL_BACKEND=true and implement each real branch.
// Analytics data comes from Supabase RPC functions (database-level aggregations)
// or computed views. The useAnalytics.js hooks and all chart components are unchanged.
//
// Supabase migration path per function:
//   • getKpiSummary      → supabase.rpc('get_kpi_summary', { range })
//   • getLeadFunnel      → supabase.rpc('get_lead_funnel',  { range })
//   • getTeamPerformance → supabase.rpc('get_team_perf',    { range })
//   (etc. — create the RPC functions in Supabase SQL editor)

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'
import {
  fetchKpiSummary,
  fetchRevenueTimeSeries,
  fetchLeadFunnel,
  fetchLeadsBySource,
  fetchLeadStats,
  fetchTaskStats,
  fetchMeetingStats,
  fetchTeamPerformance,
  fetchRecentActivity,
} from '../lib/analyticsData.js'

export async function getKpiSummary(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_kpi_summary', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchKpiSummary(range)
}

export async function getRevenueTimeSeries(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_revenue_series', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchRevenueTimeSeries(range)
}

export async function getLeadFunnel(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_lead_funnel', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchLeadFunnel(range)
}

export async function getLeadsBySource(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_leads_by_source', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchLeadsBySource(range)
}

export async function getLeadStats(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_lead_stats', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchLeadStats(range)
}

export async function getTaskStats(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_task_stats', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchTaskStats(range)
}

export async function getMeetingStats(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_meeting_stats', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchMeetingStats(range)
}

export async function getTeamPerformance(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_team_performance', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchTeamPerformance(range)
}

export async function getRecentActivity(range) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.rpc('get_recent_activity', { range_period: range })
    if (error) throw error
    return data
  }
  return fetchRecentActivity(range)
}
