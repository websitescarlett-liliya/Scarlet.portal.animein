// 50 preset warna utama untuk Panel Tema (/admin/settings > Tampilan)
// Setiap warna dipetakan ke CSS variable --primary saat dipilih admin.

export interface ColorPreset {
  name: string;
  hex: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Scarlet Red', hex: '#E11D48' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Ruby', hex: '#BE123C' },
  { name: 'Sakura Pink', hex: '#EC4899' },
  { name: 'Fuchsia', hex: '#D946EF' },
  { name: 'Magenta', hex: '#C026D3' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Deep Purple', hex: '#6D28D9' },
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Sky Blue', hex: '#0EA5E9' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Lime', hex: '#65A30D' },
  { name: 'Olive', hex: '#4D7C0F' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Burnt Orange', hex: '#C2410C' },
  { name: 'Yellow Gold', hex: '#CA8A04' },
  { name: 'Mustard', hex: '#A16207' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Rose Gold', hex: '#F43F5E' },
  { name: 'Coral', hex: '#FB7185' },
  { name: 'Salmon', hex: '#FB923C' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Mint', hex: '#34D399' },
  { name: 'Seafoam', hex: '#2DD4BF' },
  { name: 'Ocean Blue', hex: '#0284C7' },
  { name: 'Midnight Blue', hex: '#1E3A8A' },
  { name: 'Navy', hex: '#1E40AF' },
  { name: 'Slate Blue', hex: '#475569' },
  { name: 'Steel Gray', hex: '#64748B' },
  { name: 'Charcoal', hex: '#334155' },
  { name: 'Jet Black', hex: '#18181B' },
  { name: 'Graphite', hex: '#27272A' },
  { name: 'Silver', hex: '#94A3B8' },
  { name: 'Lavender', hex: '#A78BFA' },
  { name: 'Plum', hex: '#9D174D' },
  { name: 'Wine', hex: '#881337' },
  { name: 'Maroon', hex: '#7F1D1D' },
  { name: 'Terracotta', hex: '#B45309' },
  { name: 'Forest Green', hex: '#166534' },
  { name: 'Pine', hex: '#14532D' },
  { name: 'Turquoise', hex: '#0891B2' },
  { name: 'Cobalt', hex: '#1D4ED8' },
  { name: 'Hot Pink', hex: '#F472B6' },
  { name: 'Neon Green', hex: '#22C55E' },
];

// Pastikan tepat 50 warna
if (COLOR_PRESETS.length !== 50) {
  console.warn(`COLOR_PRESETS berisi ${COLOR_PRESETS.length} warna, seharusnya 50`);
}
