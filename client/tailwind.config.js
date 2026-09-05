/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#002046",
        "primary-container": "#1b365d",
        "on-primary": "#ffffff",
        "on-primary-container": "#aec7f7",
        secondary: "#16a34a",
        "secondary-dark": "#236b48",
        "secondary-container": "#dcfce7",
        "on-secondary-container": "#15803d",
        "surface-ivory": "#FAF8F5",
        "surface-card": "#FFFFFF",
        "surface-subtle": "#F3EFEA",
        "surface-container": "#ebeef3",
        "surface-container-low": "#f6f7fa",
        "surface-container-high": "#e2e6ed",
        "text-primary": "#1E2227",
        "text-secondary": "#57606A",
        "text-muted": "#7A828B",
        "border-subtle": "#E8E2D9",
        "border-strong": "#D1C9BE",
        "status-success-bg": "#EDF6F0",
        "status-success-text": "#1F5239",
        "status-warning-bg": "#FEF7EC",
        "status-warning-text": "#8F5B10",
        "status-error-bg": "#FDF2F2",
        "status-error-text": "#991B1B",
        "status-info-bg": "#EEF4FA",
        "status-info-text": "#18426B",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Manrope", "sans-serif"],
        display: ["Manrope", "Plus Jakarta Sans", "sans-serif"]
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(31, 36, 33, 0.04), 0 1px 2px 0 rgba(31, 36, 33, 0.02)',
        'elevated': '0 4px 12px 0 rgba(31, 36, 33, 0.06), 0 2px 4px 0 rgba(31, 36, 33, 0.04)',
        'card-modern': '0 4px 24px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -2px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 20px 35px -8px rgba(15, 23, 42, 0.09), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'drawer': '0 -4px 25px 0 rgba(0, 32, 70, 0.12)'
      }
    },
  },
  plugins: [],
}
