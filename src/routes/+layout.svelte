<script>
	import '../app.css';
	import { locale } from '$lib/stores/locale.js';
	import PageTransition from '$lib/components/PageTransition.svelte';

	let currentLocale = $state($locale);

	function setLanguage(lang) {
		locale.set(lang);
		currentLocale = lang;
	}
</script>

<div class="app">
	<div class="lang-toggle">
		<button
			class="lang-link"
			class:active={currentLocale === 'en'}
			onclick={() => setLanguage('en')}
		>
			EN
		</button>
		<span class="separator">|</span>
		<button
			class="lang-link"
			class:active={currentLocale === 'es'}
			onclick={() => setLanguage('es')}
		>
			ES
		</button>
	</div>

	<section class="masthead">
		<div class="container">
			<div class="masthead-content">
				<a href="/" class="logo-link">
					<img
						src="/images/f-h-masthead.svg"
						alt="Faith & Home - {currentLocale === 'en' ? 'Return to Home' : 'Volver al Inicio'}"
						class="masthead-logo"
					/>
				</a>
				<p class="subtitle">
					{currentLocale === 'en'
						? 'Building Community Through Affordable Housing'
						: 'Construyendo Comunidad a Través de Vivienda Asequible'}
				</p>
			</div>
		</div>
	</section>

	<main>
		<PageTransition>
			<slot />
		</PageTransition>
	</main>

	<footer>
		<div class="container">
			<div class="grid">
				<div class="col-12">
					<p>&copy; {new Date().getFullYear()} Faith & Home</p>
					<nav class="footer-nav">
						<a href="/">
							{currentLocale === 'en' ? 'Home' : 'Inicio'}
						</a>
						<a href="/privacy">
							{currentLocale === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
						</a>
						<a href="/terms">
							{currentLocale === 'en' ? 'Terms and Conditions' : 'Términos y Condiciones'}
						</a>
					</nav>
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.lang-toggle {
		position: fixed;
		top: 1rem;
		right: 1.5rem;
		font-size: 0.875rem;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		z-index: 1000;
	}

	.lang-link {
		background: none;
		border: none;
		color: var(--text-color);
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		text-decoration: none;
	}

	.lang-link:hover {
		opacity: 0.7;
	}

	.lang-link.active {
		font-weight: 500;
	}

	.separator {
		color: var(--text-color);
		opacity: 0.5;
	}

	.masthead {
		background: var(--bg-color);
		color: var(--text-color);
		padding: 4rem 0;
		text-align: center;
	}

	.logo-link {
		display: inline-block;
		text-decoration: none;
	}

	.logo-link:hover {
		opacity: 1;
	}

	.masthead-logo {
		max-width: none;
		width: 800px;
		height: auto;
		margin-bottom: .25rem;
	}

	@media (max-width: 850px) {
		.masthead-logo {
			width: 90vw;
		}
	}

	.subtitle {
		font-size: 1.25rem;
		color: var(--text-color);
		max-width: 600px;
	}

	main {
		flex: 1;
	}

	footer {
		background-color: var(--light-gray);
		padding: 2rem 0;
		margin-top: 4rem;
	}

	footer p {
		text-align: center;
		margin-bottom: 1rem;
	}

	.footer-nav {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	.footer-nav a {
		color: var(--text-color);
	}

	@media (max-width: 768px) {
		.lang-toggle {
			top: 0.75rem;
			right: 1rem;
			font-size: 0.75rem;
		}

		.subtitle {
			font-size: 1rem;
		}
	}
</style>
