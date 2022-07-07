<template>
<div id="main_building_room">
    <div id="div_building_room">
        <h1>Get a room</h1>
        <h2>Buildings</h2>
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
    <div id="rooms">
        <h2>Select room</h2>
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
        async bookRoom(bui_row_id) {
            let main = async function(vm) {
                await scrapeRooms(vm);
            }
            let scrapeRooms = async function(vm) {
                let to_hide = document.getElementById("div_building_room");
                to_hide.style.display = "none";
                let to_display = document.getElementById("rooms");
                to_display.style.display = "inline-block";

                let rooms = await vm.$simplicite.getBusinessObject("CowRoom").search({cowRoomBuiId: bui_row_id});
                let div_main = document.getElementById("rooms");

                for (let room of rooms) {
                    let div_room = Object.assign(document.createElement("div"), {classList: "div_room"});
                    let num_room = Object.assign(document.createElement("p"), {innerText: room.cowRoomNumber});
                    let capacity_room = Object.assign(document.createElement("span"), {innerText: "Room capacity: " + room.cowRoomCapacity});
                    let opts = await vm.$simplicite.getBusinessObject("CowEligibleOptions").search({cowEliRoomId: room.row_id});
                    div_room.appendChild(num_room);
                    div_room.appendChild(capacity_room);
                    div_main.appendChild(div_room);
                    let div_opts = Object.assign(document.createElement("div"), {classList: "div_opt"});
                    div_room.appendChild(div_opts);
                    for (let opt of opts) {
                        let div_opt = Object.assign(document.createElement("div"));
                        let opt_name = Object.assign(document.createElement("p"), {innerText: opt.cowEliOptId__cowOptOptionName});
                        div_opt.appendChild(opt_name);
                        div_opts.appendChild(div_opt);
                    }
                    div_room.addEventListener('click', async function(){await bookingSpace(vm, room, opts)});
                }
            }

            let bookingSpace = async function(vm, room, opts) {
                let div_rooms = document.getElementById("rooms");
                let l_rooms = div_rooms.querySelectorAll(".div_room");
                for (let room of l_rooms) {
                    room.style.display = "none";
                }

                let div_booking = Object.assign(document.createElement("div"), {classList: "div_booking"});
                let num_room = Object.assign(document.createElement("p"), {classList: "room_number", innerHTML: room.cowRoomNumber});
                let input_date = Object.assign(document.createElement("input"), {classList:"input_date", type:"date"});
                let input_b_time = Object.assign(document.createElement("input"), {classList:"input_b_time", type:"time"});
                let input_e_time = Object.assign(document.createElement("input"), {type:"time"});
                div_booking.appendChild(num_room);
                div_booking.appendChild(input_date);
                div_booking.appendChild(input_b_time);
                div_booking.appendChild(input_e_time);
                
                let div_check = Object.assign(document.createElement("div"), {classList: "div_check"});
                for (let opt of opts) {
                    let check_opt = Object.assign(document.createElement("input"), {type:"checkbox"});
                    div_check.appendChild(Object.assign(document.createElement("label"), {innerText:opt.cowEliOptId__cowOptOptionName }))
                    div_check.appendChild(check_opt);
                }
                div_rooms.appendChild(div_check);
                
                let button_confirm = Object.assign(document.createElement("button"), {innerText: "Confirm"});
                button_confirm.addEventListener("click", async function(){
                    await takeRoom(vm,room, opts, input_date.value, input_b_time.value,input_e_time.value)
                });
                div_booking.appendChild(button_confirm);
                div_rooms.appendChild(div_booking);
            }

            let takeRoom = async function(vm, room, options, date, b_time, e_time) {
                let customer_row = document.getElementById("log").innerHTML;
                let new_book_row_id = getLastRowId(vm, "CowRoom") + 1;
                let new_optl_row_id = getLastRowId(vm, "CowOptionsLine") + 1;
                let booking_number = generateBookingNumber(vm);
                if (parseInt(customer_row) == -1) {
                    window.alert("Please connect to your account to pursue");
                } 
                else {
                    let object_room = await vm.$simplicite.getBusinessObject("CowRoom");
                    await object_room.create({"row_id":new_book_row_id, "cowBookRoomId": room.row_id, "cowBookCusId": customer_row, "cowBookBookingNumber": booking_number, "cowBookDate": date, "cowBookBeginningTime": b_time, "cowBookEndingTime": e_time});
                    let object_options_line = await vm.$simplicite.getBusinessObject("CowOptionsLine");
                    await object_options_line.create({"row_id": new_optl_row_id, "cowOptlEliId": options.row_id, "cowOptlBookId": new_book_row_id});
                }
            }
            let generateBookingNumber = async function(vm) {
                //return a new booking number which doesn't exist
                let booking = await vm.$simplicite.getBusinessObject("CowBooking").search();
                let max = 0;
                for (let i = 0; i<booking.length; i++){
                    let num = await booking[i].cowBookNumber;
                    if (num > max) {
                        max = num;
                    }
                }
                return max + 1;
            }
            let getLastRowId = async function(vm, object) {
                //return the last request row id
                object = await vm.$simplicite.getBusinessObject(object).search();
                let max = 0;
                for (var i=0; i<object;i++) {
                    var row_id = await object[i].row_id;
                    if (row_id > max) {
                        max = row_id;
                    }
                }
                return max;
            }

            main(this);
        }
    }
}
</script>


<style>
#div_building_room {
    display: none;
}

#rooms {
    display: none;
}

.div_room {
    border: black solid 1px;
    padding: 10px;
    margin: 10px;
    color: black;
    background-color: white;
    display: inline-block;
    width: 80%;
    border-radius: 10px;
}
</style>