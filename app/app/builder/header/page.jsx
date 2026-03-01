'use client';
import TemplateBuilder from '../../../builders/TemplateBuilder';
import { useHeaderStore } from '@/store/useBuilderStore';
import { headerCanvasConfig } from '@/configs/headerCanvasConfig';

export default function HeaderBuilderPage() {
  return (
    <TemplateBuilder
      type="header"
      store={useHeaderStore}
      config={headerCanvasConfig}
    />
  );
}
