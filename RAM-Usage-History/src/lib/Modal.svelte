<script>
    export let callback;
    export let values;
    export let closeModal;
</script>

<div class="bg-gray-500 bg-opacity-30 fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center">
    <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow">
            <!-- Modal body -->
            <div class="p-6 space-y-6">
                <h1>WARNING</h1>
                <div>You are trying to load {values} datapoints. <br> Are You shure ?</div>
                <button class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" on:click={() => {closeModal(); callback()}}>YES</button>
                <button class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10" on:click={closeModal}>NO</button>
            </div>
        </div>
    </div>
</div>