import { useState, useEffect } from 'react';
import { Input, Label, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@evoapi/design-system';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { CampaignType } from '@/types/campaigns';
import { CampaignTriggerConfig } from '../components/CampaignTriggerConfig';

interface Step1Props {
  data: {
    name: string;
    description: string;
    type: CampaignType | '';
    triggerConfig?: CampaignTriggerConfig;
  };
  onChange: (data: Partial<Step1Props['data']>) => void;
  onNext: () => void;
}

const Step1_BasicInfo = ({ data, onChange, onNext }: Step1Props) => {
  const { t } = useLanguage('campaigns');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (data.name && data.name.trim().length < 3) {
      newErrors.name = t('wizard.validation.nameMinLength');
    }

    setErrors(newErrors);
  }, [data.name]);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name || !data.name.trim()) {
      newErrors.name = t('wizard.validation.nameRequired');
    } else if (data.name.trim().length < 3) {
      newErrors.name = t('wizard.validation.nameMinLength');
    }

    if (!data.type) {
      newErrors.type = t('wizard.validation.typeRequired');
    }

    if (data.type === CampaignType.TRIGGER) {
      if (!data.triggerConfig || !data.triggerConfig.triggerType) {
        newErrors.triggerConfig = t('wizard.validation.triggerConfigRequired');
      } else if (data.triggerConfig.triggerType === 'event' && (!data.triggerConfig.eventName || !data.triggerConfig.eventName.trim())) {
        newErrors.triggerConfig = t('wizard.validation.triggerEventNameRequired');
      } else if (data.triggerConfig.triggerType === 'segment' && !data.triggerConfig.segmentId) {
        newErrors.triggerConfig = t('wizard.validation.triggerSegmentRequired');
      } else if (data.triggerConfig.triggerType === 'label' && !data.triggerConfig.labelId) {
        newErrors.triggerConfig = t('wizard.validation.triggerLabelRequired');
      } else if (data.triggerConfig.triggerType === 'customAttribute' && !data.triggerConfig.customAttributeName) {
        newErrors.triggerConfig = t('wizard.validation.triggerCustomAttributeRequired');
      } else if (data.triggerConfig.triggerType === 'webhook' && (!data.triggerConfig.webhookUrl || !data.triggerConfig.webhookUrl.trim())) {
        newErrors.triggerConfig = t('wizard.validation.triggerWebhookUrlRequired');
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const isValid =
    data.name?.trim() &&
    data.type &&
    (data.type !== CampaignType.TRIGGER || (data.triggerConfig && data.triggerConfig.triggerType)) &&
    Object.keys(errors).length === 0;

  return (
    <div className="max-w-4xl mx-auto py-6 px-6">
      <div className="px-1">
        <div className="w-full space-y-6 max-w-2xl mx-auto pb-4">
          {/* Name */}
          <div>
            <Label className="text-base mb-2 block font-semibold">
              {t('wizard.step1.nameLabel')} <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder={t('wizard.step1.namePlaceholder')}
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={`h-12 text-base ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              autoFocus
            />
            {errors.name && <p className="text-sm text-red-600 mt-2">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <Label className="text-base mb-2 block font-semibold">
              {t('wizard.step1.descriptionLabel')}
            </Label>
            <Textarea
              placeholder={t('wizard.step1.descriptionPlaceholder')}
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="min-h-[100px] text-base resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">{t('wizard.step1.optional')}</p>
          </div>

          {/* Type */}
          <div>
            <Label className="text-base mb-2 block font-semibold">
              {t('wizard.step1.typeLabel')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.type || ''}
              onValueChange={(value) => onChange({ type: value as CampaignType })}
            >
              <SelectTrigger className={`h-12 text-base ${errors.type ? 'border-red-500' : ''}`}>
                <SelectValue placeholder={t('wizard.step1.typePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CampaignType.SIMPLE}>{t('type.simple')}</SelectItem>
                <SelectItem value={CampaignType.RECURRING}>{t('type.recurring')}</SelectItem>
                <SelectItem value={CampaignType.TRIGGER}>{t('type.trigger')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-600 mt-2">{errors.type}</p>}
          </div>

          {/* Trigger Configuration */}
          {data.type === CampaignType.TRIGGER && (
            <>
              <CampaignTriggerConfig
                config={data.triggerConfig || { triggerType: 'event' }}
                onChange={(config) => onChange({ triggerConfig: config })}
              />
              {errors.triggerConfig && (
                <p className="text-sm text-red-600 mt-2">{errors.triggerConfig}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background flex justify-end pt-4 pb-2 border-t mt-6">
        <Button className="px-6 gap-2" onClick={handleNext} disabled={!isValid}>
          {t('wizard.actions.continue')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;
