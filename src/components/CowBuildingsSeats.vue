<template>
<div id="main_building_seat">
    <div id="div_building_seat">
        <h1>Buildings</h1>
        <p v-if="buildings.length==0">Loading...</p> 
        <ul id="liste_buildings" v-else>
            <li v-for="building of buildings" v-bind:key="'building-' + building.row_id" classList="building" v-on:click="reqSeat(building.row_id)">
            
                <div v-bind:id="'div-building-' + building.row_id" >
                    <h3>{{building.cowBuiName}}</h3>
                    <p>{{building.cowBuiAdress}}</p>
                    <p>Opening Time: <time>{{building.cowBuiOpeningTime}}</time></p>
                    <p>Closing Time: <time>{{building.cowBuiClosingTime}}</time></p>
                    <div classList="type">
                        <p v-if="building.public  == undefined">No public seats available</p><p v-else> public seats available: {{building.public.length}}</p>
                        <p v-if="building.private  == undefined">No private seats available</p><p v-else>private seats available: {{building.private.length}} </p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div id="seats">
        
    </div>
</div>  
</template>


<script>

export default {
    name: "CowBuildingSeats",
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
        async reqSeat(bui_row_id) {
            let main = async function(vm) {
                parseSeats(vm);
            }
            let parseSeats = async function(vm) {
                let to_hide = document.getElementById("div_building_seat");
                to_hide.style.display = "none";

                let seats = await vm.$simplicite.getBusinessObject("CowWorkspace").search({cowWorBuiId: bui_row_id});
                console.log(seats);
                let div_main = document.getElementById("seats");
                let div_public = Object.assign(document.createElement("div"), {classList:"div_public_seats div_seats"});
                let div_private = Object.assign(document.createElement("div"), {classList:"div_private_seats div_seats"});
                
                for (let seat of seats) {
                    let div_seat = Object.assign(document.createElement("div"), {classList: "div_seat"});
                    let num_seat = Object.assign(document.createElement("button"), {innerHTML: seat.cowWorSeatNumber});
                    num_seat.addEventListener("click", async function() {
                        await takeSeat(vm, seat.row_id);
                    })
                    div_seat.appendChild(num_seat);
                    if (seat.cowWorStatus == "PUBLIC") {
                        div_public.appendChild(div_seat);
                    }
                    else {
                        div_private.appendChild(div_seat);
                    }
                }
                div_main.appendChild(div_public);
                div_main.appendChild(div_private);
            }
            let takeSeat = async function(vm, row_id) {
                let req = await vm.$simplicite.getBusinessObject("CowRequest");
                let custom_row = await getLastRowId(vm, "CowRequest");
                let customer_row = document.getElementById("log").innerHTML;
                console.log(customer_row);
                try {
                    await req.create({"row_id": custom_row,"cowReqWorId": row_id, "cowReqCusId": customer_row});
                } catch (e) {
                    window.alert("Please connect to your account to puruse");
                }
            }
            let getLastRowId = async function(vm, object) {
                //return the last request row id
                vm.requests = await vm.$simplicite.getBusinessObject(object).search();
                let max = 0;
                for (var i=0; i<vm.requests;i++) {
                    var row_id = await vm.requests[i].row_id;
                    if (row_id > max) {
                        max = row_id;
                    }
                }
                return max;
            }
                
            main(this);
        },

        async focusBuilding(row_id) {
            //get the rooms of the building
            const vm = this
            let div_bui = document.getElementById("div-building-" + row_id);
            let div_workspace = Object.assign(document.createElement("div"), {classList:"div_workspace"});
            vm.workspace = await vm.$simplicite.getBusinessObject("CowWorkspace").search({cowWorBuiId: row_id});
            for (var i=0; i<vm.workspace.length; i++) {
                let workspace = Object.assign(document.createElement('div'), {classList:"workspace"});
                let num_workspace = Object.assign(document.createElement("p"), {innerText:vm.workspace[i].cowWorSeatNumber + " : " + vm.workspace[i].cowWorStatus});
                workspace.appendChild(num_workspace);
                div_workspace.appendChild(workspace)
            }
            div_bui.appendChild(div_workspace);
        },
        
        async seePrivate(row_id) {
            return row_id;
            /*const vm = this;
            vm.seats = await vm.$simplicite.getBusinessObject("CowWorkspace").search({cowWorBuiId: row_id, cowWorStatus: "PRIVATE", cowWorAvailability: true});
            let div_bui = document.getElementById("div-building-" + row_id);
            div_bui.appendChild(seats);*/
        }
        /*async searchBuilding() {
            const vm = this;
            let ul_bui = document.getElementById("liste_buildings");
            let l_buildings = document.getElementsByClassName("building");
            let input = document.getElementById("search");
            for(let building of l_buildings) {
                ul_bui.removeChild(building);
            }
            vm.buildings = await vm.$simplicite.getBusinessObject("CowBuilding").search();

            for (var j = 0; j<vm.buildings.length; j++) {
                if (((vm.buildings[j].cowBuiName).substring(0,input.value.length)).toLowerCase() == input.value.toLowerCase()) {
                    let bui = Object.assign(document.createElement("li"), {classList:"building"});
                    let bui_name = Object.assign(document.createElement("h3"), {innerText:vm.buildings[j].cowBuiName});
                    bui.appendChild(bui_name);
                    ul_bui.appendChild(bui);
                }
            }
        }*/
    }
}
</script>

<style>
#div_building_seat {
    display: none;
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
    margin: 10px;
    padding: 25px;
    background-color: white;
    border: solid 1px black;
    border-radius: 15px;
    color: black;
}
.div_seats {
    border: solid black 1px;
    margin: 2px;
    padding: 2px;
    display: inline-block;
    vertical-align: top;
    background-color: blue;
    width: 40%;
}

</style>