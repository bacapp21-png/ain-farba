export const categoryTranslations: Record<string, string> = {
  heritage: "التراث",
  history: "التاريخ",
  literature: "الأدب",
  thought: "الفكر",
  identity: "الهوية",
};

export const specialtyTranslations: Record<string, string> = {
  scholar: "عالم",
  jurist: "فقيه",
  poet: "شاعر",
  writer: "كاتب",
  thinker: "مفكر",
};

export const eventStatusTranslations: Record<string, string> = {
  upcoming: "قادم",
  past: "منتهي",
};

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ar-MR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}