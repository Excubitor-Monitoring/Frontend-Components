import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  
  if(command == "serve"){
    return {
      plugins: [svelte()]
    }
  }

  else{
    return{
      build:{
        lib:{
          entry: './src/lib/main.js',
          name: 'index',
        }
      },
      plugins: [svelte({
        compilerOptions: {
          customElement: true,
        },
      })],
    }
  }
})
