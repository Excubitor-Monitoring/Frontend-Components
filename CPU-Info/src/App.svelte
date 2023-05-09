<script>
	import { onMount } from "svelte";
	import Component from "./lib/Component.svelte";
	import { connectSocket } from "./socket";

	let asyncComponent = null;

	async function login(){
		let auth = await fetch(`http://${import.meta.env.VITE_API_URI}/auth`, {
            method: "POST",
            body: JSON.stringify({
                method: "PAM",
                credentials: {
                    username: import.meta.env.VITE_USERNAME,
                    password: import.meta.env.VITE_PASSWORD
                }
            })
        })
		let json = await auth.json();
		console.log(`TOKEN: ${json.access_token}`);
		connectSocket(`ws://${import.meta.env.VITE_API_URI}/ws?token=${json.access_token}`, () => {asyncComponent = Component})
	}
	
	onMount(() => {
		login()
	});
</script>

<svelte:component this={asyncComponent} />
