<template>
    <div id="infos">
        <p>This is a demo of a coworking space's gestion.</p>
        <p id="connexion"></p><input id="log" readonly="readonly" value=""/>
        <button id="button_my_info" v-on:click="openInfos()">My informations</button>

    </div>
</template>

<script>


export default {
    methods: {
        openInfos() {
            let main = function(vm) {
                let profil = document.getElementById("div_profil");
                if (profil == undefined) {
                    let infos = document.getElementById("infos");
                    let div_profil = Object.assign(document.createElement("div"), {id: "div_profil"});
                    let button_my_bookings = Object.assign(document.createElement("button"), {id:"button_my_bookings", innerHTML:"My Bookings"});
                    let button_my_seats = Object.assign(document.createElement("button"), {id:"button_my_seats", innerHTML:"My Requests"});
                    button_my_seats.addEventListener("click", async function(){await buttonsSeats(vm,div_profil)});
                    button_my_bookings.addEventListener("click", function(){buttonsBooking(vm,div_profil)});
                    loginRegister(vm, div_profil);
                    div_profil.appendChild(button_my_seats);
                    div_profil.appendChild(button_my_bookings);
                    infos.appendChild(div_profil);
                }
                else if (profil.style.display == "none") {
                    profil.style.display = "inline-block";
                }
                else {
                    profil.style.display = "none";
                }
            }
            let buttonsSeats = async function(vm, div_profil) {
                delAllDivs(div_profil);
                let div_buttons = Object.assign(document.createElement("div"), {id:"div_buttons_req"})
                let button_my_seats = Object.assign(document.createElement("button"), {innerHTML: "My seats"});
                let button_my_req = Object.assign(document.createElement("button"), {innerHTML:"My requests"});
                button_my_seats.addEventListener("click", async function(){await seeSeats(vm,div_profil)});
                button_my_req.addEventListener("click", async function(){await seeReq(vm,div_profil)});
                div_buttons.appendChild(button_my_seats);
                div_buttons.appendChild(button_my_req);
                div_profil.appendChild(div_buttons);                
            }

            let seeSeats = async function(vm, div_profil) {
                delAllDivs(div_profil);
                if (document.getElementById("div_my_req") != undefined) {
                    div_profil.removeChild(document.getElementById("div_my_req"));
                }
                let cus_row_id = document.getElementById("log").value;
                if(cus_row_id == "") {
                    window.alert("Please connect to your account to pursue");
                }
                else{
                    let l_seats = await vm.$simplicite.getBusinessObject("CowRequest").search({"cowReqCusId": cus_row_id});
                    let div_my_req = Object.assign(document.createElement("div"), {id:"div_my_req"});
                    div_profil.appendChild(div_my_req);
                    
                    let count = 0
                    for (let seat of l_seats) {
                        if (seat.cowReqStatus == "ACCEPTED") {
                            count++;
                            let div_seat = Object.assign(document.createElement("div"), {classList:"div_seat_info"});
                            let num_seat = Object.assign(document.createElement("input"), {value:seat.cowReqWorId__cowWorSeatNumber, classList:"num_seat"});
                            num_seat.setAttribute("readonly","readonly");
                            let status_seat = Object.assign(document.createElement("p"), {innerHTML:seat.cowReqWorId__cowWorStatus});
                            let building_seat = Object.assign(document.createElement("p"), {innerHTML:seat.cowReqWorId__cowWorBuiId__cowBuiName, classList:"name_building_seat"});
                            let button_cancel = Object.assign(document.createElement("button"), {innerHTML:"Cancel seat subscription"});
                            button_cancel.addEventListener("click", async function() { await cancelRequest(vm,seat.cowReqWorId, seat.cowReqCusId, true)});
                            div_seat.appendChild(num_seat);
                            div_seat.appendChild(status_seat);
                            div_seat.appendChild(building_seat);
                            div_seat.appendChild(button_cancel);
                            div_my_req.appendChild(div_seat);
                        }
                    }

                    
                    if (count == 0) {
                        div_my_req.appendChild(Object.assign(document.createElement("p"), {innerText:"No seat yet"}));
                    }
                }
            }

            let seeReq = async function(vm, div_profil) {
                delAllDivs(div_profil);
                if (document.getElementById("div_my_req") != undefined) {
                    div_profil.removeChild(document.getElementById("div_my_req"));
                }
                let cus_row_id = document.getElementById("log").value;
                if(cus_row_id == "") {
                    window.alert("Please connect to your account to pursue");
                }
                else {
                    let l_seats = await vm.$simplicite.getBusinessObject("CowRequest").search({"cowReqCusId": cus_row_id});
                    let div_my_req = Object.assign(document.createElement("div"), {id:"div_my_req"});
                    div_profil.appendChild(div_my_req);
                    let count = 0
                    
                    for (let seat of l_seats) {
                        if (seat.cowReqStatus != "ACCEPTED") {
                            count++;
                            let div_seat = Object.assign(document.createElement("div"), {classList:"div_seat_info"});
                            let num_seat = Object.assign(document.createElement("input"), {value:seat.cowReqWorId__cowWorSeatNumber, classList:"num_seat"});
                            num_seat.setAttribute("readonly","readonly");
                            let seat_building = Object.assign(document.createElement("p"), {innerHTML:seat.cowReqWorId__cowWorBuiId__cowBuiName, classList:"name_building_seat"});
    
                            let status_req = Object.assign(document.createElement("p"), {innerHTML:seat.cowReqStatus});
                            let button_cancel = Object.assign(document.createElement("button"), {innerHTML:"Cancel request"});
                            button_cancel.addEventListener("click", async function() { await cancelRequest(vm,seat.cowReqWorId, seat.cowReqCusId, false)});
                            div_seat.appendChild(num_seat);
                            div_seat.appendChild(seat_building);
                            div_seat.appendChild(status_req);
                            div_seat.appendChild(button_cancel);
                            div_my_req.appendChild(div_seat);
                        }
                    } 

                    
                    if (count == 0) {
                        div_my_req.appendChild(Object.assign(document.createElement("p"), {innerText:"No seat request yet"}));
                    }
                }
            }
            let cancelRequest = async function(vm, wor_row_id, cus_row_id, is_accepted) {
                let res =""
                if (is_accepted) {
                    res = "Do you want to cancel your subscription?"
                }
                else{
                    res = "Do you want to cancel your request?";
                }
                if (confirm(res)) {
                    try {
                        let obj_req = await vm.$simplicite.getBusinessObject("CowRequest");
                        let req = await obj_req.search({"cowReqWorId": wor_row_id, "cowReqCusId":cus_row_id});
                        await obj_req.del(req[0]);
                        window.alert("request cancelled");
    
                    } catch (e) {
                        window.alert(e.message);
                    }

                }
            }

            let delAllDivs = function(div_profil) {
                if (document.getElementById("div_my_req") != undefined) {
                    div_profil.removeChild(document.getElementById("div_my_req"));
                }
                if (document.getElementById("div_log_in" != undefined)) {
                    div_profil.removeChild(document.getElementById("div_log_in"));
                }
                if (document.getElementById("see-bookings") != undefined) {
                    div_profil.removeChild(document.getElementById("see-bookings"));
                }  
                if (document.getElementById("div_log_in") != undefined ){
                    div_profil.removeChild(document.getElementById("div_log_in"));
                } 
                if(document.getElementById("div_buttons_req") != undefined) {
                    div_profil.removeChild(document.getElementById("div_buttons_req"));
                }
            }
            let buttonsBooking = function(vm,div_profil) {
                delAllDivs(div_profil)
                if (document.getElementById("see-bookings") == undefined) {
                    let see_bookings = Object.assign(document.createElement("div"), {id:"see-bookings"});
                    let button_old = Object.assign(document.createElement("button"), {innerText:"Previous bookings"});
                    let button_to_come = Object.assign(document.createElement("button"), {innerText:"To come"});
                    button_old.addEventListener("click",async function(){await seeBookings(vm,see_bookings,true)});
                    button_to_come.addEventListener("click", async function(){await seeBookings(vm,see_bookings,false)});
                    see_bookings.appendChild(button_old);
                    see_bookings.appendChild(button_to_come);
                    div_profil.appendChild(see_bookings);
                }
                
                
            }

            

            let seeBookings = async function(vm,div, is_old) {
                let l_bookings_check = div.querySelectorAll(".div_booking_check");
                for (let bookings_check of l_bookings_check) {
                    div.removeChild(bookings_check);
                }
                let no_previous = document.getElementById("no-previous");
                let no_upcoming = document.getElementById("no-upcoming");
                if (no_previous != undefined) {
                    div.removeChild(no_previous);
                }
                if (no_upcoming != undefined) {
                    div.removeChild(no_upcoming)
                }
                let customer_row = document.getElementById("log").value;
                console.log(customer_row);
                if(customer_row == "") {
                    window.alert("Please connect to your account to pursue");
                }
                else {
                    let count_old = 0;
                    let count_coming = 0;
                    try {
                        let bookings = await vm.$simplicite.getBusinessObject("CowBooking").search({cowBookCusId: customer_row});
                        for (let booking of bookings) {
                            if (is_old) {
                                if (isOld(booking.cowBookDate)) {
                                    count_old++;
                                    let div_booking = Object.assign(document.createElement("div"), {classList:"div_booking_check"});
                                    let booking_number = Object.assign(document.createElement("p"), {innerText:"Booking Number: " + booking.cowBookBookingNumber.toString()});
                                    let booking_room_number = Object.assign(document.createElement("p"), {innerText:"Room: " + booking.cowBookRoomId__cowRoomNumber + "   Building: " + booking.cowBookRoomId__cowRoomBuiId__cowBuiName});
                                    let booking_date = Object.assign(document.createElement("p"), {innerText: booking.cowBookDate});
                                    let time = Object.assign(document.createElement("p"), {innerText: booking.cowBookBeginningTime + " - " + booking.cowBookEndingTime});
                                    div_booking.appendChild(booking_number);
                                    div_booking.appendChild(booking_room_number);
                                    div_booking.appendChild(booking_date);
                                    div_booking.appendChild(time);
                                    div.appendChild(div_booking);
                                }
                            }
                            else {
                                if (!isOld(booking.cowBookDate)) {
                                    count_coming++;
                                    let div_booking = Object.assign(document.createElement("div"), {classList:"div_booking_check"});
                                    let booking_number = Object.assign(document.createElement("p"), {innerText:booking.cowBookBookingNumber.toString()});
                                    let booking_date = Object.assign(document.createElement("input"), {type:"date",value: booking.cowBookDate, readonly:"readonly", classList:"info_bookings_to_come"});
                                    booking_date.setAttribute("readonly","readonly")
                                    let time = Object.assign(document.createElement("div"), {classList: "times"});
                                    let b_time = Object.assign(document.createElement("input"), {type:"time", value:booking.cowBookBeginningTime.substring(0,5), classList:"info_bookings_to_come"});
                                    let e_time = Object.assign(document.createElement("input"), {type:"time", value:booking.cowBookEndingTime.substring(0,5), classList:"info_bookings_to_come"});
                                    b_time.setAttribute("readonly","readonly");
                                    e_time.setAttribute("readonly","readonly");
                                    time.appendChild(b_time);
                                    time.appendChild(e_time);
                                    let state = Object.assign(document.createElement("input"), {value:booking.cowBookStatus});
                                    state.setAttribute("readonly","readonly");
                                    
                                    let booking_room_number = Object.assign(document.createElement("p"), {innerText:"Room: " + booking.cowBookRoomId__cowRoomNumber + "   Building: " + booking.cowBookRoomId__cowRoomBuiId__cowBuiName});
                                    let cancel_button = Object.assign(document.createElement("button"), {innerText:"Cancel booking"});
                                    cancel_button.addEventListener("click",async function(){
                                        await deleteBooking(vm,booking, div_booking, div);
                                    })
                                    div_booking.appendChild(booking_number);
                                    div_booking.appendChild(booking_room_number);
                                    div_booking.appendChild(booking_date);
                                    div_booking.appendChild(time);
                                    div_booking.appendChild(state);
                                    if (booking.cowBookStatus == "PENDING") {
                                        let modify_button = Object.assign(document.createElement("button"), {innerText:"Modify booking"});
                                        let confirm_button = Object.assign(document.createElement("button"), {innerText:"Confirm modifications"});
                                        confirm_button.addEventListener("click",async function(){await confirmModifications(vm, booking.row_id,booking_date,b_time,e_time,div_booking, confirm_button,modify_button)});
                                        modify_button.addEventListener("click", async function() {await modifyBooking(div_booking, modify_button, confirm_button)});
                                        div_booking.appendChild(confirm_button);
                                        confirm_button.style.display ="none";
                                        modify_button.style.display = "inline-block";
                                        div_booking.appendChild(modify_button);
                                    }
                                    div_booking.appendChild(cancel_button);
                                    div.appendChild(div_booking);
                                }
                                
                            }
                        }
                    } catch(e) {
                        window.alert(e.messages);
                    }
                    
                    if (is_old) {
                        if (no_upcoming != null) {
                            no_upcoming.style.display = "none";
                        }
                        if (count_old==0) {
                            if (no_previous == undefined) {
                                div.appendChild(Object.assign(document.createElement("p"), {innerHTML:"No Previous booking", id:"no-previous"}));
                            }
                            else if (no_previous.style.display == "none") {
                                no_previous.style.display = "inline";
                            }
                            else {
                                no_previous.style.display = "none";
                            }
                        }
                    }
                    else {
                        if (no_previous != null) {
                            no_previous.style.display == "none";
                        }
                        if (count_coming==0) {
                            div.appendChild(Object.assign(document.createElement("p"), {innerHTML:"No upcoming booking", id:"no-upcoming"}));
                        }
                    }
                }
            }

            let modifyBooking = async function(div, button_modify, button_confirm) {
                let l_to_write = div.getElementsByClassName("info_bookings_to_come");
                button_modify.style.display = "none";
                button_confirm.style.display ="inline-block";
                for(let to_write of l_to_write) {
                    to_write.removeAttribute("readonly");
                }
            }

            let confirmModifications = async function(vm, row_id,date,b_time,e_time,div, button_confirm, button_modify) {
                try {
                    let object_bookings = await vm.$simplicite.getBusinessObject("CowBooking");
                    let booking = await object_bookings.search({"row_id":row_id});
                    const row = booking[0];
                    row.cowBookDate = date.value;
                    row.cowBookBeginningTime = b_time.value + ":00";
                    row.cowBookEndingTime = e_time.value + ":00";
                    await object_bookings.update(row);
                    window.alert("Booking modified");
                    button_confirm.style.display = "none";
                    button_modify.style.display = "inline-block";
                    let l_to_read = div.getElementsByClassName("info_bookings_to_come");
                    for (let to_read of l_to_read) {
                        to_read.setAttribute("readonly","readonly");
                    }
                } catch(e) {
                    window.alert(e.messages);
                }
            }

            let deleteBooking = async function(vm,booking, div_to_delete, div) {
                if (confirm("Do you want to cancel this booking?")) {
                    try {
                        let obj_bookings = await vm.$simplicite.getBusinessObject("CowBooking");
                        obj_bookings.del(booking);
                        div.removeChild(div_to_delete);
                    } catch (e) {
                        window.alert(e.messages);
                    }
                    
                }
                
            }
           
            let isOld = function(date) {
                //returns true the date is anterior to the current date
                let today = new Date();
                let year = parseInt(date.substring(0,4));
                let month = parseInt(date.substring(5,7));
                let day = parseInt(date.substring(8,10));
                let res = true;
                if (year > today.getFullYear()) {
                    res = false;
                }
                else if (year == today.getFullYear()) {
                    if (month > today.getMonth() + 1) {
                        res = false;
                    }
                    else if(month == today.getMonth() + 1) {
                        if (day > today.getDate()) {
                            res = false;
                        }
                    }
                }
                return res;
            }

            let loginRegister = function(vm,div_profil) {
                let login = Object.assign(document.createElement("button"), {classList:"login-button",innerText:"login", id:"button_log_in"});
                let register = Object.assign(document.createElement("button"), {classList:"login-button", innerText:"register", id:"button_register"});
                login.addEventListener("click",function(){
                    logIn(vm,div_profil);
                });
                register.addEventListener("click", function() {
                    enterInfos(vm,div_profil);
                });
                div_profil.appendChild(login);
                div_profil.appendChild(register);
            }

            let verifLogIn = async function(fname,lname,password, vm) {

                let custom = vm.$simplicite.getBusinessObject("CowCustomers");
                let customer = await custom.search({cowCusFirstName: fname, cowCusName: lname, cowCusPassword: password});
                if (customer.length==0) {
                    window.alert("Incorrect name or password");
                }
                else {
                    console.log("connected");
                    connect(customer[0]);
                }

            }

              
            let logIn = async function(vm, div_profil) {
                delAllDivs(div_profil)
                let div_log_in = Object.assign(document.createElement("div"), {id:"div_log_in"});
                let input_fname = Object.assign(document.createElement("input"), {classList: "info_customer", type:"text", placeholder:"first name"});
                let input_lname = Object.assign(document.createElement("input"), {classList: "info_customer", type:"text", placeholder:"last name"});
                let input_password = Object.assign(document.createElement("input"), {classList: "info_customer", type:"password", placeholder:"password"});
                let button_log = Object.assign(document.createElement("button"), {classList: "info_customer",innerText: "Log in"});
                button_log.addEventListener("click", async function(){
                    if(input_fname.value.length == 0 || input_lname.value.length == 0 || input_password.value.length == 0) {
                        window.alert("Enter logs");
                    }
                    else {
                        await verifLogIn(input_fname.value,input_lname.value,input_password.value, vm);
                    }
                    
                });
                div_log_in.appendChild(input_fname);
                div_log_in.appendChild(input_lname);
                div_log_in.appendChild(input_password);
                div_log_in.appendChild(button_log);
                div_profil.appendChild(div_log_in);
            }
            let enterInfos = function(vm, div_profil) {
                delAllDivs(div_profil);
                let input_fname = Object.assign(document.createElement("input"), {classList: "info_customer", type:"text", placeholder:"first name"});
                let input_lname = Object.assign(document.createElement("input"), {classList: "info_customer", type:"text", placeholder:"last name"});
                let input_password = Object.assign(document.createElement("input"), {classList: "info_customer", type:"password", placeholder:"password"})
                let input_phone_number = Object.assign(document.createElement("input"), {classList:"info_customer", type:"text",placeholder:"phone",});
                let input_mail =Object.assign(document.createElement("input"), {classList:"info_customer", type:"text",placeholder:"mail"});
                let input_bdate = Object.assign(document.createElement("input"), {classList:"info_customer", type:"date"})
                let confirm_name = Object.assign(document.createElement("button"), {classList: "info_customer", innerText:"Create my account"});
                confirm_name.addEventListener("click", async function(){
                    await register(input_fname.value,input_lname.value,input_mail.value,input_phone_number.value,input_bdate.value,input_password.value,vm)
                });
                let div_inputs = Object.assign(document.createElement("div"), {id:"div_log_in"});
                div_inputs.appendChild(input_fname);
                div_inputs.appendChild(input_lname);
                div_inputs.appendChild(input_bdate);
                div_inputs.appendChild(input_password);
                div_inputs.appendChild(input_mail);
                div_inputs.appendChild(input_phone_number);
                div_inputs.appendChild(confirm_name);
                div_profil.appendChild(div_inputs);
            }

            let register = async function(fname,lname,mail,phone,date,password,vm) {
                if (lname.length==0 || fname.length==0) {
                        window.alert("Incorrect first name or last name");
                    }
                else {
                    try {
                    var object_cus = await vm.$simplicite.getBusinessObject('CowCustomers');
                    let custom_id = await getLastRowId(vm) + 1;
                    let customer = await object_cus.create({"row_id":custom_id,"cowCusName":lname,"cowCusFirstName":fname, "cowCusMail": mail, "cowCusPhoneNumber":phone, "cowCusBirthDate": date, "cowCusPassword": password});
                    window.alert("Registered as " + fname + " " + lname);
                    connect(customer);
                    } catch (error) {
                        try {
                            window.alert(error.messages[0]);
                        } catch(e) {
                            window.alert(error);
                        }
                        
                    }
                } 
            }

            let connect = function(customer) {
                let connect = document.getElementById("connexion");
                connect.innerText = "Connected as: " + customer.cowCusFirstName + " " + customer.cowCusName;
                let log = document.getElementById("log");
                log.value = customer.row_id;
                try {
                    document.getElementById("div_log_in").style.display = "none";
                    document.getElementById("div_inputs").style.display = "none";
                } catch(e) {
                    null;
                }
            }

            let getLastRowId = async function(vm) {
                vm.customers = await vm.$simplicite.getBusinessObject("CowCustomers").search();
                let max = 0;
                for (var i=0; i<vm.customers;i++) {
                    var row_id = await vm.customers[i].row_id;
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
.info_customer {
    width: 100px;
}
.div_booking_check {
    background-color: white;
    color: black;
    border: black 1px solid;
    border-radius: 10px;
    width: 80%;
    display: inline-block;
    vertical-align: top;
}

.div_seat_info {
    background-color: white;
    color: black;
    border: black 1px solid;
    border-radius: 10px;
    width: 80%;
    display: inline-block;
    vertical-align: top;
}

#div_profil {
    border: solid black 1px;
}

#log {
    display: none;
}

.num_seat {
    width:30px;
}
</style>