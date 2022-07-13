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
            if (document.getElementById("seats") != undefined) {
                document.getElementById("main_building_seat").removeChild(document.getElementById("seats"));
            }
            
        },
        getRoom() {

            let bui_seat = document.getElementById("div_building_seat");
            let bui_room = document.getElementById("div_building_room");
            bui_seat.style.display = "none";
            bui_room.style.display = "inline-block";


            let div_seats = document.getElementById("seats");
            if (div_seats != null) {
                div_seats.style.display = "none";

            }
            
            
            if (document.getElementById("b_public") != undefined) {
                div_seats.removeChild(document.getElementById("b_public"));
                div_seats.removeChild(document.getElementById("b_private"));
            }
            let div_rooms = document.getElementById("rooms");
            if (document.getElementById("div_booking") != undefined) {
                div_rooms.removeChild(document.getElementById("div_booking"));

            }
            div_rooms.style.display = "none";
        },
    }
}
</script>


<style>
.order{
    width: 40%;
    height: 50px;
    border-radius: 8px;
    margin: 5px;
}
</style>