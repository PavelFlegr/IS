<template>
	<table>
        <tr v-for="subject in classification.subjects">
            <td>
                <div class="tooltip">
                    <div>předmět: {{ subject.name }}</div>
                    <div>průměr: </div>
                    <div>1. pololetí: {{ subject.average1 }}</div>
                    <div>2. pololetí: {{ subject.average2 }}</div>
                    <div>celkem: {{ subject.average }}</div>
                </div>
                {{ subject.name }}
            </td>
            <td v-for="i in classification.columns" v-bind:class="{ bad: i < subject.grades.length && subject.grades[i].mark == 5, isNew: i < subject.grades.length && subject.grades[i].new, secondSemester: i < subject.grades.length && subject.grades[i].semester == 2 }">
                <div class="tooltip" v-if="i < subject.grades.length">
                    <div>předmět {{ subject.name }}</div>
                    <div>datum: {{ subject.grades[i].date }}</div>
                    <div>známka: {{ subject.grades[i].mark }}</div>
                    <div>váha: {{ subject.grades[i].weight }}</div>
                    <div>téma: {{ subject.grades[i].topic }}</div>
                    <div>komentář: {{ subject.grades[i].comment }}</div>
                </div>
                {{ subject.grades.length > i ? subject.grades[i].mark : "" }}
            </td>
        </tr>
    </table>
</template>

<script>
    import axios from "axios"

    const restructure = function (data) {
        let result = {};
        result.subjects = [];
        let columns = 0;
        data.DATA.pop();
        for (const subject of data.DATA) {
            columns = Math.max(columns, subject.COUNT);
            console.log(columns);
            let newSubject = {};
            newSubject.name = subject.SUBJECT;
            newSubject.average = subject.AVERAGE;
            newSubject.average1 = subject.AVERAGE1;
            newSubject.average2 = subject.AVERAGE2;
            newSubject.grades = [];
            for (let i = 0; i < subject.COUNT; i++) {
                newSubject.grades.push({
                    mark: subject.CLASSIFICATION[i],
                    date: subject.DATE[i],
                    weight: subject.TVALUE[i],
                    topic: subject.TOPIC[i],
                    comment: subject.TEXT[i],
                    "new": subject.NEW[i],
                    semester: subject.SEMESTER[i]
                });
            }
            result.subjects.push(newSubject);
        }

        result.columns = [];
        for (let i = 0; i < columns; i++) {
            result.columns.push(i);
        }

        return result;
    }
    export default {
        data: function() {
            return {
                classification: {}
            }
        },
        created: function () {
            let that = this;
            axios.get("grades", { withCredentials: true })
                .then(function (res) {
                    that.classification = restructure(res.data);
                });
        }
    }
</script>

<style>
table {
    border-collapse: collapse;
    font-size: large;
    font-family: sans-serif;
    white-space: nowrap;
}

.tooltip {
    display: none;
    position: absolute;
    background: rgba(128, 128, 128, 128);
    padding: 0.25em 0.5em;
    border-radius: 3px;
    text-align: left;
}

.secondSemester {
    background-color: lightgray;
}

.isNew {
    background-color: limegreen;
}

td.bad.isNew {
    background-color: tomato;
}

td:hover .tooltip {
    display: block;
}

td {
    border: 1px solid;
    min-width: 2em;
    width: 2em;
    height: 2em;
    text-align: center;
}

td:first-child {
    text-align: left;
}
</style>