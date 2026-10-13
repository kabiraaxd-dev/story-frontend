import { reactive, watch } from "vue";

const KEY = "reader-prefs";
const SIZES = ["m", "l", "xl"];
const THEMES = ["light", "sepia", "night"];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        size: SIZES.includes(p.size) ? (p.size as string) : "l",
        theme: THEMES.includes(p.theme) ? (p.theme as string) : "light",
      };
    }
  } catch {
    /* storage blocked or corrupted: use defaults */
  }
  return { size: "l", theme: "light" };
}

// One shared object for the whole app.
const prefs = reactive(load());

watch(
  prefs,
  (value) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* ignore: the page still works, it just won't remember */
    }
  },
  { deep: true },
);

export const useReadingPrefs = () => prefs;
