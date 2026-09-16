import { useEffect, useMemo, useState } from 'react';

export function useCountdown(target, fallbackItems) {
  const labels = useMemo(() => (fallbackItems ?? []).map((item) => item.label), [fallbackItems]);

  function getItems() {
    const targetMs = Date.parse(target);
    if (!Number.isFinite(targetMs)) return fallbackItems ?? [];

    const totalSeconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const values = [days, hours, minutes, seconds];

    return values.map((value, index) => ({
      value: String(value).padStart(2, '0'),
      label: labels[index] ?? ['дней', 'часов', 'минут', 'секунд'][index],
    }));
  }

  const [items, setItems] = useState(getItems);

  useEffect(() => {
    setItems(getItems());
    const interval = window.setInterval(() => setItems(getItems()), 1000);
    return () => window.clearInterval(interval);
  }, [target, labels]);

  return items;
}
