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
            let b_seat = document.getElementById("b_seat");
            let b_room = document.getElementById("b_room");
            b_seat.style.display = "none";
            b_room.style.display = "inline-block";
            let bui_seat = document.getElementById("div_building_seat");
            let bui_room = document.getElementById("div_building_room");
            bui_room.style.display = "none";
            bui_seat.style.display = "inline-block";
        },
        getRoom() {
            let b_room = document.getElementById("b_room");
            let b_seat = document.getElementById("b_seat");
            b_room.style.display = "none";
            b_seat.style.display = "inline-block";
            let bui_seat = document.getElementById("div_building_seat");
            let bui_room = document.getElementById("div_building_room");
            bui_seat.style.display = "none";
            bui_room.style.display = "inline-block";
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