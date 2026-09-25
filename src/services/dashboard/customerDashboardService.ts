import api from '@/services/core/api';
import { extractData } from '@/utils/apiHelpers';
import type { CustomerDashboardParams, CustomerDashboardResponse } from '@/types/analytics/dashboard';

class CustomerDashboardService {
  async getCustomerDashboard(
    params: CustomerDashboardParams = {},
    signal?: AbortSignal,
  ): Promise<CustomerDashboardResponse> {
    const response = await api.get('/dashboard/customer', { params, signal });
    return extractData<CustomerDashboardResponse>(response);
  }
}

export const customerDashboardService = new CustomerDashboardService();
