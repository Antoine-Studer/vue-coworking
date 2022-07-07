<template>
<div id="main_buildings_rooms">
    <div id="div_building_room">
        <h1>Buildings</h1>
        <p v-if="buildings.length==0">Loading...</p>
        <ul id="liste_building" v-else>
            <li v-for="building of buildings" v-bind:key="'building-' + building.row_id" classList="building" v-on:click="bookRoom(building.row_id)">
                <div v-bind:id="'div-building-' + building.row_id">
                    <h3>{{building.cowBuiName}}</h3>
                    <p>{{building.cowBuiAdress}}</p>
                    <p>Opening Time: <time>{{building.cowBuiOpeningTime}}</time></p>
                    <p>Closing Time: <time>{{building.cowBuiClosingTime}}</time></p>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    name: "CowBuildingsRooms",
    data() {
        return {buildings: []};
    },
    async created() {
        const vm = this;
        vm.buildings = await vm.$simplicite.getBusinessObject("CowBuilding").search();
    },
    methods: {
        async bookRoom(row_id) {
            console.log(row_id);
        }
    }
}
</script>


<style>
#div_building_room {
    display: none;
}
</style>