<template>
    <div id="main_div">
        <h1>Buildings</h1>
        <input id="search" placeholder="Search building" v-on:keyup="searchBuilding()"/>
        <p v-if="buildings.length==0">Loading...</p> 
        <ul id="liste_buildings" v-else>
            <li v-for="building of buildings" v-bind:key="'building-' + building.row_id" classList="building">
            
                <div v-bind:id="'div-building-' + building.row_id">
                    <h3>{{building.cowBuiName}}</h3>
                    <p>{{building.cowBuiAdress}}</p>
                    <p>Opening Time: {{building.cowBuiOpeningTime}}</p>
                    <p>Closing Time: {{building.cowBuiClosingTime}}</p>
                    <div classList="type">
                        <p>public: </p><p v-if="building.public  == undefined">0</p><p v-else>{{building.public.length}}</p>
                        <p>private: </p><p v-if="building.private == undefined">0</p><p v-else>{{building.private.length}}</p>
                    </div>

                    <button v-on:click="focusBuilding(building.row_id)">Look</button>
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
        //parse buildings from simplicite
        const vm = this;
        vm.buildings = await vm.$simplicite.getBusinessObject("CowBuilding").search();
        for (var i=0; i< vm.buildings.length; i++) {
            vm.buildings[i].private = await vm.$simplicite.getBusinessObject("CowWorkspace").search({cowWorBuiId: this.buildings[i].row_id, cowWorStatus: "PRIVATE", cowWorAvailability: true});
            vm.buildings[i].public = await vm.$simplicite.getBusinessObject("CowWorkspace").search({cowWorBuiId: this.buildings[i].row_id, cowWorStatus: "PUBLIC", cowWorAvailability: true});
        }
        
    },
    
    methods: {
        async focusBuilding(row_id) {
            //get the rooms of the building
            const vm = this
            let div_bui = document.getElementById("div-building-" + row_id);
            let div_workspace = Object.assign(document.createElement("div"), {classList:"div_workspace"});
            vm.workspace = await vm.$simplicite.getBusinessObject("CowWorkspace").search({cowWorBuiId: row_id});
            for (var i=0; i<vm.workspace.length; i++) {
                let workspace = Object.assign(document.createElement('div'), {classList:"workspace"});
                let num_workspace = Object.assign(document.createElement("p"), {innerText:vm.workspace[i].cowWorSeatNumber});
                workspace.appendChild(num_workspace);
                div_workspace.appendChild(workspace)
            }
            div_bui.appendChild(div_workspace);
        },
        searchBuilding() {
            
        }
        
    }
    
    
}
</script>

<style>


ul {
  list-style-type:none;
  margin: 0;
  padding-inline-start: 0;
  padding-inline-end: 0;
}

.building {
    display: inline-block;
    vertical-align: top;
    margin: 10px;
    padding: 25px;
    background-color: white;
    border: solid 1px black;
    border-radius: 15px;
    color: black;
}


</style>