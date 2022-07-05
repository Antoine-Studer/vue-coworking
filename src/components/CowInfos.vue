<template>
    <div id="infos">
        <p>This is a demo of a coworking space's gestion.</p>
        <button id="bouton_mes_infos" v-on:click="openInfos()">My informations</button>
    </div>
</template>

<script>


export default {
    methods: {
        openInfos() {
            let main = function(vm) {
                console.log(vm);
                let infos = document.getElementById("infos");
                let div_profil = Object.assign(document.createElement("div"), {id: "div_profil"});
                let button_profil = Object.assign(document.createElement("button"), {innerText: "My profile"});
                button_profil.addEventListener("click",function() {

                    loginRegister(vm, div_profil);
                });
                div_profil.appendChild(button_profil);
                infos.appendChild(div_profil);
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
                    window.alert("Identifiant ou mot de passe incorrect");
                }
                else {
                    console.log("connecté");
                    let custom_id = customer.row_id;
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
                    await confirmName(input_fname.value,input_lname.value,input_mail.value,input_phone_number.value,input_bdate.value,input_password.value,vm)
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

            let confirmName = async function(fname,lname,mail,phone,date,password,vm) {
                if (lname.length==0 || fname.length==0) {
                        window.alert("Incorrect first name or last name");
                    }
                else {
                    try {
                    console.log(fname + " " + lname);
                    var client = await vm.$simplicite.getBusinessObject('CowCustomers');
                    let custom_id = await getLastRowId(vm) + 1;
                    await client.create({"row_id":custom_id,"cowCusName":lname,"cowCusFirstName":fname, "cowCusMail": mail, "cowCusPhoneNumber":phone, "cowCusBirthDate": date, "cowCusPassword": password});
                    } catch (error) {
                        try {
                            window.alert(error.messages[0]);
                        } catch(e) {
                            window.alert(error);
                        }
                        
                    }
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

#div_profil {
    border: solid black 1px;
}
</style>