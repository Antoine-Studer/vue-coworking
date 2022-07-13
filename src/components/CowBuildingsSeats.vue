<template>
<div id="main_building_seat">
    <div id="div_building_seat">
        <h1>Get a seat</h1>
        <h2>Buildings</h2>
        <input placeholder="Search building" id="search_buildings_seat" v-on:keyup="searchBuilding()"/>
        <p v-if="buildings.length==0">Loading...</p> 
        <ul id="list_buildings_seat" v-else>
            <li v-for="building of buildings" v-bind:key="'building-' + building.row_id" classList="building" v-on:click="reqSeat(building.row_id)">
            
                <div v-bind:id="'div-building-' + building.row_id" >
                    <h3 classList="building_name">{{building.cowBuiName}}</h3>
                    <p classList="building_adress">{{building.cowBuiAdress}}</p>
                    <p classList="building_opening_time building_time">Opening Time: <time>{{building.cowBuiOpeningTime}}</time></p>
                    <p classList="building_closing_time building_time">Closing Time: <time>{{building.cowBuiClosingTime}}</time></p>
                    <div classList="type">
                        <p v-if="building.public  == undefined">No public seats available</p><p v-else> public seats available: {{building.public.length}}</p>
                        <p v-if="building.private  == undefined">No private seats available</p><p v-else>private seats available: {{building.private.length}} </p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div id="seats"></div>
</div>  
</template>


<script>

export default {
    //scrape and display the buildings and seats
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
                let to_hide = document.getElementById("div_building_seat");
                to_hide.style.display = "none";
                let div_main = Object.assign(document.createElement("div"), {id:"seats"});
                document.getElementById("main_building_seat").appendChild(div_main);
                if (div_main.querySelector("button") != undefined) {
                    for (let ele of div_main.querySelectorAll("button")) {
                        div_main.removeChild(ele);
                    } 
                    for (let seat of div_main.querySelectorAll(".div_seat"))  {
                        div_main.removeChild(seat);
                    } 
                }
                let b_public = Object.assign(document.createElement("button"), {innerText: "public", id:"b_public"});
                let b_private =Object.assign(document.createElement("button"), {innerText: "private", id:"b_private"});
                document.getElementById("seats").style.display = "inline-block";
                b_public.addEventListener('click', async function(){scrapeSeats(vm,"PUBLIC")});
                b_private.addEventListener("click", async function(){scrapeSeats(vm,"PRIVATE")});
                div_main.appendChild(b_public);
                div_main.appendChild(b_private);
            }


            let scrapeSeats = async function(vm, status) {
                //scrape the seats from simplicite
                let div_main = document.getElementById("seats");
                let l_seats = div_main.querySelectorAll(".div_seat");
                for (let seat of l_seats) {
                    div_main.removeChild(seat);
                }

                let seats = await vm.$simplicite.getBusinessObject("CowWorkspace").search({cowWorBuiId: bui_row_id});
                
                
                for (let seat of seats) {
                    if (seat.cowWorStatus == status) {
                        let div_seat = Object.assign(document.createElement("div"), {classList: "div_seat"});
                        let num_seat = Object.assign(document.createElement("h5"), {innerHTML: seat.cowWorSeatNumber});
                        let availability = seat.cowWorAvailability;
                        let avai_seat = Object.assign(document.createElement("p"));
                        if (availability == true) {
                            avai_seat.innerText = "Available";
                        }
                        else {
                            avai_seat.innerText = "Not available";
                        }
                        div_seat.addEventListener("click", async function() {
                            await takeSeat(vm, seat.row_id, status);
                        })
                        div_seat.appendChild(num_seat);
                        div_seat.appendChild(avai_seat);
                        div_main.appendChild(div_seat);
                    }
                }
                
            }
            let takeSeat = async function(vm, row_id, status) {
                //create a new request of seat from the connected customer
                let req = await vm.$simplicite.getBusinessObject("CowRequest");
                let custom_row = await getLastRowId(vm, "CowRequest");
                let customer_row = document.getElementById("log").value;
                if (parseInt(customer_row) == -1) {
                    window.alert("Please connect to your account to pursue");
                }
                else {
                    try {
                        if (confirm("Do you want to request this seat ?")) {
                            await req.create({"row_id": custom_row,"cowReqWorId": row_id, "cowReqCusId": customer_row});
                            window.alert(status + " seat " + row_id + " requested");
                        }
                    } catch (e) {
                        window.alert(e.messages);
                    }
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

        
        async searchBuilding() {
            let ul_bui = document.getElementById("list_buildings_seat");
            let input = document.getElementById("search_buildings_seat");
            let l_buildings = ul_bui.querySelectorAll(".building");
            for(let building of l_buildings) {
                let name = building.querySelector(".building_name").innerHTML.toLowerCase();
                let adress = building.querySelector(".building_adress").innerHTML.toLowerCase();
                if (name.includes(input.value.toLowerCase()) || adress.includes(input.value.toLowerCase())) {
                    building.style.display = "inline-block";
                }
                else {
                    building.style.display = "none";
                }
            }
            
        }
    }
}
</script>

<style>
#div_building_seat {
    display: none;
}

#seats {
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
.div_seat {
    border: solid black 1px;
    margin: 2px;
    padding: 2px;
    display: inline-block;
    vertical-align: top;
    background-color: white;
    color: black;
    width: 40%;
}

</style>