'use client';
import TemplateBuilder from '../../../builders/TemplateBuilder';
import { useFooterStore } from '@/store/useBuilderStore';
import { footerCanvasConfig } from '@/configs/footerCanvasConfig';

export default function FooterBuilderPage() {
  return (
    <TemplateBuilder
      type="footer"
      store={useFooterStore}
      config={footerCanvasConfig}
    />
  );
}
