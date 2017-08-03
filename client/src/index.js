"use strict"

import Vue from "vue"
import login from "./login.vue"

console.log(login);
const app = new Vue({
    el: "main",
    data: {
        view: "login"
    },
    components: {
        login: login
    },
    render: function(h) {
        return h(this.view);
    }
});