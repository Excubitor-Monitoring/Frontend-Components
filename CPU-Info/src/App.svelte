<script>
	import { onMount } from "svelte";
	import Component from "./lib/Component.svelte";
	import { connectSocket } from "./socket";

	let container;

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
		connectSocket(`ws://${import.meta.env.VITE_API_URI}/ws?token=${json.access_token}`, () => {
			const child = document.createElement(import.meta.env.VITE_HTMLTAG);
			container.appendChild(child);
		})
	}
	
	onMount(() => {
		login()
	});
</script>

<div bind:this={container} style="height: 100vh;"/>