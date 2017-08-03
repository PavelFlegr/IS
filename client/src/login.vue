<template>
    <form @keypress.enter="login">
        <div>
            <div>přihlašovací jméno</div>
            <input type="text" v-model="username"/>
        </div>
        <div>
            <div>heslo</div>
            <input type="password" v-model="password" />
        </div>
        <br />
        <button type="button" @click="login">login</button>
    </form>
</template>

<script>
    import axios from "axios"
    export default {
        data: function() {
            return {
                username: "",
                password: ""
            }
        },
        methods: {
            login: function () {
                const that = this;
                axios.post("login", {
                    username: this.username,
                    password: this.password
                }, {
                    withCredentials: true
                })
                .then(function(res) {
                    if(res.data.success) {
                        that.$parent.view = "grades";
                    }
                });
            }
        }
    }
</script>

<style>
body, html {
    height: 100%;
    margin: 0;
}

body {
    display: flex;
    flex-direction: column;
    align-content: center;
}

#login {
    margin: 0 auto;
}
</style>