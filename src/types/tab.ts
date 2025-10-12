/**
 * Tab interface for TabView component
 */
export interface Tab {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  content: React.ReactNode; // Content for each tab
  className?: string; // Optional className for custom styling
}
