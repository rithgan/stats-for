#! /usr/bin/env node

const fetch = require('node-fetch')
const { program } = require('commander')
const chalk = require('chalk')

program
    .description('Get stats for any npm package on terminal.\nIf no version is specified, most recent version will be show')
    .requiredOption('-n, --name <name>', 'Name of package')
    .option(
        '-fr, --from <fromDate>',
        'From data of package in YYYY-MM-DD format'
    )
    .option('-to, --to <toDate>', 'To date of package in YYYY-MM-DD format')
    .parse()

const options = program.opts()
const from = options.from === undefined ? false : options.from
const to = options.to === undefined ? false : options.to
const packageName = options.name

let today = new Date()
let dd = String(today.getDate()).padStart(2, '0')
let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
let yyyy = today.getFullYear()

today = yyyy + '-' + mm + '-' + dd

let response = ''

console.log(from,to, today)

if (from && to) {
    console.log(0)
    const url = `https://api.npmjs.org/downloads/point/${from}:${to}/${packageName}`
    response = fetch(url)
        .then((res) => res.json())
        .then((body) => body)
} else {
    if (!from && to) {
        console.log(1)
        const url = `https://api.npmjs.org/downloads/point/1980-01-01:${to}/${packageName}`
        response = fetch(url)
            .then((res) => res.json())
            .then((body) => body)
    } else if (!to && from) {
        console.log(2)
        const url = `https://api.npmjs.org/downloads/point/${from}:${today}/${packageName}`
        response = fetch(url)
            .then((res) => res.json())
            .then((body) => body)
    } else {
        console.log(4);
        const url = `https://api.npmjs.org/downloads/point/1980-01-01:${today}/${packageName}`
        response = fetch(url)
            .then((res) => res.json())
            .then((body) => body)
    }
}

Promise.resolve(response).then((d) => {
    console.log(`Package name : ${chalk.cyan(d['package'])}`)
    console.log(`Downloads : ${chalk.blue(d['downloads'])}`)
    console.log(`Start date : ${chalk.green(d['start'])}`)
    console.log(`End date : ${chalk.red(d['end'])}`)
})
