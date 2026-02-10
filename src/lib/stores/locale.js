import { writable } from 'svelte/store';

// Initialize with browser language or default to English
function getInitialLocale() {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('locale');
		if (stored) return stored;

		const browserLang = navigator.language.split('-')[0];
		return browserLang === 'es' ? 'es' : 'en';
	}
	return 'en';
}

function createLocaleStore() {
	const { subscribe, set } = writable(getInitialLocale());

	return {
		subscribe,
		set: (value) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem('locale', value);
			}
			set(value);
		}
	};
}

export const locale = createLocaleStore();
