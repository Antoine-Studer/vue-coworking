<template>
<div id="main_building_room">
    <div id="div_building_room">
        <h1>Get a room</h1>
        <h2>Buildings</h2>
        <input placeholder="Search building" id="search_building_room" v-on:keyup="searchBuilding()"/>
        <p v-if="buildings.length==0">Loading...</p>
        <ul id="list_buildings_room" v-else>
            <li v-for="building of buildings" v-bind:key="'building-' + building.row_id" classList="building" v-on:click="bookRoom(building.row_id)">
                <div v-bind:id="'div-building-' + building.row_id">
                    <h3 classList="building_name">{{building.cowBuiName}}</h3>
                    <p classList="building_adress">{{building.cowBuiAdress}}</p>
                    <p classList="building_opening_time building_time">Opening Time: <time>{{building.cowBuiOpeningTime}}</time></p>
                    <p classList="building_closing_time building_time">Closing Time: <time>{{building.cowBuiClosingTime}}</time></p>
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
    // scrape and display the buildings and rooms
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
                let main_building_room = document.getElementById("main_building_room");
                let div_rooms = document.getElementById("rooms");
                if (div_rooms != undefined) {
                    main_building_room.removeChild(div_rooms)

                }
                let div_main = Object.assign(document.createElement("div"), {id:"rooms"});
                div_main.style.display = "inline-block";
                div_main.appendChild(Object.assign(document.createElement("h2"), {innerHTML:"Select room"}));
                main_building_room.appendChild(div_main);
                
                div_main.style.display = "inline-block";
                let rooms = await vm.$simplicite.getBusinessObject("CowRoom").search({cowRoomBuiId: bui_row_id});
                if (document.getElementById("input-deired-capacity") == undefined) {
                    let input_desired_capacity = Object.assign(document.createElement("input"), {id:"input-desired-capacity", placeholder:"Desired capacity", type:"number"})
                    input_desired_capacity.addEventListener("keyup", async function(){await searchCapacity(div_main)});
                    div_main.appendChild(input_desired_capacity);
                }
                if (rooms.length == 0) {
                    if (document.getElementById("no-rooms") == undefined) {
                        div_main.appendChild(Object.assign(document.createElement("p"), {innerHTML:"No rooms yet", id:"no-rooms"}));
                    }
                }
                for (let room of rooms) {
                    let div_room = Object.assign(document.createElement("div"), {classList: "div_room"});
                    let num_room = Object.assign(document.createElement("p"), {innerText: room.cowRoomNumber});
                    let capacity_label = Object.assign(document.createElement("span"), {innerText: "Room capacity: "});
                    let capacity_room = Object.assign(document.createElement("input"), {value:room.cowRoomCapacity, classList:"room-capacity"});
                    capacity_label.setAttribute("readonly","readonly");
                    capacity_label.appendChild(capacity_room)
                    let opts = await vm.$simplicite.getBusinessObject("CowEligibleOptions").search({cowEliRoomId: room.row_id});
                    div_room.appendChild(num_room);
                    div_room.appendChild(capacity_label);
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

            let searchCapacity = async function(div_rooms) {
                let l_rooms = div_rooms.getElementsByClassName("div_room");
                let input_value =parseInt(document.getElementById("input-desired-capacity").value);
                for (let room of l_rooms) {
                    let capacity = parseInt(room.querySelector(".room-capacity").value);
                    if (input_value != "" && (capacity < input_value-2 || capacity > input_value+2)) {
                        room.style.display = "none";
                    }
                    else {
                        room.style.display = "inline-block";
                    }
                }
            }

            let bookingSpace = async function(vm, room, opts) {
                let div_rooms = document.getElementById("rooms");
                let l_rooms = div_rooms.querySelectorAll(".div_room");
                for (let room of l_rooms) {
                    room.style.display = "none";
                }
                if (document.getElementById("div_booking") != undefined) {
                    div_rooms.removeChild(document.getElementById("div_booking"));
                }
                if (document.getElementById("input-desired-capacity") != undefined) {
                    div_rooms.removeChild(document.getElementById("input-desired-capacity"));
                }
                
                let div_booking = Object.assign(document.createElement("div"), {id: "div_booking"});
                let num_room = Object.assign(document.createElement("p"), {classList: "room_number", innerHTML: room.cowRoomNumber});
                let p_time = Object.assign(document.createElement("p"), {classList:"p_times"});
                let op_time = Object.assign(document.createElement("time"), {classList: "room_op_time", innerHTML: room.cowRoomBuiId__cowBuiOpeningTime + " - "});
                let clo_time = Object.assign(document.createElement("time"), {classList: "room_clo_time", innerHTML: room.cowRoomBuiId__cowBuiClosingTime});
                let input_date = Object.assign(document.createElement("input"), {classList:"input_date", type:"date"});
                let input_b_time = Object.assign(document.createElement("input"), {classList:"input_b_time", type:"time"});
                let input_e_time = Object.assign(document.createElement("input"), {type:"time"});


                div_booking.appendChild(num_room);
                div_booking.appendChild(p_time);
                p_time.appendChild(op_time);
                p_time.appendChild(clo_time);
                div_booking.appendChild(input_date);
                div_booking.appendChild(input_b_time);
                div_booking.appendChild(input_e_time);
                
                let div_check = Object.assign(document.createElement("div"), {classList: "div_check"});
                for (let opt of opts) {
                    let check_opt = Object.assign(document.createElement("input"), {type:"checkbox", classList:"option-checkbox", id:"option-checkbox-" + opt.row_id});
                    div_check.appendChild(Object.assign(document.createElement("label"), {innerText:opt.cowEliOptId__cowOptOptionName }))
                    div_check.appendChild(check_opt);
                }
                
                div_booking.appendChild(div_check);
                
                let button_confirm = Object.assign(document.createElement("button"), {innerText: "Confirm"});
                button_confirm.addEventListener("click", async function(){
                    await takeRoom(vm,room, opts, input_date.value, convertTime(input_b_time.value),convertTime(input_e_time.value))
                });
                div_booking.appendChild(button_confirm);
                div_rooms.appendChild(div_booking);
            }

            let takeRoom = async function(vm, room, options, date, b_time, e_time) {
                let customer_row = document.getElementById("log").value;
                let new_book_row_id = await getLastRowId(vm, "CowRoom") + 1;
                let new_optl_row_id = await getLastRowId(vm, "CowOptionsLine") + 1;
                let booking_number = await generateBookingNumber(vm);
                if (parseInt(customer_row) == -1) {
                    window.alert("Please connect to your account to pursue");
                } 
                else {
                    try {
                        let object_book = await vm.$simplicite.getBusinessObject("CowBooking");
                        await object_book.create({"row_id":new_book_row_id, "cowBookRoomId": room.row_id, "cowBookCusId": customer_row,
                        "cowBookBookingNumber": booking_number, "cowBookDate": date, "cowBookBeginningTime": b_time.toString(), "cowBookEndingTime": e_time.toString(),
                        });
                        
                        let object_options_line = await vm.$simplicite.getBusinessObject("CowOptionsLine");
                        let l_checkbox = document.getElementsByClassName("option-checkbox");
                        for (let opt of l_checkbox) {
                            if (opt.checked==true) {
                                let opt_row_id = opt.id.substring(16,opt.id.length);
                                let new_booking = await vm.$simplicite.getBusinessObject("CowBooking").search({"cowBookBookingNumber": booking_number});
                                await object_options_line.create({"row_id":  new_optl_row_id, "cowOptlEliId": opt_row_id, "cowOptlBookId": new_booking[0].row_id});
                                
                            }
                        }
                        window.alert("Your reservation Number: " + booking_number);
                    } catch (e) {
                        if(e.messages != undefined) {
                            window.alert(e.messages);
                        }
                        else {
                            window.alert(e.message);
                        }
                    }
                }
            }


            let generateBookingNumber = async function(vm) {
                //return a new booking number which doesn't exist
                let booking = await vm.$simplicite.getBusinessObject("CowBooking").search();
                let max = 0;
                for (let i = 0; i<booking.length; i++){
                    let num = await booking[i].cowBookBookingNumber;
                    if (num > max) {
                        max = num;
                    }
                }
                return max + 1;
            }
            let getLastRowId = async function(vm, obj) {
                //return the last request row id
                let object = await vm.$simplicite.getBusinessObject(obj).search();
                let max = 0;
                for (var i=0; i<object.length;i++) {
                    var row_id = await object[i].row_id;
                    if (row_id > max) {
                        max = row_id;
                    }
                }
                return max;
            }
            
            let convertTime = function(time) {
                return time + ":00";
            }

            main(this);
        },
        async searchBuilding() {
            let ul_bui = document.getElementById("list_buildings_room");
            let input = document.getElementById("search_building_room");
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