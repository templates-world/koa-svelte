<script>

	import { Router, Route } from 'swheel';
	
	import Index from './pages/Index.svelte';
	import About from './pages/About.svelte';

</script>

<Router>
	<Route path="/" exact>
		<Index />
	</Route>

	<Route path="/about">
		<About />
	</Route>
</Router>