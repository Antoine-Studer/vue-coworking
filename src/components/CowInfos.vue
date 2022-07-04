<template>
    <div id="infos">
        <button v-on:click="openInfos()">Mes informations</button>
    </div>
</template>

<script>
import test from 'node:test';

export default {
    methods: {
        openInfos() {let infos = document.getElementById("infos");
            let div_profil = Object.assign(document.createElement("div"), {id: "div_profil"});
            //let button_profil = Object.assign(document.createElement("button"), {onclick: test()});
            //div_profil.appendChild(button_profil);
            infos.appendChild(div_profil);
        }
    }
}
</script>