<template>
    <div id="infos">
        <p>This is a demo of a coworking space's gestion.</p>
        <p id="connexion">Connected as Alain Delon</p><span id="log">5</span>
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
                    let button_my_bookings = Object.assign(document.createElement("button"), {id:"button_my_bookings", innerText:"My Bookings"});
                    button_my_bookings.addEventListener("click", function(){buttonsBooking(vm,div_profil)});
                    loginRegister(vm, div_profil);
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

            let buttonsBooking = function(vm,div_profil) {
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
                let customer_row = document.getElementById("log").innerHTML;
                if (parseInt(customer_row ) == -1) {
                    window.alert("please connect to your account to check you bookings")
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
                                    let booking_number = Object.assign(document.createElement("p"), {innerText:booking.cowBookBookingNumber.toString()});
                                    let booking_date = Object.assign(document.createElement("p"), {innerText: booking.cowBookDate});
                                    div_booking.appendChild(booking_number);
                                    div_booking.appendChild(booking_date);
                                    div.appendChild(div_booking);
                                }
                            }
                            else {
                                if (!isOld(booking.cowBookDate)) {
                                    count_coming++;
                                    let div_booking = Object.assign(document.createElement("div"), {classList:"div_booking_check"});
                                    let booking_number = Object.assign(document.createElement("p"), {innerText:booking.cowBookBookingNumber.toString()});
                                    let booking_date = Object.assign(document.createElement("p"), {innerText: booking.cowBookDate});
                                    div_booking.appendChild(booking_number);
                                    div_booking.appendChild(booking_date);
                                    div.appendChild(div_booking);
                                }
                                
                            }
                        }
                    } catch(e) {
                        window.alert(e.messages);
                    }
                    let no_previous = document.getElementById("no-previous");
                    let no_upcoming = document.getElementById("no-upcoming");
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
                        console.log(no_previous);
                        if (no_previous != null) {
                            no_previous.style.display == "none";
                        }
                        if (count_coming==0) {
                            div.appendChild(Object.assign(document.createElement("p"), {innerHTML:"No upcoming booking", id:"no-upcoming"}));

                        }
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
                console.log(customer);
                if (customer.length==0) {
                    window.alert("Incorrect name or password");
                }
                else {
                    console.log("connected");
                    let custom_id = customer.row_id;
                    connect(customer[0]);
                    console.log(custom_id);
                }

            }

            let delDivs = function(div_profil) {
                try {
                    let test_div_reg = document.getElementById("div_inputs");
                    div_profil.removeChild(test_div_reg);
                } catch(e) {
                    try {
                        let test_div_log = document.getElementById("div_log_in");
                        div_profil.removeChild(test_div_log);
                    } catch(e) {
                        null;
                    }
                }
                try {
                    let l_booking_check = div_profil.querySelectorAll(".div_booking_check");
                    for (let ele in l_booking_check) {
                        div_profil.removeChild(ele)
                    }
                }catch(e) {
                    null;
                }
            }

            let logIn = async function(vm, div_profil) {
                delDivs(div_profil);
                let div_log_in = Object.assign(document.createElement("div"), {id:"div_log_in"});
                let input_fname = Object.assign(document.createElement("input"), {classList: "infos-customer", type:"text", placeholder:"first name"});
                let input_lname = Object.assign(document.createElement("input"), {classList: "infos-customer", type:"text", placeholder:"last name"});
                let input_password = Object.assign(document.createElement("input"), {classList: "input-customer", type:"password", placeholder:"password"});
                let button_log = Object.assign(document.createElement("button"), {innerText: "Log in"});
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
                delDivs(div_profil);
                let input_fname = Object.assign(document.createElement("input"), {classList: "infos-customer", type:"text", placeholder:"first name"});
                let input_lname = Object.assign(document.createElement("input"), {classList: "infos-customer", type:"text", placeholder:"last name"});
                let input_password = Object.assign(document.createElement("input"), {classList: "input-customer", type:"password", placeholder:"password"})
                let input_phone_number = Object.assign(document.createElement("input"), {class:"input-infos", type:"text",placeholder:"phone",});
                let input_mail =Object.assign(document.createElement("input"), {class:"input-infos", type:"text",placeholder:"mail"});
                let input_bdate = Object.assign(document.createElement("input"), {class:"input-infos", type:"date"})
                let confirm_name = Object.assign(document.createElement("button"), {innerText:"Create my account"});
                confirm_name.addEventListener("click", async function(){
                    await register(input_fname.value,input_lname.value,input_mail.value,input_phone_number.value,input_bdate.value,input_password.value,vm)
                });
                let div_inputs = Object.assign(document.createElement("div"), {id:"div_inputs"});
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
                    console.log(fname + " " + lname);
                    var object_cus = await vm.$simplicite.getBusinessObject('CowCustomers');
                    let custom_id = await getLastRowId(vm) + 1;
                    let customer = await object_cus.create({"row_id":custom_id,"cowCusName":lname,"cowCusFirstName":fname, "cowCusMail": mail, "cowCusPhoneNumber":phone, "cowCusBirthDate": date, "cowCusPassword": password});
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
                log.innerHTML = customer.row_id;
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
.infos-customer {
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

#div_profil {
    border: solid black 1px;
}

#log {
    display: none;
}
</style>