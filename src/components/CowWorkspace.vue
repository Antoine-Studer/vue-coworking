<template>
    <div id="main_div">
        <h1>Workspace</h1>
        <p v-if="buildings.length==0">Chargement du catalogue des batîments</p> 
        <ul v-else>
            <li v-for="building of buildings" v-bind:key="'building-' + building.row_id" classList="building">
            <button v-on:click="focusBuilding()">test</button>
                <div v-bind:id="'div-building-' + building.row_id" >
                    <h3>{{building.cowBuiName}}</h3>
                    <p>{{building.cowBuiAdress}}</p>
                </div>
                
            </li>
        </ul>
    </div>
    
</template>


<script>
export default {
    name: "CowWorkspace",
    data() {
        return {buildings: []};
    },
    async created() {
        const vm = this;
        vm.buildings = await vm.$simplicite.getBusinessObject("CowBuilding").search();
        console.log(vm.buildings);
    },
    methods: {
        focusBuilding() {
            let main = document.getElementById("main_div");
            let div_focus = Object.assign(document.createElement("div"), {id:"focus"});
            let test = Object.assign(document.createElement("p"), {innerText: "test"});
            div_focus.appendChild(test);
            main.appendChild(div_focus);
        }
    }
}
</script>

<style>
#main_div {
    color: black;
}

ul {
  list-style-type:none;
  margin: 0;
  padding-inline-start: 0;
  padding-inline-end: 0;
}

.building {
    display: inline-block;
    vertical-align: top;
    margin: 25px;
    padding: 25px;
    background-color: white;
    border: solid 1px black;
}

#focus {
    z-index: 100000; 
	position: absolute;
    background-color: aqua;
    width: 100%;
    height: 100%;
}

</style>