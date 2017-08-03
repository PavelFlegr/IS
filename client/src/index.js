"use strict"

import Vue from "vue"
import login from "./login.vue"
import grades from "./grades.vue"
import axios from "axios"

console.log(login);
const app = new Vue({
    el: "main",
    data: {
        view: ""
    },
    components: {
        login: login,
        grades: grades
    },
    render: function(h) {
        return h(this.view);
    },
    created: async function() {
        const r = await axios.get("/status", { withCredentials: true });
        this.view = r.data.logged ? "grades" : "login";
    }
});