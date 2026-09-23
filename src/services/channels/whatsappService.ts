import api from '@/services/core/api';
import { extractData } from '@/utils/apiHelpers';
import type { WhatsappConfig, WhatsappChannel } from '@/types/channels/inbox';

class WhatsappService {
  async validateCredentials(config: WhatsappConfig): Promise<{ valid: boolean; message?: string }> {
    const response = await api.post(`/channels/whatsapp/validate`, config);
    return extractData<any>(response);
  }

  async createChannel(config: WhatsappConfig & { name: string }): Promise<WhatsappChannel> {
    const response = await api.post(`/channels/whatsapp`, config);
    return extractData<any>(response);
  }

  async getWebhookUrl(channelId: string): Promise<{ webhook_url: string }> {
    const response = await api.get(`/channels/${channelId}/webhook_url`);
    return extractData<any>(response);
  }

  async updateChannel(
    channelId: string,
    config: Partial<WhatsappConfig>,
  ): Promise<WhatsappChannel> {
    const response = await api.patch(`/channels/${channelId}`, config);
    return extractData<any>(response);
  }

  // WhatsApp Cloud integration methods
  // Fix #84: acepta code (flujo server-side) o access_token (Embedded Signup con config_id)
  async exchangeCode(payload: {
    code?: string;
    access_token?: string;
    business_account_id: string;
    waba_id: string;
  }) {
    const response = await api.post(`/whatsapp/authorization`, payload);
    return extractData<any>(response);
  }

  async createWhatsappCloudChannel(payload: {
    user_access_token: string;
    waba_id: string;
    phone_number_id: string;
  }) {
    const response = await api.post(`/whatsapp/cloud/setup`, payload);
    return extractData<any>(response);
  }
}

export default new WhatsappService();
