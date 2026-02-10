/**
 * Load markdown content for a given page and locale
 * @param {string} page - The page name (e.g., 'home', 'privacy', 'terms')
 * @param {string} locale - The locale code ('en' or 'es')
 * @returns {Promise<Object>} The markdown module with default export and metadata
 */
export async function loadContent(page, locale) {
	try {
		const content = await import(`../../content/${locale}/${page}.md`);
		return content;
	} catch (error) {
		console.error(`Failed to load content for ${page} in ${locale}:`, error);
		// Fallback to English if Spanish content not found
		if (locale === 'es') {
			return await import(`../../content/en/${page}.md`);
		}
		throw error;
	}
}
