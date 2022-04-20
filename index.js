#! /usr/bin/env node

const fetch = require('node-fetch')
const { program } = require('commander')

program
    .description('Get stats for any npm package on terminal')
    .requiredOption('-n, --name <name>', 'Name of package')
    .option(
        '-fr, --from <fromDate>',
        'From data of package in YYYY-MM-DD format'
    )
    .option('-to, --to <toDate>', 'To date of package YYYY-MM-DD format')
    .parse()

const options = program.opts()
const from = options.from
const to = options.to
const packageName = options.name

let today = new Date()
let dd = String(today.getDate()).padStart(2, '0')
let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
let yyyy = today.getFullYear()

today = yyyy + '-' + mm + '-' + dd

let response = ''

if (from && to) {
    const url = `https://api.npmjs.org/downloads/point/${from}:${to}/${packageName}`
    response = fetch(url)
        .then((res) => res.json())
        .then((body) => body)
} else {
    if (from === undefined) {
        const url = `https://api.npmjs.org/downloads/point/1980-01-01:${to}/${packageName}`
        response = fetch(url)
            .then((res) => res.json())
            .then((body) => body)
    } else if (to === undefined) {
        const url = `https://api.npmjs.org/downloads/point/${from}:${today}/${packageName}`
        response = fetch(url)
            .then((res) => res.json())
            .then((body) => body)
    } else {
        const url = `https://api.npmjs.org/downloads/point/1980-01-01:${today}/${packageName}`
        response = fetch(url)
            .then((res) => res.json())
            .then((body) => body)
    }
}

Promise.resolve(response).then((d) => console.log(d))
