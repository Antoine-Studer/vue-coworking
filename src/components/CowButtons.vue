<template>
    <div id="main_buttons_div">
        <button id="b_seat" classList="order" v-on:click="getSeat()">Get a seat</button>
        <button id="b_room" classList="order" v-on:click="getRoom()">Get a room</button>
    </div>
</template>

<script>

export default {
    name: "CowButtons",
    methods: {
        getSeat() {

            let bui_seat = document.getElementById("div_building_seat");
            let bui_room = document.getElementById("div_building_room");
            bui_room.style.display = "none";
            bui_seat.style.display = "inline-block";

            let div_rooms = document.getElementById("rooms");
            div_rooms.style.display = "none";
            let l_rooms = div_rooms.querySelectorAll(".div_room");
            
            for (let room of l_rooms) {
                div_rooms.removeChild(room);
            }
        },
        getRoom() {

            let bui_seat = document.getElementById("div_building_seat");
            let bui_room = document.getElementById("div_building_room");
            bui_seat.style.display = "none";
            bui_room.style.display = "inline-block";

            let div_seats = document.getElementById("seats");
            div_seats.style.display = "none";
            if (document.getElementById("b_public") != undefined) {
                div_seats.removeChild(document.getElementById("b_public"));
                div_seats.removeChild(document.getElementById("b_private"));
            }
            let l_seats = div_seats.querySelectorAll(".div_seat");
            for (let seat of l_seats) {
                div_seats.removeChild(seat);
            }
        },
    }
}
</script>


<style>
.order{
    width: 80%;
    height: 10%;
}
</style>