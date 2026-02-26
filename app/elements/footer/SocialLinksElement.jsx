'use client';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Github } from 'lucide-react';
const ICONS = { twitter: Twitter, facebook: Facebook, instagram: Instagram, linkedin: Linkedin, youtube: Youtube, github: Github };
export default function SocialLinksElement({ props }) {
  const p = props || {};
  return (
    <div style={{ display: 'flex', gap: p.gap || 16, alignItems: 'center' }}>
      {(p.links || []).map(link => {
        const Icon = ICONS[link.platform] || Twitter;
        return (
          <a key={link.id} href={link.href || '#'} style={{ color: p.color || '#64748b', display: 'flex' }}>
            <Icon size={p.size || 20} />
          </a>
        );
      })}
    </div>
  );
}
